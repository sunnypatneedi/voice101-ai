import React, { StrictMode, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { register } from './service-worker-registration';

// Import web-vitals to monitor Core Web Vitals metrics
import { onCLS, onFID, onLCP } from 'web-vitals/attribution';

/**
 * Polyfill for requestIdleCallback and cancelIdleCallback
 */
type RequestIdleCallbackHandle = number;
type RequestIdleCallbackOptions = {
  timeout?: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

// Add TypeScript declaration for requestIdleCallback
declare global {
  interface Window {
    requestIdleCallback: (callback: (deadline: RequestIdleCallbackDeadline) => void, opts?: RequestIdleCallbackOptions) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}

/**
 * Implementation of requestIdleCallback with fallback to setTimeout
 */
const requestIdleCallbackShim = (callback: (deadline: RequestIdleCallbackDeadline) => void, options?: RequestIdleCallbackOptions): RequestIdleCallbackHandle => {
  const start = Date.now();
  return window.setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, options?.timeout || 1);
};

// Use requestIdleCallback if available, otherwise use polyfill
const scheduleIdle = window.requestIdleCallback || requestIdleCallbackShim;

/**
 * Load non-critical CSS asynchronously to avoid render blocking
 * This improves initial load performance by deferring non-essential styles
 * @param href URL of the stylesheet to load
 */
function loadNonCriticalCSS(href: string): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('as', 'style');
  link.setAttribute('media', 'print'); // Load with low priority
  link.setAttribute('onload', "this.media='all'"); // Once loaded, apply to all media
  document.head.appendChild(link);
}

// Defer loading of non-critical resources until after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Report Core Web Vitals with proper attribution for analysis
    if (process.env.NODE_ENV === 'production') {
      // Sample only 25% of users for analytics
      if (Math.random() < 0.25) {
        setTimeout(() => {
          onCLS((metric) => {
            console.log('CLS:', metric.value);
          });
          onFID((metric) => {
            console.log('FID:', metric.value);
          });
          onLCP((metric) => {
            console.log('LCP:', metric.value);
          });
        }, 3000); // Delay reporting to prioritize initial rendering
      }
    }
    
    // Load font CSS asynchronously after initial render is complete
    scheduleIdle(() => {
      loadNonCriticalCSS('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');
      loadNonCriticalCSS('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    }, { timeout: 1000 });
  }, { once: true }); // Use { once: true } to auto-cleanup the event listener
}

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
        }}>
          <h1 style={{ color: '#dc2626' }}>Something went wrong</h1>
          <p style={{ margin: '1rem 0' }}>
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              marginRight: '0.5rem',
            }}
          >
            Refresh Page
          </button>
          {this.state.error && (
            <details style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.375rem',
              color: '#991b1b',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              textAlign: 'left',
              overflowX: 'auto',
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Error Details</summary>
              <div style={{ marginTop: '0.5rem' }}>{this.state.error.message}</div>
              {this.state.error.stack && (
                <pre style={{
                  marginTop: '0.5rem',
                  color: '#7f1d1d',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.8em',
                  overflowX: 'auto',
                }}>
                  {this.state.error.stack}
                </pre>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root
const root = createRoot(rootElement);

// Register service worker
const onUpdate = (registration: ServiceWorkerRegistration) => {
  const waitingServiceWorker = registration.waiting;
  if (waitingServiceWorker) {
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
};

// Register service worker in production
if (process.env.NODE_ENV === 'production') {
  register({ onUpdate });
}

// Render the app
root.render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);

// Report web vitals (optional)
// You can use this to measure performance in your app
function reportWebVitals(metric: any) {
  console.log(metric);
  // You can send these metrics to an analytics service
}
