/// <reference types="vitest" />
import { createComponentTestConfig } from '@edunexia/test-config';
import { resolve } from 'path';

export default createComponentTestConfig(__dirname, {
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils'),
      '@pages': resolve(__dirname, './src/pages'),
      '@config': resolve(__dirname, './src/config'),
      '@lib': resolve(__dirname, './src/lib'),
      '@types': resolve(__dirname, './src/types'),
      '@edunexia/auth': resolve(__dirname, './src/types/auth'),
      '@edunexia/api-client': resolve(__dirname, './src/types/api-client')
    }
  }
}); 