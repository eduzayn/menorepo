import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuth, AuthProvider } from '../useAuth';
import { createClient } from '@supabase/supabase-js';

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

// Mock do cliente Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ 
        data: { subscription: { unsubscribe: vi.fn() } } 
      }))
    }
  }))
}));

// Componente wrapper para o contexto
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

describe('useAuth', () => {
  const mockUser = {
    id: 'user-123',
    email: 'usuario@edunexia.com',
    user_metadata: { nome: 'Usuário Teste' }
  };

  const mockSession = {
    user: mockUser,
    access_token: 'token-123',
    refresh_token: 'refresh-123',
    expires_at: Date.now() + 3600
  };

  const mockSupabaseClient = createClient('https://test.supabase.co', 'fake-key');

  // Wrapper para prover o contexto de autenticação
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider supabaseClient={mockSupabaseClient}>
      {children}
    </AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve iniciar com o estado de autenticação não carregado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('deve validar a sessão existente durante a inicialização', async () => {
    // Configurar o mock para retornar uma sessão existente
    mockSupabaseClient.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: mockSession },
      error: null
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Verificar o estado inicial (carregando)
    expect(result.current.isLoaded).toBe(false);
    
    // Aguardar a autenticação ser processada
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    
    // Verificar o estado final (autenticado)
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('deve lidar com erros na verificação da sessão', async () => {
    // Configurar o mock para retornar um erro
    mockSupabaseClient.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: null },
      error: new Error('Erro ao buscar sessão')
    });
    
    // Espionar o console.error para evitar que o erro apareça nos logs de teste
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Aguardar a autenticação ser processada
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    
    // Verificar o estado final (não autenticado devido ao erro)
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    
    consoleSpy.mockRestore();
  });

  it('deve autenticar o usuário com sucesso', async () => {
    // Configurar o mock para iniciar sem sessão
    mockSupabaseClient.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    // Configurar o mock para login com sucesso
    mockSupabaseClient.auth.signInWithPassword = vi.fn().mockResolvedValue({
      data: { session: mockSession, user: mockUser },
      error: null
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Aguardar a verificação inicial de sessão
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    
    // Realizar o login
    await act(async () => {
      await result.current.signIn({
        email: 'usuario@edunexia.com',
        password: 'senha123'
      });
    });
    
    // Verificar o estado final (autenticado)
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    
    // Verificar se a função de login foi chamada com os parâmetros corretos
    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'usuario@edunexia.com',
      password: 'senha123'
    });
  });

  it('deve retornar erro ao falhar na autenticação', async () => {
    // Configurar o mock para iniciar sem sessão
    mockSupabaseClient.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    // Configurar o mock para falha no login
    const authError = new Error('Credenciais inválidas');
    mockSupabaseClient.auth.signInWithPassword = vi.fn().mockResolvedValue({
      data: { session: null, user: null },
      error: authError
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Aguardar a verificação inicial de sessão
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    
    // Realizar o login com credenciais inválidas
    let error;
    await act(async () => {
      try {
        await result.current.signIn({
          email: 'usuario@edunexia.com',
          password: 'senha-incorreta'
        });
      } catch (e) {
        error = e;
      }
    });
    
    // Verificar que o erro foi lançado
    expect(error).toEqual(authError);
    
    // Verificar que o estado continua como não autenticado
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('deve fazer logout com sucesso', async () => {
    // Configurar o mock para iniciar com sessão
    mockSupabaseClient.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: mockSession },
      error: null
    });
    
    // Configurar o mock para logout com sucesso
    mockSupabaseClient.auth.signOut = vi.fn().mockResolvedValue({
      error: null
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Aguardar a autenticação ser processada
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    // Realizar o logout
    await act(async () => {
      await result.current.signOut();
    });
    
    // Verificar que o estado foi atualizado (não autenticado)
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    
    // Verificar se a função de logout foi chamada
    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
  });

  it('deve lidar com erros durante o logout', async () => {
    // Configurar o mock para iniciar com sessão
    mockSupabaseClient.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: mockSession },
      error: null
    });
    
    // Configurar o mock para falha no logout
    const logoutError = new Error('Erro ao fazer logout');
    mockSupabaseClient.auth.signOut = vi.fn().mockResolvedValue({
      error: logoutError
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Aguardar a autenticação ser processada
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    // Realizar o logout com erro
    let error;
    await act(async () => {
      try {
        await result.current.signOut();
      } catch (e) {
        error = e;
      }
    });
    
    // Verificar que o erro foi lançado
    expect(error).toEqual(logoutError);
    
    // Estado deve permanecer autenticado, pois o logout falhou
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('deve atualizar o estado quando a autenticação muda', async () => {
    // Configurar o mock para iniciar sem sessão
    mockSupabaseClient.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    // Guardar a função de callback do evento de autenticação para chamar manualmente
    let authChangeCallback: Function;
    mockSupabaseClient.auth.onAuthStateChange = vi.fn((callback) => {
      authChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Aguardar a verificação inicial de sessão
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    expect(result.current.isAuthenticated).toBe(false);
    
    // Simular um evento de alteração de autenticação (login)
    await act(async () => {
      if (authChangeCallback) {
        authChangeCallback('SIGNED_IN', { session: mockSession });
      }
    });
    
    // Verificar que o estado foi atualizado para autenticado
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    
    // Simular um evento de alteração de autenticação (logout)
    await act(async () => {
      if (authChangeCallback) {
        authChangeCallback('SIGNED_OUT', { session: null });
      }
    });
    
    // Verificar que o estado foi atualizado para não autenticado
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
}); 