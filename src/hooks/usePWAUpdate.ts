import { useState, useEffect } from 'react';

type Workbox = {
  addEventListener: (type: string, callback: (event: any) => void) => void;
  removeEventListener?: (type: string, callback: (event: any) => void) => void;
  register: () => Promise<void>;
  messageSkipWaiting: () => void;
};

declare global {
  interface Window {
    workbox?: Workbox;
  }
}

/**
 * Hook to handle PWA updates and show a reload prompt when updates are available
 * @returns Object containing update state and functions to handle the update
 */
export function usePWAUpdate() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip if not in browser environment or service workers aren't supported
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('[usePWAUpdate] Service workers are not supported in this environment');
      return;
    }

    const wb = window.workbox;
    
    if (!wb) {
      const error = new Error('Workbox is not available');
      console.warn('[usePWAUpdate]', error.message);
      setError(error);
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
        console.log('[usePWAUpdate] Service Worker registered');
      })
      .catch((err) => {
        console.error('[usePWAUpdate] Service Worker registration failed:', err);
        setError(err);
      });

    // Clean up event listener
    return () => {
      if (wb && wb.removeEventListener) {
        wb.removeEventListener('waiting', handleWaiting);
      }
    };
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
    error,
  };
}
