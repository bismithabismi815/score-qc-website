// Content and template for /contact/ (Contact us). Used by build.js.
// The enquiry form opens WhatsApp with the details filled in (the site has no server to send mail).

const OFFICES = [
  { city: 'Trivandrum', tag: 'HEAD OFFICE & CAMPUS', addr: 'Nandanam Towers, Vanross Junction, Palayam, Thiruvananthapuram, Kerala',
    phone: '0471 40 66566', tel: '04714066566', map: 'Nandanam Towers, Vanross Junction, Palayam, Thiruvananthapuram' },
  { city: 'Cochin', tag: 'BRANCH OFFICE', addr: 'Chandrika Building, Pipeline Road, Palarivattom, Kochi, Kerala',
    phone: '+91 80860 60565', tel: '+918086060565', map: 'Chandrika Building, Pipeline Road, Palarivattom, Kochi' },
];

const INTERESTS = ['International Certifications', 'QA/QC Courses', 'MEP Courses', 'Software Courses',
  'Professional Diplomas', 'Short Term Courses', 'Inspection & NDT Services', 'Corporate Training'];

module.exports = function contactPage({ head, nav, footer, esc, ICON, WA }) {
  const mail = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  const pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  const office = o => `<article class="ct-office" data-rv>
      <div class="ct-map"><iframe title="Map of the SCORE QC ${esc(o.city)} office" src="https://maps.google.com/maps?q=${encodeURIComponent(o.map)}&amp;z=16&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
      <div class="ct-office-body">
        <div class="kick">[ ${esc(o.tag)} ]</div>
        <h3>${esc(o.city)}</h3>
        <p class="ct-line">${pin}<span>${esc(o.addr)}</span></p>
        <p class="ct-line">${ICON.phone}<a href="tel:${o.tel}">${esc(o.phone)}</a></p>
        <div class="ct-btns">
          <a class="btn green" href="tel:${o.tel}">${ICON.phone} Call</a>
          <a class="btn line" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(o.map)}" target="_blank" rel="noopener">${pin} Directions</a>
        </div>
      </div>
    </article>`;

  return head('Contact Us | SCORE QC Training & Services',
      'Contact SCORE QC Training & Services in Trivandrum and Cochin: call, WhatsApp, email or send an enquiry about courses, certifications and inspection services.',
      '../campus/img/hero.jpg', '../courses/course.css') + nav('contact') + `
<main>
<section class="ct-hero">
  <div class="wrap">
    <div class="crumb"><a href="../">HOME</a> / CONTACT</div>
    <div class="kick light"><i></i>GET IN TOUCH</div>
    <h1>Contact <span>us.</span></h1>
    <p>Questions about a course, batch dates, fees or our inspection services? Call, message or write to us, or send the enquiry form and a counsellor will get back to you within one working day.</p>
    <div class="ct-quick">
      <a href="https://wa.me/${WA}" target="_blank" rel="noopener">${ICON.wa}<span><small>WHATSAPP</small>+91 80860 60565</span></a>
      <a href="tel:04714066566">${ICON.phone}<span><small>CALL</small>0471 40 66566</span></a>
      <a href="mailto:info@scoreqc.com">${mail}<span><small>EMAIL</small>info@scoreqc.com</span></a>
    </div>
  </div>
</section>

<section class="wrap ct-main">
  <form class="ct-form" id="ct-form" data-rv novalidate>
    <div class="kick">[ ENQUIRY ]</div>
    <h2>Send us an enquiry</h2>
    <p class="ct-note">Fill in your details and press send. WhatsApp opens with your message ready, so you just tap send.</p>
    <label>Full name<input name="name" required autocomplete="name"></label>
    <div class="ct-row">
      <label>Phone<input name="phone" type="tel" required autocomplete="tel"></label>
      <label>Email<input name="email" type="email" autocomplete="email"></label>
    </div>
    <label>Interested in<select name="interest">${INTERESTS.map(i => `<option>${esc(i)}</option>`).join('')}</select></label>
    <label>Message<textarea name="message" rows="4" placeholder="Your background, the course you are looking at, preferred batch…"></textarea></label>
    <p class="ct-err" id="ct-err" role="alert"></p>
    <button class="btn green full" type="submit">${ICON.wa} Send on WhatsApp</button>
    <a class="ct-alt" id="ct-mail" href="mailto:info@scoreqc.com">or send by email instead →</a>
  </form>

  <div class="ct-offices">${OFFICES.map(office).join('')}</div>
</section>
</main>
<script>
(function(){
  var f=document.getElementById('ct-form'),err=document.getElementById('ct-err'),mail=document.getElementById('ct-mail');
  function text(){var d=new FormData(f);return 'Hello SCORE QC, I would like to enquire.\\n\\nName: '+(d.get('name')||'')+'\\nPhone: '+(d.get('phone')||'')+(d.get('email')?'\\nEmail: '+d.get('email'):'')+'\\nInterested in: '+d.get('interest')+(d.get('message')?'\\n\\n'+d.get('message'):'');}
  function ok(){var d=new FormData(f);if(!String(d.get('name')).trim()||!String(d.get('phone')).trim()){err.textContent='Please enter your name and phone number.';return false;}err.textContent='';return true;}
  f.addEventListener('submit',function(e){e.preventDefault();if(!ok())return;window.open('https://wa.me/${WA}?text='+encodeURIComponent(text()),'_blank','noopener');});
  mail.addEventListener('click',function(e){if(!ok()){e.preventDefault();return;}mail.href='mailto:info@scoreqc.com?subject='+encodeURIComponent('Enquiry from the website')+'&body='+encodeURIComponent(text());});
})();
</script>` + footer();
};
