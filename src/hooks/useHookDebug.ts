import { useEffect, useRef, useDebugValue } from 'react';

type HookType = 
  | 'useState'
  | 'useEffect'
  | 'useContext'
  | 'useReducer'
  | 'useCallback'
  | 'useMemo'
  | 'useRef'
  | 'useImperativeHandle'
  | 'useLayoutEffect'
  | 'useDebugValue'
  | 'useDeferredValue'
  | 'useTransition'
  | 'useId'
  | 'useSyncExternalStore'
  | 'useInsertionEffect';

interface HookCall {
  type: HookType;
  timestamp: number;
  stackTrace?: string;
  componentName?: string;
  customData?: any;
}

interface HookDebugOptions {
  /** Enable/disable debugging */
  enabled?: boolean;
  /** Log hook calls to console */
  logCalls?: boolean;
  /** Component name for better debugging */
  componentName?: string;
  /** Custom data to include with hook calls */
  customData?: any;
}

interface HookDebugResult {
  /** Get all hook calls */
  getHookCalls: () => HookCall[];
  /** Reset hook call tracking */
  reset: () => void;
  /** Get hook call count by type */
  getHookCounts: () => Record<HookType, number>;
  /** Get performance metrics for hook calls */
  getPerformanceMetrics: () => {
    totalHookCalls: number;
    averageHookTime: number;
    hookTimings: Record<string, number>;
  };
}

const hookCallTimings: Record<string, number> = {};

/**
 * Hook that helps debug and track React hook usage
 */
export function useHookDebug(options: HookDebugOptions = {}): HookDebugResult {
  const { 
    enabled = process.env.NODE_ENV === 'development',
    logCalls = false,
    componentName = 'Unknown',
    customData,
  } = options;

  const hookCalls = useRef<HookCall[]>([]);
  const hookCounts = useRef<Record<HookType, number>>(
    {} as Record<HookType, number>
  );
  const hookTimers = useRef<Record<number, { start: number; type: HookType }>>({});
  const timerId = useRef(0);

  // Track hook calls in development
  if (enabled) {
    const originalHooks = new Map<HookType, any>();
    
    // Only patch hooks once
    if (Object.keys(originalHooks).length === 0) {
      // Patch React.useState
      if (!originalHooks.has('useState')) {
        const originalUseState = React.useState;
        originalHooks.set('useState', originalUseState);
        
        // @ts-ignore
        React.useState = function patchedUseState(initialState) {
          trackHookCall('useState');
          return originalUseState(initialState);
        };
      }

      // Patch React.useEffect
      if (!originalHooks.has('useEffect')) {
        const originalUseEffect = React.useEffect;
        originalHooks.set('useEffect', originalUseEffect);
        
        // @ts-ignore
        React.useEffect = function patchedUseEffect(create, deps) {
          trackHookCall('useEffect');
          return originalUseEffect(create, deps);
        };
      }
      
      // Patch other hooks similarly...
    }
  }


  // Track a hook call
  function trackHookCall(hookType: HookType, data?: any) {
    if (!enabled) return;
    
    const id = timerId.current++;
    const startTime = performance.now();
    
    // Store timer for this hook call
    hookTimers.current[id] = { start: startTime, type: hookType };
    
    // Update hook count
    hookCounts.current[hookType] = (hookCounts.current[hookType] || 0) + 1;
    
    // Get stack trace (excluding this function)
    let stackTrace: string | undefined;
    if (logCalls) {
      try {
        const error = new Error();
        stackTrace = error.stack?.split('\n').slice(3).join('\n');
      } catch (e) {
        // Ignore errors getting stack trace
      }
    }
    
    // Create hook call record
    const hookCall: HookCall = {
      type: hookType,
      timestamp: startTime,
      stackTrace,
      componentName,
      customData: data || customData,
    };
    
    hookCalls.current.push(hookCall);
    
    if (logCalls) {
      console.log(`[${componentName}] ${hookType} called`, hookCall);
    }
    
    // Return cleanup function to measure duration
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Record timing
      const timingKey = `${hookType}-${componentName}`;
      hookCallTimings[timingKey] = (hookCallTimings[timingKey] || 0) + duration;
      
      // Clean up timer
      delete hookTimers.current[id];
    };
  }
  
  // Debug information
  useDebugValue(`Hooks called: ${Object.entries(hookCounts.current)
    .map(([hook, count]) => `${hook}(${count})`)
    .join(', ')}`
  );
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (enabled && logCalls) {
        console.log(`[${componentName}] Hook calls:`, hookCalls.current);
      }
    };
  }, [enabled, logCalls, componentName]);
  
  return {
    /**
     * Get all hook calls made by this component
     */
    getHookCalls: () => [...hookCalls.current],
    
    /**
     * Reset the hook call tracking
     */
    reset: () => {
      hookCalls.current = [];
      hookCounts.current = {} as Record<HookType, number>;
    },
    
    /**
     * Get hook call counts by type
     */
    getHookCounts: () => ({ ...hookCounts.current }),
    
    /**
     * Get performance metrics for hook calls
     */
    getPerformanceMetrics: () => {
      const totalHookCalls = hookCalls.current.length;
      const totalTime = Object.values(hookCallTimings).reduce((sum, time) => sum + time, 0);
      const averageHookTime = totalHookCalls > 0 ? totalTime / totalHookCalls : 0;
      
      return {
        totalHookCalls,
        averageHookTime,
        hookTimings: { ...hookCallTimings },
      };
    },
  };
}

/**
 * Custom hook to track a specific hook's usage
 */
export function useTrackHook<T extends (...args: any[]) => any>(
  hook: T,
  hookName: string,
  options: HookDebugOptions = {}
): T {
  const { enabled = true, logCalls = false } = options;
  const hookDebug = useHookDebug({
    ...options,
    componentName: options.componentName || `useTrackHook(${hookName})`,
  });
  
  if (!enabled) {
    return hook;
  }
  
  return ((...args: Parameters<T>) => {
    const cleanup = hookDebug.trackHookCall(hookName as HookType, { args });
    const result = hook(...args);
    
    // If the hook returns a cleanup function, wrap it
    if (typeof result === 'function') {
      return () => {
        cleanup?.();
        return result();
      };
    }
    
    return result;
  }) as T;
}

/**
 * Higher-order component that adds hook debugging
 */
export function withHookDebug<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: HookDebugOptions = {}
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const DebugComponent: React.FC<P> = (props) => {
    useHookDebug({ 
      ...options, 
      componentName: displayName 
    });
    
    return <WrappedComponent {...props} />;
  };
  
  DebugComponent.displayName = `withHookDebug(${displayName})`;
  
  return DebugComponent;
}

// Export a hook that can be used to test hook execution order
export function useHookOrderTest() {
  const hookCalls = useRef<string[]>([]);
  
  const trackHook = (hookName: string) => {
    hookCalls.current.push(hookName);
  };
  
  const getHookOrder = () => [...hookCalls.current];
  
  const reset = () => {
    hookCalls.current = [];
  };
  
  return {
    trackHook,
    getHookOrder,
    reset,
  };
}
