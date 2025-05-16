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
  
  // Get all @radix-ui packages from package.json
  const packageJson = require('./package.json');
  const radixUiPackages = Object.keys(packageJson.dependencies || {})
    .filter(dep => dep.startsWith('@radix-ui/'));

  return {
    define: {
      'process.env': process.env,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'process.env.VITE_APP_ENV': JSON.stringify(process.env.VITE_APP_ENV || 'production'),
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
      react({
        jsxImportSource: 'react',
        // @ts-ignore - babel config is valid but not in the type definition
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
            ['@babel/plugin-transform-modules-commonjs', { strictMode: false }]
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
      // PWA Configuration
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
      
      // Compression for production builds
      isProduction && compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        filter: (file) => !file.includes('sw.js') // Don't compress service worker
      }),
      isProduction && compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        filter: (file) => !file.includes('sw.js') // Don't compress service worker
      }),
      // Bundle analyzer
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html',
      }),
    ].filter(Boolean) as any[],
    resolve: {
      alias: [
        {
          find: 'react',
          replacement: 'react',
        },
        {
          find: 'react-dom',
          replacement: 'react-dom',
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },
    // Build configuration
    build: {
      outDir: 'dist',
      target: 'es2020',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      modulePreload: {
        polyfill: false
      },
      cssCodeSplit: true,
      ssr: false,
      // Ensure React is properly bundled
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
        esmExternals: true,
        requireReturnsDefault: 'auto',
      },
      // Build optimization
      cssMinify: true,
      assetsInlineLimit: 4096, // 4kb
      chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
      rollupOptions: {
        onwarn(warning, warn) {
          // Skip certain warnings
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          warn(warning);
        },
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          manualChunks: (id) => {
            // Explicitly bundle React and its dependencies together
            if ([
              'react',
              'react-dom',
              'scheduler',
              'react/jsx-runtime',
              'react/jsx-dev-runtime',
              'react-router',
              'react-router-dom'
            ].some(pkg => id.includes(`/node_modules/${pkg}/`) || id.includes(`\\node_modules\\${pkg}\\`))) {
              return 'vendor-react';
            }
            // Handle other dependencies
            if (id.includes('node_modules')) {
              // Group UI components
              if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('lucide-react') || id.includes('tailwind-merge') || id.includes('tailwindcss-animate') || id.includes('sonner')) {
                return 'vendor-ui';
              }
              // Group form handling
              if (id.includes('@hookform') || id.includes('react-hook-form') || id.includes('zod')) {
                return 'vendor-forms';
              }
              // Group data and state management
              if (id.includes('@tanstack') || id.includes('react-query') || id.includes('date-fns') || id.includes('use-debounce')) {
                return 'vendor-data';
              }
              // Group animations and transitions
              if (id.includes('framer-motion') || id.includes('react-intersection-observer')) {
                return 'vendor-animations';
              }
              // Default vendor chunk
              return 'vendor';
            }
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
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
        loader: {
          '.js': 'jsx',
        },
        define: {
          'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
        },
      },
    },
  };
});
