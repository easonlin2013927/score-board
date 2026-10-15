[🌐 Choose a language](../../README.md) · [繁體中文](./README.zh-TW.md) · [简体中文](./README.zh-CN.md) · **English** · [日本語](./README.ja.md)

[📚 Wiki guide (Traditional Chinese)](https://github.com/easonlin2013927/score-board/wiki) · [🐛 Report an issue or idea](https://github.com/easonlin2013927/score-board/issues/new/choose)

<p align="center"><img src="../readme-hero-v2.svg" alt="Colorful Scoreboard project banner" width="100%" /></p>

<h1 align="center">Scoreboard · Live scores for every event</h1>

<p align="center">A lightweight scoreboard for creating groups, tracking points, and keeping every result.</p>

<p align="center"><a href="https://easonlin2013927.github.io/score-board/"><img src="https://img.shields.io/badge/OPEN%20LIVE%20DEMO-GitHub%20Pages-3aa9b5?style=for-the-badge&logo=github&logoColor=white" alt="Open the live scoreboard" /></a></p>

> The app supports Traditional Chinese, Simplified Chinese, English, and Japanese. Switch languages in the top bar; names and scores stay as you entered them.

## ✨ Features

![Instant groups, live scoring, JSON backup, and responsive layout](../readme-features.svg)

| Feature | How it works |
| :--- | :--- |
| 🟢 **Create groups** | A new board starts empty. Select **Add team** to create **New team**, then use the pencil icon to rename it. |
| ⚡ **Update scores** | Use the score buttons or select a score to enter an integer directly. Set how many points each tap changes. |
| 🏆 **See the ranking** | Groups are sorted by score. The overview shows the group count, highest score, and leader. |
| 🧹 **Manage the board** | Rename the board, delete groups, or reset all scores after confirmation. |
| 🗂️ **Multiple boards** | Create, switch, duplicate and delete boards. Teams, rules and history stay separate. |
| 🧮 **Scoring rules** | Set a 1–100 point step, choose whether negative scores are allowed, and choose shared ranks or creation order for ties. |
| 🕓 **Score history** | Each board keeps its latest 200 score adjustments, direct edits and resets. |
| 📲 **Install and use offline** | Supported browsers can install the site; after the first online load, it can open offline. |
| 📦 **Import and export** | Download a JSON backup or import one on another browser or device. Importing asks before replacing current data. |
| 🖥️ **Full screen display** | Show teams, total scores, and the round timer in a large display. |
| ⏱️ **Timer and rounds** | Set minutes per round, start or pause the timer, and review scores from earlier rounds. |
| 🖼️ **Results image** | Export a PNG image to share the final ranking. |
| 📱 **Use any screen** | The dark layout adapts to desktop and mobile screens. |

## 🎮 Get started

**Online:** Open **[easonlin2013927.github.io/score-board](https://easonlin2013927.github.io/score-board/)**. No account or installation is required.

**Moving to this URL:** Browser storage is separate for each site address. If you used the old address, export each board as JSON there and import it here.

**Locally:**

```bash
git clone https://github.com/easonlin2013927/score-board.git
cd score-board
```

Open `index.html` in a browser. This is a static site with no dependencies or build step.

### Typical workflow

1. Use the pencil beside the title to rename the scoreboard.
2. Select **Add team**, then use the pencil on its card to enter the team name.
3. Use the score buttons, or select the number to set a score directly.
4. Select **Export scoreboard** to save a JSON backup.

## 💾 Data and backups

Names and scores are saved automatically in the **current browser's** `localStorage`. They survive page reloads but **do not sync between devices**. To move a board, export its JSON file and import it in the other browser.

Importing replaces the current board and scores after a confirmation prompt. If old groups still appear after an update, they came from data saved in that browser; delete them in the app or clear this site's browser data.

## 🔒 Data and launch information

Scoreboard data stays in the current browser. “Clear all local scoreboard data” removes every board; export each one as JSON first if needed. Each import or export handles only the selected board. Offline installation requires HTTPS or a local server; opening `index.html` directly still supports ordinary scoring. The site has [privacy, terms, cookies and project information](https://easonlin2013927.github.io/score-board/legal.html). The repository also has a [launch checklist](../../LAUNCH_CHECKLIST.md) and [asset notes](../../ASSET_NOTES.md).

## 🚀 Deploy to GitHub Pages

This repository publishes automatically from the `main` branch at `/(root)` using GitHub Pages. To host your own copy, fork the repository, then open **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, `main`, and `/(root)`, then click **Save**. This static site needs no build command.

You can later add your own domain in **Settings → Pages → Custom domain** and configure DNS using [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## 🧩 Project structure

```text
score-board/
├─ index.html         # Page layout and dialogs
├─ styles.css         # Main and responsive styles
├─ github-link.css    # GitHub button in the sidebar
├─ language.css       # Language selector styles
├─ features.css       # Timer and display styles
├─ extras.css         # Multiple boards, rules and history styles
├─ i18n.js            # Interface text in four languages
├─ app.js             # Scoring, storage, import, and export
├─ pwa.js, sw.js       # Installation and offline cache
├─ manifest.webmanifest, icons/  # Install metadata and icons
├─ favicon.svg        # Site icon
└─ docs/              # README graphics and translations
```

<p align="center"><strong>🎯 Every point tells a story.</strong></p>
