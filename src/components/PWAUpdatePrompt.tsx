import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Loader2 as ReloadIcon } from 'lucide-react';

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                onSWUpdate(registration);
              }
            });
          }
        });
      });

      let refreshing: boolean;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload();
  };

  if (!showReload) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-full border border-gray-200 dark:border-gray-700">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <ReloadIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              New version available!
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A new version of Voice101 is available. Please reload to update.
            </p>
            <div className="mt-4 flex">
              <div className="flex-1">
                <Button
                  type="button"
                  className="w-full justify-center"
                  onClick={reloadPage}
                >
                  <ReloadIcon className="mr-2 h-4 w-4" />
                  Reload
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PWAUpdatePrompt;
