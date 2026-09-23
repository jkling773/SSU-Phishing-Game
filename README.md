# Spot the Phish

A phishing-awareness game for the Salem State community. Players get a mock inbox of 5 emails, find the one legitimate email among 4 phishing emails, then review what gave each one away. A surprise bonus email at the end teaches the most important lesson: phishing that fits the context.

Plain HTML/CSS/JS with no build step. Nothing is stored or sent anywhere.

## Files

| File | What it is |
|---|---|
| `index.html` | Page shell |
| `emails.js` | **All email content.** Edit this file to change emails, red flags, or the final "report it" tip |
| `game.js` | Game logic |
| `styles.css` | Styling |

## Try it locally

Double-click `index.html` to open it in a browser.

## Publish on GitHub Pages

1. Create a new GitHub repository and upload these four files (plus this README).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
4. After a minute the game is live at `https://<your-username>.github.io/<repo-name>/`.

## Editing emails

Open `emails.js`:

- **`CONFIG.reportTip`**: replace this with Salem State's real reporting instructions (for example, the IT Help Desk's report address).
- **`PHISH_EMAILS`**: the phishing emails. All of them appear in the inbox.
- **`LEGIT_EMAILS`**: the pool of real emails. One is picked at random each game, so replays differ.
- **`BONUS_EMAIL`**: the contextual "your results are ready" email that arrives after the results screen.

To mark a red flag inside a phishing email, wrap the text in `<span class="flag" data-flag="N">…</span>` and add a matching item to that email's `flags` list. Flags are hidden during play and highlighted on the reveal screen.

Links use `data-href` for the address they "go to". They never actually open. Hovering shows the address, and clicking explains where it would have gone.
