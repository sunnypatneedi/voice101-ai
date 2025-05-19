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
  const radixUiPackages = Object.keys(packageJson.dependencies || {})
    .filter((dep: string) => dep.startsWith('@radix-ui/'));

  return {
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy requests to /simulator-studio to the local dev server of the sim-studio
        '/sim-studio': {
          target: 'http://localhost:5173',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/sim-studio/, ''),
        },
      },
    },
    plugins: [
      react({
        jsxImportSource: 'react',
      }),
      // PWA Configuration
      VitePWA({
        // Use injectManifest strategy to use our custom service worker
        strategies: 'injectManifest',
        injectRegister: 'auto',
        registerType: 'prompt',
        // Scope and start URL should match the base URL of your app
        scope: '/',
        base: '/',
        srcDir: 'public',
        filename: 'sw.js',
        // Development options
        devOptions: {
          enabled: true, // Enable PWA in development
          type: 'module',
          navigateFallback: 'index.html',
        },
        includeAssets: [
          'favicon.ico',
          'robots.txt',
          'apple-touch-icon.png',
          'icons/*.png',
          'icons/*.svg',
          'icons/*.ico'
        ],
        // Manifest configuration
        manifest: {
          name: 'Voice101 AI',
          short_name: 'Voice101',
          description: 'AI-powered voice application',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#ffffff',
          orientation: 'portrait',
          lang: 'en-US',
          categories: ['productivity', 'utilities'],
          dir: 'ltr',
          prefer_related_applications: false,
          related_applications: [],
          shortcuts: [
            {
              name: 'Record',
              short_name: 'Record',
              description: 'Start a new voice recording',
              url: '/record',
              icons: [{ src: '/icons/record-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'My Recordings',
              short_name: 'Recordings',
              description: 'View your saved recordings',
              url: '/recordings',
              icons: [{ src: '/icons/list-192x192.png', sizes: '192x192' }]
            }
          ],
          icons: [
            {
              src: '/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          screenshots: [
            {
              src: '/screenshots/screenshot1.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Voice101 AI Dashboard',
            },
            {
              src: '/screenshots/screenshot2.png',
              sizes: '750x1334',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Voice101 AI Mobile View',
            },
          ],
        },
        workbox: {
          // Disable the default precache manifest generation
          // We'll handle precaching manually in sw-custom.js
          globPatterns: [],
          
          // Enable cleanup of outdated caches
          cleanupOutdatedCaches: true,
          
          // Skip waiting and claim clients
          skipWaiting: true,
          clientsClaim: true,
          
          // Don't cache bust URLs with hashes
          dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          
          // Maximum file size to cache in bytes (10MB)
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          
          // Disable source maps in production
          sourcemap: !isProduction,
          
          // Disable workbox logs in production
          mode: isProduction ? 'production' : 'development',
          
          // Disable the default precache manifest
          manifestTransforms: [
            (manifestEntries: any[]) => {
              // Return an empty manifest to prevent precaching
              return { manifest: [], warnings: [] };
            }
          ],
          
          // Configure runtime caching
          runtimeCaching: [
            // Cache the offline page
            {
              urlPattern: /\/offline\.html/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'offline-page',
                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            // Cache API responses
            {
              urlPattern: /^https?:\/\/api\.example\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // Cache static assets
            {
              urlPattern: /\.[a-z0-9]{8}\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|avif)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // Cache pages for offline use
            {
              urlPattern: ({ request, sameOrigin }: { request: Request; sameOrigin: boolean }) => 
                sameOrigin && 
                request.mode === 'navigate' && 
                !request.url.includes('/api/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                networkTimeoutSeconds: 5,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // Cache JSON/XML data
            {
              urlPattern: /^https?:\/\/\.*\.(json|xml)$/i,
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
            // Fallback for all other requests
            {
              urlPattern: /^https?:\/\/\.*$/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'fallback-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 1 day
                },
                networkTimeoutSeconds: 5
              }
            }
          ]
        },
      }),
      // Image optimization
      imagetools({
        defaultDirectives: (url: URL) => {
          const searchParams = new URLSearchParams(url.search);
          searchParams.set('format', 'avif;webp;png');
          searchParams.set('quality', '80');
          searchParams.set('as', 'picture');
          return new URLSearchParams(searchParams);
        },
      }),
      // Compression for production builds
      isProduction && compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false,
      }),
      isProduction && compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        deleteOriginFile: false,
      }),
      // Bundle analyzer
      isProduction && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        ...radixUiPackages.reduce((aliases, pkg) => ({
          ...aliases,
          [pkg]: path.resolve(__dirname, `./node_modules/${pkg}`)
        }), {})
      },
    },
    build: {
      target: 'esnext',
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['lodash', 'axios', 'date-fns'],
            ...radixUiPackages.reduce((chunks, pkg) => ({
              ...chunks,
              [pkg.replace('@radix-ui/', '')]: [pkg],
            }), {}),
          },
        },
      },
    },
  };
});
