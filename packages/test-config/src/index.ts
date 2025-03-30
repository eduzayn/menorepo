// Configurações
export * from './vitest.config';
export * from './jest.config';

// Re-exporta os utilitários
export * from './test-utils';
export * from './mock-helpers';
export * from './test-data';

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