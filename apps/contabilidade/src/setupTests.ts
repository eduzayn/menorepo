// Importação da configuração central de testes
import '@edunexia/test-config/setup';

// Configurações específicas para o módulo contabilidade, se necessário
import { vi } from 'vitest';

// Mock do cliente de API/Supabase para os testes
vi.mock('@edunexia/api-client', () => ({
  supabaseClient: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      data: null,
      error: null
    })
  }
}));

// Mock para módulos de finanças
vi.mock('@edunexia/financeiro-empresarial', () => ({
  calcularImpostos: vi.fn().mockReturnValue({
    irpj: 0,
    csll: 0,
    pis: 0,
    cofins: 0,
    iss: 0,
    total: 0
  }),
  gerarRecibo: vi.fn().mockReturnValue('recibo-mock-id')
})); 