/**
 * Arquivo de setup padrão para testes com Vitest ou Jest
 * Este arquivo importa os setups específicos para cada framework
 */

import * as vitestSetup from './vitest.setup';
import * as jestSetup from './jest.setup';

// Detecta automaticamente o framework de teste
// @ts-expect-error - Os objetos vitest e jest são injetados globalmente pelos frameworks
const isVitest = typeof (global as any).vitest !== 'undefined';
// @ts-expect-error - Os objetos vitest e jest são injetados globalmente pelos frameworks
const isJest = typeof (global as any).jest !== 'undefined';

// Exporta todas as funções do setup apropriado
if (isVitest) {
  // Se estiver executando com Vitest
  module.exports = vitestSetup;
} else if (isJest) {
  // Se estiver executando com Jest
  module.exports = jestSetup;
} else {
  // Aviso se não for possível determinar o framework
  console.warn('Aviso: Não foi possível determinar o framework de testes. ' +
    'O setup pode não funcionar corretamente. ' +
    'Tente importar diretamente ./vitest.setup.ts ou ./jest.setup.ts');
}

// Exportações específicas para cada framework, caso o auto-detect falhe
export const vitest = vitestSetup;
export const jest = jestSetup;

// Exportações comuns para ambos os frameworks
export * from './vitest.setup';
export * from './jest.setup'; 