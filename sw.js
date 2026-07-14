/* global PICHASITOS_CACHE_VERSION */
importScripts('/js/cache-version.js');

const CACHE_NAME = 'pichasitos-' + PICHASITOS_CACHE_VERSION;
const CACHE_PREFIX = 'pichasitos-';

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

/** Shell-critical assets safe for long-lived cache-first (small / reused often). */
function isBoundedCacheAsset(pathname) {
  return pathname.startsWith('/assets/ui_bg/') ||
    pathname.startsWith('/assets/enemies/') ||
    pathname.startsWith('/assets/portraits/') ||
    pathname.startsWith('/assets/map_nodes/') ||
    pathname === '/assets/asset-manifest.json' ||
    pathname.startsWith('/assets/asset-manifest.json');
}

/** Large pose packs — network-first, do not permanently grow the SW cache. */
function isPoseAsset(pathname) {
  return pathname.startsWith('/assets/poses/');
}

function isAppShell(pathname) {
  return pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname === '/' ||
    pathname.endsWith('/index.html') ||
    pathname.endsWith('/health.html');
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

/** Network-first: prefer fresh poses; optionally keep last success for brief offline. */
async function networkFirstNoStore(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (err) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
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

  const path = url.pathname;

  if (isPoseAsset(path)) {
    event.respondWith(networkFirstNoStore(event.request));
    return;
  }

  if (isBoundedCacheAsset(path) || (path.startsWith('/assets/') && !isPoseAsset(path))) {
    // Other /assets/** (monsters, etc.): cache-first only if under bounded dirs above;
    // unknown asset folders fall through to network-first without caching.
    if (isBoundedCacheAsset(path)) {
      event.respondWith(cacheFirst(event.request));
    } else {
      event.respondWith(networkFirstNoStore(event.request));
    }
    return;
  }

  if (isAppShell(path)) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});

self.addEventListener('error', function (event) {
  console.warn('[PICHASITOS SW] error', event && event.message);
});

self.addEventListener('unhandledrejection', function (event) {
  console.warn('[PICHASITOS SW] unhandledrejection', event && event.reason);
});
