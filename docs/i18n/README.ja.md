[🌐 言語を選択](../../README.md) · [繁體中文](./README.zh-TW.md) · [简体中文](./README.zh-CN.md) · [English](./README.en.md) · **日本語**

<p align="center"><img src="../readme-hero.svg" alt="カラフルなスコアボードのバナー" width="100%" /></p>

<h1 align="center">Scoreboard · イベント用スコアボード</h1>

<p align="center">チームを作成し、得点を記録できるシンプルなスコアボードです。</p>

<p align="center"><a href="https://score-board-4gz.pages.dev/"><img src="https://img.shields.io/badge/OPEN%20LIVE%20DEMO-Cloudflare%20Pages-3aa9b5?style=for-the-badge&logo=cloudflare&logoColor=white" alt="公開中のスコアボードを開く" /></a></p>

> アプリの画面表示は現在、繁体字中国語です。このページでは使い方を日本語で説明します。

## ✨ 主な機能

![チーム作成、得点管理、JSON バックアップ、レスポンシブ表示](../readme-features.svg)

| 機能 | 使い方 |
| :--- | :--- |
| 🟢 **チームを作成** | 初回表示時にチームはありません。「新增組別」（チームを追加）を押すと「新的組別」（新しいチーム）がすぐに作成されます。カードの鉛筆アイコンから名前を変更できます。 |
| ⚡ **得点を更新** | `+1` と `−1` で加減点できます。得点をクリックして整数を直接入力することもできます。 |
| 🏆 **順位を確認** | チームは得点順に並び、チーム数、最高得点、首位のチームが表示されます。 |
| 🧹 **ボードを管理** | ボード名の変更、チームの削除、確認後の全得点リセットに対応しています。 |
| 📦 **インポートとエクスポート** | JSON バックアップを保存し、別のブラウザーや端末で読み込めます。読み込み前にデータの上書きを確認します。 |
| 📱 **画面サイズに対応** | ダークテーマの画面はデスクトップとスマートフォンの両方に対応しています。 |

## 🎮 使い始める

**オンライン：** **[score-board-4gz.pages.dev](https://score-board-4gz.pages.dev/)** を開いてください。登録やインストールは不要です。

**ローカル：**

```bash
git clone https://github.com/easonlin2013927/score-board.git
cd score-board
```

ブラウザーで `index.html` を開きます。静的サイトのため、依存パッケージのインストールやビルドは不要です。

### イベントでの操作例

1. タイトル横の鉛筆アイコンからボード名を変更します。
2. 「新增組別」を押し、作成されたカードの鉛筆アイコンからチーム名を入力します。
3. 加減点ボタンを使います。大きく変更する場合は得点をクリックして入力します。
4. 終了後に「匯出記分板」（ボードをエクスポート）を押し、JSON ファイルを保存します。

## 💾 データとバックアップ

名前と得点は**現在使用中のブラウザー**の `localStorage` に自動保存されます。ページを再読み込みしても残りますが、端末間では**自動同期されません**。別の端末へ移すには、JSON をエクスポートしてから移行先でインポートしてください。

インポートすると現在のボードと得点が置き換わります。実行前に確認画面が表示されます。更新後も以前のチームが表示される場合は、そのブラウザーに保存されたデータです。アプリ内で削除するか、このサイトのブラウザーデータを消去してください。

## ☁️ Cloudflare Pages にデプロイ

このリポジトリは Cloudflare Pages と連携済みで、`main` へのプッシュで自動デプロイされます。自分のアカウントで公開する場合は **Workers & Pages → Create application → Pages → Connect to Git** でこのリポジトリを選び、次のように設定します。

| 設定 | 値 |
| :--- | :--- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | 空欄 |
| Build output directory | リポジトリのルート `/`。画面に `/` が接頭辞として表示されている場合、入力欄は空欄 |
| Root directory、Environment variables | 空欄 |

独自ドメインは Pages プロジェクトの **Custom domains → Set up a domain** から追加できます。DNS の要件は [Cloudflare 公式ガイド](https://developers.cloudflare.com/pages/configuration/custom-domains/)を参照してください。

## 🧩 ファイル構成

```text
score-board/
├─ index.html         # 画面とダイアログ
├─ styles.css         # 基本スタイルとレスポンシブ表示
├─ github-link.css    # サイドバーの GitHub ボタン
├─ app.js             # 得点、保存、インポート、エクスポート
├─ favicon.svg        # サイトアイコン
└─ docs/              # README 用画像と翻訳
```

<p align="center"><strong>🎯 すべての得点に、思い出を。</strong></p>
