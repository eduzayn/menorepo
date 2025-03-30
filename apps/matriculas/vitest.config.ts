import { createVitestConfig } from '@edunexia/test-config';

export default createVitestConfig('./', {
  // Configurações específicas do módulo de matrículas, se necessário
  coverage: {
    thresholds: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    include: [
      'src/components/**',
      'src/hooks/**',
      'src/utils/**',
    ],
  },
}); 