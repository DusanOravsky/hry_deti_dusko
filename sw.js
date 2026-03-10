// Keep in sync with APP_VERSION in index.html
const CACHE_NAME = 'hrajmesi-v4.2';
const ASSETS = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Don't skipWaiting automatically - wait for user confirmation
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  // Don't claim clients automatically - page will reload after skipWaiting
  // and pick up the new SW naturally
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // HTML pages: network-first (always get latest)
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  // Other assets (icons, manifest): cache-first (fast offline)
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
