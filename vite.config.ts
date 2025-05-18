import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import compression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";

// https://vitejs.dev/config/
// Ensure React is always available as a global
const reactAlias = {
  'react': path.resolve('./node_modules/react'),
  'react-dom': path.resolve('./node_modules/react-dom'),
  'react/jsx-runtime': path.resolve('./node_modules/react/jsx-runtime.js'),
};

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isDevelopment = !isProduction;
  
  // Ensure React is always included in the bundle
  const alwaysInclude = ['react', 'react-dom', 'react/jsx-runtime'];
  
  // Add global variables to ensure React is available
  const defineVars = {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.VITE_APP_ENV': JSON.stringify(process.env.VITE_APP_ENV || 'production'),
    'window.__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })',
    'globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })',
  };

  return {
    define: defineVars,
    resolve: {
      alias: [
        // React aliases first to ensure correct resolution
        ...Object.entries(reactAlias).map(([find, replacement]) => ({
          find,
          replacement,
        })),
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
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      preserveSymlinks: true,
    },
    optimizeDeps: {
      include: [...alwaysInclude, 'react/jsx-runtime'],
      esbuildOptions: {
        jsx: 'automatic',
        // Ensure React is treated as a pure module
        define: {
          'process.env.NODE_ENV': JSON.stringify(mode),
        },
        // Preserve React's named exports
        keepNames: true,
      },
      // Force optimize these deps (they won't be externalized)
      force: true,
    },
    
    // Ensure React is not externalized
    ssr: {
      noExternal: [...alwaysInclude],
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
      // Configure React plugin
      react({
        // Use the new JSX runtime
        jsxImportSource: 'react',
        // Babel configuration
        babel: {
          plugins: [
            // Add any Babel plugins if needed
          ]
        }
      }),
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
      // Bundle analyzer - only include gzip size to avoid duplicate brotliSize
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: false, // Disable brotli size in visualizer since it's configured in build
        filename: 'dist/stats.html'
      })
    ].filter(Boolean),
    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDevelopment,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // Keep React and its dependencies in a single chunk
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/scheduler') ||
                id.includes('node_modules/object-assign') ||
                id.includes('node_modules/prop-types')) {
              return 'vendor-react';
            }
            // Group other node_modules into vendor chunks
            if (id.includes('@tanstack') || 
                id.includes('react-query') || 
                id.includes('date-fns') || 
                id.includes('use-debounce')) {
              return 'vendor-data';
            }
            
            // Group UI components and animations
            if (id.includes('framer-motion') || 
                id.includes('@radix-ui/') ||
                id.includes('cmdk') ||
                id.includes('vaul') ||
                id.includes('sonner')) {
              return 'vendor-ui';
            }
            
            // Group utility libraries
            if (id.includes('clsx') ||
                id.includes('tailwind-merge') ||
                id.includes('class-variance-authority')) {
              return 'vendor-utils';
            }
            
            // Vendor chunk for remaining node_modules
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            return null;
          },
          // Configure chunk optimization
          experimentalMinChunkSize: 20000, // Increased for better chunking
          // Ensure consistent chunk names
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: (chunkInfo) => {
            // Ensure React and its dependencies are in stable chunks
            if (chunkInfo.name === 'react-vendor') {
              return 'assets/react-vendor.[hash].js';
            }
            return 'assets/[name]-[hash].js';
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
        // Configure tree-shaking
        treeshake: {
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      // Enable brotli and gzip compression
      // brotliSize and chunkSizeWarningLimit are already defined above
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
