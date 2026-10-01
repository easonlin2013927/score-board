# Scoreboard 記分板

以深色與綠色設計的單頁記分板。點擊新增會立即建立「新的組別」，之後可重新命名或刪除；點擊 `+1` / `−1` 計分，也能點分數直接輸入整數。組別會依分數排序，可一鍵將全部分數歸零。側邊欄提供 GitHub 原始碼連結。

資料會自動存入目前瀏覽器的 `localStorage`。匯出功能會下載 JSON 備份；匯入時會檢查格式並在覆蓋目前資料前確認。資料不會自動同步到其他裝置。

## 在本機使用

直接以瀏覽器開啟 `index.html` 即可。若要用本機伺服器預覽，也可以用任何靜態檔案伺服器指向專案根目錄。網站不需要編譯或安裝套件。

## 部署至 Cloudflare Pages

在 Cloudflare 的 **Workers & Pages** 建立 Pages 專案，選擇 **Connect to Git** 並連接此 GitHub repository。正式環境分支設為 `main`，Framework preset 選 `None`，Build command 留空，Build output directory 填入 `/`。Cloudflare 會直接發布根目錄的 `index.html`、`styles.css`、`app.js` 和 `favicon.svg`。之後推送到 `main` 會自動部署。

發布後可到 Pages 專案的 **Custom domains → Set up a domain** 加入自己的網域。根網域需要將該網域加入同一個 Cloudflare 帳戶並設定其名稱伺服器；子網域依 Cloudflare 畫面提示設定 DNS。
