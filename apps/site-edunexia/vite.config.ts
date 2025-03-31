/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import type { UserConfig } from 'vite';

// https://vitejs.dev/config/
const config: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@edunexia/auth': resolve(__dirname, '../../packages/auth/dist/index.js'),
      '@edunexia/api-client': resolve(__dirname, '../../packages/api-client/dist/index.js'),
      '@edunexia/navigation': resolve(__dirname, '../../packages/navigation/dist/index.js'),
      '@edunexia/test-config': resolve(__dirname, '../../packages/test-config/dist/index.js')
    }
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          auth: ['@edunexia/auth'],
          api: ['@edunexia/api-client']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/[.]**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        'cypress/**',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}'
      ]
    }
  }
};

export default defineConfig(config); 