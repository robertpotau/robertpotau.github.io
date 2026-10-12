/*
 * © 2026 Robert Potau Nuñez — Tots els drets reservats / All rights reserved.
 * Prohibida la còpia, modificació o redistribució sense permís escrit.
 * Termes: https://robertpotau.github.io/termes.html · Contacte: robertpotau@gmail.com
 */
// Eines del taller — service worker (offline). El genera tools/build.py a partir d'aquest fitxer.
// Estratègia: xarxa primer per a HTML/JS/JSON (sempre fresc si hi ha connexió); caché primer per a imatges i fonts.
const CACHE = "eines-v@@VERSION@@";
const ASSETS = @@ASSETS@@;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === location.origin;
  const fresh = e.request.mode === "navigate" || (sameOrigin && /\.(html|js|json)$/.test(url.pathname)) || url.pathname.endsWith("/");
  if (fresh) {
    e.respondWith(fetch(e.request).then(res => {
      if (res.ok && sameOrigin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && sameOrigin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    })));
  }
});
