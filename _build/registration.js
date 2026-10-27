// Content and template for /registration/ (candidate exam registration). Used by build.js.
// The site has no server, so the form posts to SCORE QC's own PHP script on the task-portal hosting
// (source in _server/registration/), which emails each registration to info@scoreqc.com via their mail server.

const TO = 'info@scoreqc.com';
const ENDPOINT = 'https://taskportal.scoreqc.com/registration/submit.php';

const COURSES = ['CSWIP 3.0 – Visual Welding Inspector', 'CSWIP 3.1 – Welding Inspector', 'CSWIP 3.2 – Senior Welding Inspector',
  'AWS to CSWIP Bridging', 'BGAS Grade 2 – Painting Inspector', 'BGAS Grade 1 – Senior Painting Inspector',
  'AWS – Certified Welding Inspector (CWI)', 'API 510 / 570 / 653 / 571 / 577 / 580 / 936 / 1169',
  'NACE CIP Level 1', 'NACE CIP Level 2', 'ISO Lead Auditor', 'Other'];

const QUALIFICATIONS = ['B.Tech / B.E. – Mechanical', 'B.Tech / B.E. – Civil', 'B.Tech / B.E. – Electrical', 'B.Tech / B.E. – Other',
  'M.Tech / M.E.', 'Diploma – Mechanical', 'Diploma – Civil', 'Diploma – Electrical', 'Diploma – Other', 'ITI', 'B.Sc / Other degree', 'Other'];

