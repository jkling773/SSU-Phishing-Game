/*
 * Spare emails that were cut from the game to keep it focused.
 * This file is NOT loaded by index.html. To bring one back, copy its entry into
 * PHISH_EMAILS or LEGIT_EMAILS in emails.js (it uses the same S.* branding values).
 */

const SPARE_PHISH_EMAILS = [
  {
    id: "phish-gift-card-prof",
    fromName: "Prof. Alex Rivera",
    fromAddr: `prof.arivera.${S.short.toLowerCase()}@gmail.com`,
    flagSender: 1,
    subject: "Quick favor?",
    preview: "Are you on campus right now? I need a quick favor, I'm stuck in a meeting…",
    body: `
      <p>Hi Sam,</p>
      <p><span class="flag" data-flag="2">Are you on campus right now? I need a quick favor. I'm stuck in a faculty meeting and can't step out to make a call.</span></p>
      <p><span class="flag" data-flag="3">I need 4 Apple gift cards ($100 each) for a student awards event this afternoon.</span>
        <span class="flag" data-flag="4">Can you pick them up, scratch off the back, and send me photos of the codes?</span> I'll pay you back first thing tomorrow.</p>
      <p><span class="flag" data-flag="5">Please keep this between us for now. It's a surprise for the students. Let me know ASAP.</span></p>
      <p>Prof. Rivera<br><span class="fine-print">Sent from my iPhone</span></p>`,
    flags: [
      { title: "Personal Gmail, professor's name", text: `Anyone can create a Gmail account with a professor's name in it. Faculty email you from their <b>@${S.domain}</b> address.` },
      { title: "An excuse not to talk", text: "“Can't step out to make a call” makes sure you can't check with them by phone. Scammers avoid any channel where they'd be caught." },
      { title: "Gift cards", text: "No school purchase is made by asking a student to buy gift cards. Gift cards are how scammers take untraceable cash." },
      { title: "“Send photos of the codes”", text: "Once you send the codes, the money is gone and can't be recovered." },
      { title: "Secrecy and urgency", text: "“Keep this between us” and “ASAP” stop you from asking anyone else. Also notice there's no link: this scam only needs you to reply. If you're unsure, contact the professor through their school email or in person." },
    ],
  },
  {
    id: "phish-starbucks",
    fromName: "University Community Events",
    fromAddr: `rewards@${S.short.toLowerCase()}-appreciation.net`,
    flagSender: 1,
    subject: "Free Starbucks gift cards ☕ first 200 only",
    preview: "As part of a university community appreciation event, we're giving away…",
    body: `
      <p>Hello,</p>
      <p>As part of <span class="flag" data-flag="5">a university community appreciation event</span>,
        <span class="flag" data-flag="2">we're giving away Starbucks gift cards</span> to the
        <strong class="flag" data-flag="3">first 200 people who participate</strong>.</p>
      <p>If you'd like to claim your opportunity, use the link below:</p>
      <p><strong>Claim Your Gift Card:</strong><br>
        <a href="#" class="email-btn email-link flag" data-flag="4" data-href="https://starbucks-${S.short.toLowerCase()}-rewards.com/claim">CLAIM NOW</a></p>
      <p>Participation is limited to the first 200 people.</p>
      <p>Thank you,<br>University Community Events</p>`,
    flags: [
      { title: `Sender isn't ${S.name}`, text: `<b>${S.short.toLowerCase()}-appreciation.net</b> is not a university address. Real ${S.name} email comes from <b>@${S.domain}</b>.` },
      { title: "Too good to be true", text: "Free gift cards for doing nothing is one of the most common hooks. The “prize” is usually your password or payment info." },
      { title: "Artificial scarcity", text: "“First 200 people” pushes you to click before you think, and they say it twice." },
      { title: "Suspicious link", text: `“CLAIM NOW” goes to <b>starbucks-${S.short.toLowerCase()}-rewards.com</b>, which belongs to neither Starbucks nor ${S.name}.` },
      { title: "Vague event", text: "Which appreciation event? Hosted by which office? Real announcements give names, dates, and places." },
    ],
  },
  {
    id: "phish-job",
    fromName: "Jessica Alvarez",
    fromAddr: `j.alvarez4@${S.domain}`,
    flagSender: 1,
    subject: "Paid Research Assistant – $450/week (Remote, Flexible)",
    preview: "Dr. Kevin Brooks from the Department of Psychology is looking for a part-time…",
    body: `
      <p>Hello Students,</p>
      <p>Dr. Kevin Brooks from the Department of Psychology is looking for a
        <span class="flag" data-flag="2">part-time remote research assistant. <strong>$450/week</strong> for about 5 hours of work. No experience needed.</span></p>
      <p><span class="flag" data-flag="3">Duties are simple: running errands, handling some purchases, and processing payments for the lab.</span></p>
      <p>Positions are filled first come, first served. To apply,
        <span class="flag" data-flag="4">fill out the form below with your <strong>personal email and cell phone number</strong>. Dr. Brooks will reach out by text.</span></p>
      <p><a href="#" class="email-btn email-link flag" data-flag="5" data-href="https://docs.google.com/forms/d/e/1FAIpQLSf-ra-application/viewform">APPLY NOW</a></p>
      <p>Best,<br>Jessica</p>`,
    flags: [
      { title: "A real address, but the wrong person", text: `This really is an <b>@${S.domain}</b> address. But why would a student send out a job for a professor? Scammers break into real student accounts and send these to everyone. A real address doesn't guarantee a real message.` },
      { title: "Too good to be true", text: "$450 a week for 5 hours with no experience is about $90 an hour. Real campus jobs don't pay like that." },
      { title: "Vague duties involving money", text: "“Handling purchases and processing payments” is how the fake-check scam works. They send you a check, you buy things or forward money, the check bounces, and you owe the bank." },
      { title: "Moving you off school email", text: "Asking for your personal email and cell number moves the conversation somewhere your school's IT can't see it or protect you." },
      { title: "A real site used for a scam", text: "The link goes to a real Google Form, but anyone can make one. Real campus jobs are posted through the career office or student employment." },
    ],
  },
  {
    id: "phish-payroll",
    fromName: "Payroll Services",
    fromAddr: `payroll@${S.slug}-hr.com`,
    flagSender: 1,
    subject: "Action required: confirm your direct deposit before Friday's payroll",
    preview: "Dear Employee, due to a payroll system upgrade, all faculty, staff, and student workers…",
    body: `
      <p><span class="flag" data-flag="2">Dear Employee,</span></p>
      <p>Due to a payroll system upgrade, all faculty, staff, and student workers must re-confirm their direct deposit information.</p>
      <p><span class="flag" data-flag="3">If you do not confirm by Thursday at 5:00 PM, your next paycheck may be delayed.</span></p>
      <p><a href="#" class="email-btn email-link flag" data-flag="4" data-href="https://${S.slug}-hr.com/employee/direct-deposit">CONFIRM DIRECT DEPOSIT</a></p>
      <p><span class="flag" data-flag="5">You will need your bank routing and account number to complete verification.</span></p>
      <p>Payroll Services<br>${S.fullName}</p>`,
    flags: [
      { title: "Not a university address", text: `<b>${S.slug}-hr.com</b> is not <b>${S.domain}</b>. Payroll email would come from the school's real domain.` },
      { title: "“Dear Employee”", text: "Your own employer knows your name. A generic greeting means the email went out to a big list." },
      { title: "A threat to your paycheck", text: "“Your paycheck may be delayed” is meant to scare you into acting fast. If you have a campus job, this one is aimed at you too." },
      { title: "Link to an outside site", text: `The button goes to <b>${S.slug}-hr.com</b>. Any real direct-deposit change happens in the employee portal you already use.` },
      { title: "Asks for bank details", text: "With your routing and account numbers, attackers send your next paycheck to their own account." },
    ],
  },
  {
    id: "phish-password",
    fromName: "IT Service Desk",
    fromAddr: `it-support@${S.domain}.account-verify.net`,
    flagSender: 1,
    subject: "Your password expires in 24 hours",
    preview: `The password for ${S.playerEmail} expires in 24 hours. To keep your current password…`,
    body: `
      <p>Hello,</p>
      <p><span class="flag" data-flag="2">The password for <strong>${S.playerEmail}</strong></span>
        <span class="flag" data-flag="3">expires in <strong>24 hours</strong>. After that, you will lose access to email, the student portal, and Wi-Fi.</span></p>
      <p>To keep your current password, click below:</p>
      <p><a href="#" class="email-btn email-link flag" data-flag="4" data-href="https://${S.domain}.account-verify.net/keep-password">KEEP CURRENT PASSWORD</a></p>
      <p><span class="flag" data-flag="5">${S.short} IT will never ask for your password by email.</span></p>
      <p>IT Service Desk</p>`,
    flags: [
      { title: "The subdomain trick", text: `The address starts with <b>${S.domain}</b>, but the real domain is the part at the end: <b>account-verify.net</b>. Read domains from right to left.` },
      { title: "Your address isn't proof", text: "It shows your real email address, which feels personal. But of course they know your address. That's where they sent the email." },
      { title: "Deadline plus a threat", text: "“24 hours” and “you will lose access” push you to act before you think." },
      { title: "Same trick in the link", text: `The link goes to <b>${S.domain}.account-verify.net</b>, not your school. Password changes happen in the portal you already use, never through an email button.` },
      { title: "Borrowed reassurance", text: "It promises IT “will never ask for your password” while linking to a page that asks for your password. Scammers copy the safety language from real emails." },
    ],
  },
];

