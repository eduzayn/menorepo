import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock para o Supabase
vi.mock('@edunexia/api-client', () => ({
  useSupabaseClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: null
        }
      }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: vi.fn()
          }
        }
      })
    },
    from: vi.fn().mockImplementation((table) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null })
    }))
  })
}));

// Componente wrapper para o contexto
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve iniciar com o estado de carregamento', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    
    // Verificar estado inicial
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.session).toBe(null);
    expect(result.current.error).toBe(null);
    
    // Aguardar o fim da verificação de sessão
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('deve verificar a sessão na inicialização', async () => {
    const mockSupabase = vi.mocked(require('@edunexia/api-client').useSupabaseClient());
    
    renderHook(() => useAuth(), { wrapper: Wrapper });
    
    // Verificar se getSession foi chamado
    await waitFor(() => {
      expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    });
  });

  it('deve realizar login com credenciais corretas', async () => {
    const mockUser = {
      id: 'user-123',
      nome: 'Teste',
      email: 'teste@edunexia.com.br',
      permissoes: ['ler', 'escrever'],
      perfil: 'aluno'
    };
    
    const mockSession = {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      expires_at: Date.now() + 3600000,
      token_type: 'bearer'
    };
    
    // Mock do retorno de signInWithPassword
    const mockSupabase = vi.mocked(require('@edunexia/api-client').useSupabaseClient());
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user: { id: 'user-123' },
        session: mockSession
      },
      error: null
    });
    
    // Mock do retorno da consulta ao usuário
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: mockUser, error: null })
    }));
    
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    
    // Aguardar o fim da verificação de sessão inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Realizar login
    await act(async () => {
      const response = await result.current.signIn({
        email: 'teste@edunexia.com.br',
        password: 'senha123'
      });
      
      // Verificar o retorno da função de login
      expect(response.user).not.toBeNull();
      expect(response.error).toBeNull();
    });
    
    // Verificar se o estado foi atualizado corretamente
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).not.toBeNull();
    expect(result.current.session?.token.access_token).toBe('access-token');
  });

  it('deve lidar com erros durante o login', async () => {
    const mockError = new Error('Credenciais inválidas');
    
    // Mock do retorno de signInWithPassword com erro
    const mockSupabase = vi.mocked(require('@edunexia/api-client').useSupabaseClient());
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: mockError
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    
    // Aguardar o fim da verificação de sessão inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Tentar realizar login
    await act(async () => {
      const response = await result.current.signIn({
        email: 'teste@edunexia.com.br',
        password: 'senha_errada'
      });
      
      // Verificar o retorno da função de login
      expect(response.user).toBeNull();
      expect(response.error).not.toBeNull();
      expect(response.error?.message).toBe('Credenciais inválidas');
    });
    
    // Verificar se o estado de erro foi atualizado
    expect(result.current.error).not.toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('deve realizar logout corretamente', async () => {
    // Simular um usuário já logado
    const mockUser = {
      id: 'user-123',
      nome: 'Teste',
      email: 'teste@edunexia.com.br',
      permissoes: ['ler', 'escrever'],
      perfil: 'aluno'
    };
    
    const mockSession = {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      expires_at: Date.now() + 3600000,
      token_type: 'bearer'
    };
    
    // Mock para getSession para simular usuário logado
    const mockSupabase = vi.mocked(require('@edunexia/api-client').useSupabaseClient());
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: mockSession
      }
    });
    
    // Mock para busca de dados do usuário
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: mockUser, error: null })
    }));
    
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    
    // Aguardar o fim da verificação de sessão inicial e definição do usuário
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).not.toBeNull();
    });
    
    // Realizar logout
    await act(async () => {
      const response = await result.current.signOut();
      
      // Verificar o retorno da função de logout
      expect(response.success).toBe(true);
      expect(response.error).toBeNull();
    });
    
    // Verificar se o estado foi limpo corretamente
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('deve verificar permissões corretamente', async () => {
    // Simular um usuário com permissões específicas
    const mockUser = {
      id: 'user-123',
      nome: 'Teste',
      email: 'teste@edunexia.com.br',
      permissoes: ['ler', 'escrever', 'editar_alunos'],
      perfil: 'coordenador'
    };
    
    const mockSession = {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      expires_at: Date.now() + 3600000,
      token_type: 'bearer'
    };
    
    // Mock para getSession para simular usuário logado
    const mockSupabase = vi.mocked(require('@edunexia/api-client').useSupabaseClient());
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: mockSession
      }
    });
    
    // Mock para busca de dados do usuário
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: mockUser, error: null })
    }));
    
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    
    // Aguardar o fim da verificação de sessão inicial e definição do usuário
    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });
    
    // Verificar permissões
    expect(result.current.hasPermission('ler')).toBe(true);
    expect(result.current.hasPermission('escrever')).toBe(true);
    expect(result.current.hasPermission('editar_alunos')).toBe(true);
    expect(result.current.hasPermission('excluir')).toBe(false);
    
    // Verificar perfil
    expect(result.current.hasRole('coordenador')).toBe(true);
    expect(result.current.hasRole('professor')).toBe(true); // Deve passar porque coordenador > professor
    expect(result.current.hasRole('admin')).toBe(false); // Deve falhar porque admin > coordenador
  });

  it('deve responder ao evento de alteração de autenticação', async () => {
    const mockUser = {
      id: 'user-123',
      nome: 'Teste',
      email: 'teste@edunexia.com.br',
      permissoes: ['ler'],
      perfil: 'aluno'
    };
    
    const mockSession = {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      expires_at: Date.now() + 3600000,
      token_type: 'bearer'
    };
    
    const mockSupabase = vi.mocked(require('@edunexia/api-client').useSupabaseClient());
    
    // Capturar a função de callback registrada no listener
    let authChangeCallback: Function;
    mockSupabase.auth.onAuthStateChange.mockImplementationOnce((callback) => {
      authChangeCallback = callback;
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn()
          }
        }
      };
    });
    
    // Mock para busca de dados do usuário
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockUser, error: null })
    }));
    
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    
    // Aguardar o fim da verificação de sessão inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Simular evento de login
    await act(async () => {
      // @ts-ignore - Ignorar tipo porque estamos chamando diretamente a callback capturada
      authChangeCallback('SIGNED_IN', mockSession);
    });
    
    // Aguardar a atualização do estado
    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
      expect(result.current.session).not.toBeNull();
    });
    
    // Verificar se os dados foram atualizados
    expect(result.current.user).toEqual(mockUser);
    
    // Simular evento de logout
    await act(async () => {
      // @ts-ignore - Ignorar tipo porque estamos chamando diretamente a callback capturada
      authChangeCallback('SIGNED_OUT', null);
    });
    
    // Verificar se o estado foi limpo
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });
}); 