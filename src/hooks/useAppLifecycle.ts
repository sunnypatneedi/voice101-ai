import { useState, useEffect, useCallback, useRef } from 'react';
import { usePWA } from '../contexts/PWAContext';

type VisibilityState = 'visible' | 'hidden' | 'prerender' | 'unloaded';

declare global {
  interface WindowEventMap {
    pageshow: PageTransitionEvent;
  }
}

interface AppState {
  isActive: boolean;
  visibilityState: VisibilityState;
  lastActiveTime: number | null;
  lastInactiveTime: number | null;
  sessionStart: number;
}

export function useAppLifecycle() {
  const { isOnline, isUpdateAvailable, reloadToUpdate } = usePWA();
  const [appState, setAppState] = useState<AppState>({
    isActive: true,
    visibilityState: document.visibilityState as VisibilityState,
    lastActiveTime: null,
    lastInactiveTime: null,
    sessionStart: Date.now(),
  });

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    const isVisible = document.visibilityState === 'visible';
    const now = Date.now();
    
    setAppState(prev => ({
      ...prev,
      isActive: isVisible,
      visibilityState: document.visibilityState as VisibilityState,
      lastActiveTime: isVisible ? now : prev.lastActiveTime,
      lastInactiveTime: isVisible ? prev.lastInactiveTime : now,
      sessionStart: isVisible && !prev.isActive ? now : prev.sessionStart,
    }));

    // If coming back to the app after an update was installed, reload
    if (isVisible && isUpdateAvailable) {
      reloadToUpdate();
    }
  }, [isUpdateAvailable, reloadToUpdate]);

  // Handle online/offline changes
  const handleOnline = useCallback(() => {
    // If we come back online and there's an update, check if we should reload
    if (isUpdateAvailable) {
      reloadToUpdate();
    }
  }, [isUpdateAvailable, reloadToUpdate]);

  // Handle page show/hide events (for mobile)
  const handlePageShow = useCallback((event: PageTransitionEvent) => {
    if (event.persisted) {
      // Page was restored from bfcache, check for updates
      window.location.reload();
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('pageshow', handlePageShow as EventListener);

    // Check service worker update on initial load
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.update().catch(console.error);
      });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('pageshow', handlePageShow as EventListener);
    };
  }, [handleOnline, handlePageShow, handleVisibilityChange]);

  // Track time in foreground/background
  useEffect(() => {
    if (!isOnline) return;

    const handleFocus = () => {
      setAppState(prev => ({
        ...prev,
        isActive: true,
        lastActiveTime: Date.now(),
      }));
    };

    const handleBlur = () => {
      setAppState(prev => ({
        ...prev,
        isActive: false,
        lastInactiveTime: Date.now(),
      }));
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isOnline]);

  return {
    ...appState,
    isOnline,
    isOffline: !isOnline,
  };
}

// Hook to run a callback when the app becomes active
export function useOnAppActive(callback: () => void, deps: any[] = []) {
  const { isActive } = useAppLifecycle();
  const wasActive = useRef<boolean>(false);

  useEffect(() => {
    if (isActive && !wasActive.current) {
      callback();
    }
    wasActive.current = isActive;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, ...deps]);

  return null;
}

// Hook to run a callback when the app becomes inactive
export function useOnAppInactive(callback: () => void, deps: any[] = []) {
  const { isActive } = useAppLifecycle();
  const wasInactive = useRef<boolean>(true);

  useEffect(() => {
    if (!isActive && wasInactive.current) {
      callback();
    }
    wasInactive.current = !isActive;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, ...deps]);

  return null;
}
