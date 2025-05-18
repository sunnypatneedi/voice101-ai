import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import the App component without the Router to avoid nesting
const App = require('./App').default;

// Mock the lazy-loaded components
vi.mock('@/pages/Index', () => ({
  default: () => <div>Mock Index Page</div>,
}));

// Mock other components
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="sonner-toaster" />,
}));

vi.mock('@/components/PWAUpdatePrompt', () => ({
  default: () => <div data-testid="pwa-update-prompt" />,
}));

// Mock the usePerformanceMetrics hook
vi.mock('@/hooks/usePerformanceMetrics', () => ({
  usePerformanceMetrics: () => ({
    measurePageView: vi.fn(),
  }),
}));

// Mock the lazy-loaded components
vi.mock('@/pages/Index', () => ({
  default: () => <div>Mock Index Page</div>,
}));

// Mock the Toaster component
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

// Mock the Sonner Toaster
vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="sonner-toaster" />,
}));

// Mock the TooltipProvider
vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
}));

// Mock the PWAUpdatePrompt
vi.mock('@/components/PWAUpdatePrompt', () => ({
  default: () => <div data-testid="pwa-update-prompt" />,
}));

// Mock the usePerformanceMetrics hook
vi.mock('@/hooks/usePerformanceMetrics', () => ({
  usePerformanceMetrics: () => ({
    measurePageView: vi.fn(),
  }),
}));

// Create a test-utils file to wrap components with necessary providers
const TestProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  const renderApp = () => {
    return render(
      <TestProviders>
        <App />
      </TestProviders>
    );
  };

  it('shows loading spinner initially', async () => {
    renderApp();
    
    // Check for loading spinner
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-busy', 'true');
    
    // Verify the loading spinner has the correct ARIA attributes
    const loaderIcon = spinner.querySelector('.animate-spin');
    expect(loaderIcon).toBeInTheDocument();
    
    // Wait for the app to finish loading
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('renders the app after loading', async () => {
    renderApp();
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check if the app content is rendered
    expect(screen.getByText('Mock Index Page')).toBeInTheDocument();
  });

  it('handles errors in the error boundary', async () => {
    // Store the original implementation
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Mock the Index component to throw an error
    const mockError = new Error('Test error');
    const mockIndex = await import('@/pages/Index');
    const originalIndex = mockIndex.default;
    
    try {
      // Replace the default export with a function that throws
      mockIndex.default = () => {
        throw mockError;
      };
      
      renderApp();
      
      // Wait for the error boundary to catch the error
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
      
      // Verify the error message is displayed
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
      
      // Verify the try again button is present
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
      
      // Test the try again functionality
      mockIndex.default = () => <div>Recovered Page</div>;
      
      await act(async () => {
        tryAgainButton.click();
      });
      
      // Verify the app recovered
      await waitFor(() => {
        expect(screen.getByText('Recovered Page')).toBeInTheDocument();
      });
    } finally {
      // Restore the original implementation
      if (originalIndex) {
        mockIndex.default = originalIndex;
      }
      console.error = originalConsoleError;
    }
  });
});
