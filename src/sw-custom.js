// Custom service worker for Voice101
// This service worker works alongside Workbox for better caching

// Import Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Set workbox config
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'https://storage.googleapis.com/workbox-cdn/releases/7.0.0/'
});

// Cache name
const CACHE_NAME = 'voice101-v1';
const CACHE_NAME_PREFIX = 'voice101';

// Disable workbox logs in production
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.warn);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  /^https?:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE_NAME_PREFIX}-google-fonts-stylesheets`,
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year
workbox.routing.registerRoute(
  /^https?:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_NAME_PREFIX}-google-fonts-webfonts`,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200], // Cache opaque responses too
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);

// Cache images with a cache-first strategy
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_NAME_PREFIX}-images`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache JavaScript and CSS files with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE_NAME_PREFIX}-static-resources`,
  })
);

// Cache API responses with a network-first strategy
workbox.routing.registerRoute(
  /\/api\//,
  new workbox.strategies.NetworkFirst({
    cacheName: `${CACHE_NAME_PREFIX}-api-responses`,
    networkTimeoutSeconds: 10,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Use a stale-while-revalidate strategy for all other requests
workbox.routing.setDefaultHandler(
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE_NAME_PREFIX}-default`,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Clean up old caches during service worker activation
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [
    CACHE_NAME,
    `${CACHE_NAME_PREFIX}-google-fonts-stylesheets`,
    `${CACHE_NAME_PREFIX}-google-fonts-webfonts`,
    `${CACHE_NAME_PREFIX}-images`,
    `${CACHE_NAME_PREFIX}-static-resources`,
    `${CACHE_NAME_PREFIX}-api-responses`,
    `${CACHE_NAME_PREFIX}-default`
  ];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Skip waiting and claim clients
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle fetch events with Workbox
workbox.routing.setCatchHandler(({ event }) => {
  // Handle failed requests (e.g., show a custom offline page)
  if (event.request.destination === 'document') {
    return caches.match('/offline.html');
  }
  return Response.error();
});

// Handle navigation requests for SPA
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try to fetch from network first
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // If network fails, return the cached index.html
          const cache = await caches.open(CACHE_NAME);
          return cache.match('/index.html');
        }
      })()
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        
        // If the response is valid, cache it
        if (networkResponse && networkResponse.status === 200) {
          // Don't cache API responses
          if (!event.request.url.includes('/api/')) {
            cache.put(event.request, networkResponse.clone());
          }
        }
        
        return networkResponse;
      } catch (error) {
        // If both cache and network fail, return a fallback response
        return new Response('Offline - No internet connection', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});
