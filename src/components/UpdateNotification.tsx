import { useEffect, useState } from 'react';
import { usePWAUpdate } from '../hooks/usePWAUpdate';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const UpdateNotification = () => {
  const { showReload, reloadToUpdate, isUpdateAvailable } = usePWAUpdate();
  const isOnline = useOnlineStatus();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show notification with a small delay to prevent flash on page load
  useEffect(() => {
    if (showReload) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showReload]);

  if (!isVisible || !isUpdateAvailable) return null;

  return (
    <div 
      className={`fixed right-4 transition-all duration-300 ease-in-out z-50 ${
        isVisible ? 'bottom-4 opacity-100' : '-bottom-20 opacity-0'
      }`}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-80"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg 
                  className={`h-6 w-6 text-blue-600 dark:text-blue-300 transition-transform duration-300 ${
                    isHovered ? 'animate-bounce' : ''
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Update Available
              </h3>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isOnline ? (
                  <p>A new version is available. Refresh to get the latest features and improvements.</p>
                ) : (
                  <p>New update downloaded. Will be applied when you're back online.</p>
                )}
              </div>
              <div className="mt-3 flex space-x-3">
                <button
                  type="button"
                  disabled={!isOnline}
                  onClick={reloadToUpdate}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Refresh Now
                </button>
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
        {!isOnline && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 text-xs text-yellow-700 dark:text-yellow-400 border-t border-yellow-100 dark:border-yellow-800">
            You're currently offline. The update will be applied when you're back online.
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateNotification;
