import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { QueryClient } from '@tanstack/react-query';
import App from './App';
import { TooltipProvider } from '@/components/ui/tooltip';

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

// Create a test-utils file to wrap components with necessary providers
const TestProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Disable retries for failed queries in tests
        retryDelay: 1,
      },
    },
  });

  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  );
};

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', async () => {
    render(
      <TestProviders>
        <App />
      </TestProviders>
    );
    
    // Check for loading spinner
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-busy', 'true');
    
    // Wait for the app to finish loading
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('renders the app after loading', async () => {
    render(
      <TestProviders>
        <App />
      </TestProviders>
    );
    
    // Wait for the mock Index page to be rendered
    await waitFor(() => {
      expect(screen.getByText('Mock Index Page')).toBeInTheDocument();
    });
    
    // Verify that the app has rendered without errors
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    
    // Verify that the loading spinner is no longer present
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
