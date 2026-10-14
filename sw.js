const CACHE_NAME = 'scoreboard-offline-v2';
const OFFLINE_FILES = [
  './', './index.html', './styles.css', './github-link.css', './language.css',
  './features.css', './legal-links.css', './extras.css', './i18n.js?v=2', './app.js?v=2',
  './legal.html', './legal.css', './legal.js', './pwa.js', './favicon.svg',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('scoreboard-offline-') && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(request) ?? await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === 'navigate') return await cache.match('./index.html') ?? Response.error();
      return Response.error();
    }
  })());
});
