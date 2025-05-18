import { afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { QueryClient } from '@tanstack/react-query';
import { expect, afterEach } from 'vitest'
import * as React from 'react'
global.React = React

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = ResizeObserverStub as any;

// Mock performance metrics
window.performance = {
  ...window.performance,
  getEntriesByType: vi.fn().mockReturnValue([{
    type: 'navigate',
    startTime: 0,
    loadEventEnd: 1000,
    domComplete: 900,
  }]),
} as any;

// Run cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Create a test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0, // cacheTime was renamed to gcTime in newer versions
    },
  },
});

// Export test utilities
export { createTestQueryClient };