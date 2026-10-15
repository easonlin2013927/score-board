# Scoreboard 專案協作指引

本檔適用於整個儲存庫。使用者當前的要求優先於本檔。

## 專案概況

- 這是不用套件管理器或建置程序的靜態 HTML、CSS、JavaScript 網站。
- 正式站點為 <https://easonlin2013927.github.io/score-board/>。GitHub Pages 從 `main` 分支的 `/(root)` 自動發布，網站沒有建置程序。
- 介面支援繁體中文、簡體中文、英文、日文。首次開啟時，記分板沒有預設組別；點擊「新增組別」會直接建立可改名的「新的組別」。

## 檔案分工

- `index.html`、`styles.css` 和其他根目錄的 CSS：主介面與響應式排版。
- `app.js`：多記分板、組別、分數、回合、計時器、匯入匯出與本機儲存。
- `i18n.js`：四種語言的主介面文字；`legal.js`：資訊頁的四語內容。
- `legal.html`、`legal.css`：隱私、條款、Cookie 與專案資訊頁。
- `pwa.js`、`sw.js`、`manifest.webmanifest`、`icons/`：安裝與離線功能。
- `README.md` 是語言入口；`docs/i18n/README.*.md` 是各語言的獨立說明。`.nojekyll` 讓 GitHub Pages 直接發布靜態檔案。

## 修改時維持的行為

- 記分資料只存在使用者瀏覽器。`app.js` 使用 `scoreboard.collection.v1`，並會搬移舊版的 `scoreboard.v1`；語言偏好使用 `scoreboard.language`。不要在一般版本更新時清除或覆寫既有資料。
- JSON 匯入和匯出只處理目前選取的記分板，並須持續接受舊版單一記分板 JSON。修改資料格式時，同步更新驗證、搬移與備份行為。
- 每個記分板各自保存組別、計分規則與最近 200 筆分數紀錄。切換記分板時不可混用資料。
- 增加或修改可見文字時，同步處理四種語言；涉及資料儲存或離線行為時，同步檢查資訊頁及各語言 README。
- 修改離線資源時，檢查 `sw.js` 的預先快取清單。若快取內容或載入方式改變，更新快取版本並實測重新連線及離線載入。

## 驗證與交付

- 先檢查 `git status`，保留使用者原有的未提交變更。
- JavaScript 變更可用 `node --check app.js`、`node --check i18n.js`、`node --check legal.js`、`node --check pwa.js`、`node --check sw.js` 驗證語法；用 `git diff --check` 檢查空白錯誤。
- 需要測試安裝、Service Worker 或離線行為時，以本機 HTTP 伺服器或 HTTPS 開啟網站；直接開啟 `index.html` 不適合測試 PWA。介面變更應在桌面與窄螢幕檢查換行和溢出。
- 使用者要求發布時，提交並推送到 GitHub，再確認 GitHub Pages 正式站點提供更新後的檔案。
