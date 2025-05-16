import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import compression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  // Get all @radix-ui packages from package.json
  const packageJson = require('./package.json');
  const radixUiPackages = Object.keys(packageJson.dependencies || {})
    .filter(dep => dep.startsWith('@radix-ui/'));

  return {
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
      sourcemap: !isProduction,
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
