import { useState, useEffect } from 'react';

interface ServiceWorkerState {
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

// Extend the Window interface to include additional properties
interface Window {
  caches?: CacheStorage;
  location: Location;
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
}

declare const window: Window;

/**
 * Hook to handle service worker updates and registration
 * @returns {ServiceWorkerState} Object containing update status and registration
 */
export function useServiceWorker(): ServiceWorkerState {
  const [state, setState] = useState<ServiceWorkerState>({
    updateAvailable: false,
    registration: null,
  });

  useEffect(() => {
    // Enable in development for testing
    if (import.meta.env.DEV) {
      console.log('[Service Worker] Running in development mode');
    }

    if (!('serviceWorker' in navigator)) {
      console.error('[Service Worker] This browser does not support service workers');
      return;
    }

    // Ensure we're on HTTPS in production
    if (window.location.protocol !== 'https:' && import.meta.env.PROD) {
      console.log('[Service Worker] Service workers require HTTPS in production');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        console.log('[Service Worker] Attempting to register service worker...');
        
        // First, unregister any existing service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          console.log('[Service Worker] Unregistering existing service worker:', registration.scope);
          await registration.unregister();
        }

        // Clear all caches
        if ('caches' in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map(key => caches.delete(key)));
        }

        // Register the service worker
        const swUrl = import.meta.env.DEV ? '/sw.js' : '/sw.js';
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: '/',
          type: import.meta.env.DEV ? 'module' : 'classic',
        });

        console.log('[Service Worker] Registration successful with scope: ', registration.scope);

        // Update state with registration
        setState(prev => ({
          ...prev,
          registration,
        }));

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          console.log('[Service Worker] New service worker found, state:', newWorker.state);
          
          newWorker.addEventListener('statechange', () => {
            console.log('[Service Worker] Service worker state changed:', newWorker.state);
            
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[Service Worker] New content is available; please refresh.');
              setState(prev => ({
                ...prev,
                updateAvailable: true,
              }));
            }
          });
        });

        // Check for updates periodically
        const updateInterval = setInterval(() => {
          console.log('[Service Worker] Checking for updates...');
          registration.update().catch(err => 
            console.error('[Service Worker] Error checking for updates:', err)
          );
        }, 60 * 60 * 1000); // Check every hour

        // Handle controller change (page refresh needed)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[Service Worker] Controller changed, reloading...');
          window.location.reload();
        });

        return () => {
          clearInterval(updateInterval);
          navigator.serviceWorker.removeEventListener('controllerchange', () => {});
        };
      } catch (error) {
        console.error('[Service Worker] Registration failed:', error);
        
        // More detailed error handling
        if (error instanceof Error) {
          if (error.message.includes('missing') || error.message.includes('load')) {
            console.error('[Service Worker] The service worker file could not be loaded. Check the network tab.');
          } else if (error.message.includes('scope')) {
            console.error('[Service Worker] The service worker scope is not allowed.');
          } else {
            console.error('[Service Worker] Unknown error during registration');
          }
        }
      }
    };

    // Register service worker after load
    if (document.readyState === 'complete') {
      registerServiceWorker().catch(console.error);
    } else {
      window.addEventListener('load', () => {
        registerServiceWorker().catch(console.error);
      });
    }
  }, []);

  return state;
}

export default useServiceWorker;
