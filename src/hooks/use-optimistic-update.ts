import { useState, useCallback, useRef } from 'react';

/**
 * Options for configuring the optimistic update behavior
 * @template T The type of the async function's return value
 */
interface OptimisticUpdateOptions<T> {
  /**
   * Callback called when the async operation succeeds
   * @param data The result of the async operation
   */
  onSuccess?: (data: T) => void;
  
  /**
   * Callback called when the async operation fails
   * @param error The error that occurred
   * @param rollback A function to manually trigger rollback
   */
  onError?: (error: Error, rollback: () => void) => void;
  
  /**
   * Whether to automatically rollback on error (default: true)
   */
  rollbackOnError?: boolean;
  
  /**
   * Custom error message for the error boundary
   */
  errorMessage?: string;
}

/**
 * A hook to handle optimistic updates in React components
 * @param asyncFn The async function to execute
 * @param options Configuration options
 * @returns An object containing the execute function and pending state
 */
/**
 * A hook to handle optimistic updates in React components
 * @template T The type of the async function's return value
 * @template Args The argument types of the async function (defaults to any[])
 * @param asyncFn The async function to execute
 * @param options Configuration options for the optimistic update
 * @returns An object containing the execute function and state
 */
export function useOptimisticUpdate<T, Args extends any[] = any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const rollbackRef = useRef<(() => void) | null>(null);

  /**
   * Executes the optimistic update pattern
   * @param optimisticUpdate Function that applies the optimistic update
   * @param rollback Function to revert the optimistic update (optional)
   * @param args Arguments to pass to the async function
   * @returns Promise that resolves with the result of the async function
   */
  const execute = useCallback(
    async (
      optimisticUpdate: () => void,
      rollback?: () => void,
      ...args: Args
    ): Promise<T> => {
      setIsPending(true);
      setError(null);
      
      // Store the rollback function for potential use
      rollbackRef.current = rollback || null;
      
      try {
        // Apply optimistic update
        optimisticUpdate();
        
        // Execute the async operation
        const result = await asyncFn(...args);
        
        // Clear the rollback ref on success
        rollbackRef.current = null;
        
        // Call success callback if provided
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err instanceof Error 
          ? err 
          : new Error(options.errorMessage || 'An unknown error occurred');
        
        setError(error);
        
        // Get current rollback function before potential execution
        const currentRollback = rollbackRef.current;
        
        // Define rollback function to pass to onError
        const performRollback = () => {
          if (currentRollback) {
            currentRollback();
            rollbackRef.current = null;
          }
        };
        
        // Call error callback if provided
        if (options.onError) {
          options.onError(error, performRollback);
        }
        
        // Auto-rollback if configured to do so and we have a rollback function
        if (options.rollbackOnError !== false && currentRollback) {
          performRollback();
        }
        
        // Re-throw the error for error boundaries or try/catch
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [asyncFn, options]
  );

  return { 
    /**
     * Execute the optimistic update
     * @param optimisticUpdate Function that applies the optimistic update
     * @param rollback Optional function to revert the optimistic update
     * @param args Arguments to pass to the async function
     */
    execute,
    /** Whether the async operation is in progress */
    isPending,
    /** The error that occurred, if any */
    error,
    /** Manually trigger rollback if needed */
    rollback: () => {
      if (rollbackRef.current) {
        rollbackRef.current();
        rollbackRef.current = null;
      }
    }
  };
}

/**
 * A higher-order function to create an optimistic update handler
 * @param updateFn The function that performs the optimistic update
 * @param asyncFn The async function to execute
 * @param options Configuration options
 * @returns A function that can be called to execute the optimistic update
 */
/**
 * A higher-order function to create an optimistic update handler
 * @template T The type of the async function's return value
 * @template Args The argument types of the async function
 * @param updateFn The function that performs the optimistic update
 * @param rollbackFn Optional function to revert the optimistic update
 * @param asyncFn The async function to execute
 * @param options Configuration options
 * @returns An object with the execute function and state
 */
export function withOptimisticUpdate<T, Args extends any[] = any[]>(
  updateFn: () => void,
  rollbackFn?: () => void,
  asyncFn?: (...args: Args) => Promise<T>,
  options: OptimisticUpdateOptions<T> = {}
) {
  // If asyncFn is not provided, assume the first two params are update and rollback
  const actualAsyncFn = asyncFn || (updateFn as unknown as (...args: Args) => Promise<T>);
  const actualUpdateFn = asyncFn ? updateFn : (() => {});
  
  const { execute, isPending, error, rollback } = useOptimisticUpdate(actualAsyncFn, options);
  
  return {
    /**
     * Execute the optimistic update with the provided arguments
     */
    execute: async (...args: Args) => {
      return execute(actualUpdateFn, rollbackFn, ...args);
    },
    /** Whether the async operation is in progress */
    isPending,
    /** The error that occurred, if any */
    error,
    /** Manually trigger rollback if needed */
    rollback
  };
}
