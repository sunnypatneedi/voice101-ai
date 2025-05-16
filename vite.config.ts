import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import compression from 'vite-plugin-compression';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy requests to /simulator-studio to the local dev server of the sim-studio
        '/sim-studio': {
          target: 'http://localhost:5173', // Default Vite dev server port
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sim-studio/, ''),
        },
      },
    },
    plugins: [
      react(),
      // Compression for production builds
      isProduction && compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024, // 1KB
      }),
      isProduction && compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024, // 1KB
      }),
      // Bundle analyzer
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html',
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // Keep React and React DOM together
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              // Group UI libraries
              if (id.includes('@radix-ui')) {
                return 'vendor-ui';
              }
              // Group animation libraries
              if (id.includes('framer-motion')) {
                return 'vendor-animations';
              }
              // Group routing
              if (id.includes('react-router')) {
                return 'vendor-routing';
              }
              // Group form handling
              if (id.includes('react-hook-form') || id.includes('@hookform')) {
                return 'vendor-forms';
              }
              // Group data fetching
              if (id.includes('@tanstack/query')) {
                return 'vendor-data';
              }
              return 'vendor-other';
            }
            // Split simulator studio code
            if (id.includes('/simulator-studio/')) {
              return 'simulator-studio';
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react-router-dom',
        '@tanstack/react-query',
        'framer-motion',
      ],
      esbuildOptions: {
        // Ensure React is only included once
        loader: {
          '.js': 'jsx',
        },
      },
    },
  };
});
