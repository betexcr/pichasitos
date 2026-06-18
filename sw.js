/* global PICHASITOS_CACHE_VERSION */
importScripts('/js/cache-version.js');

const CACHE_NAME = 'pichasitos-' + PICHASITOS_CACHE_VERSION;
const CACHE_PREFIX = 'pichasitos-';

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isCacheableAsset(pathname) {
  return pathname.startsWith('/assets/');
}

function isAppShell(pathname) {
  return pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname === '/' ||
    pathname.endsWith('/index.html');
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkUpdate = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    networkUpdate.catch(function () {});
    return cached;
  }
  return networkUpdate;
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!isSameOrigin(url)) return;

  if (isCacheableAsset(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (isAppShell(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
