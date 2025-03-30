// Importação da configuração central de testes
import '@edunexia/test-config/setup';

// Configurações específicas para o módulo de matrículas, se necessário
// Por exemplo, mocks para serviços específicos do módulo

// Mock para o serviço de contrato
import { vi } from 'vitest';

// Os serviços específicos do módulo podem ser mockados aqui
vi.mock('../services/contratoService', () => ({
  contratoService: {
    buscarContrato: vi.fn(),
    assinarContrato: vi.fn()
  }
})); 