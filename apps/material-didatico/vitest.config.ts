import { createVitestConfig } from '@edunexia/test-config';
import path from 'path';

export default createVitestConfig('./', {
  plugins: [
    // Plugins específicos para o módulo material-didatico, se necessário
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@app': path.resolve(__dirname, './src/app'),
      '@ai': path.resolve(__dirname, './src/ai')
    }
  },
  test: {
    coverage: {
      include: [
        'src/components/**',
        'src/hooks/**',
        'src/services/**',
        'src/contexts/**',
        'src/lib/**',
        'src/ai/**'
      ],
    },
  },
}); 