const VERSION = 'btm2026-v2.2.0-20260925';
const APP_CACHE = `${VERSION}-app`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const DATA_CACHE = `${VERSION}-data`;

const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './src/styles.css',
  './src/app.js',
  './data/app-config.json',
  './data/program.json',
  './data/abstracts.json',
  './data/announcements.json',
  './images/icon.svg',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/maskable-512.png',
  './images/apple-touch-icon.png',
  './images/brain-maze.svg',
  './images/campus-schematic.svg',
  './images/stadtgut-schematic.svg',
  './images/transit-schematic.svg',
  './images/og-card.png',
  './images/sponsors/jazz-pharmaceuticals.png',
  './images/sponsors/lam-x.png',
  './images/sponsors/illumina.png',
  './images/sponsors/servier.png',
  './images/sponsors/novocure.png',
  './images/sponsors/alexion.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const activeCaches = new Set([APP_CACHE, RUNTIME_CACHE, DATA_CACHE]);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => !activeCaches.has(key)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function put(cacheName, request, response) {
  if (response && response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName, fallback) {
  try {
    const response = await fetch(request);
    return put(cacheName, request, response);
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallback) {
      const fallbackResponse = await caches.match(fallback);
      if (fallbackResponse) return fallbackResponse;
    }
    throw error;
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  return put(cacheName, request, response);
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then(response => put(cacheName, request, response))
    .catch(() => null);
  if (cached) {
    network.catch(() => null);
    return cached;
  }
  const response = await network;
  if (response) return response;
  throw new Error('Resource unavailable offline');
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes('/docs/')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, APP_CACHE, './index.html'));
    return;
  }

  if (url.pathname.includes('/data/')) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  if (url.pathname.includes('/abstracts/pdf/')) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image' || url.pathname.endsWith('.webmanifest')) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
  }
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
