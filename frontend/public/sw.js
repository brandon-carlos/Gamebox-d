const CACHE_NAME = 'gameboxd-image-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets-fast/Background-Green.png',
  '/assets-fast/Background-Blue.png',
  '/assets-fast/Background-Red.png',
  '/assets-fast/Background-purple.png',
  '/assets-fast/Background-cyan.png',
  '/assets-fast/pixil_dither_overlay_background.png',
  '/assets-fast/logo.png',
  '/assets-fast/heart.png',
  '/assets-fast/Contact.png',
  '/assets-fast/views.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Cache local images aggressively.
  if (url.origin === self.location.origin && (
      url.pathname.startsWith('/assets-fast/') ||
      url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg)$/)
    )) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for same-origin static files.
  if (url.origin === self.location.origin && url.pathname.match(/\.(js|css|html)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
