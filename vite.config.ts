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
    // Build configuration
    build: {
      outDir: 'dist',
      target: 'es2020',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      cssMinify: true,
      assetsInlineLimit: 4096, // 4kb
      chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          manualChunks: (id) => {
            // Group React and related libraries
            if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-markdown|rehype-|remark-|unified|zustand)/.test(id)) {
              return 'vendor-react';
            }
            // Group UI components
            if (/[\\/]node_modules[\\/](@radix-ui|class-variance-authority|clsx|lucide-react|tailwind-merge|tailwindcss-animate|sonner)/.test(id)) {
              return 'vendor-ui';
            }
            // Group form handling
            if (/[\\/]node_modules[\\/](@hookform|react-hook-form|zod)/.test(id)) {
              return 'vendor-forms';
            }
            // Group data and state management
            if (/[\\/]node_modules[\\/](@tanstack|react-query|date-fns|use-debounce)/.test(id)) {
              return 'vendor-data';
            }
            // Group animations and transitions
            if (/[\\/]node_modules[\\/](framer-motion|react-intersection-observer)/.test(id)) {
              return 'vendor-animations';
            }
            // Default vendor chunk
            if (/[\\/]node_modules[\\/]/.test(id)) {
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
