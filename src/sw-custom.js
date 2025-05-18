// Custom service worker for Voice101
// This service worker handles caching and offline functionality

const CACHE_NAME = 'voice101-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/index-*.js',
  '/assets/vendor-*.js',
  '/assets/App-*.css',
  '/assets/logo-192x192.png',
  '/assets/logo-512x512.png',
  '/favicon.ico',
  '/robots.txt',
  '/apple-touch-icon.png'
];

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle navigation requests for SPA
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
