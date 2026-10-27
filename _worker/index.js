// Cloudflare Worker for scoreqc.com. Static pages are served from the assets binding;
// this script only handles:
//   POST /api/register   – candidate registration form (/registration/) → saved to D1
//   /admin/...           – password-protected staff page to view, export and delete registrations
// Bindings (wrangler.jsonc): ASSETS, DB (D1). Secret: ADMIN_PASSWORD.
// Optional email alert: add a send_email binding named EMAIL plus vars NOTIFY_TO and MAIL_FROM
// (needs the Workers Paid plan and scoreqc.com onboarded to Cloudflare Email Sending).

const FIELDS = [
  // [key, label, required, max length]
  ['course_title', 'Course Title', true, 120],
  ['twi_id', 'TWI Candidate ID', false, 40],
  ['seminar_date', 'Seminar Date', true, 10],
  ['exam_date', 'Date of Examination', true, 10],
  ['full_name', 'Full Name', true, 120],
  ['dob', 'Date of Birth', true, 10],
  ['age', 'Age', true, 3],
  ['email', 'Email', true, 160],
  ['phone', 'Contact Number', true, 20],
  ['alt_phone', 'Alternate Contact Number', true, 20],
  ['perm_address', 'Permanent Address', true, 600],
  ['perm_pin', 'Permanent Pin Code', true, 6],
  ['comm_address', 'Communication Address', false, 600],
  ['comm_pin', 'Communication Pin Code', false, 6],
  ['qualification', 'Course Completed', true, 120],
  ['completion_date', 'Date of Completion', true, 10],
  ['ndt_certification', 'NDT Certification', false, 15],
  ['company', 'Company Name', false, 160],
  ['designation', 'Designation', false, 120],
  ['exp_from', 'Experience From', false, 10],
  ['exp_to', 'Experience To', false, 10],
];
const KEYS = FIELDS.map(f => f[0]);
const LABEL = Object.fromEntries(FIELDS.map(f => [f[0], f[1]]));
const DATE_KEYS = ['seminar_date', 'exam_date', 'dob', 'completion_date', 'exp_from', 'exp_to'];

