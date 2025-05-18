import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { RotateCw as ReloadIcon } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
  resetKeys?: any[];
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  lastResetTime: number;
}

/**
 * A reusable error boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * Enhanced with performance monitoring and recovery options.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static defaultProps: Partial<ErrorBoundaryProps> = {
    componentName: 'UnknownComponent',
    fallback: null,
  };

  private resetTimeout: NodeJS.Timeout | null = null;
  private errorReported = false;
  private static lastResetKeys: any[] = [];

  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    lastResetTime: Date.now(),
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { 
      hasError: true, 
      error,
      lastResetTime: Date.now(),
    };
  }

  public static getDerivedStateFromProps(
    nextProps: ErrorBoundaryProps,
    prevState: ErrorBoundaryState
  ): Partial<ErrorBoundaryState> | null {
    // Reset error boundary when resetKeys change
    if (
      nextProps.resetKeys && 
      prevState.lastResetTime < Date.now() - 1000 && // Prevent rapid resets
      !this.arraysEqual(nextProps.resetKeys, ErrorBoundary.lastResetKeys)
    ) {
      return { 
        hasError: false, 
        error: null, 
        errorInfo: null,
        lastResetTime: Date.now(),
      };
    }
    return null;
  }

  private static arraysEqual(a: any[] = [], b: any[] = []): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Prevent duplicate error reporting
    if (this.errorReported) return;
    this.errorReported = true;

    // Log the error to an error reporting service
    const errorContext = {
      component: this.props.componentName,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    };

    console.error('[ErrorBoundary] Caught error:', error, errorContext);
    
    // Report to error tracking service if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: errorContext });
    }

    // Store error info in state
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (e) {
        console.error('Error in onError handler:', e);
      }
    }
  }

  public componentDidUpdate() {
    // Update lastResetKeys when resetKeys prop changes
    if (this.props.resetKeys) {
      ErrorBoundary.lastResetKeys = this.props.resetKeys;
    }
  }

  public componentWillUnmount() {
    // Clear any pending timeouts
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }
  }

  private handleReset = () => {
    this.errorReported = false;
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      lastResetTime: Date.now(),
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private renderDefaultFallback() {
    const { error, errorInfo } = this.state;
    const componentStack = errorInfo?.componentStack;
    const errorMessage = error?.toString() || 'Unknown error occurred';

    return (
      <div 
        className="p-6 max-w-3xl mx-auto my-8 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg 
              className="h-5 w-5 text-red-600 dark:text-red-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Something went wrong
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p className="font-mono text-sm bg-red-100 dark:bg-red-900 p-2 rounded overflow-x-auto">
                {errorMessage}
              </p>
              {componentStack && (
                <details className="mt-3">
                  <summary className="text-sm font-medium cursor-pointer text-red-700 dark:text-red-300">
                    Component Stack
                  </summary>
                  <pre className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded overflow-x-auto text-xs">
                    {componentStack}
                  </pre>
                </details>
              )}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                className="bg-white dark:bg-gray-800 border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/50"
              >
                <ReloadIcon className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public render() {
    if (this.state.hasError) {
      // Use the provided fallback or the default one
      return this.props.fallback || this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
