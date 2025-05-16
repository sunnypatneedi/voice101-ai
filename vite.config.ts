import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import compression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_APP_ENV': JSON.stringify(process.env.VITE_APP_ENV || 'production'),
    },
    resolve: {
      alias: [
        // Alias for src directory
        {
          find: '@',
          replacement: path.resolve(__dirname, './src')
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      preserveSymlinks: true
    },
    optimizeDeps: {
      // Let Vite handle dependency optimization automatically
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-dom/client',
        'react-router',
        'react-router-dom',
        'scheduler',
      ],
      esbuildOptions: {
        // Configure esbuild options
        jsx: 'automatic',
        jsxDev: !isProduction,
        jsxImportSource: 'react',
        target: 'es2020',
      },
      // Don't force optimization on every start
      force: false,
    },
    // Server configuration
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy requests to /simulator-studio to the local dev server of the sim-studio
        '/sim-studio': {
          target: 'http://localhost:5173',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sim-studio/, ''),
        },
      },
    },
    plugins: [
      // Basic React plugin
      react(),
      // Image optimization
      imagetools({
        defaultDirectives: (url) => {
          const urlObj = new URL(url, 'imported-from-file');
          const format = urlObj.searchParams.get('format') || 'webp';
          
          return new URLSearchParams({
            format,
            quality: '85',
            w: '1200',
            as: 'picture',
            metadata: 'copyright,location',
          });
        },
      }),
      // PWA Configuration with offline support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Voice101 AI',
          short_name: 'Voice101',
          description: 'From fundamentals to pro techniques — a handbook for building production-grade Voice AI',
          theme_color: '#0d1117',
          background_color: '#0d1117',
          display: 'standalone',
          icons: [
            {
              src: '/assets/images/logo-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/assets/images/logo-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          // Skip waiting for service worker installation
          skipWaiting: true,
          clientsClaim: true,
          // Clean up outdated caches
          cleanupOutdatedCaches: true,
          // Don't cache the service worker itself
          dontCacheBustURLsMatching: /^\/assets\//,
          // Add a filter to prevent caching of files with revision hashes
          navigateFallback: 'index.html',
          // Add a filter to prevent caching of files with revision hashes
          navigateFallbackDenylist: [/^\/__/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            // Add a runtime cache for assets
            {
              urlPattern: /^https?:\/\/voice101\.ai\/assets\//i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'assets-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: false // Enable PWA in development if needed
        }
      }),
      
      // Brotli compression for production builds
      isProduction && compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        filter: (file) => !/\.[a-z]+\.[a-f0-9]+\.(js|css|html|svg)$/i.test(file)
      }),
      // Gzip compression for production builds
      isProduction && compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        filter: (file) => !/\.[a-z]+\.[a-f0-9]+\.(js|css|html|svg|br)$/i.test(file)
      }),
      // Bundle analyzer
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html'
      })
    ].filter(Boolean),
    // Build configuration
    build: {
      target: 'es2020',
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // Group React and related libraries
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom') || 
                id.includes('scheduler')) {
              return 'vendor-react';
            }
            // Group UI libraries
            if (id.includes('@radix-ui') || 
                id.includes('class-variance-authority') ||
                id.includes('clsx') ||
                id.includes('tailwind-merge')) {
              return 'vendor-ui';
            }
            // Group form handling libraries
            if (id.includes('@hookform') || 
                id.includes('react-hook-form') || 
                id.includes('zod')) {
              return 'vendor-forms';
            }
            // Group data and state management
            if (id.includes('@tanstack') || 
                id.includes('react-query') || 
                id.includes('date-fns') || 
                id.includes('use-debounce')) {
              return 'vendor-data';
            }
            // Group animations and transitions
            if (id.includes('framer-motion') || 
                id.includes('@radix-ui/react-collapsible') ||
                id.includes('@radix-ui/react-dialog') ||
                id.includes('@radix-ui/react-popover') ||
                id.includes('@radix-ui/react-tooltip')) {
              return 'vendor-animations';
            }
            // Vendor chunk for remaining node_modules
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            return null;
          },
          // Enable tree-shaking
          experimentalMinChunkSize: 10000,
          // Ensure consistent chunk naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        },
        // Enable tree-shaking
        treeshake: {
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      // Enable brotli and gzip compression
      brotliSize: true,
      chunkSizeWarningLimit: 1000,
      // Enable CSS minification
      cssMinify: isProduction,
      // Enable module preloading
      modulePreload: {
        polyfill: true,
      },
      // Enable dynamic imports
      dynamicImportVarsOptions: {
        warnOnError: true,
        exclude: [],
      },
    },
  };
});