const SPARE_LEGIT_EMAILS = [
  {
    id: "legit-registrar",
    fromName: "Office of the Registrar",
    fromAddr: `registrar@${S.domain}`,
    subject: "Spring 2027 registration: check your enrollment time",
    preview: "Registration for Spring 2027 courses opens Monday, November 2…",
    body: `
      <p>Hello,</p>
      <p>Registration for Spring 2027 courses opens <strong>Monday, November 2</strong>, with enrollment times assigned by class year.</p>
      <p>Before your time slot:</p>
      <ul>
        <li>Check your enrollment time and any holds in the student portal.</li>
        <li>Meet with your advisor to plan your schedule.</li>
      </ul>
      <p>Dates and FAQs: <a href="#" class="email-link" data-href="https://www.${S.domain}/registrar">${S.domain}/registrar</a></p>
      <p>Office of the Registrar<br>${S.fullName}</p>`,
    checks: [
      `Sent from a real <b>@${S.domain}</b> address.`,
      "Makes sense: registration really does come up every semester, and the dates are specific.",
      `The link goes to <b>${S.domain}</b>, and the email tells you to use the portal you already use. It doesn't hand you a login link.`,
      "No prize, no threat, and no request for your information.",
    ],
  },
  {
    id: "legit-library",
    fromName: `${S.short} Library`,
    fromAddr: `library@${S.domain}`,
    subject: "Courtesy reminder: 2 items due Friday, Sept 25",
    preview: "The following items checked out to you are due soon…",
    body: `
      <p>Hello,</p>
      <p>The following items checked out to you are due <strong>Friday, September 25</strong>:</p>
      <ul>
        <li><em>Psychology: Themes and Variations</em> (course reserve)</li>
        <li>USB-C laptop charger (tech loan)</li>
      </ul>
      <p>Most items can be renewed once. Renew at the circulation desk or through your library account:
        <a href="#" class="email-link" data-href="https://www.${S.domain}/library">${S.domain}/library</a></p>
      <p>Thanks,<br>${S.short} Library Circulation</p>`,
    checks: [
      `Sent from a real <b>@${S.domain}</b> address.`,
      "Lists the exact items and due date, which you can check against your own library account.",
      `The link goes to <b>${S.domain}</b>, and you can also handle it in person at the desk.`,
      "The deadline is an ordinary due date, not a threat.",
    ],
  },
  {
    id: "legit-rec",
    fromName: "Campus Recreation",
    fromAddr: `campusrec@${S.domain}`,
    subject: "Intramural volleyball sign-ups close Friday, Oct 2",
    preview: "Build a team of 6–10 players and register by Friday…",
    body: `
      <p>${S.greetingAll}</p>
      <p>Intramural co-ed volleyball starts <strong>Monday, October 5</strong>. Games are Monday and Wednesday nights in the Rec Center gym.</p>
      <ul>
        <li>Teams of 6–10 players</li>
        <li>Free for all students</li>
        <li>Register by <strong>Friday, October 2</strong> at the Rec Center front desk or online</li>
      </ul>
      <p>Details: <a href="#" class="email-link" data-href="https://www.${S.domain}/campus-rec">${S.domain}/campus-rec</a></p>
      <p>See you on the court,<br>Campus Recreation</p>`,
    checks: [
      `Sent from a real <b>@${S.domain}</b> address.`,
      "There's a deadline, but it's a normal one, with who, what, when, and where spelled out.",
      `You can sign up in person, and the link goes to <b>${S.domain}</b>.`,
      "It doesn't ask for a password or any personal information.",
    ],
  },
  {
    id: "legit-career",
    fromName: "Career Services",
    fromAddr: `careers@${S.domain}`,
    subject: "Fall Career & Internship Fair: Wed, Oct 14",
    preview: "60+ employers, drop-in résumé reviews, and no registration required…",
    body: `
      <p>Hello,</p>
      <p>The <strong>Fall Career &amp; Internship Fair</strong> is <strong>Wednesday, October 14, 11 AM–2 PM</strong> in the Campus Center.</p>
      <ul>
        <li>60+ employers hiring for jobs and internships</li>
        <li>Drop-in résumé reviews in our office all week</li>
        <li>No registration required, just bring your student ID</li>
      </ul>
      <p>Employer list: <a href="#" class="email-link" data-href="https://www.${S.domain}/career-services">${S.domain}/career-services</a></p>
      <p>Career Services</p>`,
    checks: [
      `Sent from a real <b>@${S.domain}</b> address.`,
      "Names an office, a date, a time, and a place.",
      "Nothing to “claim” and no sign-in. You just show up with your ID.",
      `The link goes to <b>${S.domain}</b>.`,
    ],
  },
  {
    id: "legit-teams",
    fromName: "Microsoft Teams",
    fromAddr: "noreply@email.teams.microsoft.com",
    subject: "Jordan Lee mentioned you in PSY 101 Study Group",
    preview: "Jordan Lee: @Sam are you still good to meet in the library at 6?",
    body: `
      <p><strong>Jordan Lee</strong> mentioned you in <strong>PSY 101 Study Group › General</strong></p>
      <blockquote>@Sam are you still good to meet in the library at 6? I'll grab a table on the 2nd floor.</blockquote>
      <p><a href="#" class="email-btn email-btn-teams email-link" data-href="https://teams.microsoft.com/l/message/19:psy101-study-group">Reply in Teams</a></p>
      <p class="fine-print">You're receiving this because you were mentioned. Manage notifications in Teams settings.</p>`,
    checks: [
      "The sender is a real <b>microsoft.com</b> address (<b>email.teams.microsoft.com</b>).",
      "It makes sense in context: a classmate in a study group you're actually part of.",
      "The link goes to <b>teams.microsoft.com</b>, the real Teams site.",
      "No urgency, no reward, no request for information.",
    ],
  },
];
