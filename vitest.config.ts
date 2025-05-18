/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Alias for src directory
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      // Alias for public directory
      {
        find: /^~(.+)/,
        replacement: path.resolve(__dirname, 'node_modules/$1'),
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    // Add support for TypeScript paths
    alias: [
      { find: /^@\/(.*)/, replacement: path.resolve(__dirname, './src/$1') },
    ],
  },
});
