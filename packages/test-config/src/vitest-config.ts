import { mergeConfig } from 'vitest/config';
import type { UserConfig } from 'vitest/config';
import { generateCoverageThresholds } from './coverage-thresholds';

/**
 * Configuração base para o Vitest com suporte a cobertura de código
 * Esta configuração pode ser estendida por cada módulo do projeto
 */
export function createVitestConfig(
  modulePath: string,
  customConfig: UserConfig = {}
): UserConfig {
  const baseConfig: UserConfig = {
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['@edunexia/test-config/setup'],
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'json', 'lcov', 'html'],
        reportsDirectory: './coverage',
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/__tests__/**',
          '**/__mocks__/**',
          '**/*.{test,spec}.*',
          '**/test-utils/**',
          '**/setup-tests.*',
          '**/*.d.ts',
        ],
        // @ts-expect-error - A opção thresholds existe para a configuração de cobertura
        // mas não está tipada corretamente na versão atual do Vitest
        thresholds: generateCoverageThresholds(),
        all: true,
        clean: true,
      },
    },
  };

  return mergeConfig(baseConfig, customConfig);
}

/**
 * Configuração específica para testes de componentes
 */
export function createComponentTestConfig(
  modulePath: string,
  customConfig: UserConfig = {}
): UserConfig {
  return createVitestConfig(
    modulePath,
    mergeConfig(
      {
        test: {
          include: ['**/*.{test,spec}.{jsx,tsx}'],
          environment: 'jsdom',
        },
      },
      customConfig
    )
  );
}

/**
 * Configuração específica para testes de integração
 */
export function createIntegrationTestConfig(
  modulePath: string,
  customConfig: UserConfig = {}
): UserConfig {
  return createVitestConfig(
    modulePath,
    mergeConfig(
      {
        test: {
          include: ['**/*.integration.{test,spec}.{js,ts}'],
        },
      },
      customConfig
    )
  );
} 