import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook';
import { ThemeProvider } from "@/components/ui/theme-provider";
import ErrorBoundary from '@/components/ErrorBoundary';
import { CommandPalette } from '@/components/CommandPalette';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import ReactDebug from '@/components/ReactDebug';

// Type declarations
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

// Configure query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Error boundary for lazy-loaded components
const withSuspense = (Component: React.ComponentType) => (props: any) => (
  <ErrorBoundary 
    fallback={
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    }
  >
    <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
);

// Lazy load pages with error boundaries
const Index = withSuspense(lazy(() => import('./pages/Index')));
const NotFound = withSuspense(lazy(() => import('./pages/NotFound')));
const FoundationalTerms = withSuspense(lazy(() => import('./pages/FoundationalTerms')));
const AdvancedConcepts = withSuspense(lazy(() => import('./pages/AdvancedConcepts')));
const TermDetail = withSuspense(lazy(() => import('./pages/TermDetail')));
const FAQ = withSuspense(lazy(() => import('./pages/FAQ')));
const SimulatorStudio = withSuspense(lazy(() => import('./pages/SimulatorStudio')));

// Loading component for Suspense fallback
const LoadingSpinner = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
    <Skeleton className="h-8 w-8 rounded-full" />
  </div>
);

// Component to handle route changes and scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App component with routing and global error handling
const App: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Handle global errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      toast({
        title: 'An error occurred',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      toast({
        title: 'An error occurred',
        description: event.reason?.message || 'Something went wrong with an asynchronous operation.',
        variant: 'destructive',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [toast]);
  
  // Register command palette shortcut
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    setCommandPaletteOpen(true);
  }, { enableOnFormTags: true });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <ReactDebug />
          <Toaster />
          <Sonner />
          <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/foundational-terms" element={<FoundationalTerms />} />
            <Route path="/advanced-concepts" element={<AdvancedConcepts />} />
            <Route path="/term/:id" element={<TermDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route 
              path="/simulator-studio/*" 
              element={
                <ErrorBoundary 
                  onError={(error: Error) => {
                    console.error('Error in SimulatorStudio:', error);
                    toast({
                      title: 'Failed to load Simulator Studio',
                      description: 'Please try again or contact support if the problem persists.',
                      variant: 'destructive',
                    });
                    return <Navigate to="/" replace />;
                  }}
                >
                  <SimulatorStudio />
                </ErrorBoundary>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Wrapper component to provide error boundary at the top level
const AppWithErrorBoundary: React.FC = () => (
  <ErrorBoundary 
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="mb-4">We're sorry, but an unexpected error occurred.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    }
  >
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
