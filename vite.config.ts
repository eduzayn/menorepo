import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@edunexia/auth': resolve(__dirname, './packages/auth/src'),
      '@edunexia/database-schema': resolve(__dirname, './packages/database-schema/src'),
      '@edunexia/ui-components': resolve(__dirname, './packages/ui-components/src'),
    },
  },
}); 