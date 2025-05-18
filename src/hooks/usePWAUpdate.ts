import { useState, useEffect } from 'react';
import { Workbox, WorkboxLifecycleWaitingEvent } from 'workbox-window';

declare global {
  interface Window {
    workbox?: Workbox;
  }
}

export function usePWAUpdate() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const wb = new Workbox('/service-worker.js');

      const showSkipWaitingPrompt = (event: WorkboxLifecycleWaitingEvent) => {
        setWaitingWorker(event.sw);
        setShowReload(true);
        setIsUpdateAvailable(true);
      };

      const handleExternalWaiting = (event: Event) => {
        const customEvent = event as CustomEvent<{ sw: ServiceWorker }>;
        if (customEvent.detail?.sw) {
          setWaitingWorker(customEvent.detail.sw);
          setShowReload(true);
          setIsUpdateAvailable(true);
        }
      };

      wb.addEventListener('waiting', showSkipWaitingPrompt);
      window.addEventListener('externalwaiting', handleExternalWaiting as EventListener);

      // Check for updates on initial load
      wb.register()
        .then((registration) => {
          if (registration) {
            // Check for updates every hour
            const updateInterval = setInterval(() => {
              registration.update().catch(console.error);
            }, 60 * 60 * 1000);

            return () => clearInterval(updateInterval);
          }
          return undefined;
        })
        .catch(console.error);

      // Clean up event listeners
      return () => {
        wb.removeEventListener('waiting', showSkipWaitingPrompt);
        window.removeEventListener('externalwaiting', handleExternalWaiting as EventListener);
      };
    }
    return undefined;
  }, []);

  const reloadToUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowReload(false);
      window.location.reload();
    }
  };

  return {
    isUpdateAvailable,
    showReload,
    reloadToUpdate,
  };
}
