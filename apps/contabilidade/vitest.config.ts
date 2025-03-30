import { createVitestConfig } from '@edunexia/test-config';
import path from 'path';

export default createVitestConfig('./', {
  plugins: [
    // Plugins específicos para o módulo contabilidade, se necessário
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@lib': path.resolve(__dirname, './src/lib')
    }
  },
  test: {
    coverage: {
      include: [
        'src/components/**',
        'src/hooks/**',
        'src/services/**',
        'src/contexts/**',
        'src/utils/**',
        'src/lib/**'
      ],
    },
  },
}); 