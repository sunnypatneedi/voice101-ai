import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
  isSlow: boolean;
  effectiveConnectionType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  saveData: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
  offlineAt: Date | null;
  onlineAt: Date | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<Omit<NetworkStatus, 'isOffline'>>(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlow: false,
    effectiveConnectionType: 'unknown',
    saveData: false,
    lastOnline: null,
    lastOffline: null,
    offlineAt: null,
    onlineAt: typeof navigator !== 'undefined' && navigator.onLine ? new Date() : null,
  }));

  const updateNetworkStatus = useCallback(() => {
    if (typeof navigator === 'undefined') return;

    const isOnline = navigator.onLine;
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    const effectiveType = connection?.effectiveType || 'unknown';
    const saveData = connection?.saveData || false;
    
    // Calculate if connection is slow (2g or slow-2g)
    const isSlow = effectiveType === 'slow-2g' || effectiveType === '2g';

    setStatus(prev => {
      const now = new Date();
      const updates: Partial<typeof status> = {
        isOnline,
        isSlow,
        effectiveConnectionType: effectiveType as NetworkStatus['effectiveConnectionType'],
        saveData,
      };

      // Track when we come online
      if (isOnline && !prev.isOnline) {
        updates.lastOnline = now;
        updates.onlineAt = now;
      }
      
      // Track when we go offline
      if (!isOnline && prev.isOnline) {
        updates.lastOffline = now;
        updates.offlineAt = now;
      }

      return { ...prev, ...updates };
    });
  }, []);

  // Set up event listeners for online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial check
    updateNetworkStatus();

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Clean up
    return () => {
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, [updateNetworkStatus]);

  return {
    ...status,
    isOffline: !status.isOnline,
  };
}

// Helper hook to show a toast when network status changes
export function useNetworkStatusToast() {
  const { isOnline, isSlow } = useNetworkStatus();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'info' | 'warning' | 'error'>('info');

  useEffect(() => {
    if (isOnline) {
      setToastMessage('You are back online');
      setToastType('info');
      setShowToast(true);
      
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setToastMessage('You are currently offline. Some features may be limited.');
      setToastType('warning');
      setShowToast(true);
    }
  }, [isOnline]);

  // Don't show toast on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show toast for offline status after initial load
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    showToast,
    toastMessage,
    toastType,
    isOnline,
    isSlow,
    dismissToast: () => setShowToast(false),
  };
}
