import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import UpdateNotification from './components/UpdateNotification';
import { useServiceWorker } from './hooks/useServiceWorker';
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

// Main App Wrapper Component
const AppContent = () => {
  // Initialize service worker
  useServiceWorker();
  
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <App />
          <UpdateNotification />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
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
