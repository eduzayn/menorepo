/**
 * Thresholds de cobertura de testes para os módulos do projeto Edunéxia
 * Os valores são percentuais mínimos de cobertura exigidos para cada módulo
 */

type CoverageThreshold = {
  branches: number;
  functions: number;
  lines: number;
  statements: number;
};

type ModuleThresholds = {
  [modulePath: string]: CoverageThreshold;
};

/**
 * Thresholds padrão para todos os módulos
 */
export const DEFAULT_THRESHOLD: CoverageThreshold = {
  branches: 80,
  functions: 80,
  lines: 80,
  statements: 80
};

/**
 * Thresholds específicos para módulos críticos
 */
export const CRITICAL_MODULES_THRESHOLD: CoverageThreshold = {
  branches: 90,
  functions: 90,
  lines: 90,
  statements: 90
};

/**
 * Thresholds customizados por módulo específico
 */
export const moduleThresholds: ModuleThresholds = {
  // Módulos críticos com threshold mais alto
  'apps/matriculas': CRITICAL_MODULES_THRESHOLD,
  'apps/portal-do-aluno': CRITICAL_MODULES_THRESHOLD,
  'packages/auth': CRITICAL_MODULES_THRESHOLD,
  
  // Módulos com thresholds customizados para funcionalidades específicas
  'apps/matriculas/src/components/pagamentos': {
    branches: 90,
    functions: 90,
    lines: 95,
    statements: 90
  },
  'packages/auth/src': {
    branches: 95,
    functions: 95,
    lines: 95,
    statements: 95
  },
  
  // Módulos com thresholds mais baixos durante desenvolvimento
  'apps/comunicacao': {
    branches: 70,
    functions: 75,
    lines: 75,
    statements: 75
  },
  'apps/material-didatico': {
    branches: 70,
    functions: 75,
    lines: 75,
    statements: 75
  }
};

/**
 * Obtém o threshold para um determinado caminho de módulo
 * Verifica os thresholds específicos e, se não encontrado, retorna o padrão
 * 
 * @param modulePath Caminho do módulo
 * @returns Threshold de cobertura para o módulo
 */
export function getThresholdForModule(modulePath: string): CoverageThreshold {
  // Tenta encontrar um threshold exato para o caminho
  if (moduleThresholds[modulePath]) {
    return moduleThresholds[modulePath];
  }
  
  // Tenta encontrar um threshold para um diretório pai
  for (const path in moduleThresholds) {
    if (modulePath.startsWith(path)) {
      return moduleThresholds[path];
    }
  }
  
  // Retorna o threshold padrão
  return DEFAULT_THRESHOLD;
}

/**
 * Gera um objeto de configuração de thresholds para o Vitest/Jest
 * baseado nos módulos do projeto
 * 
 * @returns Configuração de thresholds para o relatório de cobertura
 */
export function generateCoverageThresholds(): Record<string, CoverageThreshold> {
  const thresholds: Record<string, CoverageThreshold> = {
    global: DEFAULT_THRESHOLD
  };
  
  // Adiciona thresholds específicos para cada módulo
  for (const [path, threshold] of Object.entries(moduleThresholds)) {
    thresholds[path] = threshold;
  }
  
  return thresholds;
} 