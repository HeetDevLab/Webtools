const CACHE_NAME = "heetdevlab-webtools-v2.1";

const urlsToCache = [
  "/Webtools/",
  "/Webtools/index.html",
  "/Webtools/style.css",
  "/Webtools/icon-192.png",
  "/Webtools/icon-512.png"
];

// Install
self.addEventListener("install", event => {
  self.skipWaiting(); // Force new SW
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
