import '@testing-library/jest-dom';
import { expect, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estende os matchers do Vitest com os do jest-dom
expect.extend(matchers);

// Limpa automaticamente o DOM após cada teste
afterEach(() => {
  cleanup();
});

// Restaura todos os mocks depois de cada teste
afterEach(() => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
  
  // Restaura timers reais se algum mock de timer foi usado
  if (vi.isFakeTimers()) {
    vi.useRealTimers();
  }
});

// Mock para o localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true
});

// Mock para o ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock para o IntersectionObserver
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock básico para funções comuns e módulos externos
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<object>('react-router-dom');
  return {
    ...(actual as object),
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
    useParams: vi.fn().mockReturnValue({}),
    useLocation: vi.fn().mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
  };
});

// Mock para API e localStorage
vi.mock('@edunexia/api-client', () => ({
  useSupabaseClient: vi.fn().mockReturnValue({
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
  })
}));

// Mock para o React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockImplementation(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useMutation: vi.fn().mockImplementation(() => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null
  })),
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn()
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children
})); 