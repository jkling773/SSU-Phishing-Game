(function () {
  "use strict";

  const PHISH_PER_GAME = 4;
  const TIMES = ["10:42 AM", "10:05 AM", "9:17 AM", "8:36 AM", "8:03 AM"];
  const BONUS_DELAY_MS = 2000;

  const app = document.getElementById("app");
  const progressEl = document.getElementById("progress");
  const statusBar = document.getElementById("status-bar");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const toast = document.getElementById("toast");

  // screen: intro | play | review | results | bonus | final
  const state = {
    screen: "intro",
    emails: [],
    openId: null,
    pickedId: null,
    inspected: 0,
    opened: new Set(),
    phishClicks: new Set(),
    bonusArrived: false,
    bonusTimer: null,
  };

  // ---------- helpers ----------

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function initials(name) {
    return name
      .replace(/\(.*?\)/g, "")
      .replace(/^(Prof|Dr)\.\s*/, "")
      .split(/\s+/)
      .filter((w) => /^[A-Za-z]/.test(w) && !/^(of|the|and|&)$/i.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  function avatarColor(name) {
    const palette = ["#b5121b", "#e0661b", "#2a6f97", "#5a4fcf", "#2b8a3e", "#8f5b2e", "#c2255c", "#1c7c7d"];
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return palette[h % palette.length];
  }

  function isMobile() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function inboxEmails() {
    return state.screen === "bonus" ? [BONUS_EMAIL, ...state.emails] : state.emails;
  }

  function findEmail(id) {
    return inboxEmails().find((e) => e.id === id);
  }

  function legitEmail() {
    return state.emails.find((e) => !e.phish);
  }

  function setProgress(html) {
    progressEl.innerHTML = html || "";
  }

  // ---------- modal ----------

  let lastFocus = null;

  function showModal({ title, body, actions }) {
    lastFocus = document.activeElement;
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = body;
    const actionsEl = document.getElementById("modal-actions");
    actionsEl.innerHTML = "";
    actions.forEach((a) => {
      const b = document.createElement("button");
      b.className = "btn " + (a.primary ? "btn-primary" : "btn-ghost");
      b.textContent = a.label;
      b.addEventListener("click", () => {
        hideModal();
        if (a.onClick) a.onClick();
      });
      actionsEl.appendChild(b);
    });
    modalBackdrop.hidden = false;
    const primary = actionsEl.querySelector(".btn-primary") || actionsEl.querySelector("button");
    if (primary) primary.focus();
  }

  function hideModal() {
    modalBackdrop.hidden = true;
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) hideModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalBackdrop.hidden) hideModal();
  });

  // ---------- email rendering ----------

  function renderEmail(e, { reveal = false } = {}) {
    const senderFlag = reveal && e.flagSender ? ` flag" data-flag="${e.flagSender}` : "";
    return `
      <article class="email${reveal ? " revealed" : ""}">
        <h2 class="email-subject">${esc(e.subject)}</h2>
        <div class="email-meta">
          <div class="avatar" style="background:${avatarColor(e.fromName)}" aria-hidden="true">${esc(initials(e.fromName))}</div>
          <div class="meta-main">
            <div class="from"><strong>${esc(e.fromName)}</strong>
              <span class="addr${senderFlag}">&lt;${esc(e.fromAddr)}&gt;</span></div>
            <div class="to">To: ${esc(CONFIG.playerName)} &lt;${esc(CONFIG.playerEmail)}&gt;</div>
          </div>
          <div class="time">${esc(e.time || "")}</div>
        </div>
        <div class="email-body">${e.body}</div>
      </article>`;
  }

  function renderFlagList(flags) {
    return `<ol class="flag-list">${flags
      .map((f, i) => `<li><span class="flag-n">${i + 1}</span><div><strong>${esc(f.title)}</strong><br>${f.text}</div></li>`)
      .join("")}</ol>`;
  }

  function renderExplanation(e) {
    const pickedNote = e.id === state.pickedId ? `<span class="tag">Your pick</span>` : "";
    if (e.phish) {
      return `
        <div class="verdict verdict-phish"><span>🎣 <strong>Phishing</strong>: ${e.flags.length} red flags</span>${pickedNote}</div>
        ${renderEmail(e, { reveal: true })}
        <div class="explain"><h3>What you should have noticed</h3>${renderFlagList(e.flags)}</div>`;
    }
    return `
      <div class="verdict verdict-legit"><span>✅ <strong>Legit</strong>: this was the real one</span>${pickedNote}</div>
      ${renderEmail(e)}
      <div class="explain"><h3>Why it's trustworthy</h3>
        <ul class="check-list">${e.checks.map((c) => `<li><span class="check" aria-hidden="true">✓</span><div>${c}</div></li>`).join("")}</ul>
      </div>`;
  }

  // ---------- screens ----------

  function renderIntro() {
    state.screen = "intro";
    setProgress();
    app.innerHTML = `
      <section class="card intro">
        <div class="intro-hook" aria-hidden="true">🎣</div>
        <h1>Only one of these emails is real.</h1>
        <p class="lead">The rest are phishing. Scammers target college inboxes every day. Can you find the one email that's safe?</p>
        <ol class="steps">
          <li><span class="step-n">1</span><div><strong>Inspect your inbox.</strong> Open each email. Look at who really sent it, what it wants, and whether it makes sense.</div></li>
          <li><span class="step-n">2</span><div><strong>Check links carefully.</strong> Hover over a link (or press and hold on a phone) to see where it goes. Clicking won't hurt anything here, but we'll know.</div></li>
          <li><span class="step-n">3</span><div><strong>Pick the real one.</strong> Open the email you trust and press <span class="kbd kbd-good">✅ This one's legit</span>. You get one guess.</div></li>
        </ol>
        <p class="meta-line">About 3 minutes · Nothing is emailed to you · Nothing you do here is saved or sent anywhere</p>
        <button class="btn btn-primary btn-lg" data-action="start">Open my inbox</button>
      </section>`;
  }

  function renderInbox() {
    const mode = state.screen; // play | review | bonus
    const emails = inboxEmails();
    const open = findEmail(state.openId);

    if (mode === "play") setProgress(`<span class="pill">Find the 1 real email</span>`);
    else if (mode === "review") setProgress(`<span class="pill">Review</span>`);
    else setProgress();

    const unreadCount = emails.filter((e) => !state.opened.has(e.id)).length;

    const list = emails
      .map((e) => {
        const unread = !state.opened.has(e.id);
        let badge = "";
        if (mode === "review") {
          badge = e.phish ? `<span class="badge badge-phish">Phish</span>` : `<span class="badge badge-legit">Legit</span>`;
          if (e.id === state.pickedId) badge += `<span class="badge badge-pick">Your pick</span>`;
        }
        return `
        <li>
          <button class="mail-item${unread ? " unread" : ""}${e.id === state.openId ? " active" : ""}" data-action="open" data-id="${e.id}">
            <div class="avatar sm" style="background:${avatarColor(e.fromName)}" aria-hidden="true">${esc(initials(e.fromName))}</div>
            <div class="mail-item-text">
              <div class="mail-item-top"><span class="mail-from">${esc(e.fromName)}</span><span class="mail-time">${esc(e.time)}</span></div>
              <div class="mail-subject">${esc(e.subject)}</div>
              <div class="mail-preview">${esc(e.preview)}</div>
              ${badge ? `<div class="badges">${badge}</div>` : ""}
            </div>
          </button>
        </li>`;
      })
      .join("");

    let toolbarActions = "";
    if (open && mode === "play") {
      toolbarActions = `<button class="btn btn-legit" data-action="pick" data-id="${open.id}">✅ This one's legit</button>`;
    } else if (open && mode === "bonus" && open.id === BONUS_EMAIL.id) {
      toolbarActions = `<button class="btn btn-report" data-action="report-bonus">🚩 Report phishing</button>`;
    }

    let emptyText = "Select an email to read it.";
    let emptyHint = `${emails.length - 1} of these ${emails.length} emails are phishing. Only one is real.`;
    if (mode === "review") {
      emptyText = "Select an email to see what gave it away.";
      emptyHint = "";
    } else if (mode === "bonus") {
      emptyHint = "";
    }

    const reader = open
      ? `
        <div class="reader-toolbar">
          <button class="btn btn-ghost back-btn" data-action="back">← Inbox</button>
          ${toolbarActions}
        </div>
        <div class="reader-scroll">${mode === "review" ? renderExplanation(open) : renderEmail(open)}</div>`
      : `
        <div class="reader-empty">
          <div class="reader-empty-icon" aria-hidden="true">✉️</div>
          <p>${emptyText}</p>
          ${emptyHint ? `<p class="hint">${emptyHint}</p>` : ""}
        </div>`;

    let banner = "";
    if (mode === "review") {
      const correct = state.pickedId === legitEmail().id;
      banner = correct
        ? `<div class="banner banner-good"><span class="banner-icon">✅</span><div class="banner-text"><strong>You found the real one!</strong> Now look through the others to see what gave them away.</div>
             <button class="btn btn-primary" data-action="results">See my results →</button></div>`
        : `<div class="banner banner-bad"><span class="banner-icon">🪝</span><div class="banner-text"><strong>Hooked!</strong> The email you picked was phishing. The real one was <strong>“${esc(legitEmail().subject)}.”</strong> Open each email to see what you should have noticed.</div>
             <button class="btn btn-primary" data-action="results">See my results →</button></div>`;
    }

    app.innerHTML = `
      ${banner}
      <section class="mail${open ? " reading" : ""}${mode === "review" ? " with-banner" : ""}">
        <div class="mail-list">
          <div class="mail-list-head">Inbox <span class="count">${unreadCount ? unreadCount + " unread" : ""}</span></div>
          <ul>${list}</ul>
        </div>
        <div class="reader">${reader}</div>
      </section>`;
  }

  function renderResults() {
    state.screen = "results";
    setProgress();
    const correct = state.pickedId === legitEmail().id;
    const clicks = state.phishClicks.size;
    const total = state.emails.length;

    let icon, title, msg;
    if (correct && clicks === 0) {
      [icon, title, msg] = ["🛡️", `Phish-proof ${S.mascot || "pro"}!`, "You found the real email without taking any bait along the way. Nicely done."];
    } else if (correct) {
      [icon, title, msg] = ["🔍", "Found it, but you nibbled.", `You picked the right email, but you clicked a link in ${clicks} phishing email${clicks > 1 ? "s" : ""} while exploring. In a real inbox, one click can be enough.`];
    } else if (clicks === 0) {
      [icon, title, msg] = ["🎣", "Careful, but fooled.", "You didn't click any bad links, but the email you trusted was phishing. Look back at the red flags to see what gave it away."];
    } else {
      [icon, title, msg] = ["🐟", "Hooked!", "The phishers would love your inbox. No worries, that's what practice is for."];
    }

    app.innerHTML = `
      <section class="card results">
        <div class="end-icon" aria-hidden="true">${icon}</div>
        <h1>${title}</h1>
        <p class="lead">${msg}</p>
        <div class="stats">
          <div class="stat ${correct ? "stat-good" : "stat-bad"}"><div class="stat-value">${correct ? "✓" : "✗"}</div><div class="stat-label">Found the real email</div></div>
          <div class="stat ${clicks ? "stat-bad" : "stat-good"}"><div class="stat-value">${clicks}</div><div class="stat-label">Phishing emails you clicked a link in</div></div>
          <div class="stat"><div class="stat-value">${state.inspected}/${total}</div><div class="stat-label">Emails you inspected</div></div>
        </div>
        <div class="results-actions">
          <button class="btn btn-primary btn-lg inbox-btn" data-action="bonus" hidden>📥 Back to inbox <span class="new-badge">1 new</span></button>
        </div>
      </section>`;
    window.scrollTo({ top: 0 });

    clearTimeout(state.bonusTimer);
    state.bonusTimer = setTimeout(() => {
      if (state.screen !== "results") return;
      state.bonusArrived = true;
      const btn = app.querySelector(".inbox-btn");
      if (btn) btn.hidden = false;
      showToast();
    }, BONUS_DELAY_MS);
  }

  function showToast() {
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">📩</span>
      <span class="toast-text"><strong>${esc(BONUS_EMAIL.fromName)}</strong><br>${esc(BONUS_EMAIL.subject)}</span>`;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("show"));
  }

  function hideToast() {
    toast.classList.remove("show");
    toast.hidden = true;
  }

  function renderFinal(outcome) {
    state.screen = "final";
    setProgress();
    hideToast();
    const phished = outcome === "phished";
    const hero = phished
      ? `<div class="hero hero-bad">
           <div class="hero-icon" aria-hidden="true">🎣</div>
           <h1 class="hero-title">YOU JUST GOT PHISHED.</h1>
           <p>You clicked “Review Results” on an email you'd never seen before, minutes after practicing how to spot phishing.<br><strong>Don't feel bad. That's exactly why it worked.</strong></p>
         </div>`
      : `<div class="hero hero-good">
           <div class="hero-icon" aria-hidden="true">🛡️</div>
           <h1 class="hero-title">You didn't take the bait!</h1>
           <p>That “results” email was the real test, and a lot of people click it. Here's why it's so effective.</p>
         </div>`;

    app.innerHTML = `
      <section class="final">
        ${hero}
        <div class="card lesson">
          <h2>Why this one works</h2>
          <p>There were no typos, no weird formatting, and no obvious scam. It worked because <strong>it made sense in context</strong>. You had just finished a phishing activity, so a message about your results felt like the obvious next step.</p>
          <p>Real attackers do the same thing. They time their emails around things you're expecting: registration week, a financial aid deadline, a package you ordered, or an event you just went to.</p>
          <div class="callout">
            <strong>Ask yourself:</strong> Was I expecting <em>this</em>, from <em>this sender</em>, in <em>this way</em>? If you're not sure, go to the source directly instead of using the link.
          </div>
        </div>
        <div class="reveal-grid">
          <div class="card reveal-email">${renderEmail(BONUS_EMAIL, { reveal: true })}</div>
          <div class="card"><h3>The red flags were still there</h3>${renderFlagList(BONUS_EMAIL.flags)}</div>
        </div>
        <div class="card">
          <h3>6 habits that beat phishing</h3>
          <ol class="tips">
            <li><strong>Check the address, not just the name.</strong> Anyone can call themselves “University Events.” <b>${esc(S.domain)}</b> ≠ <b>${esc(S.slug)}-edu.com</b>.</li>
            <li><strong>Hover before you click.</strong> On a phone, press and hold. Does the link go where it says it does?</li>
            <li><strong>Slow down when you feel rushed.</strong> “Limited spots,” “before Friday,” and “your account is at risk” are designed to make you skip thinking.</li>
            <li><strong>Question things that fit a little too well.</strong> An email that shows up right when you expect it deserves a second look, not a free pass.</li>
            <li><strong>Go there yourself, and never share a code.</strong> Use your bookmark or the portal you always use, not the link in the email. Never give anyone a verification code, not even IT.</li>
            <li><strong>Report it.</strong> ${esc(CONFIG.reportTip)}</li>
          </ol>
        </div>
        <div class="end-actions">
          <button class="btn btn-primary btn-lg" data-action="restart">Play again</button>
        </div>
      </section>`;
    window.scrollTo({ top: 0 });
  }

  // ---------- actions ----------

  function start() {
    const legit = LEGIT_EMAILS[Math.floor(Math.random() * LEGIT_EMAILS.length)];
    const phish = shuffle(PHISH_EMAILS).slice(0, PHISH_PER_GAME);
    state.emails = shuffle([...phish.map((e) => ({ ...e, phish: true })), { ...legit, phish: false }]).map((e, i) => ({
      ...e,
      time: TIMES[i % TIMES.length],
    }));
    state.openId = null;
    state.pickedId = null;
    state.opened = new Set();
    state.phishClicks = new Set();
    state.bonusArrived = false;
    clearTimeout(state.bonusTimer);
    hideToast();
    state.screen = "play";
    renderInbox();
    window.scrollTo({ top: 0 });
  }

  function openEmail(id) {
    if (!findEmail(id)) return;
    state.opened.add(id);
    state.openId = id;
    renderInbox();
    const reader = app.querySelector(".reader-scroll");
    if (reader) reader.scrollTop = 0;
    if (isMobile()) window.scrollTo({ top: 0 });
  }

  function pick(id) {
    const e = findEmail(id);
    showModal({
      title: "Is this the real one?",
      body: `<p>You're choosing <strong>“${esc(e.subject)}”</strong> from <strong>${esc(e.fromName)}</strong> as the one legitimate email.</p><p>You only get one guess.</p>`,
      actions: [
        { label: "Keep looking", primary: false },
        {
          label: "✅ Yes, it's legit",
          primary: true,
          onClick: () => {
            state.pickedId = id;
            state.inspected = state.opened.size;
            state.screen = "review";
            state.emails.forEach((x) => state.opened.add(x.id));
            state.openId = isMobile() ? null : legitEmail().id;
            renderInbox();
            window.scrollTo({ top: 0 });
          },
        },
      ],
    });
  }

  function enterBonus() {
    hideToast();
    state.screen = "bonus";
    state.openId = null;
    renderInbox();
    window.scrollTo({ top: 0 });
  }

  function handleLink(link) {
    hideStatus();
    const email = findEmail(state.openId);
    const url = esc(link.dataset.href);

    if (state.screen === "bonus" && email && email.id === BONUS_EMAIL.id) {
      renderFinal("phished");
      return;
    }

    if (state.screen === "play" && email && email.phish) state.phishClicks.add(email.id);

    let body;
    if (state.screen === "review" && email) {
      body = email.phish
        ? `<p class="url-box url-bad">${url}</p><p>This is the <strong>phishing link</strong>. It would have taken you to a fake page built to steal your password or personal info.</p>`
        : `<p class="url-box url-good">${url}</p><p>This is a <strong>real</strong> address that matches the sender.</p>`;
    } else {
      body = `<p class="url-box">${url}</p>
              <p>Links don't open in this game. Before you click a link in a real email, <strong>hover over it</strong> (or <strong>press and hold</strong> on a phone) and check that the address matches who the email claims to be from.</p>`;
    }
    showModal({ title: "Where this link goes", body, actions: [{ label: "Got it", primary: true }] });
  }

  app.addEventListener("click", (ev) => {
    const link = ev.target.closest(".email-link");
    if (link) {
      ev.preventDefault();
      handleLink(link);
      return;
    }

    const btn = ev.target.closest("[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === "start" || action === "restart") start();
    else if (action === "open") openEmail(id);
    else if (action === "back") {
      state.openId = null;
      renderInbox();
    } else if (action === "pick") pick(id);
    else if (action === "results") renderResults();
    else if (action === "bonus") enterBonus();
    else if (action === "report-bonus") renderFinal("caught");
  });

  toast.addEventListener("click", enterBonus);

  // ---------- link hover status bar (like a browser) ----------

  function showStatus(link) {
    statusBar.textContent = link.dataset.href;
    statusBar.hidden = false;
  }
  function hideStatus() {
    statusBar.hidden = true;
  }

  app.addEventListener("mouseover", (ev) => {
    const link = ev.target.closest(".email-link");
    if (link) showStatus(link);
  });
  app.addEventListener("mouseout", (ev) => {
    const link = ev.target.closest(".email-link");
    if (link && !link.contains(ev.relatedTarget)) hideStatus();
  });
  app.addEventListener("focusin", (ev) => {
    const link = ev.target.closest(".email-link");
    if (link) showStatus(link);
  });
  app.addEventListener("focusout", (ev) => {
    if (ev.target.closest(".email-link")) hideStatus();
  });

  document.title = `Spot the Phish · ${S.name}`;
  document.querySelector(".brand-sub").textContent = S.name;
  renderIntro();
})();
