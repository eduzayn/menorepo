import { createVitestConfig } from '@edunexia/test-config';
import path from 'path';

export default createVitestConfig('./', {
  plugins: [
    // Plugins específicos para o módulo template, se necessário
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services')
    }
  },
  test: {
    coverage: {
      include: [
        'src/components/**',
        'src/hooks/**',
        'src/services/**'
      ],
    },
  },
}); 