// Importação da configuração central de testes
import '@edunexia/test-config/setup';

// Configurações específicas para o site Edunexia, se necessário
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
      data: null,
      error: null
    })
  }
}));

// Mock para o React Query (usado no site)
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({
    data: null,
    isLoading: false,
    error: null
  }),
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn()
  })),
  QueryClientProvider: ({ children }) => children
})); 