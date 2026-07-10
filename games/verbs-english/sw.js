// VerbQuest service worker — offline cache
// Strategy: network-first for HTML/data (always fresh when online, cache fallback offline);
// cache-first for the rest. Bump CACHE on every release.
const CACHE = "verbquest-v1.4";
const ASSETS = ["./", "./index.html", "./verbs-data.js", "./manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === location.origin;
  const isFresh = e.request.mode === "navigate" || (sameOrigin && /\.(html|js|json)$/.test(url.pathname)) || url.pathname.endsWith("/");
  if (isFresh) {
    // network-first: never serve a stale game when online
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok && sameOrigin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // cache-first for static assets (fonts, etc.)
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        if (res.ok && sameOrigin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }))
    );
  }
});
