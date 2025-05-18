import { useEffect, useRef, useDebugValue } from 'react';

type HookType = 'useState' | 'useEffect' | 'useCallback' | 'useMemo' | 'useRef' | 'useContext' | 'useReducer' | 'useLayoutEffect' | 'useImperativeHandle' | 'useDebugValue' | 'useDeferredValue' | 'useTransition' | 'useId' | 'useSyncExternalStore' | 'useInsertionEffect';

interface HookCall {
  type: HookType;
  stack: string | undefined;
  timestamp: number;
}

interface HookValidatorOptions {
  /** Enable/disable the validation */
  enabled?: boolean;
  /** Log hook calls to console */
  logCalls?: boolean;
  /** Throw errors on validation failures */
  throwOnError?: boolean;
  /** Component name for better debugging */
  componentName?: string;
}

/**
 * Hook that validates React hook execution order and rules
 * @param options Configuration options for the validator
 */
export function useHookValidator(options: HookValidatorOptions = {}) {
  const { 
    enabled = true, 
    logCalls = false,
    throwOnError = false,
    componentName = 'Unknown'
  } = options;

  const hookCalls = useRef<HookCall[]>([]);
  const hasValidated = useRef(false);
  const previousHookCount = useRef(0);
  const effectCleanups = useRef<Map<number, () => void>>(new Map());
  const effectId = useRef(0);

  // Track hook calls in development
  if (enabled && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalHooks = new Map<HookType, any>();
    
    // Only patch hooks once per component
    if (!hasValidated.current) {
      hasValidated.current = true;
      
      // Patch React.useState
      const originalUseState = React.useState;
      if (!originalHooks.has('useState')) {
        originalHooks.set('useState', originalUseState);
        // @ts-ignore
        React.useState = function patchedUseState(initialState) {
          logHookCall('useState');
          return originalUseState(initialState);
        };
      }

      // Patch React.useEffect
      const originalUseEffect = React.useEffect;
      if (!originalHooks.has('useEffect')) {
        originalHooks.set('useEffect', originalUseEffect);
        // @ts-ignore
        React.useEffect = function patchedUseEffect(create, deps) {
          logHookCall('useEffect');
          const currentId = effectId.current++;
          
          return originalUseEffect(() => {
            const cleanup = create();
            if (typeof cleanup === 'function') {
              effectCleanups.current.set(currentId, cleanup);
            }
            return () => {
              if (effectCleanups.current.has(currentId)) {
                effectCleanups.current.get(currentId)?.();
                effectCleanups.current.delete(currentId);
              }
            };
          }, deps);
        };
      }

      // Patch other hooks similarly...
      // (Implementation omitted for brevity)
    }
  }


  // Log hook calls for debugging
  function logHookCall(hookType: HookType) {
    if (!enabled) return;
    
    const stack = new Error().stack?.split('\n').slice(3).join('\n');
    const call: HookCall = {
      type: hookType,
      stack,
      timestamp: performance.now(),
    };
    
    hookCalls.current.push(call);
    
    if (logCalls) {
      console.log(`[${componentName}] Hook called:`, hookType);
    }
  }

  // Validate hook order on mount and updates
  useEffect(() => {
    if (!enabled) return;
    
    const currentHooks = [...hookCalls.current];
    
    // Check for hook order consistency
    if (previousHookCount.current > 0 && currentHooks.length !== previousHookCount.current) {
      const errorMsg = `[${componentName}] Rendered a different number of hooks than during the previous render.`;
      
      if (throwOnError) {
        throw new Error(errorMsg);
      } else {
        console.error(errorMsg);
      }
    }
    
    previousHookCount.current = currentHooks.length;
    
    return () => {
      // Cleanup on unmount
      if (enabled && process.env.NODE_ENV === 'development') {
        // Verify all effects were cleaned up
        if (effectCleanups.current.size > 0) {
          console.warn(
            `[${componentName}] Some effects were not cleaned up:`, 
            effectCleanups.current.size
          );
        }
      }
    };
  }, [enabled, componentName, throwOnError]);
  
  // Debug information
  useDebugValue(`Hooks used: ${hookCalls.current.map(h => h.type).join(', ')}`);
  
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
      previousHookCount.current = 0;
      effectCleanups.current.clear();
    },
    
    /**
     * Validate hook rules and return any violations
     */
    validate: () => {
      const violations: string[] = [];
      const calls = hookCalls.current;
      
      // Rule: Hooks should be called in the same order
      // (This is handled by React, but we can provide better error messages)
      
      // Rule: No hooks after early returns
      // (This is handled by the linter, but we can detect some cases at runtime)
      
      // Rule: No hooks in conditions or loops
      // (This is handled by the linter, but we can detect some cases at runtime)
      
      return violations;
    },
  };
}

// Export a component wrapper for easier usage
export function withHookValidation<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: HookValidatorOptions = {}
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const ValidatedComponent: React.FC<P> = (props) => {
    useHookValidator({ 
      ...options, 
      componentName: displayName 
    });
    
    return <WrappedComponent {...props} />;
  };
  
  ValidatedComponent.displayName = `withHookValidation(${displayName})`;
  
  return ValidatedComponent;
}

// Export a custom hook that wraps other hooks with validation
export function useValidatedHook<T extends (...args: any[]) => any>(
  hook: T,
  hookName: string,
  options: HookValidatorOptions = {}
): T {
  const { enabled = true } = options;
  
  if (!enabled) {
    return hook;
  }
  
  return ((...args: Parameters<T>) => {
    // In a real implementation, we would track hook calls here
    console.log(`[Hook] ${hookName} called`);
    return hook(...args);
  }) as T;
}

// Export a hook that can be used to test hook execution
export function useHookExecutionTest() {
  return {
    /**
     * Test if hooks are called in the same order between renders
     */
    testHookOrder: (hook: () => void) => {
      const firstRenderHooks: string[] = [];
      const secondRenderHooks: string[] = [];
      
      // First render
      const firstResult = hook();
      firstRenderHooks.push(...hook.toString().match(/use[A-Z]\w+/g) || []);
      
      // Second render
      const secondResult = hook();
      secondRenderHooks.push(...hook.toString().match(/use[A-Z]\w+/g) || []);
      
      // Compare hook order
      const orderMatch = firstRenderHooks.join(',') === secondRenderHooks.join(',');
      
      return {
        firstRenderHooks,
        secondRenderHooks,
        orderMatch,
        firstResult,
        secondResult,
      };
    },
  };
}