const RATE_LIMIT = 5, RATE_WINDOW = 600;          // registrations per IP per 10 minutes
const LOGIN_LIMIT = 8, LOGIN_WINDOW = 900;        // failed staff logins per IP per 15 minutes
const SESSION_HOURS = 8;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS registrations (id INTEGER PRIMARY KEY AUTOINCREMENT, ${KEYS.map(k => k + ' TEXT').join(', ')}, ip TEXT, submitted_at TEXT NOT NULL)`,
  'CREATE INDEX IF NOT EXISTS idx_reg_submitted ON registrations (submitted_at)',
  'CREATE INDEX IF NOT EXISTS idx_reg_ip ON registrations (ip, submitted_at)',
  'CREATE TABLE IF NOT EXISTS login_failures (ip TEXT NOT NULL, at INTEGER NOT NULL)',
];
let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch(SCHEMA.map(s => db.prepare(s)));
  schemaReady = true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/register') return await register(request, env);
      if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) return await admin(request, env, url);
    } catch (e) {
      console.error('worker error', e && e.stack || e);
      return json(500, { ok: false, message: 'Something went wrong. Please try again.' });
    }
    return env.ASSETS.fetch(request);
  },
};

// ---------------------------------------------------------------- helpers

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clientIp = req => req.headers.get('cf-connecting-ip') || 'unknown';
const nowSec = () => Math.floor(Date.now() / 1000);
const sameOrigin = (req, url) => req.headers.get('origin') === url.origin;
// IST timestamp, e.g. 27/10/2026 14:40
const istStamp = iso => {
  const d = new Date(new Date(iso).getTime() + 330 * 60000);
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
};

// ---------------------------------------------------------------- registration

async function register(request, env) {
  const url = new URL(request.url);
  if (request.method !== 'POST') return json(405, { ok: false, message: 'Method not allowed.' });
  if (!sameOrigin(request, url)) return json(403, { ok: false, message: 'Forbidden.' });

  const raw = await request.text();
  if (raw.length > 20000) return json(413, { ok: false, message: 'Submission too large.' });
  let input;
  try { input = JSON.parse(raw); } catch { return json(400, { ok: false, message: 'Invalid submission.' }); }
  if (!input || typeof input !== 'object') return json(400, { ok: false, message: 'Invalid submission.' });
  if (input._honey) return json(200, { ok: true }); // bot filled the hidden trap field

  const data = {};
  for (const [key, label, required, max] of FIELDS) {
    let v = input[key];
    v = (typeof v === 'string' || typeof v === 'number') ? String(v).trim() : '';
    v = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    if (required && !v) return json(422, { ok: false, message: `Please fill in ${label}.` });
    if ([...v].length > max) return json(422, { ok: false, message: `${label} is too long.` });
    data[key] = v;
  }
  for (const k of DATE_KEYS) {
    if (data[k] && !/^\d{2}\/\d{2}\/\d{4}$/.test(data[k])) return json(422, { ok: false, message: `${LABEL[k]} is not a valid date.` });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return json(422, { ok: false, message: 'Please enter a valid email address.' });
  for (const k of ['phone', 'alt_phone']) {
    if (data[k].replace(/\D/g, '').length < 10) return json(422, { ok: false, message: `Please enter a valid ${LABEL[k]}.` });
  }
  if (!/^\d{6}$/.test(data.perm_pin)) return json(422, { ok: false, message: 'Please enter a 6-digit pin code.' });
  if (data.comm_pin && !/^\d{6}$/.test(data.comm_pin)) return json(422, { ok: false, message: 'Please enter a 6-digit communication pin code.' });
  if (!/^\d{1,3}$/.test(data.age) || +data.age < 15 || +data.age > 80) return json(422, { ok: false, message: 'Please enter a valid age.' });
  if (!data.ndt_certification) data.ndt_certification = 'NOT SPECIFIED';

  const db = env.DB;
  await ensureSchema(db);
  const ip = clientIp(request);
  const since = new Date(Date.now() - RATE_WINDOW * 1000).toISOString();
  const recent = await db.prepare('SELECT COUNT(*) AS n FROM registrations WHERE ip = ? AND submitted_at > ?').bind(ip, since).first();
  if (recent && recent.n >= RATE_LIMIT) return json(429, { ok: false, message: 'Too many submissions. Please try again later.' });

  const submittedAt = new Date().toISOString();
  const res = await db.prepare(`INSERT INTO registrations (${KEYS.join(', ')}, ip, submitted_at) VALUES (${KEYS.map(() => '?').join(', ')}, ?, ?)`)
    .bind(...KEYS.map(k => data[k]), ip, submittedAt).run();
  const id = res.meta && res.meta.last_row_id;

  if (env.EMAIL && env.NOTIFY_TO && env.MAIL_FROM) {
    try { await notify(env, data, id, submittedAt); } catch (e) { console.error('email alert failed', e && (e.code || e.message)); }
  }
  return json(200, { ok: true });
}

async function notify(env, data, id, submittedAt) {
  const rows = KEYS.map(k => `<tr><td style="border:1px solid #ddd;background:#f6f8fa;font-weight:bold;width:38%">${esc(LABEL[k])}</td><td style="border:1px solid #ddd">${esc(data[k] || '—').replace(/\n/g, '<br>')}</td></tr>`).join('');
  await env.EMAIL.send({
    to: env.NOTIFY_TO,
    from: env.MAIL_FROM,
    replyTo: data.email,
    subject: `Candidate registration: ${data.full_name} – ${data.course_title}`,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px"><h2>New candidate registration #${esc(id)}</h2><p>Submitted ${esc(istStamp(submittedAt))} IST</p><table cellpadding="8" style="border-collapse:collapse;max-width:680px;width:100%">${rows}</table><p>All registrations: https://scoreqc.com/admin/</p></div>`,
    text: KEYS.map(k => `${LABEL[k]}: ${data[k] || '—'}`).join('\n'),
  });
}

// ---------------------------------------------------------------- staff admin

