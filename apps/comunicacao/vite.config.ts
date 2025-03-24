import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@edunexia/auth': resolve(__dirname, '../../packages/auth/src'),
      '@edunexia/database-schema': resolve(__dirname, '../../packages/database-schema/src'),
      '@edunexia/ui-components': resolve(__dirname, '../../packages/ui-components/src'),
    },
  },
  server: {
    port: 3000,
  },
}); 