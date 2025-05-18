/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Import types for web-vitals
import { ReportHandler } from 'web-vitals';

declare global {
  // Extend the Window interface to include web vitals
  interface Window {
    webVitals?: {
      reportWebVitals: (onPerfEntry?: ReportHandler) => void;
    };
  }
}
