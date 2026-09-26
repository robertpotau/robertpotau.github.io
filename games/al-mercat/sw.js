// Service Worker — Al Mercat! (network-first per a HTML/JS/JSON, cache-first per a la resta)
const CACHE_NAME = 'almercat-v1.2';
const ASSETS = ['./', './index.html', './data.js', './game.js', './manifest.json', './icon.svg', './fonts/nunito-400.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const netFirst = /\.(html|js|json)$/.test(u.pathname) || u.pathname.endsWith('/');
  if (netFirst) {
    e.respondWith(fetch(e.request).then(r => {
      if (r && r.status === 200) { const c = r.clone(); caches.open(CACHE_NAME).then(x => x.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
      if (r && r.status === 200) { const cl = r.clone(); caches.open(CACHE_NAME).then(x => x.put(e.request, cl)); }
      return r;
    })));
  }
});
