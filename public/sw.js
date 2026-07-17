// NYA Santé - Service Worker
// Provides offline caching and network-first strategy for API calls

const CACHE_NAME = 'nya-sante-v1';
const STATIC_CACHE = 'nya-sante-static-v1';
const API_CACHE = 'nya-sante-api-v1';
const DYNAMIC_CACHE = 'nya-sante-dynamic-v1';

// Static assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/nya-logo.png',
];

// Cache duration: 7 days for static, 5 minutes for API
const STATIC_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const API_CACHE_MAX_AGE = 5 * 60 * 1000;
const DYNAMIC_CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

// Install event - pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== STATIC_CACHE &&
                   name !== API_CACHE &&
                   name !== DYNAMIC_CACHE &&
                   name !== CACHE_NAME;
          })
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Helper: determine cache strategy based on URL
function getStrategy(request) {
  const url = new URL(request.url);

  // API calls: Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    return 'network-first';
  }

  // Static assets (JS, CSS, images): Cache first, then network
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    return 'cache-first';
  }

  // HTML pages: Network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    return 'network-first';
  }

  // Default: Stale while revalidate
  return 'stale-while-revalidate';
}

// Network-first strategy
async function networkFirst(request, cacheName, maxAge) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    return new Response('Hors ligne', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Ressource non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Fetch event - route to appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) protocols
  if (!url.protocol.startsWith('http')) return;

  const strategy = getStrategy(request);

  switch (strategy) {
    case 'network-first':
      event.respondWith(networkFirst(request, API_CACHE, API_CACHE_MAX_AGE));
      break;
    case 'cache-first':
      event.respondWith(cacheFirst(request, STATIC_CACHE));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
      break;
    default:
      event.respondWith(networkFirst(request, DYNAMIC_CACHE, DYNAMIC_CACHE_MAX_AGE));
  }
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-actions') {
    event.waitUntil(syncPendingActions());
  }
});

async function syncPendingActions() {
  // Placeholder for future offline action sync
  console.log('Syncing pending actions...');
}