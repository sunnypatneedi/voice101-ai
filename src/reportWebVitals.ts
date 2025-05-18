import type { ReportHandler } from './utils/webVitals';

export const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('./utils/webVitals')
      .then(({ default: reportWebVitals }) => {
        reportWebVitals(onPerfEntry);
      })
      .catch(error => {
        console.error('Error loading web vitals:', error);
      });
  }
};

export default reportWebVitals;
