import { Suspense, lazy, useCallback, useMemo, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import { Loader2 } from 'lucide-react';
import PWAUpdatePrompt from '@/components/PWAUpdatePrompt';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';

// Lazy load routes
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const FoundationalTerms = lazy(() => import('@/pages/FoundationalTerms'));
const AdvancedConcepts = lazy(() => import('@/pages/AdvancedConcepts'));
const TermDetail = lazy(() => import('@/pages/TermDetail'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const SimulatorStudio = lazy(() => import('@/pages/SimulatorStudio'));

// Error boundary fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div 
    role="alert" 
    className="flex flex-col items-center justify-center min-h-screen p-4 text-center"
  >
    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
    <pre className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-left overflow-auto max-w-full">
      {error.message}
    </pre>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
    >
      Try again
    </button>
  </div>
);

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div 
    className="flex items-center justify-center min-h-screen"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
    <span className="sr-only">Loading...</span>
  </div>
);

// Create query client with default options
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
};

// Component to handle route changes and performance tracking
const AppRoutes = () => {
  const location = useLocation();
  const { measurePageView } = usePerformanceMetrics('AppRoutes');

  // Track page views when location changes
  useEffect(() => {
    measurePageView(location.pathname);
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname, measurePageView]);

  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => [
    { path: "/", element: <Index /> },
    { path: "/foundational-terms", element: <FoundationalTerms /> },
    { path: "/advanced-concepts", element: <AdvancedConcepts /> },
    { path: "/term/:id", element: <TermDetail /> },
    { path: "/faq", element: <FAQ /> },
    { 
      path: "/simulator-studio", 
      element: <SimulatorStudio /> 
    },
    { path: "*", element: <NotFound /> },
  ], []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error) => {
        // Log error to error tracking service
        console.error('App Error Boundary caught an error:', error);
      }}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location}>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
        <PWAUpdatePrompt />
        <Toaster />
        <Sonner />
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  // Memoize query client to prevent recreating it on every render
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
