import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { join } from 'path';

export function createVitestConfig(basePath: string = './', extraConfig = {}) {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': join(basePath, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [join(__dirname, 'vitest.setup.ts')],
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.d.ts',
          '**/*.test.{ts,tsx}',
          '**/*.stories.{ts,tsx}',
          '**/__mocks__/**'
        ],
      },
      ...extraConfig,
    },
  });
} 