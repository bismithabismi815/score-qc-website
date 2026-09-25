// Content and template for /campus/ (the Campus page, written like an About us page). Used by build.js.
// Text is from the SCORE QC website's About page, lightly edited.

const SPECIALITIES = [
  'Well-equipped smart classrooms with LED projectors',
  'Easy to reach, right in the heart of Thiruvananthapuram',
  'Best-in-class lab facilities with modern tools and equipment',
  'Faculty with long experience in their fields',
  'Application-oriented training material written by our faculty',
  'Exam-oriented, interactive training sessions',
  'International certification at an affordable fee, with batches all year round',
  'Interview-oriented grooming sessions',
  'Career guidance and counselling',
  'International corporate training in mechanical, electrical and civil disciplines',
  'Design, drafting, commissioning and inspection projects delivered worldwide',
];

const AFFILIATIONS = [
  ['aff-asnt.png', 'ASNT', 'The American Society for Nondestructive Testing'],
  ['aff-msme.png', 'MSME', 'Government of India'],
  ['aff-sted.png', 'STED Council', 'Government of India'],
  ['aff-iso.png', 'ISO 9001:2015', 'International Organization for Standardization'],
];

const EXAMS = [
  ['CSWIP & BGAS', 'TWI, United Kingdom'],
  ['NACE', 'AMPP (formerly NACE International)'],
  ['API', 'American Petroleum Institute'],
  ['AWS', 'American Welding Society'],
];

const CAMPUS = [
  ['campus-k02.jpg', 'Classroom session with a whiteboard lesson'],
  ['campus-a16.jpg', 'Faculty member teaching a batch'],
  ['campus-k08.jpg', 'Trainees working through course material'],
  ['campus-k26.jpg', 'Trainees in a theory session'],
];