async function hmacKey(env) {
  const raw = new TextEncoder().encode('scoreqc-admin-session:' + env.ADMIN_PASSWORD);
  return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function makeSession(env) {
  const exp = String(nowSec() + SESSION_HOURS * 3600);
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(env), new TextEncoder().encode(exp));
  return exp + '.' + b64url(sig);
}
async function validSession(request, env) {
  const m = (request.headers.get('cookie') || '').match(/(?:^|;\s*)sq_admin=([^;]+)/);
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || +exp < nowSec()) return false;
  const expected = await crypto.subtle.sign('HMAC', await hmacKey(env), new TextEncoder().encode(exp));
  return timingSafeEqual(b64url(expected), sig);
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function passwordMatches(env, given) {
  // compare SHA-256 digests so the comparison takes the same time whatever the input length
  const h = async s => b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
  return timingSafeEqual(await h(given), await h(env.ADMIN_PASSWORD));
}
const cookie = (value, maxAge) => `sq_admin=${value}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
const redirect = (to, extra = {}) => new Response(null, { status: 303, headers: { location: to, 'cache-control': 'no-store', ...extra } });

async function admin(request, env, url) {
  if (!env.ADMIN_PASSWORD) return page('Not set up', '<p>The staff page is not set up yet: the ADMIN_PASSWORD secret is missing.</p>', 503);
  const db = env.DB;
  await ensureSchema(db);
  const path = url.pathname.replace(/\/+$/, '') || '/admin';

  if (path === '/admin/login') {
    if (request.method !== 'POST' || !sameOrigin(request, url)) return redirect('/admin/');
    const ip = clientIp(request);
    const since = nowSec() - LOGIN_WINDOW;
    const fails = await db.prepare('SELECT COUNT(*) AS n FROM login_failures WHERE ip = ? AND at > ?').bind(ip, since).first();
    if (fails && fails.n >= LOGIN_LIMIT) return loginPage('Too many wrong attempts. Please wait 15 minutes and try again.', 429);
    const form = await request.formData();
    if (await passwordMatches(env, String(form.get('password') || ''))) {
      await db.prepare('DELETE FROM login_failures WHERE ip = ? OR at < ?').bind(ip, since).run();
      return redirect('/admin/', { 'set-cookie': cookie(await makeSession(env), SESSION_HOURS * 3600) });
    }
    await db.prepare('INSERT INTO login_failures (ip, at) VALUES (?, ?)').bind(ip, nowSec()).run();
    return loginPage('Wrong password.', 401);
  }
  if (path === '/admin/logout') return redirect('/admin/', { 'set-cookie': cookie('', 0) });

  if (!(await validSession(request, env))) return loginPage('', 200);

  if (path === '/admin/delete') {
    if (request.method !== 'POST' || !sameOrigin(request, url)) return redirect('/admin/');
    const id = parseInt(String((await request.formData()).get('id')), 10);
    if (id > 0) await db.prepare('DELETE FROM registrations WHERE id = ?').bind(id).run();
    return redirect('/admin/');
  }

  const q = (url.searchParams.get('q') || '').trim().slice(0, 80);
  const where = q ? `WHERE full_name LIKE ?1 OR email LIKE ?1 OR phone LIKE ?1 OR course_title LIKE ?1` : '';
  const stmt = sql => q ? db.prepare(sql).bind('%' + q + '%') : db.prepare(sql);

  if (path === '/admin/export.csv') {
    const { results } = await stmt(`SELECT * FROM registrations ${where} ORDER BY id DESC`).all();
    const cell = v => {
      let s = String(v == null ? '' : v);
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const head = ['ID', 'Submitted (IST)', ...KEYS.map(k => LABEL[k])];
    const lines = [head.map(cell).join(','), ...results.map(r => [r.id, istStamp(r.submitted_at), ...KEYS.map(k => r[k])].map(cell).join(','))];
    return new Response('﻿' + lines.join('\r\n'), {
      headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="scoreqc-registrations-${new Date().toISOString().slice(0, 10)}.csv"`, 'cache-control': 'no-store' },
    });
  }

  const { results } = await stmt(`SELECT * FROM registrations ${where} ORDER BY id DESC LIMIT 500`).all();
  const total = await db.prepare('SELECT COUNT(*) AS n FROM registrations').first();
  const cards = results.map(r => `
    <details class="reg">
      <summary><span class="id">#${r.id}</span><b>${esc(r.full_name)}</b><span>${esc(r.course_title)}</span><span>${esc(r.phone)}</span><span class="when">${esc(istStamp(r.submitted_at))}</span></summary>
      <table>${KEYS.map(k => `<tr><th>${esc(LABEL[k])}</th><td>${r[k] ? esc(r[k]).replace(/\n/g, '<br>') : '—'}</td></tr>`).join('')}</table>
      <div class="acts">
        <a href="mailto:${esc(r.email)}">Email candidate</a>
        <a href="tel:${esc(r.phone.replace(/[^\d+]/g, ''))}">Call</a>
        <form method="post" action="/admin/delete" onsubmit="return confirm('Delete registration #${r.id} (${esc(r.full_name).replace(/'/g, '')})? This cannot be undone.')"><input type="hidden" name="id" value="${r.id}"><button>Delete</button></form>
      </div>
    </details>`).join('');
  const qs = q ? '?q=' + encodeURIComponent(q) : '';
  return page('Registrations', `
    <div class="bar">
      <form method="get" action="/admin/" class="search"><input name="q" value="${esc(q)}" placeholder="Search name, email, phone or course"><button>Search</button>${q ? '<a href="/admin/">Clear</a>' : ''}</form>
      <a class="btn" href="/admin/export.csv${qs}">Download CSV (Excel)</a>
      <a href="/admin/logout">Log out</a>
    </div>
    <p class="count">${q ? `${results.length} matching · ` : ''}${total ? total.n : 0} registration${total && total.n === 1 ? '' : 's'} in total${results.length === 500 ? ' · showing the latest 500' : ''}</p>
    ${cards || '<p class="empty">No registrations yet.</p>'}`);
}

