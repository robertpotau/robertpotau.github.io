/*
 * © 2026 Robert Potau Nuñez — Tots els drets reservats / All rights reserved.
 * Prohibida la còpia, modificació o redistribució sense permís escrit.
 * Termes: https://robertpotau.github.io/termes.html · Contacte: robertpotau@gmail.com
 */
// Service Worker — Jocs Aula d'Acollida
// Estratègia: network-first amb fallback a cache.
// Així les actualitzacions del joc arriben sempre que hi hagi connexió,
// i el joc continua funcionant offline amb l'última versió descarregada.
const CACHE = 'acollida-v2.4.1';
const ASSETS = [
  './index.html',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        // Desa una còpia fresca al cache per quan no hi hagi connexió
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
