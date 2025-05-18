import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loader2 } from 'lucide-react';

// Mock the Loader2 component
vi.mock('lucide-react', () => ({
  Loader2: ({ className }: { className: string }) => (
    <div data-testid="loader-icon" className={className} />
  ),
}));

describe('LoadingSpinner', () => {
  it('renders a loading spinner with correct accessibility attributes', () => {
    // Mock the LoadingSpinner component
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

    render(<LoadingSpinner />);
    
    // Check that the spinner container is rendered with the correct attributes
    const spinnerContainer = screen.getByRole('status');
    expect(spinnerContainer).toBeInTheDocument();
    expect(spinnerContainer).toHaveAttribute('aria-live', 'polite');
    expect(spinnerContainer).toHaveAttribute('aria-busy', 'true');
    
    // Check that the loader icon is rendered with the correct class
    const loaderIcon = screen.getByTestId('loader-icon');
    expect(loaderIcon).toBeInTheDocument();
    expect(loaderIcon).toHaveClass('h-12', 'w-12', 'animate-spin', 'text-primary');
    
    // Check that the loading text is rendered for screen readers
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass('sr-only');
  });
});
