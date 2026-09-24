// Builds /courses/index.html and one page per course from courses.js.
// Usage: node _build/build.js   (run from the repo root)
const fs = require('fs');
const path = require('path');
const { CATEGORIES, COURSES } = require('./courses.js');

const OUT = path.join(__dirname, '..', 'courses');
const WA = '918086060565';
const PHONE = '04714066566';
const PHONE_LABEL = '0471 40 66566';
const catById = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inCat = (c, id) => c.cat === id || (c.also || []).includes(id);
const waLink = text => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);

const ICON = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.2 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.1 1.4 15.2.2 12 .2 5.5.2.2 5.5.2 12c0 2.1.5 4.1 1.6 5.9L.1 24l6.3-1.7c1.7.9 3.7 1.4 5.6 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6.1-3.4-8.3z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>'
};

function head(title, desc, img) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(img)}">
<meta name="theme-color" content="#071a30">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="course.css">
</head>
<body>`;
}

function nav(active) {
  const l = (href, label, key) => `<a href="${href}"${active === key ? ' class="on"' : ''}>${label}</a>`;
  const links = [l('../#institute', 'INSTITUTE'), l('../#programs', 'PROGRAMS'), l('./', 'COURSES', 'courses'), l('../#cswip-page', 'CSWIP'), l('../#campus', 'CAMPUS'), l('../landing/', 'SERVICES')].join('');
  return `
<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="../" aria-label="SCORE QC home"><span class="mark"><i></i><i></i></span><span><b>SCORE QC</b><small>TRAINING_&amp;_SERVICES</small></span></a>
    <nav class="links">${links}<a href="#enquire" class="cta">ENQUIRE →</a></nav>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false">☰</button>
  </div>
  <div class="mnav">${links}<a href="#enquire">ENQUIRE →</a></div>
</header>`;
}

function footer() {
  return `
<section class="cta-band" id="enquire">
  <div class="wrap cta-in">
    <div>
      <div class="kick light">[ BEGIN ]</div>
      <h2>Not sure which course fits? <span>Talk to a counsellor.</span></h2>
      <p>Tell us your background and goals. We will map your certification path and call you within one working day.</p>
    </div>
    <div class="cta-btns">
      <a class="btn green" href="${waLink('Hello SCORE QC, I would like advice on your courses.')}" target="_blank" rel="noopener">${ICON.wa} WhatsApp us</a>
      <a class="btn ghost" href="tel:${PHONE}">${ICON.phone} Call ${PHONE_LABEL}</a>
    </div>
  </div>
</section>
<footer class="foot">
  <div class="wrap foot-in">
    <a class="brand light" href="../"><span class="mark"><i></i><i></i></span><span><b>SCORE QC</b></span></a>
    <div class="foot-links"><a href="../#institute">INSTITUTE</a><a href="./">COURSES</a><a href="../#cswip-page">CSWIP_3.1</a><a href="../landing/">SERVICES</a></div>
    <div class="copy">© <span id="yr">2026</span> SCORE_QC_TRAINING_&amp;_SERVICES</div>
  </div>
</footer>
<a class="wa-fab" href="${waLink('Hello SCORE QC')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ICON.wa}</a>
<script>
(function(){
  var n=document.getElementById('nav'),b=document.getElementById('burger');
  b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o);});
  n.querySelectorAll('.mnav a').forEach(function(a){a.addEventListener('click',function(){n.classList.remove('open');});});
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px'}):null;
  document.querySelectorAll('[data-rv]').forEach(function(el){io?io.observe(el):el.classList.add('in');});
  document.getElementById('yr').textContent=new Date().getFullYear();
  var f=document.getElementById('filters');
  if(f){f.addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;
    f.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===t);});
    var id=t.dataset.cat;document.querySelectorAll('.cat-sec').forEach(function(s){s.hidden=id!=='all'&&s.id!==id;});});
    if(location.hash){var h=location.hash.slice(1),bt=f.querySelector('[data-cat="'+h+'"]');if(bt)bt.click();}}
})();
</script>
</body>
</html>`;
}

function card(c) {
  return `<a class="card" href="${c.slug}.html" data-rv>
      <div class="card-img"><img src="img/${c.slug}-sm.jpg" alt="" loading="lazy"></div>
      <div class="card-body">
        <span class="card-tag">${esc(c.tag)}</span>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.short)}</p>
        <div class="card-foot"><span>${c.dur ? ICON.clock + esc(c.dur) : ICON.user + 'Ask a counsellor'}</span><i>→</i></div>
      </div>
    </a>`;
}

function coursePage(c) {
  const cat = catById[c.cat];
  const related = COURSES.filter(x => x !== c && inCat(x, c.cat)).slice(0, 3);
  const waText = 'Hello SCORE QC, I am interested in the "' + c.title + '" course. Please share batch dates and fees.';
  const fact = (icon, label, value) => `<div class="fact">${icon}<div><small>${label}</small><b>${esc(value)}</b></div></div>`;
  return head(c.title + ' | SCORE QC Courses', c.short, 'img/' + c.slug + '.jpg') + nav('courses') + `
