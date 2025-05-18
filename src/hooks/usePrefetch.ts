import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type PrefetchOptions = {
  priority?: boolean;
};

export function usePrefetch(path: string, options: PrefetchOptions = {}) {
  const navigate = useNavigate();
  
  // In React Router v6, prefetching is handled automatically
  // This hook is kept for API compatibility
  const prefetch = () => {
    // No-op in React Router v6 as it handles prefetching automatically
  };
  
  useEffect(() => {
    // No-op in React Router v6
  }, [path, options.priority]);
  
  return { prefetch };
}

// Usage example:
// const { prefetch } = usePrefetch('/some-route');
// <Link href="/some-route" onMouseEnter={prefetch}>
//   Prefetch on hover
// </Link>
