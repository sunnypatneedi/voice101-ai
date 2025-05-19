import React, { StrictMode, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import UpdateNotification from './components/UpdateNotification';
import { useServiceWorker } from './hooks/useServiceWorker';
import './index.css';

// Register service worker with proper scope and error handling
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser');
    return;
  }

  try {
    // Unregister any existing service workers first
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      console.log('Unregistering existing service worker:', registration.scope);
      await registration.unregister();
    }

    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    // Register the service worker with the correct scope
    const swUrl = '/sw.js';
    const registration = await navigator.serviceWorker.register(swUrl, { 
      scope: './' // Use relative path for scope
    });

    console.log('Service Worker registered with scope:', registration.scope);

    // Check for updates
    if (registration.waiting) {
      console.log('Service Worker is waiting to activate');
      return;
    }

    // Track updates
    if (registration.installing) {
      console.log('Service Worker is installing');
      registration.installing.addEventListener('statechange', (e) => {
        console.log('Service Worker state changed:', (e.target as ServiceWorker).state);
      });
      return;
    }

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      console.log('New Service Worker found, installing...');
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          console.log('New Service Worker state:', newWorker.state);
        });
      }
    });

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Controller changed, reloading...');
      window.location.reload();
    });

    // Check if the service worker is controlling the page
    if (navigator.serviceWorker.controller) {
      console.log('Service Worker is controlling the page');
    } else {
      console.log('Service Worker is not controlling the page');
    }
  } catch (error) {
    console.error('Error during service worker registration:', error);
  }
};

// Register service worker when the app loads in production
if (process.env.NODE_ENV === 'production' && window.location.protocol === 'https:') {
  // Wait for the page to be fully loaded before registering the service worker
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
} else if (process.env.NODE_ENV === 'development') {
  console.log('Service Worker registration is disabled in development mode');
}

// Debug component to track React in component context
const ReactDebug = () => {
  useEffect(() => {
    console.log('[DIAGNOSTIC] React version in component:', React.version);
    console.log('[DIAGNOSTIC] React.useEffect in component:', React.useEffect);
  }, []);
  return null;
};

// Simple loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem',
      }}></div>
      <p>Loading Voice101...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

// Error boundary for the root component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6',
        }}>
          <h1>Something went wrong.</h1>
          <p>We're sorry for the inconvenience. The application has encountered an error.</p>
          {this.state.error && (
            <div style={{ marginTop: '1rem' }}>
              <details>
                <summary>Error details</summary>
                <pre style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflowX: 'auto',
                  marginTop: '0.5rem',
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return (
      <>
        {this.props.children}
        <UpdateNotification />
      </>
    );
  }
}

// Main App Wrapper Component
const AppContent = () => {
  console.log('[DIAGNOSTIC] AppContent rendering');
  const { updateAvailable } = useServiceWorker();
  
  return (
    <>
      <ReactDebug />
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <App />
            {updateAvailable && <UpdateNotification />}
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  );
};

// Root Component
const Root = () => (
  <StrictMode>
    <AppContent />
  </StrictMode>
);

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create and render the root
const root = createRoot(rootElement);
root.render(<Root />);

// Web vitals reporting is handled by the Vite PWA plugin
