// CalcuHerois Service Worker — v1.0
// Permet funcionar offline i instal·lar com a PWA

const CACHE_NAME = 'calcuherois-v2';
const ASSETS = [
  './',
  './index.html',
];

// Instal·lació: guardar el fitxer HTML a la cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activació: eliminar caches antigues
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first per a l'HTML, network-first per a la resta
self.addEventListener('fetch', event => {
  if (event.request.url.includes('index.html') || event.request.url.endsWith('/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});
