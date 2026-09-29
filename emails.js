/*
 * Email content for "Spot the Phish".
 *
 * Main round: the 4 PHISH emails + the LEGIT email, in random order.
 * The player's job is to find the legit one.
 * (More emails are parked in spare-emails.js, which the game doesn't load.)
 * Bonus round: BONUS_EMAIL arrives after the results screen.
 *
 * Marking red flags in phishing emails:
 *   - Wrap suspicious text in  <span class="flag" data-flag="N">...</span>
 *   - Links/buttons use        <a href="#" class="email-link" data-href="URL">
 *     (add class "flag" + data-flag="N" to mark the link itself as red flag N)
 *   - flagSender: N marks the sender address as red flag N.
 *   - The flags array explains each numbered flag on the review screen.
 * Legit emails list what made them trustworthy in `checks`.
 */

/*
 * School branding: name, domains, mascot and help desk used everywhere.
 * USE_SCHOOL is the default. Any link can override it by adding
 * ?school=ssu or ?school=generic to the URL (e.g. for the QR code at an SSU event).
 */
const SCHOOLS = {
  ssu: {
    name: "Salem State",
    fullName: "Salem State University",
    short: "SSU",
    slug: "salemstate", // used to build the fake lookalike domains
    domain: "salemstate.edu",
    mascot: "Viking",
    greetingAll: "Hey Vikings!",
    playerName: "Sam Viking",
    playerEmail: "s.viking@salemstate.edu",
    helpDesk: "the Salem State IT Help Desk",
  },
  generic: {
    name: "State University",
    fullName: "State University",
    short: "SU",
    slug: "stateu",
    domain: "stateu.edu",
    mascot: "",
    greetingAll: "Hey everyone!",
    playerName: "Sam Taylor",
    playerEmail: "s.taylor@stateu.edu",
    helpDesk: "your campus IT Help Desk",
  },
};

const USE_SCHOOL = "generic";

const S = SCHOOLS[new URLSearchParams(location.search).get("school")] || SCHOOLS[USE_SCHOOL];

const CONFIG = {
  playerName: S.playerName,
  playerEmail: S.playerEmail,
  // Shown on the final screen. Update with your school's real reporting instructions.
  reportTip: `Don't click, don't reply. Report it to ${S.helpDesk}, then delete it.`,
};

// The real Starbucks giveaway at your table. Match this to the actual event so
// players who find the real email can go claim their $5 card.
const EVENT = {
  where: "at the IT table in the Campus Center",
  when: "today from 10 AM to 2 PM",
};

