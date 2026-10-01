[🌐 語言選擇](../../README.md) · **繁體中文** · [简体中文](./README.zh-CN.md) · [English](./README.en.md) · [日本語](./README.ja.md)

<p align="center"><img src="../readme-hero.svg" alt="Scoreboard 彩色記分板橫幅" width="100%" /></p>

<h1 align="center">Scoreboard · 活動記分板</h1>

<p align="center">一個輕巧、好上手的即時記分板。打開網站，建立組別，開始記錄每一分。</p>

<p align="center"><a href="https://score-board-4gz.pages.dev/"><img src="https://img.shields.io/badge/立即使用-Cloudflare%20Pages-3aa9b5?style=for-the-badge&logo=cloudflare&logoColor=white" alt="開啟線上版本" /></a></p>

## ✨ 功能總覽

![建立組別、即時記分、JSON 備份與響應式版面](../readme-features.svg)

| 功能 | 使用方式 |
| :--- | :--- |
| 🟢 **自由建立組別** | 首次開啟沒有預設組別。按「新增組別」就會建立一個「新的組別」，再按卡片上的鉛筆改名。 |
| ⚡ **快速計分** | 用 `+1`、`−1` 按鈕計分；點擊分數可直接輸入整數。 |
| 🏆 **即時排行** | 組別依分數排序，概況區顯示組別數、最高分與領先組別。 |
| 🧹 **管理記分板** | 可修改記分板名稱、刪除組別，或在確認後讓全部分數歸零。 |
| 📦 **匯入與匯出** | 下載 JSON 備份，也能將備份匯入其他瀏覽器或裝置。匯入前會先確認是否覆蓋目前資料。 |
| 🌐 **切換語言** | 在網站右上角選擇繁體中文、简体中文、English 或日本語。選擇會儲存在瀏覽器中，已輸入的名稱與分數不會被改寫。 |
| 📱 **各種螢幕皆可用** | 深色介面支援桌面與手機瀏覽。 |

## 🎮 開始使用

**線上使用：** 前往 **[score-board-4gz.pages.dev](https://score-board-4gz.pages.dev/)**，不需要註冊或安裝。

**在本機開啟：**

```bash
git clone https://github.com/easonlin2013927/score-board.git
cd score-board
```

接著以瀏覽器開啟 `index.html`。這是純靜態網站，沒有套件安裝或編譯步驟。

### 一場活動的操作流程

1. 按標題旁的鉛筆，改好記分板名稱。
2. 按「新增組別」，再按組別卡片上的鉛筆輸入隊名。
3. 用加減按鈕記分；需要大幅調整時，直接點分數輸入。
4. 活動結束後按「匯出記分板」，保留 JSON 備份。

## 💾 資料與備份

分數與名稱會自動儲存在**目前瀏覽器**的 `localStorage`。重新整理頁面後可繼續使用，但不同裝置之間**不會自動同步**。要換裝置，先在原裝置匯出 JSON，再於新裝置匯入。

匯入檔案會取代目前的記分板與分數，操作前會顯示確認視窗。若你在新版網站仍看到舊組別，那是此瀏覽器先前儲存的資料；可逐一刪除組別，或清除這個網站的瀏覽器資料。

## ☁️ 部署到 Cloudflare Pages

此專案已使用 GitHub 連接 Cloudflare Pages；推送到 `main` 後會自動部署。若你想在自己的帳戶建立相同網站，可在 **Workers & Pages → Create application → Pages → Connect to Git** 選取此 repo，使用以下設定：

| 設定欄位 | 值 |
| :--- | :--- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | 留白 |
| Build output directory | repo 根目錄 `/`；若畫面已顯示 `/` 前綴，輸入框留白即可 |
| Root directory、Environment variables | 留白 |

部署後可在專案的 **Custom domains → Set up a domain** 加入自己的網域。根網域與子網域的 DNS 設定方式請參考 [Cloudflare 官方說明](https://developers.cloudflare.com/pages/configuration/custom-domains/)。

## 🧩 專案結構

```text
score-board/
├─ index.html         # 畫面與對話框
├─ styles.css         # 記分板樣式與響應式版面
├─ github-link.css    # 側邊欄 GitHub 按鈕
├─ language.css       # 語言選單樣式
├─ i18n.js            # 四種語言的介面文字
├─ app.js             # 計分、儲存、匯入與匯出
├─ favicon.svg        # 網站圖示
└─ docs/              # README 視覺素材與各語言文件
```

<p align="center"><strong>🎯 讓每一分都有跡可循。</strong></p>