module.exports = function aboutPage({ head, nav, footer, esc, waLink, ICON, PHONE, PHONE_LABEL }) {
  const exam = ([name, body]) => `<div class="ab-exam" data-rv>
      <div><h3>${esc(name)}</h3><small>${esc(body)}</small></div>
      <a class="btn line" href="${waLink('Hello SCORE QC, please share the upcoming ' + name + ' examination schedule.')}" target="_blank" rel="noopener">${ICON.wa} Ask for dates</a>
    </div>`;
  return head('Campus | SCORE QC Training & Services',
      'SCORE QC Training & Services is an ISO 9001:2015 certified NDT and QA/QC institute in the heart of Thiruvananthapuram, with training, inspection services and placement support.',
      'img/hero.jpg', '../courses/course.css') + nav('campus') + `
<main>
<section class="c-hero ab-hero">
  <img class="c-hero-bg" src="img/hero.jpg" alt="A SCORE QC faculty member teaching a full classroom of trainees">
  <div class="wrap c-hero-in">
    <div class="crumb"><a href="../">HOME</a> / CAMPUS</div>
    <div class="kick light"><i></i>ISO 9001:2015 CERTIFIED</div>
    <h1>Our <span>Campus.</span></h1>
    <p>An NDT and quality-control institute in the heart of Thiruvananthapuram, and one of the fast-growing companies in quality assurance and quality control.</p>
  </div>
</section>

<section class="wrap ab-intro">
  <div data-rv>
    <div class="kick">[ 01 — WHO WE ARE ]</div>
    <h2>Trained and nurtured by people who inspect for a living.</h2>
    <p class="lead">SCORE QC Training &amp; Services is the best NDT institute in Trivandrum. Situated in the heart of Thiruvananthapuram city, we offer easy access and a well-equipped place to study. Our students are trained and mentored by experienced faculty with wide, multidisciplinary backgrounds.</p>
    <p>We keep raising our standards and respond to what industry needs. Backed by expert faculty, technicians and engineers known for their experience and professionalism, we open doors to the wide and growing opportunities in oil &amp; gas, refineries and other industrial fields.</p>
    <p>We also provide NDT and quality-control services to the rigging, refining, construction and power-generation industries. Our certified technicians deliver accurate, high-level inspections that improve reliability and reduce equipment downtime. Our ISO 9001:2015 quality management system drives continual improvement in our training and services, so the work is reliable and safely executed.</p>
  </div>
  <figure class="ab-fig" data-rv><img src="img/faculty.jpg" alt="A SCORE QC instructor teaching at the whiteboard" loading="lazy"></figure>
</section>

<section class="ab-mv">
  <div class="wrap ab-mv-in">
    <div class="ab-mv-card" data-rv>
      <div class="kick light">[ OUR MISSION ]</div>
      <p>To provide quality-control solutions in a highly efficient and professional manner that meets the needs of industry, and to give you the technical insight into what lies ahead.</p>
    </div>
    <div class="ab-mv-card" data-rv>
      <div class="kick light">[ OUR VISION ]</div>
      <p>To be a leading, world-class professional institute, recognised for setting benchmarks in quality control and quality assurance.</p>
    </div>
  </div>
</section>

<section class="wrap ab-spec">
  <figure class="ab-fig" data-rv><img src="img/students.jpg" alt="Trainees following a lecture at SCORE QC" loading="lazy"></figure>
  <div data-rv>
    <div class="kick">[ 02 — OUR SPECIALITIES ]</div>
    <h2>Why students choose us.</h2>
    <ul class="ab-list">${SPECIALITIES.map(s => `<li>${ICON.award}<span>${esc(s)}</span></li>`).join('')}</ul>
  </div>
</section>

<section class="ab-campus">
  <div class="wrap">
    <div class="rel-head" data-rv><div><div class="kick">[ 03 — OUR CAMPUS ]</div><h2>Inside our classrooms.</h2></div></div>
    <div class="ab-gallery">${CAMPUS.map(([f, a]) => `<figure data-rv><img src="img/${f}" alt="${esc(a)}" loading="lazy"></figure>`).join('')}</div>
  </div>
</section>

<section class="wrap ab-aff">
  <div data-rv>
    <div class="kick">[ 04 — PARTNERSHIPS &amp; AFFILIATIONS ]</div>
    <h2>Recognised and affiliated.</h2>
  </div>
  <div class="ab-aff-grid">${AFFILIATIONS.map(([f, n, d]) => `<div class="ab-aff-card" data-rv><img src="img/${f}" alt="${esc(n)}" loading="lazy"><b>${esc(n)}</b><small>${esc(d)}</small></div>`).join('')}</div>
</section>

<section class="ab-why">
  <div class="wrap ab-why-in" data-rv>
    <div class="kick light">[ 05 — WHY US? ]</div>
    <h2>As the name suggests, we assure quality.</h2>
    <p>We draw on our long experience, and it won't take long to see that choosing us is not only the right choice but the perfect one. We provide NDT and quality-control solutions to the rigging, refining, construction and power-generation industries, with high-level inspections and accurate results.</p>
  </div>
</section>

<section class="wrap ab-place">
  <div data-rv>
    <div class="kick">[ 06 — PLACEMENT &amp; TRAINING ]</div>
    <h2>Careers with leading companies, in India and abroad.</h2>
    <p class="lead">As one of the fast-growing companies in QA/QC, we keep close relationships with some of the best companies in India and overseas. That keeps us up to date with what they need and the opportunities coming up.</p>
    <p>We have an exceptional record of placing our students with leading companies in India and abroad, and we make sure everyone gets the chance to build their career with a well-known employer.</p>
  </div>
  <figure class="ab-fig" data-rv><img src="img/placement.jpg" alt="SCORE QC team on site at an industrial plant" loading="lazy"></figure>
</section>

<section class="related ab-exams-sec">
  <div class="wrap">
    <div class="rel-head" data-rv><div><div class="kick">[ 07 — EXAMINATIONS ]</div><h2>International certification exam schedules.</h2></div><a class="more" href="../courses/#intl">International courses →</a></div>
    <div class="ab-exams">${EXAMS.map(exam).join('')}</div>
    <div class="ab-brochure" data-rv>
      <div><h3>Download our brochure</h3><p>Get the detailed brochure with all our courses and services.</p></div>
      <a class="btn green" href="${waLink('Hello SCORE QC, please send me your brochure.')}" target="_blank" rel="noopener">${ICON.wa} Get the brochure</a>
    </div>
  </div>
</section>
</main>` + footer();
};
