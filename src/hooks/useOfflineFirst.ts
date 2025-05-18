import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

type QueryKey = readonly unknown[];

interface OfflineFirstOptions<TData, TError> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  initialData?: TData;
  enabled?: boolean;
  staleTime?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: (data?: TData | null, error?: TError | null) => void;
}

export function useOfflineFirst<TData = boolean, TError = Error>({
  queryKey = ['offline-status'],
  queryFn = async () => !navigator.onLine as unknown as TData,
  initialData = false as unknown as TData,
  enabled = true,
  staleTime = 0,
  onSuccess,
  onError,
  onSettled,
}: Partial<OfflineFirstOptions<TData, TError>> = {}): UseQueryResult<TData, TError> & {
  isOffline: boolean;
  updateCache: (updater: (oldData: TData | undefined) => TData) => void;
} {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const queryClient = useQueryClient();

  // Update online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get data from cache first, then fetch if needed
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      // Try to get data from cache first
      const cachedData = queryClient.getQueryData<TData>(queryKey);
      if (cachedData) {
        return cachedData;
      }

      // If no cache and we're offline, return initialData or throw
      if (isOffline) {
        if (initialData) return initialData;
        throw new Error('No cached data available and offline');
      }

      // Otherwise fetch fresh data
      return queryFn();
    },
    enabled,
    staleTime,
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (cacheTime was renamed to gcTime in v5)
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: isOffline ? 0 : 3,
  });

  // Call the callbacks manually
  useEffect(() => {
    if (data !== undefined && onSuccess) {
      onSuccess(data);
    }
  }, [data, onSuccess]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (onSettled && (data !== undefined || error)) {
      onSettled(data || null, error || null);
    }
  }, [data, error, onSettled]);

  // Function to manually update the cache
  const updateCache = useCallback(
    (updater: (oldData: TData | undefined) => TData) => {
      queryClient.setQueryData(queryKey, updater);
    },
    [queryClient, queryKey]
  );

  const queryResult = { data, error, isLoading, isError, isFetching, refetch };

  return {
    ...queryResult,
    isOffline,
    updateCache,
  } as unknown as UseQueryResult<TData, TError> & {
    isOffline: boolean;
    updateCache: (updater: (oldData: TData | undefined) => TData) => void;
  };
}
