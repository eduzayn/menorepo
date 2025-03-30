// Importação da configuração central de testes
import '@edunexia/test-config/setup';

// Configurações específicas para o módulo template, se necessário
import { vi } from 'vitest';

// Mock do cliente de API
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
      data: null,
      error: null
    })
  }
})); 