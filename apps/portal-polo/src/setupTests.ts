// Importação da configuração central de testes
import '@edunexia/test-config/setup';

// Configurações específicas para o módulo portal-polo, se necessário
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
      data: null,
      error: null
    })
  }
})); 