const PHISH_EMAILS = [
  {
    id: "phish-raffle",
    fromName: "University Community Events",
    fromAddr: `events@${S.slug}-edu.com`,
    flagSender: 1,
    subject: "You're invited: this month's campus raffle! 🎁",
    preview: `We're inviting members of the ${S.name} community to participate…`,
    body: `
      <p><span class="flag" data-flag="2">Hello,</span></p>
      <p>We're inviting members of the ${S.name} community to participate in this month's campus raffle!
        Prizes include gift cards, AirPods, and more.</p>
      <p><span class="flag" data-flag="3">Entry is open now, and spots are limited to the <strong>first 200 people</strong>.</span></p>
      <p><strong>Join the raffle:</strong><br>
        <a href="#" class="email-btn email-link flag" data-flag="4" data-href="http://${S.slug}-raffle.com/enter">ENTER RAFFLE</a></p>
      <p>Don't miss your opportunity to participate. Once the 200 spots are gone, entry closes.</p>
      <p>Good luck!</p>
      <p><span class="flag" data-flag="5">University Community Events</span></p>`,
    flags: [
      { title: "Lookalike sender", text: `<b>${S.slug}-edu.com</b> is not <b>${S.domain}</b>. Anyone can register a domain that looks close to the real one.` },
      { title: "Generic greeting", text: "It says “Hello,” instead of your name. Campus offices usually know who they're writing to." },
      { title: "Scarcity pressure", text: "“Limited to the first 200 people” (and they say it twice) is there to rush you before you think it through." },
      { title: "Suspicious link", text: `The button goes to <b>${S.slug}-raffle.com</b>, which is not a university website. Links like this often lead to a fake login page.` },
      { title: "No real details", text: "“Gift cards, AirPods, and more” sounds exciting, but when is the drawing? Who's running it? The email doesn't name an office, a person, or a way to contact anyone." },
    ],
  },
  {
    id: "phish-m365",
    fromName: "Microsoft 365 Security",
    fromAddr: "security-alert@microsoft365-account-verify.com",
    flagSender: 1,
    subject: "Microsoft 365 Security Alert",
    preview: "We detected a sign-in to your university Microsoft 365 account that may not…",
    body: `
      <p><strong>Microsoft 365 Security Alert</strong></p>
      <p>We detected a sign-in to your university Microsoft 365 account
        <span class="flag" data-flag="3">that may not have been made by you.</span></p>
      <p><strong>Sign-in details:</strong></p>
      <div class="flag flag-block" data-flag="2">
        <ul>
          <li>Account: Your University Account</li>
          <li>Service: Microsoft 365</li>
          <li>Status: Action may be required</li>
        </ul>
      </div>
      <p>If you recognize this activity, no action is required.</p>
      <p>If you <strong>do not recognize this activity</strong>, review it here:</p>
      <p><a href="#" class="email-btn email-link flag" data-flag="4" data-href="https://m365-signin-review.com/verify">REVIEW ACTIVITY</a></p>
      <p><span class="flag" data-flag="5">If you believe your account may be compromised, contact your university IT help desk.</span></p>
      <p>Microsoft 365 Security</p>`,
    flags: [
      { title: "Fake Microsoft address", text: "<b>microsoft365-account-verify.com</b> isn't owned by Microsoft. Real alerts come from a <b>microsoft.com</b> address." },
      { title: "“Details” with no details", text: "A real alert lists your actual email address, the time, location, and device. “Your University Account” could be sent to anyone." },
      { title: "Fear and urgency", text: "The idea that someone's in your account makes people click first and think later." },
      { title: "Link to a fake login page", text: "“REVIEW ACTIVITY” goes to <b>m365-signin-review.com</b>. Real Microsoft sign-ins happen at <b>login.microsoftonline.com</b>." },
      { title: "Borrowed trust", text: "Mentioning the help desk makes the email feel official. If you're worried, go to the help desk or your account settings yourself, not through the email's link." },
    ],
  },
  {
    id: "phish-shared-doc",
    fromName: "Daniel Morgan (via OneDrive)",
    fromAddr: "no-reply@onedrive-filesharing.net",
    flagSender: 1,
    subject: "Daniel Morgan shared “Parking Permit Renewals – Fall 2026” with you",
    preview: "Hi Sam, your permit is on the list of permits that haven't been renewed…",
    body: `
      <div class="share-card">
        <div class="share-icon" aria-hidden="true">📊</div>
        <div>
          <p class="share-title"><strong>Daniel Morgan</strong> shared a file with you</p>
          <p class="share-file">Parking Permit Renewals – Fall 2026.xlsx</p>
        </div>
      </div>
      <blockquote><span class="flag" data-flag="2">Hi Sam, your permit is on our list of parking permits that haven't been renewed for this semester.</span>
        <span class="flag" data-flag="3">Please review your entry and <strong>confirm your campus ID number and vehicle info by Friday</strong>, or your permit will be deactivated.</span> Thanks!</blockquote>
      <p><a href="#" class="email-btn email-btn-ms email-link flag" data-flag="4" data-href="https://${S.slug}-sharepoint.com/login?file=parking_permit_renewals.xlsx">Open</a></p>
      <p class="fine-print"><span class="flag" data-flag="5">This link will only work for the recipient. Sign in with your university account to view.</span></p>`,
    flags: [
      { title: "Not a real sharing address", text: "Real OneDrive/SharePoint notifications come from a <b>microsoft.com</b> or <b>sharepoint.com</b> address, not <b>onedrive-filesharing.net</b>." },
      { title: "Unexpected, and aimed at you", text: "Do you know Daniel Morgan? Would the parking office really send you a spreadsheet through OneDrive? Attackers pick everyday topics that feel personal, so you don't stop to ask." },
      { title: "Asks for your info, with a threat", text: "“Confirm your ID number and vehicle info by Friday, or your permit will be deactivated” means handing over personal data on a deadline. If you're worried about your permit, check with the parking office directly." },
      { title: "Lookalike login link", text: `<b>${S.slug}-sharepoint.com</b> sounds official, but it isn't a ${S.name} or Microsoft site. It's a fake sign-in page built to catch your password.` },
      { title: "“Sign in to view”", text: "Asking you to sign in again is the whole point. Once you type your password on their page, they have it." },
    ],
  },
  {
    id: "phish-mfa-code",
    fromName: "IT Help Desk",
    fromAddr: `${S.short.toLowerCase()}.helpdesk@outlook.com`,
    flagSender: 1,
    subject: "Action needed: verify your account for this week's security upgrade",
    preview: "In the next few minutes you'll receive a 6-digit code by text. Reply with it to…",
    body: `
      <p>Hello,</p>
      <p>We are completing a required security upgrade for all faculty, staff, and student accounts this week, and your account is next.</p>
      <p><span class="flag" data-flag="2">In the next few minutes, you will receive a text message with a 6-digit verification code.</span>
        <span class="flag" data-flag="3">Please <strong>reply to this email with that code</strong> so we can confirm your identity and finish the upgrade.</span></p>
      <p><span class="flag" data-flag="4">If we don't receive your code within 30 minutes, your account will be temporarily locked.</span></p>
      <p><span class="flag" data-flag="5">Thank you for your cooperation,<br>IT Help Desk</span></p>`,
    flags: [
      { title: "IT doesn't use Outlook.com", text: `Anyone can make a free <b>outlook.com</b> account with “helpdesk” in the name. Your IT department emails you from <b>@${S.domain}</b>.` },
      { title: "The text will be real", text: "That's what makes this scam work. The attacker already has your password and is signing in as you right now, so your phone gets a real code from your school's login system." },
      { title: "Never share a verification code", text: "The code is the last lock on your account. No one, including IT, will ever ask you to read it back or send it to them. Anyone who asks is the person trying to get in." },
      { title: "Deadline plus a threat", text: "“Within 30 minutes” and “your account will be locked” push you to reply before you think." },
      { title: "No name, no ticket, no phone number", text: "A real IT request comes from a real person, usually with a ticket number, and you can call the help desk yourself to check. Also notice there's no link: this scam only needs you to reply." },
    ],
  },
];

