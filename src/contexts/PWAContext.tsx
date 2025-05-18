import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { usePWAInstallPrompt } from '../hooks/usePWAInstallPrompt';
import { usePWAUpdate } from '../hooks/usePWAUpdate';

interface PWAContextType {
  isOnline: boolean;
  isOffline: boolean;
  isSlow: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isUpdateAvailable: boolean;
  showUpdateNotification: boolean;
  installPWA: () => Promise<boolean>;
  reloadToUpdate: () => void;
  dismissUpdate: () => void;
  effectiveConnectionType: string;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

interface PWAProviderProps {
  children: ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  // Network status
  const { isOnline, isSlow, effectiveConnectionType } = useNetworkStatus();
  
  // PWA installation
  const { isInstallable, isInstalled, promptInstall } = usePWAInstallPrompt();
  
  // PWA updates
  const { showReload, reloadToUpdate, isUpdateAvailable } = usePWAUpdate();
  const [showUpdate, setShowUpdate] = useState(false);
  
  // Handle install prompt
  const handleInstall = async () => {
    if (isInstallable) {
      try {
        const installed = await promptInstall();
        return installed;
      } catch (error) {
        console.error('Error during installation:', error);
        return false;
      }
    }
    return false;
  };
  
  // Handle update notification
  useEffect(() => {
    if (showReload && isUpdateAvailable) {
      setShowUpdate(true);
    }
  }, [showReload, isUpdateAvailable]);
  
  const dismissUpdate = () => {
    setShowUpdate(false);
  };

  const value: PWAContextType = {
    isOnline,
    isOffline: !isOnline,
    isSlow,
    isInstallable: isInstallable && !isInstalled,
    isInstalled,
    isUpdateAvailable,
    showUpdateNotification: showUpdate,
    installPWA: handleInstall,
    reloadToUpdate,
    dismissUpdate,
    effectiveConnectionType: effectiveConnectionType || 'unknown',
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
