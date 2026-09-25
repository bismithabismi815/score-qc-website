/* SCORE QC image tuner
 * - Every visitor: applies saved crop/zoom settings from assets/image-positions.json.
 * - Site owner: open any page with ?edit to reposition (drag) and zoom (wheel / slider)
 *   photos, then "Download settings" and send the file to be published.
 *   Nothing is written to the site from the browser.
 */
(function () {
  'use strict';
  var FILE = 'assets/image-positions.json';

  // site root = folder that contains /assets/image-tuner.js
  var me = document.currentScript && document.currentScript.src;
  var ROOT = me ? me.replace(/assets\/image-tuner\.js.*$/, '') : location.origin + '/';
  var rootPath = new URL(ROOT).pathname;

  function pageKey() {
    var p = location.pathname;
    if (p.indexOf(rootPath) === 0) p = p.slice(rootPath.length);
    return p.replace(/index\.html$/, '') || '/';
  }
  function srcKey(img) {
    var s = img.getAttribute('src') || '';
    if (/^(data|blob):/.test(s)) return null;
    var p = new URL(s, location.href).pathname;
    return p.indexOf(rootPath) === 0 ? p.slice(rootPath.length) : p;
  }
  function keyOf(img) { var s = srcKey(img); return s ? pageKey() + '|' + s : null; }

  var settings = {}, edits = {};
  function apply(img) {
    var k = keyOf(img); if (!k) return;
    var v = k in edits ? edits[k] : settings[k];
    if (!v) { if (k in edits) { img.style.objectPosition = img.style.scale = img.style.transformOrigin = ''; } return; }
    img.style.objectPosition = v.x + '% ' + v.y + '%';
    img.style.transformOrigin = v.x + '% ' + v.y + '%';
    img.style.scale = String(v.z || 1);
  }
  function applyAll() { Array.prototype.forEach.call(document.images, apply); }

  fetch(ROOT + FILE + '?v=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (j) { settings = j || {}; applyAll(); watch(); if (/[?&]edit\b/.test(location.search)) editor(); });

  // images can be rendered late (the home page is unpacked by script)
  function watch() {
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes, function (n) {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'IMG') apply(n);
          if (n.querySelectorAll) Array.prototype.forEach.call(n.querySelectorAll('img'), apply);
        });
        if (m.type === 'attributes' && m.target.tagName === 'IMG') apply(m.target);
      });
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  }

  // ---------------- editor (?edit) ----------------
  function editor() {
    var LS = 'sqc-image-edits';
    try { edits = JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch (e) { edits = {}; }
    function persist() { try { localStorage.setItem(LS, JSON.stringify(edits)); } catch (e) {} }
    applyAll();

    var css = document.createElement('style');
    css.textContent =
      '.sqc-editable{outline:2px dashed rgba(47,158,68,.9)!important;outline-offset:-2px;cursor:grab!important}' +
      '.sqc-editable.sqc-sel{outline:3px solid #1c67b0!important;cursor:move!important}' +
      '#sqc-panel{position:fixed;left:16px;bottom:16px;z-index:2147483000;width:300px;background:#0d1b26;color:#e9f1f7;font:13px/1.45 system-ui,sans-serif;border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:16px 16px 14px}' +
      '#sqc-panel h4{margin:0 0 4px;font-size:15px;color:#fff}#sqc-panel p{margin:0 0 10px;color:#9fb3c8;font-size:12px}' +
      '#sqc-panel label{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:12px}#sqc-panel label span{width:66px;color:#9fb3c8}' +
      '#sqc-panel input[type=range]{flex:1}#sqc-panel .row{display:flex;gap:6px;margin-top:10px}' +
      '#sqc-panel button{flex:1;border:0;border-radius:6px;padding:9px 8px;font:600 12px system-ui,sans-serif;cursor:pointer;background:#1e3448;color:#fff}' +
      '#sqc-panel button.pri{background:#2f9e44}' +
      '#sqc-panel .name{font-family:ui-monospace,monospace;font-size:11px;color:#7cbcf0;word-break:break-all;margin-bottom:6px}' +
      '#sqc-panel .msg{margin-top:8px;font-size:12px;color:#a5e8ac;min-height:16px}';
    document.head.appendChild(css);

    var panel = document.createElement('div');
    panel.id = 'sqc-panel';
    panel.innerHTML =
      '<h4>Image editor</h4><p>Click a photo (green outline), then drag it to reposition. Scroll over it or use Zoom to enlarge. Your changes are kept in this browser across pages.</p>' +
      '<div class="name" id="sqc-name">No image selected</div>' +
      '<label><span>Left / right</span><input id="sqc-x" type="range" min="0" max="100" step="1"></label>' +
      '<label><span>Up / down</span><input id="sqc-y" type="range" min="0" max="100" step="1"></label>' +
      '<label><span>Zoom</span><input id="sqc-z" type="range" min="1" max="2.5" step="0.01"></label>' +
      '<div class="row"><button id="sqc-reset">Reset image</button><button id="sqc-exit">Exit editor</button></div>' +
      '<div class="row"><button class="pri" id="sqc-dl">Download settings</button><button id="sqc-copy">Copy</button></div>' +
      '<div class="msg" id="sqc-msg"></div>';
    document.body.appendChild(panel);
    var $ = function (id) { return document.getElementById(id); };
    var sel = null;
    function status() { var n = Object.keys(edits).length; $('sqc-msg').textContent = n ? n + ' image(s) adjusted. Download the settings file and send it to publish.' : ''; }
    status();

    function editable(img) {
      if (panel.contains(img)) return false;
      var cs = getComputedStyle(img), r = img.getBoundingClientRect();
      return cs.objectFit === 'cover' && r.width > 80 && r.height > 60;
    }
    function mark() { Array.prototype.forEach.call(document.images, function (i) { if (editable(i)) i.classList.add('sqc-editable'); }); }
    mark(); setInterval(mark, 1500);

    function cur(img) {
      var k = keyOf(img), v = k in edits ? edits[k] : settings[k];
      if (v) return { x: v.x, y: v.y, z: v.z || 1 };
      var op = getComputedStyle(img).objectPosition.split(' ');
      var pc = function (s) { return /%$/.test(s) ? parseFloat(s) : 50; };
      return { x: pc(op[0]), y: pc(op[1] || '50%'), z: 1 };
    }
    function set(img, v) {
      v.x = Math.max(0, Math.min(100, Math.round(v.x))); v.y = Math.max(0, Math.min(100, Math.round(v.y)));
      v.z = Math.max(1, Math.min(2.5, Math.round(v.z * 100) / 100));
      edits[keyOf(img)] = v; persist(); apply(img); fill(); status();
    }
    function fill() {
      if (!sel) return;
      var v = cur(sel); $('sqc-x').value = v.x; $('sqc-y').value = v.y; $('sqc-z').value = v.z;
      $('sqc-name').textContent = srcKey(sel) + '  (' + v.x + '%, ' + v.y + '%, x' + v.z + ')';
    }
    // photos are often under text/overlay layers: find the editable image beneath the pointer
    function imgAt(x, y) {
      if (panel.contains(document.elementFromPoint(x, y))) return null;
      var els = document.elementsFromPoint(x, y);
      for (var i = 0; i < els.length; i++) if (els[i].tagName === 'IMG' && els[i].classList.contains('sqc-editable')) return els[i];
      return null;
    }
    function select(img) { if (sel) sel.classList.remove('sqc-sel'); sel = img; sel.classList.add('sqc-sel'); fill(); }

    // stop links under photos from navigating while editing
    document.addEventListener('click', function (e) {
      if (imgAt(e.clientX, e.clientY)) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    var drag = null;
    document.addEventListener('pointerdown', function (e) {
      var img = imgAt(e.clientX, e.clientY);
      if (!img) return;
      e.preventDefault(); select(img);
      var r = img.getBoundingClientRect(), v = cur(img);
      var nw = img.naturalWidth || r.width, nh = img.naturalHeight || r.height;
      var s = Math.max(r.width / nw, r.height / nh) * v.z;
      drag = { img: img, x0: e.clientX, y0: e.clientY, v: v,
        ox: Math.max(nw * s - r.width, r.width * .6), oy: Math.max(nh * s - r.height, r.height * .6) };
    }, true);
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      set(drag.img, { x: drag.v.x - (e.clientX - drag.x0) / drag.ox * 100, y: drag.v.y - (e.clientY - drag.y0) / drag.oy * 100, z: drag.v.z });
    });
    window.addEventListener('pointerup', function () { drag = null; });
    document.addEventListener('wheel', function (e) {
      if (!sel || imgAt(e.clientX, e.clientY) !== sel) return;
      e.preventDefault(); var v = cur(sel); v.z += e.deltaY < 0 ? 0.05 : -0.05; set(sel, v);
    }, { passive: false });

    ['x', 'y', 'z'].forEach(function (a) {
      $('sqc-' + a).addEventListener('input', function () { if (!sel) return; var v = cur(sel); v[a] = parseFloat(this.value); set(sel, v); });
    });
    $('sqc-reset').onclick = function () {
      if (!sel) return;
      edits[keyOf(sel)] = null; persist(); apply(sel); fill(); status();
    };
    $('sqc-exit').onclick = function () {
      location.href = location.href.replace(/([?&])edit\b[^&]*&?/, '$1').replace(/[?&]$/, '');
    };

    // merged settings = published settings + this browser's edits (null = reset)
    function merged() {
      var out = {}, k;
      for (k in settings) out[k] = settings[k];
      for (k in edits) { if (edits[k]) out[k] = edits[k]; else delete out[k]; }
      var sorted = {}; Object.keys(out).sort().forEach(function (k) { sorted[k] = out[k]; });
      return JSON.stringify(sorted, null, 1) + '\n';
    }
    $('sqc-dl').onclick = function () {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([merged()], { type: 'application/json' }));
      a.download = 'image-positions.json'; document.body.appendChild(a); a.click(); a.remove();
      $('sqc-msg').textContent = 'Downloaded image-positions.json. Send this file to publish your changes.';
    };
    $('sqc-copy').onclick = function () {
      var t = merged();
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(
        function () { $('sqc-msg').textContent = 'Settings copied. Paste them in a message to publish.'; },
        function () { prompt('Copy these settings:', t); });
    };
  }
})();
