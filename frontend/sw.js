const CACHE_NAME = 'gyfx35-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/style.css',
  '/header.js',
  '/footer.js',
  '/arts.html',
  '/arts.js',
  '/arts.css',
  '/entertainment.html',
  '/entertainment.js',
  '/entertainment.css',
  '/settings.html',
  '/settings.js',
  '/settings.css',
  '/talents.html',
  '/talents.js',
  '/talents.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
