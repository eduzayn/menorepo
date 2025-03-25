import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { dirname, resolve } from 'path';

const __filename = path.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@repo/auth': path.resolve(__dirname, '../../packages/auth/src'),
      '@repo/ui-components': path.resolve(__dirname, '../../packages/ui-components/src'),
      '@components': resolve(__dirname, './src/components'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services'),
      '@styles': resolve(__dirname, './src/styles'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
      '@edunexia/database-schema': resolve(__dirname, '../../packages/database-schema/src'),
    },
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@heroicons/react', 'antd'],
          'auth-vendor': ['@edunexia/auth', '@supabase/supabase-js']
        }
      }
    }
  }
}); 