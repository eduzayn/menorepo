// Importação da configuração central de testes
import '@edunexia/test-config/setup';

// Configurações específicas para o módulo financeiro-empresarial, se necessário
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
      data: null,
      error: null
    })
  }
}));

// Mock de funções específicas para o módulo financeiro
vi.mock('../utils/calculosFinanceiros', () => ({
  calcularJuros: vi.fn((valor, taxa, prazo) => valor * taxa * prazo / 100),
  calcularParcelas: vi.fn((valor, numeroParcelas) => Array(numeroParcelas).fill(valor / numeroParcelas)),
  formatarMoeda: vi.fn(valor => `R$ ${valor.toFixed(2)}`)
})); 