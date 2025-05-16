
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Error boundary for the root component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in application:', error);
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Something went wrong</h1>
        <p>We're working on fixing this issue. Please try refreshing the page.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }
};

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root
const root = createRoot(rootElement);

// Render the app with error boundary
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