function loginPage(msg, status) {
  return page('Staff login', `
    <form method="post" action="/admin/login" class="login">
      <label>Password<input type="password" name="password" autocomplete="current-password" required autofocus></label>
      ${msg ? `<p class="err">${esc(msg)}</p>` : ''}
      <button>Log in</button>
    </form>`, status);
}

function page(title, body, status = 200) {
  return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>${esc(title)} | SCORE QC staff</title>
<link rel="icon" type="image/png" href="/assets/brand/scoreqc-mark-64.png">
<style>
*{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0d1b26;background:#f3f6f9}
header{background:#071a30;color:#fff;padding:16px 20px}header b{font-size:17px}header span{opacity:.7;margin-left:8px}
main{max-width:1000px;margin:0 auto;padding:24px 16px 60px}
.bar{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;margin-bottom:10px}.search{display:flex;gap:8px;flex:1 1 320px;align-items:center}
input{font:inherit;padding:10px 12px;border:1px solid #c9d3dc;border-radius:6px;width:100%;background:#fff}
button,.btn{font:inherit;font-weight:600;padding:10px 16px;border:0;border-radius:6px;background:#2f9e44;color:#fff;cursor:pointer;text-decoration:none;white-space:nowrap}
a{color:#1c67b0}.count{color:#5b6b78;font-size:14px;margin:6px 0 16px}.empty{color:#5b6b78}
.reg{background:#fff;border:1px solid #dde4ea;border-radius:8px;margin-bottom:10px}
.reg summary{display:flex;flex-wrap:wrap;gap:4px 16px;padding:14px 16px;cursor:pointer;align-items:baseline}
.reg summary .id{color:#8fa1ae;font-size:13px}.reg summary .when{margin-left:auto;color:#5b6b78;font-size:13px}
.reg table{width:100%;border-collapse:collapse;border-top:1px solid #eef2f5}.reg th,.reg td{text-align:left;vertical-align:top;padding:8px 16px;border-bottom:1px solid #eef2f5;font-size:14px}
.reg th{width:36%;color:#5b6b78;font-weight:600}.acts{display:flex;gap:16px;align-items:center;padding:12px 16px}.acts form{margin-left:auto}.acts button{background:#c0392b;padding:8px 14px}
.login{max-width:360px;margin:40px auto;background:#fff;border:1px solid #dde4ea;border-radius:8px;padding:28px}.login label{display:block;font-weight:600;margin-bottom:14px}
.login input{margin-top:6px}.login button{width:100%}.err{color:#c0392b}
@media (max-width:600px){.reg th{width:42%}.reg summary .when{margin-left:0;width:100%}}
</style></head><body><header><b>SCORE QC</b><span>Candidate registrations</span></header><main>${body}</main></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer' } });
}
