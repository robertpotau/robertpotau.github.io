/* © 2026 Robert Potau Nuñez — Tots els drets reservats / All rights reserved. robertpotau@gmail.com */
// Service worker — Detectiu de Senyals. Network-first per a HTML/JS/JSON (mai cache-first: serviria versions velles).
const CACHE = 'senyals-v1.2.1'; // el sufix és SEMPRE la versió del joc
const ASSETS = ['./', './index.html', './senyals.js', './game.js', './modes2.js', './estudia.js', './manifest.json', './icon.svg', './fonts/nunito-400.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  const net = /\.(html|js|json)$/.test(u.pathname) || u.pathname.endsWith('/');
  if (net) {
    e.respondWith(fetch(e.request).then(r => { if (r && r.status === 200) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
  } else {
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })));
  }
});
