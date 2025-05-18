import { useEffect, useRef, useCallback } from 'react';

type PerformanceMetrics = {
  componentMountTime: number | null;
  renderCount: number;
  lastRenderTime: number | null;
  averageRenderTime: number | null;
  maxRenderTime: number | null;
};

type UsePerformanceMetricsOptions = {
  enabled?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  componentName?: string;
};

export function usePerformanceMetrics({
  enabled = true,
  onMetricsUpdate,
  componentName = 'Unknown',
}: UsePerformanceMetricsOptions = {}) {
  const metricsRef = useRef<{
    mountTime: number;
    renderCount: number;
    lastRenderStart: number | null;
    renderTimes: number[];
    isFirstRender: boolean;
  }>({
    mountTime: 0,
    renderCount: 0,
    lastRenderStart: null,
    renderTimes: [],
    isFirstRender: true,
  });

  // Measure render time
  const measureRender = useCallback(() => {
    if (!enabled) return () => {};
    
    const start = performance.now();
    metricsRef.current.lastRenderStart = start;
    
    return () => {
      if (metricsRef.current.lastRenderStart === null) return;
      
      const end = performance.now();
      const renderTime = end - metricsRef.current.lastRenderStart;
      
      metricsRef.current.renderTimes.push(renderTime);
      metricsRef.current.renderCount++;
      metricsRef.current.lastRenderStart = null;
      
      if (metricsRef.current.isFirstRender) {
        metricsRef.current.mountTime = end;
        metricsRef.current.isFirstRender = false;
      }
      
      if (onMetricsUpdate) {
        onMetricsUpdate({
          componentMountTime: metricsRef.current.mountTime,
          renderCount: metricsRef.current.renderCount,
          lastRenderTime: renderTime,
          averageRenderTime: metricsRef.current.renderTimes.reduce((a, b) => a + b, 0) / metricsRef.current.renderTimes.length,
          maxRenderTime: Math.max(...metricsRef.current.renderTimes),
        });
      }
      
      return renderTime;
    };
  }, [enabled, onMetricsUpdate]);

  // Mark interactive point (e.g., after data loading)
  const markInteractive = useCallback(() => {
    if (!enabled) return null;
    
    const timeToInteractive = performance.now() - metricsRef.current.mountTime;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Performance] ${componentName} became interactive in ${timeToInteractive.toFixed(2)}ms`);
    }
    
    return timeToInteractive;
  }, [enabled, componentName]);

  // Log metrics on unmount
  useEffect(() => {
    if (!enabled) return;
    
    return () => {
      if (process.env.NODE_ENV !== 'production' && metricsRef.current.renderCount > 0) {
        const metrics = {
          componentName,
          mountTime: metricsRef.current.mountTime,
          totalRenders: metricsRef.current.renderCount,
          averageRenderTime: metricsRef.current.renderTimes.reduce((a, b) => a + b, 0) / metricsRef.current.renderTimes.length,
          maxRenderTime: Math.max(...metricsRef.current.renderTimes),
        };
        
        console.group(`[Performance] ${componentName} Metrics`);
        console.table(metrics);
        console.groupEnd();
      }
    };
  }, [enabled, componentName]);

  return {
    measureRender,
    markInteractive,
    metrics: {
      mountTime: metricsRef.current.mountTime,
      renderCount: metricsRef.current.renderCount,
      averageRenderTime: metricsRef.current.renderTimes.length > 0
        ? metricsRef.current.renderTimes.reduce((a, b) => a + b, 0) / metricsRef.current.renderTimes.length
        : null,
      maxRenderTime: metricsRef.current.renderTimes.length > 0
        ? Math.max(...metricsRef.current.renderTimes)
        : null,
    },
  };
}

// Hook for checking hook execution consistency
export function useHookConsistencyCheck(componentName: string) {
  const hookOrderRef = useRef<string[]>([]);
  const hookCounts = useRef<Record<string, number>>({});
  const hasWarned = useRef(false);

  const recordHook = useCallback((hookName: string) => {
    if (hasWarned.current) return;
    
    const hookId = `${hookName}-${hookCounts.current[hookName] || 0}`;
    hookOrderRef.current.push(hookId);
    hookCounts.current[hookName] = (hookCounts.current[hookName] || 0) + 1;
    
    if (__DEV__) {
      const currentOrder = hookOrderRef.current.join(' -> ');
      console.log(`[Hook Order] ${componentName}: ${currentOrder}`);
    }
  }, [componentName]);

  const checkConsistency = useCallback((expectedOrder: string[]) => {
    if (hasWarned.current) return true;
    
    const currentOrder = hookOrderRef.current;
    const isConsistent = JSON.stringify(currentOrder) === JSON.stringify(expectedOrder);
    
    if (!isConsistent && !hasWarned.current) {
      console.warn(
        `[Hook Consistency] Inconsistent hook execution order in ${componentName}.\n` +
        `Expected: ${expectedOrder.join(' -> ')}\n` +
        `Actual:   ${currentOrder.join(' -> ')}`
      );
      hasWarned.current = true;
    }
    
    return isConsistent;
  }, [componentName]);

  return {
    recordHook,
    checkConsistency,
    getHookOrder: () => [...hookOrderRef.current],
    hasInconsistencies: () => hasWarned.current,
  };
}
