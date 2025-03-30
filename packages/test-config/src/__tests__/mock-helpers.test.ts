import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockSupabaseClient, setupLocalStorageMock, mockFetch, mockReactQuery } from '../mock-helpers';

describe('Helpers de Mock', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('mockSupabaseClient', () => {
    it('deve criar um mock básico do Supabase', () => {
      const supabaseMock = mockSupabaseClient();
      
      expect(supabaseMock.auth).toBeDefined();
      expect(supabaseMock.from).toBeDefined();
      expect(typeof supabaseMock.auth.getSession).toBe('function');
      expect(typeof supabaseMock.from).toBe('function');
    });

    it('deve permitir configurar sessão e dados do usuário', async () => {
      const mockSession = { user: { id: 'user-123' } };
      const mockUserData = { id: 'user-123', nome: 'Teste' };
      
      const supabaseMock = mockSupabaseClient({
        authSession: mockSession,
        userData: mockUserData
      });
      
      // Verificar se a sessão é retornada
      const sessionResult = await supabaseMock.auth.getSession();
      expect(sessionResult.data.session).toEqual(mockSession);
      
      // Verificar se os dados do usuário são retornados
      const userResult = await supabaseMock.from().single();
      expect(userResult.data).toEqual(mockUserData);
    });
  });

  describe('setupLocalStorageMock', () => {
    it('deve configurar um mock para o localStorage', () => {
      const localStorageMock = setupLocalStorageMock();
      
      // Testar métodos do localStorage
      localStorageMock.setItem('teste', 'valor');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('teste', 'valor');
      
      localStorageMock.getItem('teste');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('teste');
    });
  });

  describe('mockFetch', () => {
    it('deve criar um mock para fetch com sucesso', async () => {
      const mockData = { id: 1, nome: 'Item de Teste' };
      global.fetch = mockFetch(mockData);
      
      const response = await fetch('https://api.exemplo.com/dados');
      const data = await response.json();
      
      expect(data).toEqual(mockData);
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    it('deve criar um mock para fetch com erro', async () => {
      const errorData = { message: 'Erro ao buscar dados' };
      global.fetch = mockFetch(errorData, 404);
      
      const response = await fetch('https://api.exemplo.com/dados');
      const data = await response.json();
      
      expect(data).toEqual(errorData);
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('mockReactQuery', () => {
    it('deve criar um mock para hooks de React Query', () => {
      const mockData = { items: [1, 2, 3] };
      const queryResult = mockReactQuery(mockData);
      
      expect(queryResult.data).toEqual(mockData);
      expect(queryResult.isLoading).toBe(false);
      expect(queryResult.isError).toBe(false);
      expect(typeof queryResult.refetch).toBe('function');
    });

    it('deve permitir configurar estados personalizados', () => {
      const mockError = new Error('Falha ao carregar dados');
      const queryResult = mockReactQuery(null, {
        isLoading: true,
        isError: true,
        error: mockError
      });
      
      expect(queryResult.data).toBeNull();
      expect(queryResult.isLoading).toBe(true);
      expect(queryResult.isError).toBe(true);
      expect(queryResult.error).toBe(mockError);
    });
  });
}); 