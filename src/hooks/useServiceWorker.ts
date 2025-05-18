import { useEffect } from 'react';

/**
 * Hook to handle service worker updates and registration
 */
export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            type: 'module',
          });

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
              }
            });
          });
        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      };

      // Register service worker after load
      window.addEventListener('load', () => {
        registerServiceWorker();
      });
    }
  }, []);
}

export default useServiceWorker;
