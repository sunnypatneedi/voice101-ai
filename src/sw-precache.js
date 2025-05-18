// Custom service worker logic to handle cache conflicts
export const onPrecachingComplete = (precacheEntries) => {
  // Clean up any duplicate cache entries
  const seen = new Map();
  const cleanedEntries = [];

  for (const entry of precacheEntries) {
    // Remove query parameters for comparison
    const url = new URL(entry.url, self.location.origin);
    const cleanUrl = `${url.origin}${url.pathname}`;
    
    // If we haven't seen this URL before, add it to the cleaned entries
    if (!seen.has(cleanUrl)) {
      seen.set(cleanUrl, true);
      cleanedEntries.push(entry);
    }
  }

  return cleanedEntries;
};

// Custom fetch handler to handle navigation requests
export const onFetch = (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle navigation requests for SPA
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          return await fetch(event.request);
        } catch (error) {
          return caches.match('/index.html');
        }
      })()
    );
    return;
  }

  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
};
