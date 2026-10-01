[🌐 选择语言](../../README.md) · [繁體中文](./README.zh-TW.md) · **简体中文** · [English](./README.en.md) · [日本語](./README.ja.md)

<p align="center"><img src="../readme-hero.svg" alt="Scoreboard 彩色记分板横幅" width="100%" /></p>

<h1 align="center">Scoreboard · 活动记分板</h1>

<p align="center">一个轻巧、易用的实时记分板。打开网站，创建组别，记录每一分。</p>

<p align="center"><a href="https://score-board-4gz.pages.dev/"><img src="https://img.shields.io/badge/OPEN%20LIVE%20DEMO-Cloudflare%20Pages-3aa9b5?style=for-the-badge&logo=cloudflare&logoColor=white" alt="打开在线记分板" /></a></p>

> 网站支持繁体中文、简体中文、英语和日语。可在右上角切换语言，记分板名称、组别名称和分数不会因此改变。

## ✨ 功能总览

![创建组别、实时记分、JSON 备份和响应式布局](../readme-features.svg)

| 功能 | 使用方式 |
| :--- | :--- |
| 🟢 **自由创建组别** | 首次打开时没有预设组别。点击「新增小组」会立即创建「新的小组」，再点击卡片上的铅笔修改名称。 |
| ⚡ **快速记分** | 使用 `+1`、`−1` 按钮记分；点击分数也可以直接输入整数。 |
| 🏆 **实时排名** | 组别按分数排序，概览区显示组别数量、最高分和领先组别。 |
| 🧹 **管理记分板** | 可以修改记分板名称、删除组别，或确认后将所有分数归零。 |
| 📦 **导入与导出** | 下载 JSON 备份，也可以在其他浏览器或设备中导入。导入前会确认是否覆盖当前数据。 |
| 📱 **适配不同屏幕** | 深色界面适用于桌面和手机。 |

## 🎮 开始使用

**在线使用：** 打开 **[score-board-4gz.pages.dev](https://score-board-4gz.pages.dev/)**，无需注册或安装。

**在本地打开：**

```bash
git clone https://github.com/easonlin2013927/score-board.git
cd score-board
```

然后用浏览器打开 `index.html`。这是纯静态网站，无需安装依赖或执行构建命令。

### 一场活动的操作流程

1. 点击标题旁的铅笔，修改记分板名称。
2. 点击「新增小组」，再点击组别卡片上的铅笔输入队名。
3. 使用加减按钮记分；需要大幅调整时，直接点击分数输入。
4. 活动结束后点击「导出记分板」，保存 JSON 备份。

## 💾 数据与备份

名称和分数会自动保存在**当前浏览器**的 `localStorage` 中。刷新页面后仍可继续使用，但不同设备之间**不会自动同步**。若要换设备，请先在原设备导出 JSON，再在新设备导入。

导入文件会替换当前的记分板和分数，操作前会出现确认窗口。如果更新网站后仍看到旧组别，那是当前浏览器之前保存的数据；可以在应用中逐一删除，或清除此网站的浏览器数据。

## ☁️ 部署到 Cloudflare Pages

本仓库已连接 Cloudflare Pages；推送到 `main` 后会自动部署。若想在自己的账号中部署，可选择 **Workers & Pages → Create application → Pages → Connect to Git**，连接本仓库并使用以下设置：

| 设置项 | 值 |
| :--- | :--- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | 留空 |
| Build output directory | 仓库根目录 `/`；若界面已显示 `/` 前缀，输入框留空即可 |
| Root directory、Environment variables | 留空 |

部署后可在 Pages 项目的 **Custom domains → Set up a domain** 添加自己的域名。根域名和子域名的 DNS 要求请参阅 [Cloudflare 官方文档](https://developers.cloudflare.com/pages/configuration/custom-domains/)。

## 🧩 项目结构

```text
score-board/
├─ index.html         # 页面与对话框
├─ styles.css         # 主样式与响应式布局
├─ github-link.css    # 侧边栏 GitHub 按钮
├─ language.css       # 语言选择器样式
├─ i18n.js            # 四种语言的界面文字
├─ app.js             # 记分、存储、导入和导出
├─ favicon.svg        # 网站图标
└─ docs/              # README 图片与多语言文档
```

<p align="center"><strong>🎯 让每一分都留下记录。</strong></p>
