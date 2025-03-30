// Importação da configuração central de testes
import '@edunexia/test-config/setup';

// Configurações específicas para o módulo RH, se necessário
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

// Mock para funções específicas de RH
vi.mock('../utils/colaboradores', () => ({
  calcularBeneficios: vi.fn().mockReturnValue({
    valeRefeicao: 0,
    valeTransporte: 0,
    planoSaude: 0
  }),
  calcularFerias: vi.fn().mockReturnValue({
    diasDisponiveis: 30,
    valorFerias: 0
  })
})); 