<main>
<section class="c-hero">
  <img class="c-hero-bg" src="img/${c.slug}.jpg" srcset="img/${c.slug}-sm.jpg 900w, img/${c.slug}.jpg 1800w" sizes="100vw" alt="${esc(c.title)}">
  <div class="wrap c-hero-in">
    <div class="crumb"><a href="../">HOME</a> / <a href="./">COURSES</a> / <a href="./#${cat.id}">${esc(cat.short.toUpperCase())}</a></div>
    <div class="kick light"><i></i>${esc(c.tag.toUpperCase())}</div>
    <h1>${esc(c.title)}</h1>
    <p>${esc(c.short)}</p>
    <div class="hero-chips">
      <span>${ICON.clock}${esc(c.dur || 'Duration: ask a counsellor')}</span>
      <span>${ICON.award}${esc(c.cert)}</span>
    </div>
  </div>
</section>

<section class="wrap c-body">
  <article class="c-main">
    <div data-rv>
      <div class="kick">[ OVERVIEW ]</div>
      <h2>About this course</h2>
      <p class="lead">${esc(c.overview)}</p>
      ${c.note ? `<div class="note">${esc(c.note)}</div>` : ''}
      ${c.link ? `<a class="more" href="${c.link.href}">${esc(c.link.label)} →</a>` : ''}
    </div>
    <div data-rv>
      <div class="kick">[ CURRICULUM ]</div>
      <h2>What you will learn</h2>
      <ul class="learn">${c.learn.map((l, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(l)}</li>`).join('')}</ul>
    </div>
    <div class="practical" data-rv>
      <div class="p-ic">${ICON.tool}</div>
      <div><h3>Practical, hands-on training</h3><p>Sessions are taught by faculty with long professional and teaching backgrounds, on real equipment and specimens, with classroom theory alongside.</p></div>
    </div>
  </article>

  <aside class="c-side">
    <div class="side-card" data-rv>
      <h3>Course facts</h3>
      ${fact(ICON.clock, 'Duration', c.dur || 'Ask a counsellor')}
      ${fact(ICON.user, 'Eligibility', c.elig || 'Ask a counsellor')}
      ${fact(ICON.award, 'Certification', c.cert)}
      <a class="btn green full" href="${waLink(waText)}" target="_blank" rel="noopener">${ICON.wa} Enquire on WhatsApp</a>
      <a class="btn line full" href="tel:${PHONE}">${ICON.phone} Call ${PHONE_LABEL}</a>
      <div class="reg"><small>TO REGISTER, BRING</small>
        <ul><li>Two passport-size photographs</li><li>Attested copy of your last qualifying certificate</li><li>Attested copy of ID proof (Aadhaar, passport, driving licence)</li></ul>
      </div>
    </div>
  </aside>
</section>

${related.length ? `<section class="related">
  <div class="wrap">
    <div class="rel-head" data-rv><div><div class="kick">[ ${esc(cat.short.toUpperCase())} ]</div><h2>Related courses</h2></div><a class="more" href="./#${cat.id}">All ${esc(cat.name.toLowerCase())} →</a></div>
    <div class="grid">${related.map(card).join('')}</div>
  </div>
</section>` : ''}
</main>` + footer();
}

function indexPage() {
  const total = COURSES.length;
  const sections = CATEGORIES.map((cat, i) => {
    const list = COURSES.filter(c => inCat(c, cat.id));
    return `<section class="cat-sec${i % 2 ? ' alt' : ''}" id="${cat.id}">
  <div class="wrap">
    <div class="cat-head" data-rv>
      <div><div class="kick">[ ${String(i + 1).padStart(2, '0')} — ${esc(cat.short.toUpperCase())} ]</div><h2>${esc(cat.name)}</h2></div>
      <p>${esc(cat.blurb)} <b>${list.length} courses.</b></p>
    </div>
    <div class="grid">${list.map(card).join('')}</div>
  </div>
</section>`;
  }).join('\n');
  return head('Courses | SCORE QC Training & Services', 'QA/QC, MEP, software, international certification, professional diploma and short term courses at SCORE QC, Kerala.', '../assets/home/training-bay.jpg') + nav('courses') + `
<main>
<section class="c-hero idx">
  <img class="c-hero-bg" src="../assets/home/training-bay.jpg" alt="Trainees at work in the SCORE QC training bay">
  <div class="wrap c-hero-in">
    <div class="crumb"><a href="../">HOME</a> / COURSES</div>
    <div class="kick light"><i></i>COURSES OFFERED</div>
    <h1>Find your <span>course.</span></h1>
    <p>${total} programmes for careers in oil &amp; gas, refineries, electrical, building and construction – from 7-day software courses to one-year professional diplomas.</p>
  </div>
</section>
<div class="filter-bar">
  <div class="wrap"><div class="filters" id="filters" role="group" aria-label="Filter courses by category">
    <button data-cat="all" aria-pressed="true">All</button>${CATEGORIES.map(c => `<button data-cat="${c.id}" aria-pressed="false">${esc(c.short)}</button>`).join('')}
  </div></div>
</div>
${sections}
</main>` + footer();
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), indexPage());
COURSES.forEach(c => fs.writeFileSync(path.join(OUT, c.slug + '.html'), coursePage(c)));
fs.copyFileSync(path.join(__dirname, 'course.css'), path.join(OUT, 'course.css'));
console.log('built', COURSES.length + 1, 'pages');
