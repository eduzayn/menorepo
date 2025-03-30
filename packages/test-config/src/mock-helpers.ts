import { vi } from 'vitest';

// Interface para mock do Supabase
export interface SupabaseMockOptions {
  authSession?: any;
  userData?: any;
  error?: any;
}

/**
 * Cria um mock para o cliente Supabase
 */
export function mockSupabaseClient({
  authSession = null,
  userData = null,
  error = null
}: SupabaseMockOptions = {}) {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: authSession },
        error
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: authSession ? { id: authSession.user.id } : null, session: authSession },
        error
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: vi.fn()
          }
        }
      })
    },
    from: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: userData, error }),
      insert: vi.fn().mockResolvedValue({ data: userData, error }),
      update: vi.fn().mockResolvedValue({ data: userData, error }),
      delete: vi.fn().mockResolvedValue({ data: null, error }),
      match: vi.fn().mockReturnThis()
    }))
  };
}

/**
 * Mock para o hook useSupabaseClient
 */
export function mockUseSupabaseClient(options: SupabaseMockOptions = {}) {
  return vi.fn().mockReturnValue(mockSupabaseClient(options));
}

/**
 * Mock para localStorage
 */
export function setupLocalStorageMock() {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });

  return localStorageMock;
}

/**
 * Mock para fetch
 */
export function mockFetch(responseData: any, status = 200) {
  return vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(responseData),
      text: () => Promise.resolve(JSON.stringify(responseData))
    })
  );
}

/**
 * Helper para criar mocks de hooks que usam useQuery do React Query
 */
export function mockReactQuery(data: any, options: any = {}) {
  const {
    isLoading = false,
    isError = false,
    error = null,
    isFetching = false
  } = options;

  return {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch: vi.fn().mockResolvedValue({ data })
  };
} 