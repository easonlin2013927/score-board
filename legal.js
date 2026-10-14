(() => {
  'use strict';

  const content = {
    'zh-TW': {
      lang: 'zh-Hant', title: '網站資訊', intro: '了解記分資料如何儲存、網站如何運作，以及如何聯絡專案維護者。', back: '返回記分板', language: '語言', updated: '更新日期：2026-10-14', nav: '頁面段落',
      sections: {
        privacy: { title: '隱私說明', parts: [
          ['儲存的資料', '記分板名稱、組別名稱、分數、回合與計時器存在您目前瀏覽器的 localStorage（scoreboard.v1）。語言偏好另存於 scoreboard.language。此網站沒有帳號，也沒有把這些記分資料傳到專案自己的伺服器。'],
          ['匯入、匯出與刪除', '匯入的 JSON 由瀏覽器在本機讀取；匯出的 JSON 與 PNG 會下載到您的裝置。若您自行分享匯出檔案，接收者將能看到其中內容。側邊欄的「清除本機記分資料」可刪除目前網站來源的記分資料，並保留語言設定。清除瀏覽器網站資料也會移除本機設定。'],
          ['主機與外部連結', '網站由 Cloudflare Pages 提供。Cloudflare 可能為連線、安全及服務運作處理技術資料；詳細做法請參考 Cloudflare 的隱私與 Cookie 文件。只有在您點選 GitHub 連結時，瀏覽器才會前往 GitHub。網站程式目前沒有分析追蹤、廣告、第三方嵌入或遠端字型。']
        ], links: [['Cloudflare 隱私政策', 'https://www.cloudflare.com/privacypolicy/']] },
        terms: { title: '使用條款', parts: [
          ['使用方式', 'Scoreboard 是提供活動記分的免費工具。請自行確認輸入內容的準確性及使用權限，並在需要保留紀錄時匯出 JSON 備份。'],
          ['服務狀態', '網站與功能可能更新或暫時無法使用。本機資料會受瀏覽器設定、清除網站資料及裝置狀態影響；請勿把它當作唯一備份。'],
          ['使用限制', '請勿利用本網站從事違法活動，或輸入您無權處理、公開或分享的資料。本說明不取代您所在地適用的法律要求。']
        ] },
        cookies: { title: 'Cookie 說明', parts: [
          ['網站程式', '目前的記分板程式不設定 Cookie，使用 localStorage 保存記分資料與語言偏好，也沒有加入分析或廣告追蹤程式。'],
          ['託管服務', 'Cloudflare 可能依啟用的安全功能設定必要的 Cookie。Cloudflare 的文件列出相關 Cookie 及其用途；實際情況可能隨託管設定變動。']
        ], links: [['Cloudflare Cookie 文件', 'https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/']] },
        about: { title: '關於專案', parts: [
          ['維護與聯絡', '這是由 GitHub 帳號 easonlin2013927 維護的公開記分板專案。專案未提供公司名稱、地址或法人身分，因此這裡不臆造公司資料。功能與資料處理問題可在 GitHub Issues 回報。'],
          ['素材', '網站介面的圖示和專案文件中的插圖由此專案提供。素材來源與後續使用注意事項記錄在儲存庫的 ASSET_NOTES.md。']
        ], links: [['GitHub 儲存庫', 'https://github.com/easonlin2013927/score-board'], ['提出問題', 'https://github.com/easonlin2013927/score-board/issues']] }
      }
    },
    'zh-CN': {
      lang: 'zh-Hans', title: '网站信息', intro: '了解计分数据如何存储、网站如何运作，以及如何联系项目维护者。', back: '返回计分板', language: '语言', updated: '更新日期：2026-10-14', nav: '页面章节',
      sections: {
        privacy: { title: '隐私说明', parts: [
          ['存储的数据', '计分板名称、组别名称、分数、回合和计时器保存在当前浏览器的 localStorage（scoreboard.v1）。语言偏好另存于 scoreboard.language。本站没有账户，也不会将这些计分数据发送到项目自己的服务器。'],
          ['导入、导出和删除', '导入的 JSON 由浏览器在本地读取；导出的 JSON 和 PNG 会下载到您的设备。若您自行分享导出文件，接收者将能看到其中内容。侧边栏的“清除本地计分数据”可删除当前网站来源的计分数据，并保留语言设置。清除浏览器网站数据也会移除本地设置。'],
          ['主机和外部链接', '网站托管于 Cloudflare Pages。Cloudflare 可能为连接、安全及服务运行处理技术数据；详情请参考其隐私和 Cookie 文件。只有点击 GitHub 链接时，浏览器才会前往 GitHub。网站程序目前没有分析追踪、广告、第三方嵌入或远程字体。']
        ], links: [['Cloudflare 隐私政策', 'https://www.cloudflare.com/privacypolicy/']] },
        terms: { title: '使用条款', parts: [
          ['使用方式', 'Scoreboard 是免费的活动计分工具。请自行确认输入内容的准确性及使用权限，并在需要保留记录时导出 JSON 备份。'],
          ['服务状态', '网站和功能可能更新或暂时无法使用。本地数据受浏览器设置、清除网站数据和设备状态影响；请勿将其作为唯一备份。'],
          ['使用限制', '请勿利用本网站从事违法活动，或输入您无权处理、公开或分享的数据。本说明不能替代您所在地适用的法律要求。']
        ] },
        cookies: { title: 'Cookie 说明', parts: [
          ['网站程序', '当前计分板程序不设置 Cookie，而使用 localStorage 保存计分数据和语言偏好，也未加入分析或广告追踪程序。'],
          ['托管服务', 'Cloudflare 可能根据启用的安全功能设置必要的 Cookie。Cloudflare 文档列出相关 Cookie 及其用途；实际情况可能随托管设置变化。']
        ], links: [['Cloudflare Cookie 文档', 'https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/']] },
        about: { title: '关于项目', parts: [
          ['维护和联系', '这是由 GitHub 账号 easonlin2013927 维护的公开计分板项目。项目未提供公司名称、地址或法人身份，因此这里不虚构公司信息。功能和数据处理问题可在 GitHub Issues 反馈。'],
          ['素材', '网站界面的图标和项目文档中的插图由此项目提供。素材来源与后续使用注意事项记录在仓库的 ASSET_NOTES.md。']
        ], links: [['GitHub 仓库', 'https://github.com/easonlin2013927/score-board'], ['反馈问题', 'https://github.com/easonlin2013927/score-board/issues']] }
      }
    },
    en: {
      lang: 'en', title: 'Site information', intro: 'How scoreboard data is stored, how this site works, and how to contact the project maintainer.', back: 'Back to scoreboard', language: 'Language', updated: 'Updated: 2026-10-14', nav: 'On this page',
      sections: {
        privacy: { title: 'Privacy', parts: [
          ['Data stored', 'The board title, group names, scores, rounds and timer are saved in this browser’s localStorage (scoreboard.v1). Your language choice is saved separately as scoreboard.language. There are no accounts, and the site does not send this scoreboard data to a project-operated server.'],
          ['Import, export and deletion', 'Imported JSON is read locally in your browser. Exported JSON and PNG files download to your device. Anyone you choose to share an export with can read its contents. “Clear local scoreboard data” in the sidebar removes scoreboard data for this site while retaining your language choice. Clearing browser site data removes local settings too.'],
          ['Hosting and external links', 'Cloudflare Pages hosts this site. Cloudflare may process technical connection and security data to operate its service; see its privacy and cookie documents. Your browser visits GitHub only after you click a GitHub link. The site code currently has no analytics, advertising, third-party embeds or remote fonts.']
        ], links: [['Cloudflare Privacy Policy', 'https://www.cloudflare.com/privacypolicy/']] },
        terms: { title: 'Terms of use', parts: [
          ['Using the tool', 'Scoreboard is a free event scoring tool. You are responsible for checking the accuracy of your entries and your right to use them. Export a JSON backup when you need to keep a record.'],
          ['Availability', 'The site and its features may change or be temporarily unavailable. Browser settings, site-data clearing and device conditions can affect local data. Keep a separate backup for important records.'],
          ['Appropriate use', 'Do not use this site for unlawful activity or enter information you have no right to process, publish or share. This information does not replace laws that apply where you live.']
        ] },
        cookies: { title: 'Cookies', parts: [
          ['Site code', 'The scoreboard code currently sets no cookies. It uses localStorage for scoreboard data and language preference, with no analytics or advertising trackers.'],
          ['Hosting provider', 'Cloudflare may set necessary cookies depending on enabled security features. Its documentation describes those cookies and their purposes. Actual behavior can change with hosting configuration.']
        ], links: [['Cloudflare cookie documentation', 'https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/']] },
        about: { title: 'About this project', parts: [
          ['Maintainer and contact', 'This public scoreboard project is maintained by the GitHub account easonlin2013927. No company name, address or legal entity details have been provided, so none are asserted here. Please report feature or data-handling questions through GitHub Issues.'],
          ['Assets', 'The interface icons and documentation illustrations are included with this project. Asset provenance and future-use notes are recorded in ASSET_NOTES.md in the repository.']
        ], links: [['GitHub repository', 'https://github.com/easonlin2013927/score-board'], ['Open an issue', 'https://github.com/easonlin2013927/score-board/issues']] }
      }
    },
    ja: {
      lang: 'ja', title: 'サイト情報', intro: 'スコアデータの保存方法、サイトの仕組み、管理者への連絡方法を説明します。', back: 'スコアボードに戻る', language: '言語', updated: '更新日：2026-10-14', nav: 'ページ内の項目',
      sections: {
        privacy: { title: 'プライバシー', parts: [
          ['保存するデータ', 'ボード名、グループ名、得点、ラウンド、タイマーは現在のブラウザーの localStorage（scoreboard.v1）に保存されます。言語設定は scoreboard.language に別途保存されます。アカウントはなく、これらのスコアデータをプロジェクト運営のサーバーに送信しません。'],
          ['読み込み・書き出し・削除', '読み込んだ JSON はブラウザー内で処理されます。書き出した JSON と PNG は端末にダウンロードされます。共有したファイルの内容は受信者が確認できます。サイドバーの「端末のスコアデータを消去」でこのサイトのスコアデータを削除し、言語設定は残せます。ブラウザーのサイトデータを消去すると設定も消えます。'],
          ['ホスティングと外部リンク', 'このサイトは Cloudflare Pages で配信されます。Cloudflare はサービスの運営やセキュリティのために接続情報などを処理する場合があります。詳細は同社のプライバシーと Cookie の文書をご覧ください。GitHub への移動はリンクをクリックした場合のみです。現在のサイトコードには解析、広告、外部埋め込み、外部フォントはありません。']
        ], links: [['Cloudflare プライバシーポリシー', 'https://www.cloudflare.com/privacypolicy/']] },
        terms: { title: '利用条件', parts: [
          ['利用方法', 'Scoreboard は無料のイベント得点管理ツールです。入力内容の正確性と利用権限をご確認ください。記録を残す場合は JSON でバックアップしてください。'],
          ['サービスの状態', 'サイトや機能は変更されたり一時的に利用できなくなったりする場合があります。ブラウザーの設定、サイトデータの消去、端末の状態によってローカルデータは影響を受けます。重要な記録は別途保存してください。'],
          ['適切な利用', '違法な行為に利用したり、処理・公開・共有する権利のない情報を入力したりしないでください。この説明は各地域の適用法令に代わるものではありません。']
        ] },
        cookies: { title: 'Cookie', parts: [
          ['サイトのコード', '現在のスコアボードのコードは Cookie を設定しません。スコアデータと言語設定には localStorage を使用し、解析や広告の追跡コードは含みません。'],
          ['ホスティング事業者', 'Cloudflare は有効なセキュリティ機能に応じて必要な Cookie を設定する場合があります。種類と用途は Cloudflare の文書をご覧ください。実際の動作はホスティング設定により変わることがあります。']
        ], links: [['Cloudflare Cookie 文書', 'https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/']] },
        about: { title: 'プロジェクトについて', parts: [
          ['管理者と連絡先', 'この公開スコアボードプロジェクトは GitHub アカウント easonlin2013927 が管理しています。会社名、住所、法人情報は提供されていないため、ここには記載していません。機能やデータの取り扱いについては GitHub Issues でお問い合わせください。'],
          ['素材', '画面内のアイコンと文書のイラストはこのプロジェクトに含まれます。素材の出所と今後の利用上の注意はリポジトリの ASSET_NOTES.md に記録しています。']
        ], links: [['GitHub リポジトリ', 'https://github.com/easonlin2013927/score-board'], ['Issue を作成', 'https://github.com/easonlin2013927/score-board/issues']] }
      }
    }
  };

  function detectLanguage() {
    try {
      const saved = localStorage.getItem('scoreboard.language');
      if (Object.hasOwn(content, saved)) return saved;
    } catch { /* The page remains usable without local storage. */ }
    for (const item of navigator.languages ?? [navigator.language]) {
      const tag = item?.toLowerCase() ?? '';
      if (tag.startsWith('zh')) return /-(cn|sg|hans)/.test(tag) ? 'zh-CN' : 'zh-TW';
      if (tag.startsWith('ja')) return 'ja';
      if (tag.startsWith('en')) return 'en';
    }
    return 'zh-TW';
  }

  function render(language) {
    const page = content[language];
    document.documentElement.lang = page.lang;
    document.title = `${page.title} · Scoreboard`;
    document.querySelector('meta[name="description"]').content = page.intro;
    document.querySelector('#language-select').value = language;
    document.querySelector('#language-label').textContent = page.language;
    document.querySelector('#page-title').textContent = page.title;
    document.querySelector('#page-intro').textContent = page.intro;
    document.querySelector('#updated').textContent = page.updated;
    document.querySelector('#back-link').textContent = `← ${page.back}`;
    document.querySelector('#footer-back').textContent = page.back;
    const nav = document.querySelector('#section-nav');
    nav.setAttribute('aria-label', page.nav);
    const sections = document.querySelector('#sections');
    nav.replaceChildren();
    sections.replaceChildren();
    for (const [id, section] of Object.entries(page.sections)) {
      const navLink = document.createElement('a');
      navLink.href = `#${id}`;
      navLink.textContent = section.title;
      nav.append(navLink);
      const article = document.createElement('section');
      article.id = id;
      article.className = 'legal-section';
      const heading = document.createElement('h2');
      heading.textContent = section.title;
      article.append(heading);
      for (const [subheading, paragraph] of section.parts) {
        const h3 = document.createElement('h3');
        h3.textContent = subheading;
        const p = document.createElement('p');
        p.textContent = paragraph;
        article.append(h3, p);
      }
      if (section.links) {
        const list = document.createElement('ul');
        for (const [label, url] of section.links) {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = url;
          link.textContent = label;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          li.append(link);
          list.append(li);
        }
        article.append(list);
      }
      sections.append(article);
    }
  }

  document.querySelector('#language-select').addEventListener('change', (event) => {
    const language = event.target.value;
    if (!Object.hasOwn(content, language)) return;
    try { localStorage.setItem('scoreboard.language', language); } catch { /* Selection works for this visit. */ }
    render(language);
  });
  render(detectLanguage());
})();
