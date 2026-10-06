// Content and template for /gallery/. Used by build.js.
// Only real SCORE QC photos (classroom, training, site work, clients). No stock or AI images.
// Each photo is in gallery/img as <file>.jpg (full size) and <file>-sm.jpg (thumbnail).

const GROUPS = [
  { id: 'classroom', label: 'Classroom' },
  { id: 'training', label: 'Training' },
  { id: 'site', label: 'On Site' },
  { id: 'clients', label: 'Clients' },
];

// [file, group, caption, width, height]
const PHOTOS = [
  ['classroom-session', 'classroom', 'Classroom session at SCORE QC', 1600, 1067],
  ['instructor-whiteboard', 'classroom', 'A SCORE QC instructor teaching at the whiteboard', 1400, 1120],
  ['trainees-in-class', 'classroom', 'Trainees in class', 1400, 933],
  ['trainees-lecture', 'classroom', 'Trainees following a lecture', 1400, 1120],
  ['whiteboard-lesson', 'classroom', 'Classroom session with a whiteboard lesson', 1000, 667],
  ['faculty-teaching', 'classroom', 'Faculty member teaching a batch', 1000, 667],
  ['course-material', 'classroom', 'Trainees working through course material', 1000, 667],
  ['theory-session', 'classroom', 'Trainees in a theory session', 1000, 667],
  ['hands-on-practical', 'training', 'Hands-on practical with inspection equipment', 1400, 936],
  ['equipment-guidance', 'training', 'Instructor guiding a trainee on the equipment', 1400, 990],
  ['course-work', 'training', 'Instructor guiding trainees through course work', 1400, 936],
  ['team-training', 'training', 'Training a client team', 1200, 802],
  ['corporate-training', 'training', 'Instructor leading a corporate training session', 1200, 900],
  ['trainees-desks', 'training', 'Trainees working through course material in class', 1024, 683],
  ['socotec-training', 'training', 'Training the SOCOTEC team', 1080, 720],
  ['training-oman', 'training', 'Training session for a client team in Oman', 531, 358],
  ['tank-inspection', 'site', 'SCORE QC inspector carrying out a tank inspection on site', 1400, 1227],
  ['site-team-madagascar', 'site', 'Our team on site in Madagascar', 1400, 1050],
  ['site-inspection', 'site', 'Inspection on site', 1200, 678],
  ['in-service-ndt', 'site', 'In-service NDT inspection', 1200, 900],
  ['inspection-team', 'site', 'SCORE QC inspectors and technicians', 1024, 691],
  ['inspection-documents', 'site', 'Inspection documentation', 1200, 802],
  ['socotec-meeting', 'clients', 'Meeting the SOCOTEC team', 1080, 720],
  ['client-meeting', 'clients', 'Client meeting', 1080, 720],
  ['client-workshop', 'clients', 'Client workshop', 1080, 720],
  ['client-team-oman', 'clients', 'With our client team in Oman', 1080, 720],
];

module.exports = function galleryPage({ head, nav, footer, esc }) {
  const tile = (p, i) => {
    const [file, group, caption, w, h] = p;
    return `<figure class="g-item" data-group="${group}" data-rv>
      <button type="button" data-i="${i}" aria-label="Open photo: ${esc(caption)}"><img src="img/${file}-sm.jpg" width="${Math.min(720, w)}" height="${Math.round(h * Math.min(720, w) / w)}" alt="${esc(caption)}" loading="${i < 6 ? 'eager' : 'lazy'}"></button>
      <figcaption>${esc(caption)}</figcaption>
    </figure>`;
  };
  const data = PHOTOS.map(([file, , caption]) => ({ src: 'img/' + file + '.jpg', caption }));

  return head('Gallery | SCORE QC Training & Services',
      'Photos from SCORE QC: classroom sessions, hands-on training, inspection work on site and our client teams.',
      'img/classroom-session.jpg', '../courses/course.css') + nav('gallery') + `
<main>
<section class="ct-hero">
  <div class="wrap">
    <div class="crumb"><a href="../">HOME</a> / GALLERY</div>
    <div class="kick light"><i></i>LIFE AT SCORE QC</div>
    <h1>Our <span>gallery.</span></h1>
    <p>Real photos from our classrooms, practical sessions, inspection sites and client trainings in India and abroad.</p>
  </div>
</section>
<div class="filter-bar">
  <div class="wrap"><div class="filters" id="g-filters" role="group" aria-label="Filter photos">
    <button data-group="all" aria-pressed="true">All</button>${GROUPS.map(g => `<button data-group="${g.id}" aria-pressed="false">${esc(g.label)}</button>`).join('')}
  </div></div>
</div>
<section class="wrap g-sec">
  <div class="g-grid" id="g-grid">
    ${PHOTOS.map(tile).join('\n    ')}
  </div>
</section>
</main>
<dialog class="g-box" id="g-box" aria-label="Photo viewer">
  <figure><img id="g-img" alt=""><figcaption id="g-cap"></figcaption></figure>
  <button type="button" class="g-close" id="g-close" aria-label="Close">✕</button>
  <button type="button" class="g-nav g-prev" id="g-prev" aria-label="Previous photo">‹</button>
  <button type="button" class="g-nav g-next" id="g-next" aria-label="Next photo">›</button>
</dialog>
<script>
(function(){
  var P=${JSON.stringify(data)};
  var grid=document.getElementById('g-grid'),f=document.getElementById('g-filters'),box=document.getElementById('g-box'),img=document.getElementById('g-img'),cap=document.getElementById('g-cap'),cur=0;
  function visible(){return Array.prototype.filter.call(grid.querySelectorAll('.g-item'),function(el){return !el.hidden;}).map(function(el){return +el.querySelector('button').dataset.i;});}
  function show(i){cur=i;img.src=P[i].src;img.alt=P[i].caption;cap.textContent=P[i].caption;}
  function step(d){var v=visible(),k=v.indexOf(cur);show(v[(k+d+v.length)%v.length]);}
  grid.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(!b)return;show(+b.dataset.i);if(box.showModal)box.showModal();else box.setAttribute('open','');});
  document.getElementById('g-close').addEventListener('click',function(){box.close();});
  document.getElementById('g-prev').addEventListener('click',function(){step(-1);});
  document.getElementById('g-next').addEventListener('click',function(){step(1);});
  box.addEventListener('click',function(e){if(e.target===box)box.close();});
  box.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);});
  var sx=null;box.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  box.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)step(dx<0?1:-1);sx=null;});
  f.addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;
    f.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===t);});
    var g=t.dataset.group;grid.querySelectorAll('.g-item').forEach(function(el){el.hidden=g!=='all'&&el.dataset.group!==g;});});
})();
</script>` + footer();
};
