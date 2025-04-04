/// <reference types="vitest" />
import { createVitestConfig } from '@edunexia/test-config'
import path from 'path'

export default createVitestConfig('./', {
  plugins: [
    // Plugins específicos para o módulo de comunicação, se necessário
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
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
}) 