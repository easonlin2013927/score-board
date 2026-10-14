(() => {
  'use strict';
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* The site still works online. */ });
    });
  }

  let installPrompt = null;
  const installButton = document.querySelector('#install-app');
  window.addEventListener('beforeinstallprompt', (event) => {
    if (!installButton) return;
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });
  installButton?.addEventListener('click', async () => {
    if (!installPrompt) return;
    const prompt = installPrompt;
    installPrompt = null;
    installButton.hidden = true;
    await prompt.prompt();
    await prompt.userChoice;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    if (installButton) installButton.hidden = true;
  });
})();