module.exports = function registrationPage({ head, nav, footer, esc }) {
  const opts = list => '<option value="" selected disabled></option>' + list.map(o => `<option>${esc(o)}</option>`).join('');
  const req = '<b class="rg-req" aria-hidden="true">*</b>';
  const field = (label, input, required) => `<label>${esc(label)}${required ? req : ''}${input}</label>`;

  return head('Candidate Registration | SCORE QC Training & Services',
      'Register for your CSWIP, BGAS, AWS, API or NACE examination with SCORE QC Training & Services.',
      '../campus/img/hero.jpg', '../courses/course.css') + nav('') + `
<main>
<section class="ct-hero">
  <div class="wrap">
    <div class="crumb"><a href="../">HOME</a> / REGISTRATION</div>
    <div class="kick light"><i></i>EXAM REGISTRATION</div>
    <h1>Candidate <span>registration.</span></h1>
    <p>Register for your certification seminar and examination. Our team will confirm your registration by phone or email.</p>
  </div>
</section>

<section class="wrap rg-main">
  <ul class="rg-notes">
    <li>Candidates should carefully fill in all the fields.</li>
    <li>Make sure the information you have provided is accurate before clicking the <b>Submit</b> button.</li>
    <li>The <b class="rg-req">*</b> marks mandatory fields.</li>
    <li>Please fill in using <b>BLOCK</b> letters.</li>
  </ul>

  <form class="ct-form rg-form" id="rg-form" novalidate>
    <h2>Course details</h2>
    ${field('Course Title', `<select name="course_title" required>${opts(COURSES)}</select>`, true)}
    ${field('TWI Candidate ID', '<input name="twi_id" placeholder="Not required for initial">')}
    <div class="ct-row">
      ${field('Seminar Date', '<input name="seminar_date" type="date" required>', true)}
      ${field('Date of Examination', '<input name="exam_date" type="date" required>', true)}
    </div>

    <h2>Personal details</h2>
    ${field('Full Name', '<input name="full_name" required autocomplete="name" placeholder="As required on certificate">', true)}
    <div class="ct-row">
      ${field('Date of Birth', '<input name="dob" type="date" required id="rg-dob">', true)}
      ${field('Age', '<input name="age" type="number" min="15" max="80" inputmode="numeric" required id="rg-age">', true)}
    </div>
    ${field('Email', '<input name="email" type="email" required autocomplete="email" class="rg-keep">', true)}
    <div class="ct-row">
      ${field('Contact Number', '<input name="phone" type="tel" required autocomplete="tel">', true)}
      ${field('Alternate Contact Number', '<input name="alt_phone" type="tel" required>', true)}
    </div>
    ${field('Permanent Address', '<textarea name="perm_address" rows="3" required></textarea>', true)}
    ${field('Pin Code', '<input name="perm_pin" inputmode="numeric" maxlength="6" required>', true)}
    ${field('Communication Address', '<textarea name="comm_address" rows="3"></textarea>')}
    ${field('Pin Code', '<input name="comm_pin" inputmode="numeric" maxlength="6">')}

    <h2>Qualification</h2>
    ${field('Course Completed', `<select name="qualification" required>${opts(QUALIFICATIONS)}</select>`, true)}
    ${field('Date of Completion', '<input name="completion_date" type="date" required>', true)}
    <fieldset class="rg-radio"><legend>NDT Certification</legend>
      <label><input type="radio" name="ndt_certification" value="No"> No</label>
      <label><input type="radio" name="ndt_certification" value="Yes"> Yes</label>
    </fieldset>

    <h2>Experience, if any</h2>
    ${field('Company Name', '<input name="company">')}
    ${field('Designation', '<input name="designation">')}
    <div class="ct-row">
      ${field('From', '<input name="exp_from" type="date">')}
      ${field('To', '<input name="exp_to" type="date">')}
    </div>

    <input type="text" name="_honey" class="rg-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <p class="ct-err" id="rg-err" role="alert"></p>
    <button class="btn green full" type="submit" id="rg-btn">Submit registration</button>
  </form>

  <div class="rg-done" id="rg-done" hidden>
    <h2>Registration received.</h2>
    <p>Thank you. Your details have been sent to SCORE QC and our team will contact you to confirm your seminar and examination. For anything urgent, call <a href="tel:04714066566">0471 40 66566</a> or email <a href="mailto:${TO}">${TO}</a>.</p>
  </div>
</section>
</main>
<script>
(function(){
  var f=document.getElementById('rg-form'),err=document.getElementById('rg-err'),btn=document.getElementById('rg-btn'),dob=document.getElementById('rg-dob'),age=document.getElementById('rg-age');
  dob.addEventListener('change',function(){var d=new Date(dob.value);if(isNaN(d))return;var n=new Date(),a=n.getFullYear()-d.getFullYear();if(n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate()))a--;if(a>0)age.value=a;});
  function check(){
    var bad=null;
    f.querySelectorAll('[required]').forEach(function(el){el.classList.remove('rg-bad');if(!bad&&!String(el.value).trim()){bad=el;}});
    if(bad){bad.classList.add('rg-bad');return [bad,'Please fill in '+bad.closest('label').firstChild.textContent.trim()+'.'];}
    var em=f.elements.email;if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(em.value.trim()))return [em,'Please enter a valid email address.'];
    var ph=[f.elements.phone,f.elements.alt_phone];
    for(var i=0;i<ph.length;i++)if(ph[i].value.replace(/\\D/g,'').length<10)return [ph[i],'Please enter a valid 10-digit phone number.'];
    var pin=f.elements.perm_pin;if(!/^\\d{6}$/.test(pin.value.trim()))return [pin,'Please enter a 6-digit pin code.'];
    return null;
  }
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var c=check();if(c){err.textContent=c[1];c[0].focus();return;}
    err.textContent='';
    var data={};new FormData(f).forEach(function(v,k){v=String(v).trim();data[k]=(k==='email'||k==='_honey')?v:v.toUpperCase();});
    f.querySelectorAll('input[type=date]').forEach(function(el){if(el.value)data[el.name]=el.value.split('-').reverse().join('/');});
    btn.disabled=true;btn.textContent='Sending…';
    fetch('${ENDPOINT}',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||!j.ok){var e=new Error('failed');e.msg=(r.status===422||r.status===429)&&j.message;throw e;}});})
      .then(function(){f.hidden=true;document.getElementById('rg-done').hidden=false;window.scrollTo({top:document.getElementById('rg-done').offsetTop-120,behavior:'smooth'});})
      .catch(function(e){if(e.msg)err.textContent=e.msg;else err.innerHTML='Sorry, your registration could not be sent. Please try again, or email it to <a href="mailto:${TO}">${TO}</a>.';btn.disabled=false;btn.textContent='Submit registration';});
  });
})();
</script>` + footer();
};
