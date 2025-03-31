// Importação da configuração central de testes
import '@edunexia/test-config/setup';
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Configurações específicas para o site Edunexia, se necessário
import { vi } from 'vitest';
import { ReactNode } from 'react';

// Estende o expect do Vitest com os matchers do jest-dom
expect.extend(matchers);

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup();
});

// Mock do cliente de API/Supabase para os testes
vi.mock('@edunexia/api-client', () => ({
  createClient: () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
}));

// Mock do AuthProvider para os testes
vi.mock('@edunexia/auth', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({
    currentUser: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
  }),
}));

// Mock para o React Query (usado no site)
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({
    data: null,
    isLoading: false,
    error: null
  }),
  useMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isLoading: false,
    error: null
  }),
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn()
  })),
  QueryClientProvider: ({ children }: { children: ReactNode }) => children
}));

// Mock para react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...(actual as object),
    useParams: vi.fn().mockReturnValue({}),
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
    useLocation: vi.fn().mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
  };
});

// Mock para hooks personalizados
vi.mock('./hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: null,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAdmin: vi.fn().mockReturnValue(false),
  }),
}));

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock
});

// Mock matchMedia
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