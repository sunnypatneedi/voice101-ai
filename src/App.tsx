
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FoundationalTerms from "./pages/FoundationalTerms";
import AdvancedConcepts from "./pages/AdvancedConcepts";
import TermDetail from "./pages/TermDetail";
import FAQ from "./pages/FAQ";
import { Loader2 } from 'lucide-react';

// Lazy load the SimulatorStudio component
const SimulatorStudio = lazy(() => import("./pages/SimulatorStudio"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/foundational-terms" element={<FoundationalTerms />} />
          <Route path="/advanced-concepts" element={<AdvancedConcepts />} />
          <Route path="/term/:category/:id" element={<TermDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/simulator-studio/*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SimulatorStudio />
            </Suspense>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
