/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */

// This variable will be replaced during the build process with the actual precache manifest
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  // Add other static assets you want to precache here
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(
        cachesToDelete.map((cacheToDelete) => {
          return caches.delete(cacheToDelete);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle runtime GET requests for data from the cache first, then network.
  if (event.request.method === 'GET') {
    // For non-API requests, try the cache first, falling back to network
    if (!event.request.url.includes('/api/')) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return caches.open(RUNTIME).then((cache) => {
            return fetch(event.request).then((response) => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    } else {
      // For API requests, try network first, falling back to cache if offline
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // If the response is good, clone it and store it in the cache.
            if (response.status === 200) {
              const responseToCache = response.clone();
              caches.open(RUNTIME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(() => {
            // If the network is unavailable, get the response from the cache.
            return caches.match(event.request).then((response) => {
              if (response) {
                return response;
              }
              // If the request is for an HTML page, return the offline page.
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              return new Response('', { status: 408, statusText: 'Network request failed' });
            });
          })
      );
    }
  }
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Your background sync logic here
      Promise.resolve()
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || 'New notification';
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.data || {},
    // Add more options as needed: actions, tag, renotify, requireInteraction, etc.
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Handle the notification click
  const urlToOpen = new URL('/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
      return null;
    })
  );
});
