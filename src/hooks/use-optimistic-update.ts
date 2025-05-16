import { useState, useCallback } from 'react';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  rollbackOnError?: boolean;
}

/**
 * A hook to handle optimistic updates in React components
 * @param asyncFn The async function to execute
 * @param options Configuration options
 * @returns An object containing the execute function and pending state
 */
export function useOptimisticUpdate<T, Args extends any[] = any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (optimisticUpdate: () => void, ...args: Args): Promise<T | void> => {
      setIsPending(true);
      setError(null);
      
      // Store the current state for potential rollback
      let shouldRollback = false;
      let rollback: (() => void) | null = null;
      
      try {
        // Apply optimistic update
        optimisticUpdate();
        
        // Execute the async operation
        const result = await asyncFn(...args);
        
        // Call success callback if provided
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);
        
        // Call error callback if provided
        if (options.onError) {
          options.onError(error);
        }
        
        // Rollback if configured to do so
        if (options.rollbackOnError !== false && rollback) {
          rollback();
        }
        
        // Re-throw the error for error boundaries or try/catch
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [asyncFn, options]
  );

  return { execute, isPending, error };
}

/**
 * A higher-order function to create an optimistic update handler
 * @param updateFn The function that performs the optimistic update
 * @param asyncFn The async function to execute
 * @param options Configuration options
 * @returns A function that can be called to execute the optimistic update
 */
export function withOptimisticUpdate<T, Args extends any[] = any[]>(
  updateFn: () => void,
  asyncFn: (...args: Args) => Promise<T>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const { execute, isPending, error } = useOptimisticUpdate(asyncFn, options);
  
  return {
    execute: (...args: Args) => execute(updateFn, ...args),
    isPending,
    error
  };
}
