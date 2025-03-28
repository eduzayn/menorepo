import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@layouts': resolve(__dirname, './src/layouts'),
    },
  },
  server: {
    port: 3003,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}); 