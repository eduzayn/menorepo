import { createVitestConfig } from '@edunexia/test-config';
import path from 'path';

export default createVitestConfig('./', {
  plugins: [
    // Plugins específicos para o pacote de autenticação, se necessário
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@components': path.resolve(__dirname, './src/components'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },
  test: {
    environment: 'jsdom',
    coverage: {
      include: [
        'src/hooks/**',
        'src/components/**',
        'src/*.tsx',
        'src/*.ts',
        '!src/types.ts', // Exclusão dos arquivos de tipos
        '!src/index.ts'  // Exclusão do arquivo de exportação principal
      ],
    },
  },
}); 