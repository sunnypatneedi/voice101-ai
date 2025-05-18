import { useState, useCallback } from 'react';

export function useOptimisticUpdate<T>(
  asyncAction: () => Promise<T>,
  optimisticUpdate: () => T
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Apply optimistic update
    const optimisticResult = optimisticUpdate();
    
    try {
      // Execute the async action
      const result = await asyncAction();
      return result;
    } catch (err) {
      // Revert the optimistic update on error
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncAction, optimisticUpdate]);

  return { execute, isLoading, error };
}
