import { useCallback, useEffect, useRef } from 'react';

// Extend the PerformanceEntry type to include the type property
interface PerformanceNavigationTiming extends PerformanceEntry {
  type: string;
}

interface PerformanceMetrics {
  componentName: string;
  mountTime: number | null;
  renderStart: number | null;
  renderEnd: number | null;
  interactionTime: number | null;
}

export const usePerformanceMetrics = (componentName: string) => {
  const metricsRef = useRef<PerformanceMetrics>({
    componentName,
    mountTime: null,
    renderStart: null,
    renderEnd: null,
    interactionTime: null,
  });

  // Track component mount time
  useEffect(() => {
    metricsRef.current.mountTime = performance.now();
    
    return () => {
      // Cleanup function to log metrics when component unmounts
      const { mountTime, renderStart, renderEnd, interactionTime } = metricsRef.current;
      if (mountTime && renderStart && renderEnd) {
        const totalTime = performance.now() - mountTime;
        const renderTime = renderEnd - renderStart;
        
        // Log metrics to your analytics service
        console.log(`[Performance] ${componentName}:`, {
          totalMountTime: totalTime.toFixed(2) + 'ms',
          renderTime: renderTime.toFixed(2) + 'ms',
          timeToInteractive: interactionTime 
            ? (interactionTime - mountTime).toFixed(2) + 'ms' 
            : 'N/A',
        });
      }
    };
  }, [componentName]);

  // Measure render time
  const measureRender = useCallback(() => {
    metricsRef.current.renderStart = performance.now();
    
    return () => {
      metricsRef.current.renderEnd = performance.now();
    };
  }, []);

  // Mark when the component becomes interactive
  const markInteractive = useCallback(() => {
    if (!metricsRef.current.interactionTime) {
      metricsRef.current.interactionTime = performance.now();
    }
  }, []);

  // Track page views
  const measurePageView = useCallback((path: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navEntries = performance.getEntriesByType('navigation');
      const navEntry = navEntries[0] as PerformanceNavigationTiming | undefined;
      
      // Log page view to your analytics service
      console.log(`[PageView] ${path}`, {
        loadTime: performance.now(),
        navigationType: navEntry?.type || 'navigate',
      });
    }
  }, []);

  return {
    measureRender,
    markInteractive,
    measurePageView,
  };
};

export default usePerformanceMetrics;
