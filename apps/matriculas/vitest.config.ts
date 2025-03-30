import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { createComponentTestConfig } from '@edunexia/test-config';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    ...createComponentTestConfig('apps/matriculas').test,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage',
      // @ts-expect-error - A opção thresholds existe para a configuração de cobertura
      // mas não está tipada corretamente na versão atual do Vitest
      thresholds: {
        // Thresholds específicos para o módulo de matrículas
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
        // Thresholds mais altos para componentes críticos
        'src/components/pagamentos/**/*.{js,ts,jsx,tsx}': {
          statements: 95,
          branches: 90,
          functions: 95,
          lines: 95,
        },
        'src/components/MatriculaFormMultiStep.*': {
          statements: 95,
          branches: 90,
          functions: 95,
          lines: 95,
        },
      },
      all: true,
      clean: true,
    },
  },
}); 