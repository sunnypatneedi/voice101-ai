// Export the types for use in other files
export type WebVitalsMetric = {
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB';
  value: number;
  id: string;
  delta: number;
  entries: any[];
  navigationType?: 'navigate' | 'reload' | 'back_forward' | 'prerender';
};

export type ReportHandler = (metric: WebVitalsMetric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Only run in browser
    if (typeof window !== 'undefined') {
      // Use dynamic import to handle different web-vitals versions
      import('web-vitals').then((webVitals: any) => {
        // Get the web vitals functions
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;

        // Call each web vitals function with the provided callback
        if (onPerfEntry) {
          try {
            if (getCLS) getCLS(onPerfEntry);
            if (getFID) getFID(onPerfEntry);
            if (getFCP) getFCP(onPerfEntry);
            if (getLCP) getLCP(onPerfEntry);
            if (getTTFB) getTTFB(onPerfEntry);
          } catch (error) {
            console.error('Error in web vitals:', error);
          }
        }
      }).catch(error => {
        console.error('Error loading web-vitals:', error);
      });
    }
  }
};

export default reportWebVitals;