// The single real email in the main round. (If you add more, one is picked at random.)
const LEGIT_EMAILS = [
  {
    id: "legit-starbucks",
    fromName: "IT Services",
    fromAddr: `itservices@${S.domain}`,
    subject: "☕ Free $5 Starbucks gift card: come see us today",
    preview: "The IT team is out on campus today! Stop by our table to grab a free…",
    body: `
      <p>Hello,</p>
      <p>The IT team is out on campus today for Cybersecurity Awareness Month! Stop by our table
        <strong>${EVENT.where}</strong>, <strong>${EVENT.when}</strong>, to say hi, ask questions about keeping your accounts safe,
        and grab a <strong>free $5 Starbucks gift card</strong> while supplies last.</p>
      <p>Just bring your campus ID.</p>
      <p>Want tips before you stop by? <a href="#" class="email-link" data-href="https://www.${S.domain}/it/security">${S.domain}/it/security</a></p>
      <p>See you there!<br>IT Services<br>${S.fullName}</p>`,
    checks: [
      `Sent from a real <b>@${S.domain}</b> address that belongs to the IT department.`,
      "You claim the gift card <b>in person</b> from people you can see. There's nothing to click, no form, and no login.",
      "It names a specific place and time, and you can check whether the table is really there.",
      `The only link goes to <b>${S.domain}</b> and is just information. It doesn't ask you to sign in.`,
      "Free stuff and “while supplies last” aren't automatically red flags. What matters is <b>how</b> you get it. And it's real: come find us at the table!",
    ],
  },
];

// Arrives after the results screen. Clicking its button triggers "YOU JUST GOT PHISHED".
const BONUS_EMAIL = {
  id: "bonus-results",
  fromName: `${S.short} Security Awareness`,
  fromAddr: `results@${S.short.toLowerCase()}-awareness.com`,
  flagSender: 1,
  subject: "Your phishing assessment results are ready",
  preview: "Thanks for completing today's Spot the Phish challenge! Your assessment has been…",
  time: "Just now",
  body: `
    <p>Hi Sam,</p>
    <p><span class="flag" data-flag="2">Thanks for completing today's <strong>Spot the Phish</strong> challenge!</span>
      <span class="flag" data-flag="3">Your assessment has been recorded</span>, and your personalized results report is ready.</p>
    <p>Your report includes the red flags you missed and tips for keeping your ${S.short} account secure.</p>
    <p><a href="#" class="email-btn email-link flag" data-flag="4" data-href="https://${S.short.toLowerCase()}-awareness.com/results/signin?session=8f3a2c">REVIEW RESULTS</a></p>
    <p><span class="flag" data-flag="5">Participants who review their results by 5:00 PM today will be entered into the Awareness Week prize drawing.</span></p>
    <p>Stay safe,<br>${S.short} Security Awareness Team</p>`,
  flags: [
    { title: `The sender still isn't ${S.name}`, text: `<b>${S.short.toLowerCase()}-awareness.com</b> is not <b>${S.domain}</b>. It's the same lookalike-domain trick you just practiced spotting, but it's easy to miss when the message feels expected.` },
    { title: "Perfect timing", text: "It showed up seconds after you finished. Because you were expecting something like it, you had no reason to be suspicious." },
    { title: "It doesn't add up", text: "The game told you at the start that nothing is saved or sent anywhere. So what “assessment” was recorded?" },
    { title: "A sign-in link for “results”", text: `The button goes to a sign-in page on <b>${S.short.toLowerCase()}-awareness.com</b>. Viewing quiz results should never need your ${S.short} password.` },
    { title: "The same old hook", text: "A prize and a deadline are exactly the tactics you just learned to spot. This time they were dressed up in context." },
  ],
};
