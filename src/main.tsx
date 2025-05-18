import React, { StrictMode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import UpdateNotification from './components/UpdateNotification';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { reportWebVitals } from './reportWebVitals';
import './index.css';

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

// Initialize the app
function AppWithServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Register service worker
    const register = async () => {
      try {
        // Register service worker
        serviceWorkerRegistration.register({
          onSuccess: (reg) => {
            console.log('ServiceWorker registration successful');
            setRegistration(reg);
          },
          onUpdate: (reg) => {
            console.log('New content is available; please refresh.');
            setUpdateAvailable(true);
            setRegistration(reg);
          },
        });
      } catch (error) {
        console.error('Error during service worker registration:', error);
      }
    };

    // Only register service worker in production
    if (process.env.NODE_ENV === 'production') {
      register();
    }

    // Report web vitals
    if (process.env.NODE_ENV === 'development') {
      reportWebVitals((metric) => {
        console.log('Web Vitals:', metric);
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Send message to service worker to skip waiting and activate
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page once the new service worker is activated
      registration.waiting.addEventListener('statechange', (e) => {
        if ((e.target as ServiceWorker).state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  return (
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <App />
          {updateAvailable && (
            <div style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span>New version available!</span>
              <button 
                onClick={handleUpdate}
                style={{
                  backgroundColor: 'white',
                  color: '#2563eb',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Update
              </button>
            </div>
          )}
          <UpdateNotification />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>
  );
}

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// Render the app
root.render(<AppWithServiceWorker />);

// Report web vitals (optional)
// You can use this to measure performance in your app
function reportWebVitals(metric: any) {
  console.log(metric);
  // You can send these metrics to an analytics service
}
