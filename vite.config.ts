import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import compression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";

// Get package.json for versioning
const packageJson = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  // Get all @radix-ui packages from package.json
  const packageJson = require('./package.json');
  const radixUiPackages = Object.keys(packageJson.dependencies || {})
    .filter(dep => dep.startsWith('@radix-ui/'));

  return {
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
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
      }),
      // PWA Configuration
      VitePWA({
        registerType: 'autoUpdate',
        // Enable auto-registration of the service worker
        injectRegister: 'auto',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Voice101 Book',
          short_name: 'Voice101',
          description: 'From fundamentals to pro techniques — a handbook for building production-grade Voice AI.',
          theme_color: '#0d1117',
          background_color: '#0d1117',
          display: 'standalone',
          start_url: '/',
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
          navigateFallback: '/index.html',
          clientsClaim: true,
          skipWaiting: true,
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
          dontCacheBustURLsMatching: /\.\w{8}\./,
          
          // Handle cache conflicts by modifying the precache manifest
          manifestTransforms: [
            async (manifestEntries) => {
              // Create a map to track unique URLs without query parameters
              const urlMap = new Map();
              
              // Process each entry and keep only one version of each URL
              const manifest = manifestEntries.filter(entry => {
                if (entry.url.endsWith('.map')) return false; // Skip source maps
                
                try {
                  // Extract base URL without query parameters
                  const url = new URL(entry.url, 'https://voice101.ai');
                  const baseUrl = `${url.pathname}`;
                  
                  // If we've seen this URL before, skip it
                  if (urlMap.has(baseUrl)) {
                    return false;
                  }
                  
                  // Otherwise, keep this entry and track its base URL
                  urlMap.set(baseUrl, true);
                  return true;
                } catch (e) {
                  console.warn('Failed to process URL:', entry.url, e);
                  return false;
                }
              });
              
              console.log('Precaching', manifest.length, 'files');
              return { manifest, warnings: [] };
            },
          ],
          
          // Additional Workbox configuration
          mode: 'production',
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
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|webp|svg|gif|ico)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https?:\/\/.*\.(woff|woff2|eot|ttf|otf)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https?:\/\/.*\.(json|xml)$/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'data-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                },
                networkTimeoutSeconds: 10
              }
            },
            {
              urlPattern: /^https?:\/\/.*$/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 1 day
                },
                networkTimeoutSeconds: 5
              }
            }
          ]
        },
        devOptions: {
          enabled: false, // Disable in development
          type: 'module',
          navigateFallback: 'index.html',
        },
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
      // Compression for production builds
      isProduction && compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
      }),
      isProduction && compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
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
          replacement: path.resolve(__dirname, './node_modules/react'),
        },
        {
          find: 'react-dom',
          replacement: path.resolve(__dirname, './node_modules/react-dom'),
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },
    build: {
      outDir: "dist",
      target: 'esnext',
      emptyOutDir: true,
      sourcemap: !isProduction,
      manifest: true,
      minify: isProduction ? 'esbuild' : false,
      assetsInlineLimit: 4096, // 4kb
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          manualChunks: {
            // Core React and related
            'vendor-react': [
              'react',
              'react-dom',
              'react-dom/client',
              'scheduler',
            ],
            // UI libraries
            'vendor-ui': [
              'class-variance-authority',
              'clsx',
              'tailwind-merge',
              'tailwindcss-animate',
              ...radixUiPackages,
            ],
            // Animation libraries
            'vendor-animations': [
              'framer-motion',
            ],
            // Routing - let Vite handle these dependencies automatically
            'vendor-routing': ['react-router-dom'],
            // Data fetching
            'vendor-data': [
              '@tanstack/react-query',
            ],
            // Forms
            'vendor-forms': [
              'react-hook-form',
              '@hookform/resolvers',
              'zod',
            ],
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
