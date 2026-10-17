// Content and template for the legal pages: /privacypolicy/, /termsandconditions/ and /disclaimer/.
// They sit at the same addresses as on the old scoreqc.com site. Text is from those pages, unchanged apart from typos.
// Each block is a heading (h), a paragraph (p) or a list (ul). Used by build.js.

const PAGES = [
  {
    dir: 'privacypolicy', title: 'Privacy Policy', h1: ['Privacy ', 'Policy.'], kick: 'EFFECTIVE DATE: JULY 31, 2018',
    desc: 'How SCORE QC Training & Services collects, uses and protects personal data when you use the scoreqc.com website.',
    body: [
      { p: 'SCORE QC Training & Services ("us", "we", or "our") operates the www.scoreqc.com website (the "Service").' },
      { p: 'This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.' },
      { p: 'We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.' },
      { h: 'Information collection and use' },
      { p: 'We collect several different types of information for various purposes to provide and improve our Service to you.' },
      { h: 'Types of data collected' },
      { h3: 'Personal data' },
      { p: 'While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include:' },
      { ul: ['Email address', 'First name and last name', 'Phone number', 'Address'] },
      { h3: 'Tracking and cookies data' },
      { p: 'We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.' },
      { p: 'Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.' },
      { p: 'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.' },
      { h: 'Use of data' },
      { p: 'SCORE QC Training & Services uses the collected data for various purposes:' },
      { ul: ['To provide and maintain the Service', 'To notify you about changes to our Service', 'To allow you to participate in interactive features of our Service when you choose to do so', 'To provide support', 'To provide analysis or valuable information so that we can improve the Service', 'To monitor the usage of the Service', 'To detect, prevent and address technical issues'] },
      { h: 'Transfer of data' },
      { p: 'If you are located outside India and choose to provide information to us, please note that we transfer the data, including Personal Data, to India and process it there.' },
      { p: 'Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.' },
      { p: 'SCORE QC Training & Services will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.' },
      { h: 'Disclosure of data' },
      { h3: 'Legal requirements' },
      { p: 'SCORE QC Training & Services may disclose your Personal Data in the good faith belief that such action is necessary to:' },
      { ul: ['Comply with a legal obligation', 'Protect and defend the rights or property of SCORE QC Training & Services', 'Prevent or investigate possible wrongdoing in connection with the Service', 'Protect the personal safety of users of the Service or the public', 'Protect against legal liability'] },
      { h: 'Security of data' },
      { p: 'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.' },
      { h: 'Service providers' },
      { p: 'We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.' },
      { p: 'These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.' },
      { h: 'Changes to this Privacy Policy' },
      { p: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.' },
      { p: 'We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.' },
      { p: 'You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.' },
      { h: 'Contact us' },
      { p: 'If you have any questions about this Privacy Policy, please contact us by email at {privacy@scoreqc.com}.' },
    ],
  },
  {
    dir: 'termsandconditions', title: 'Terms & Conditions', h1: ['Terms & ', 'Conditions.'], kick: 'TERMS OF SERVICE',
    desc: 'The terms and conditions that apply to everyone who uses the SCORE QC Training & Services website.',
    body: [
      { h: 'Overview' },
      { p: 'This website is operated by SCORE QC Training & Services. Throughout the site, the terms "we", "us" and "our" refer to SCORE QC Training & Services. SCORE QC Training & Services offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.' },
      { p: 'By visiting our site you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.' },
      { p: 'Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.' },
      { p: 'Any new features or tools which are added shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.' },
      { h: 'Section 1 – General conditions' },
      { p: 'We reserve the right to refuse service to anyone for any reason at any time.' },
      { p: 'You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.' },
      { p: 'The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.' },
      { h: 'Section 2 – Accuracy, completeness and timeliness of information' },
      { p: 'We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.' },
      { p: 'This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.' },
      { h: 'Section 3 – Modifications to the service and prices' },
      { p: 'Prices for our products and services are subject to change without notice.' },
      { p: 'We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.' },
      { p: 'We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.' },
      { h: 'Section 4 – User comments, feedback and other submissions' },
      { p: 'If, at our request, you send certain specific submissions or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, "comments"), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.' },
      { p: 'We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party’s intellectual property or these Terms of Service.' },
      { p: 'You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website. You may not use a false e-mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.' },
      { h: 'Section 5 – Personal information' },
      { p: 'Your submission of personal information through the website is governed by our [Privacy Policy](../privacypolicy/).' },
      { h: 'Section 6 – Errors, inaccuracies and omissions' },
      { p: 'Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice.' },
      { p: 'We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated.' },
      { h: 'Section 7 – Disclaimer of warranties; limitation of liability' },
      { p: 'In no case shall SCORE QC Training & Services, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service, or for any other claim related in any way to your use of the service or any product, including, but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the service or any content posted, transmitted, or otherwise made available via the service, even if advised of their possibility. Because some jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such jurisdictions, our liability shall be limited to the maximum extent permitted by law.' },
      { h: 'Section 8 – Indemnification' },
      { p: 'You agree to indemnify, defend and hold harmless SCORE QC Training & Services and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.' },
      { h: 'Section 9 – Termination' },
      { p: 'The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.' },
      { p: 'These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.' },
      { p: 'If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).' },
      { h: 'Section 10 – Entire agreement' },
      { p: 'The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.' },
      { p: 'These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).' },
      { p: 'Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.' },
      { h: 'Section 11 – Governing law' },
      { p: 'These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.' },
      { h: 'Section 12 – Changes to Terms of Service' },
      { p: 'You can review the most current version of the Terms of Service at any time at this page.' },
      { p: 'We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.' },
      { h: 'Section 13 – Contact information' },
      { p: 'Questions about the Terms of Service should be sent to us at {termsandconditions@scoreqc.com}.' },
    ],
  },
  {
    dir: 'disclaimer', title: 'Disclaimer', h1: ['', 'Disclaimer.'], kick: 'SCORE QC TRAINING & SERVICES',
    desc: 'Website disclaimer for SCORE QC Training & Services.',
    body: [
      { p: 'If you require any more information or have any questions about our site’s disclaimer, please feel free to contact us by email at {privacy@scoreqc.com}.' },
      { h: 'Disclaimers for SCORE QC' },
      { p: 'All the information on this website – www.scoreqc.com – is published in good faith and for general information purpose only. SCORE QC does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website is strictly at your own risk. SCORE QC will not be liable for any losses and/or damages in connection with the use of our website.' },
      { p: 'From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone “bad”.' },
      { p: 'Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as Terms and Conditions before engaging in any business or uploading any information.' },
      { h: 'Consent' },
      { p: 'By using our website, you hereby consent to our disclaimer and agree to its terms.' },
      { h: 'Update' },
      { p: 'Should we update, amend or make any changes to this document, those changes will be prominently posted here.' },
    ],
  },
];

module.exports = function legalPages({ head, nav, footer, esc }) {
  // {name@scoreqc.com} becomes a mailto link, [label](href) an ordinary link.
  const inline = s => esc(s)
    .replace(/\{([^}]+@[^}]+)\}/g, (m, e) => `<a href="mailto:${e}">${e}</a>`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, l, h) => `<a href="${h}">${l}</a>`);
  const block = b => b.h ? `<h2>${esc(b.h)}</h2>` : b.h3 ? `<h3>${esc(b.h3)}</h3>`
    : b.ul ? `<ul>${b.ul.map(i => `<li>${inline(i)}</li>`).join('')}</ul>` : `<p>${inline(b.p)}</p>`;
  const others = pg => PAGES.filter(x => x !== pg).map(x => `<a href="../${x.dir}/">${esc(x.title)} →</a>`).join('');

  return PAGES.map(pg => ({
    dir: pg.dir,
    html: head(pg.title + ' | SCORE QC Training & Services', pg.desc, '../campus/img/hero.jpg', '../courses/course.css') + nav('') + `
<main>
<section class="ct-hero lg-hero">
  <div class="wrap">
    <div class="crumb"><a href="../">HOME</a> / ${esc(pg.title.toUpperCase())}</div>
    <div class="kick light"><i></i>${esc(pg.kick)}</div>
    <h1>${esc(pg.h1[0])}<span>${esc(pg.h1[1])}</span></h1>
  </div>
</section>
<section class="wrap lg-body">
  <article class="lg-text">${pg.body.map(block).join('\n    ')}</article>
  <aside class="lg-side"><small>OTHER POLICIES</small>${others(pg)}</aside>
</section>
</main>` + footer(),
  }));
};
