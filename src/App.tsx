
import { Suspense, lazy, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook';
import { ThemeProvider } from "@/components/ui/theme-provider";
import ErrorBoundary from '@/components/ErrorBoundary';
import { CommandPalette } from '@/components/CommandPalette';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load pages
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FoundationalTerms = lazy(() => import('./pages/FoundationalTerms'));
const AdvancedConcepts = lazy(() => import('./pages/AdvancedConcepts'));
const TermDetail = lazy(() => import('./pages/TermDetail'));
const FAQ = lazy(() => import('./pages/FAQ'));
const SimulatorStudio = lazy(() => import('./pages/SimulatorStudio'));

// Loading component for Suspense fallback
const LoadingSpinner = ({ className = "" }) => (
  <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
    <Skeleton className="h-8 w-8 rounded-full" />
  </div>
);

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

// Component to handle route changes and scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Register command palette shortcut
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    setCommandPaletteOpen(true);
  }, { enableOnFormTags: true });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/foundational-terms" element={<FoundationalTerms />} />
                  <Route path="/advanced-concepts" element={<AdvancedConcepts />} />
                  <Route path="/term/:id" element={<TermDetail />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/simulator-studio" element={<SimulatorStudio />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
