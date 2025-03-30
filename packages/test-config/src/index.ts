// Configurações
export * from './vitest.config';
export * from './jest.config';

// Re-exporta os utilitários
export * from './test-utils';
export * from './mock-helpers';
// export * from './test-data'; // Removido para evitar conflito com generateTestId

// Exporta os arquivos de setup
import * as vitestSetupModule from './vitest.setup';
import * as jestSetupModule from './jest.setup';

export const vitestSetup = vitestSetupModule;
export const jestSetup = jestSetupModule;

// Funções de configuração para serem utilizadas por módulos
export function createTestConfig(type: 'vitest' | 'jest', options: any = {}) {
  switch (type) {
    case 'vitest':
      const { createVitestConfig } = require('./vitest.config');
      return createVitestConfig(options.basePath, options.extraConfig);
    case 'jest':
      const { createJestConfig } = require('./jest.config');
      return createJestConfig(options);
    default:
      throw new Error(`Tipo de configuração de teste não suportado: ${type}`);
  }
}

// Re-export de utilidades do React Testing Library
export { render, screen, waitFor, fireEvent } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Exportar configurações do Vitest
export { 
  createVitestConfig,
  createComponentTestConfig,
  createIntegrationTestConfig
} from './vitest-config';

// Exportar funções e constantes de thresholds de cobertura
export {
  DEFAULT_THRESHOLD,
  CRITICAL_MODULES_THRESHOLD,
  getThresholdForModule,
  generateCoverageThresholds
} from './coverage-thresholds';

// Exportar geradores de dados para testes
export * from './test-data-generators';

// Exportar tipos
export * from './types'; 