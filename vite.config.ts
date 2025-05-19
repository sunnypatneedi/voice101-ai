import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isProduction = mode === 'production';
  
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get package.json for versioning
  const packageJson = require('./package.json');
  
  // Get all @radix-ui packages from package.json
  const radixUiPackages = Object.keys(packageJson.dependencies || {})
    .filter((dep: string) => dep.startsWith('@radix-ui/'));

  // Initialize plugins array with proper typing
  const plugins = [
    // React plugin
    react({
      jsxImportSource: 'react',
    }) as any,
    // PWA plugin
    (VitePWA as any)({
      strategies: 'injectManifest',
      injectRegister: 'auto',
      registerType: 'prompt',
      scope: '/',
      base: '/',
      srcDir: 'public',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
      },
      devOptions: {
        enabled: true,
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
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    // Image optimization
    (imagetools as any)({
      defaultDirectives: (url: URL) => {
        const searchParams = new URLSearchParams(url.search);
        searchParams.set('format', 'avif;webp;png');
        searchParams.set('quality', '80');
        searchParams.set('as', 'picture');
        return new URLSearchParams(searchParams);
      },
    }),
  ];

  // Add production-only plugins
  if (isProduction) {
    plugins.push(
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false,
      }),
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        deleteOriginFile: false,
      }),
      (visualizer as any)({
        open: false,
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  // Create manual chunks for Radix UI packages
  const manualChunks = {
    react: ['react', 'react-dom', 'react-router-dom'],
    vendor: ['lodash', 'axios', 'date-fns'],
    ...Object.fromEntries(
      radixUiPackages.map(pkg => [
        pkg.replace('@radix-ui/react-', ''),
        [pkg]
      ])
    )
  };

  // Return the final configuration
  return {
    mode: isProduction ? 'production' : 'development',
    base: '/',
    publicDir: 'public',
    plugins: plugins.filter(Boolean),
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      port: 3000,
      open: !process.env.CI,
      cors: true,
      host: '::',
      proxy: {
        // Proxy requests to /simulator-studio to the local dev server of the sim-studio
        '/sim-studio': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 3000,
      open: !process.env.CI,
      cors: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
    },
  };
});
