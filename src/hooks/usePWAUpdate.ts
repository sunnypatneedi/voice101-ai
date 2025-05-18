import { useState, useEffect } from 'react';

declare global {
  interface Window {
    workbox?: {
      addEventListener: (type: string, callback: (event: any) => void) => void;
      register: () => Promise<void>;
      messageSkipWaiting: () => void;
    };
  }
}

export function usePWAUpdate() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const wb = window.workbox;
      
      if (!wb) {
        console.warn('Workbox is not available');
        return;
      }

      const handleWaiting = (event: { sw: ServiceWorker }) => {
        setWaitingWorker(event.sw);
        setShowReload(true);
        setIsUpdateAvailable(true);
      };

      // Listen for the waiting event
      wb.addEventListener('waiting', handleWaiting);

      // Check for updates on initial load
      wb.register()
        .then(() => {
          console.log('Service Worker registered');
        })
        .catch(console.error);

      // Clean up event listener
      return () => {
        // The Vite PWA plugin handles cleanup of its own event listeners
        // No need to manually remove them here
      };
    }
    return undefined;
  }, []);

  const reloadToUpdate = () => {
    if (typeof window !== 'undefined' && window.workbox) {
      // Tell the service worker to skip waiting
      window.workbox.messageSkipWaiting();
      // Reload the page to activate the new service worker
      window.location.reload();
    } else if (waitingWorker) {
      // Fallback for non-Vite PWA plugin environments
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return {
    isUpdateAvailable,
    showReload,
    reloadToUpdate,
  };
}
