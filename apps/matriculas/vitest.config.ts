import { createVitestConfig } from '@edunexia/test-config';
import path from 'path';

export default createVitestConfig('./', {
  plugins: [
    // Plugins específicos para o módulo de matrículas, se necessário
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      include: [
        'src/components/**',
        'src/hooks/**',
        'src/utils/**',
        'src/services/**'
      ],
    },
  },
}); 