/*
 * Email content for "Spot the Phish".
 *
 * Main round: every PHISH email + ONE randomly chosen LEGIT email, shuffled.
 * The player's job is to find the legit one.
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

const CONFIG = {
  playerName: "Sam Viking",
  playerFirstName: "Sam",
  playerEmail: "s.viking@salemstate.edu",
  // Shown on the final screen. Update with Salem State's real reporting instructions.
  reportTip:
    "Don't click, don't reply. Report it to the Salem State IT Help Desk, then delete it.",
};

const PHISH_EMAILS = [
  {
    id: "phish-raffle",
    fromName: "University Community Events",
    fromAddr: "events@salemstate-edu.com",
    flagSender: 1,
    subject: "You're invited: this month's campus raffle!",
    preview: "We're inviting members of the Salem State community to participate…",
    body: `
      <p><span class="flag" data-flag="2">Hello,</span></p>
      <p>We're inviting members of the Salem State community to participate in this month's campus raffle!</p>
      <p><span class="flag" data-flag="3">Entry is open now, and spots are limited.</span></p>
      <p><strong>Join the raffle:</strong><br>
        <a href="#" class="email-btn email-link flag" data-flag="4" data-href="http://salemstate-raffle.com/enter">ENTER RAFFLE</a></p>
      <p>Don't miss your opportunity to participate.</p>
      <p>Good luck!</p>
      <p><span class="flag" data-flag="5">University Community Events</span></p>`,
    flags: [
      { title: "Lookalike sender", text: "<b>salemstate-edu.com</b> is not <b>salemstate.edu</b>. Anyone can register a domain that looks close to the real one." },
      { title: "Generic greeting", text: "It says “Hello,” instead of your name. Campus offices usually know who they're writing to." },
      { title: "Scarcity pressure", text: "“Spots are limited” is there to rush you before you think it through." },
      { title: "Suspicious link", text: "The button goes to <b>salemstate-raffle.com</b>, which is not a university website. Links like this often lead to a fake login page." },
      { title: "No real details", text: "What's the prize? When is the drawing? Who's running it? The email doesn't name an office, a person, or a way to contact anyone." },
    ],
  },
  {
    id: "phish-starbucks",
    fromName: "University Community Events",
    fromAddr: "rewards@ssu-appreciation.net",
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
        <a href="#" class="email-btn email-link flag" data-flag="4" data-href="https://starbucks-ssu-rewards.com/claim">CLAIM NOW</a></p>
      <p>Participation is limited to the first 200 people.</p>
      <p>Thank you,<br>University Community Events</p>`,
    flags: [
      { title: "Sender isn't Salem State", text: "<b>ssu-appreciation.net</b> is not a university address. Real Salem State email comes from <b>@salemstate.edu</b>." },
      { title: "Too good to be true", text: "Free gift cards for doing nothing is one of the most common hooks. The “prize” is usually your password or payment info." },
      { title: "Artificial scarcity", text: "“First 200 people” pushes you to click before you think, and they say it twice." },
      { title: "Suspicious link", text: "“CLAIM NOW” goes to <b>starbucks-ssu-rewards.com</b>, which belongs to neither Starbucks nor Salem State." },
      { title: "Vague event", text: "Which appreciation event? Hosted by which office? Real announcements give names, dates, and places." },
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
    subject: "Daniel Morgan shared “Scholarship Eligibility Review – Fall 2026” with you",
    preview: "Hi Sam, please review and confirm your information before Friday…",
    body: `
      <div class="share-card">
        <div class="share-icon" aria-hidden="true">📊</div>
        <div>
          <p class="share-title"><strong>Daniel Morgan</strong> shared a file with you</p>
          <p class="share-file">Scholarship Eligibility Review – Fall 2026.xlsx</p>
        </div>
      </div>
      <blockquote><span class="flag" data-flag="2">Hi Sam, your name came up on the eligibility list for the fall award.</span>
        <span class="flag" data-flag="3">Please review and <strong>confirm your student ID and contact info</strong> before Friday</span> so we can finalize the list. Thanks!</blockquote>
      <p><a href="#" class="email-btn email-btn-ms email-link flag" data-flag="4" data-href="https://salemstate-sharepoint.com/login?file=scholarship_review.xlsx">Open</a></p>
      <p class="fine-print"><span class="flag" data-flag="5">This link will only work for the recipient. Sign in with your university account to view.</span></p>`,
    flags: [
      { title: "Not a real sharing address", text: "Real OneDrive/SharePoint notifications come from a <b>microsoft.com</b> or <b>sharepoint.com</b> address, not <b>onedrive-filesharing.net</b>." },
      { title: "Unexpected, and aimed at you", text: "Do you know Daniel Morgan? Were you expecting a scholarship file? Attackers use names and topics that feel personal so you don't stop to ask." },
      { title: "Asks for your information", text: "“Confirm your student ID and contact info before Friday” means handing over personal data on a deadline. That's a classic setup." },
      { title: "Lookalike login link", text: "<b>salemstate-sharepoint.com</b> sounds official, but it isn't a Salem State or Microsoft site. It's a fake sign-in page built to catch your password." },
      { title: "“Sign in to view”", text: "Asking you to sign in again is the whole point. Once you type your password on their page, they have it." },
    ],
  },
];

// One of these is chosen at random as the single real email in the main round.
const LEGIT_EMAILS = [
  {
    id: "legit-registrar",
    fromName: "Office of the Registrar",
    fromAddr: "registrar@salemstate.edu",
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
      <p>Dates and FAQs: <a href="#" class="email-link" data-href="https://www.salemstate.edu/registrar">salemstate.edu/registrar</a></p>
      <p>Office of the Registrar<br>Salem State University</p>`,
    checks: [
      "Sent from a real <b>@salemstate.edu</b> address.",
      "Makes sense: registration really does come up every semester, and the dates are specific.",
      "The link goes to <b>salemstate.edu</b>, and the email tells you to use the portal you already use. It doesn't hand you a login link.",
      "No prize, no threat, and no request for your information.",
    ],
  },
  {
    id: "legit-library",
    fromName: "SSU Library",
    fromAddr: "library@salemstate.edu",
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
        <a href="#" class="email-link" data-href="https://www.salemstate.edu/library">salemstate.edu/library</a></p>
      <p>Thanks,<br>SSU Library Circulation</p>`,
    checks: [
      "Sent from a real <b>@salemstate.edu</b> address.",
      "Lists the exact items and due date, which you can check against your own library account.",
      "The link goes to <b>salemstate.edu</b>, and you can also handle it in person at the desk.",
      "The deadline is an ordinary due date, not a threat.",
    ],
  },
  {
    id: "legit-rec",
    fromName: "Campus Recreation",
    fromAddr: "campusrec@salemstate.edu",
    subject: "Intramural volleyball sign-ups close Friday, Oct 2",
    preview: "Build a team of 6–10 players and register by Friday…",
    body: `
      <p>Hey Vikings!</p>
      <p>Intramural co-ed volleyball starts <strong>Monday, October 5</strong>. Games are Monday and Wednesday nights in the Rec Center gym.</p>
      <ul>
        <li>Teams of 6–10 players</li>
        <li>Free for all students</li>
        <li>Register by <strong>Friday, October 2</strong> at the Rec Center front desk or online</li>
      </ul>
      <p>Details: <a href="#" class="email-link" data-href="https://www.salemstate.edu/campus-rec">salemstate.edu/campus-rec</a></p>
      <p>See you on the court,<br>Campus Recreation</p>`,
    checks: [
      "Sent from a real <b>@salemstate.edu</b> address.",
      "There's a deadline, but it's a normal one, with who, what, when, and where spelled out.",
      "You can sign up in person, and the link goes to <b>salemstate.edu</b>.",
      "It doesn't ask for a password or any personal information.",
    ],
  },
  {
    id: "legit-career",
    fromName: "Career Services",
    fromAddr: "careers@salemstate.edu",
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
      <p>Employer list: <a href="#" class="email-link" data-href="https://www.salemstate.edu/career-services">salemstate.edu/career-services</a></p>
      <p>Career Services</p>`,
    checks: [
      "Sent from a real <b>@salemstate.edu</b> address.",
      "Names an office, a date, a time, and a place.",
      "Nothing to “claim” and no sign-in. You just show up with your ID.",
      "The link goes to <b>salemstate.edu</b>.",
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

// Arrives after the results screen. Clicking its button triggers "YOU JUST GOT PHISHED".
const BONUS_EMAIL = {
  id: "bonus-results",
  fromName: "SSU Security Awareness",
  fromAddr: "results@ssu-awareness.com",
  flagSender: 1,
  subject: "Your phishing assessment results are ready",
  preview: "Thanks for completing today's Spot the Phish challenge! Your assessment has been…",
  time: "Just now",
  body: `
    <p>Hi Sam,</p>
    <p><span class="flag" data-flag="2">Thanks for completing today's <strong>Spot the Phish</strong> challenge!</span>
      <span class="flag" data-flag="3">Your assessment has been recorded</span>, and your personalized results report is ready.</p>
    <p>Your report includes the red flags you missed and tips for keeping your SSU account secure.</p>
    <p><a href="#" class="email-btn email-link flag" data-flag="4" data-href="https://ssu-awareness.com/results/signin?session=8f3a2c">REVIEW RESULTS</a></p>
    <p><span class="flag" data-flag="5">Participants who review their results by 5:00 PM today will be entered into the Awareness Week prize drawing.</span></p>
    <p>Stay safe,<br>SSU Security Awareness Team</p>`,
  flags: [
    { title: "The sender still isn't Salem State", text: "<b>ssu-awareness.com</b> is not <b>salemstate.edu</b>. It's the same trick as the raffle email, but it's easy to miss when the message feels expected." },
    { title: "Perfect timing", text: "It showed up seconds after you finished. Because you were expecting something like it, you had no reason to be suspicious." },
    { title: "It doesn't add up", text: "The game told you at the start that nothing is saved or sent anywhere. So what “assessment” was recorded?" },
    { title: "A sign-in link for “results”", text: "The button goes to a sign-in page on <b>ssu-awareness.com</b>. Viewing quiz results should never need your SSU password." },
    { title: "The same old hook", text: "A prize and a deadline are exactly the tactics you just learned to spot. This time they were dressed up in context." },
  ],
};
