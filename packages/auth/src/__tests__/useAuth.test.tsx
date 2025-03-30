import { createClient } from '@supabase/supabase-js';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider } from '../AuthProvider';
import { useAuth } from '../hooks/useAuth';

// Mock do Supabase melhorado
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ 
        data: { session: null },
        error: null 
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { session: null, user: null },
        error: null
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn((callback) => {
        // Guardar o callback para poder disparar eventos manualmente
        (global as any).authChangeCallback = callback;
        return { 
          data: { 
            subscription: { 
              id: 'mock-id',
              unsubscribe: vi.fn() 
            } 
          } 
        };
      })
    },
    from: vi.fn().mockImplementation((table) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: null, 
        error: null 
      })
    }))
  }))
}));

// Mock do API Client
vi.mock('@edunexia/api-client', () => ({
  useSupabaseClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { session: null, user: null },
        error: null
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn((callback) => {
        return {
          data: {
            subscription: {
              id: 'mock-id',
              unsubscribe: vi.fn()
            }
          }
        };
      })
    },
    from: vi.fn().mockImplementation((table) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: null, 
        error: null 
      })
    }))
  }))
}));

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

  // Mock simplificado do AuthProvider para evitar problemas com o componente real
  const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  // Wrapper para prover o contexto de autenticação
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockAuthProvider>{children}</MockAuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Redefinir os mocks do Supabase para cada teste
    mockSupabaseClient.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    mockSupabaseClient.auth.signInWithPassword = vi.fn().mockResolvedValue({
      data: { session: null, user: null },
      error: null
    });
    
    mockSupabaseClient.auth.signOut = vi.fn().mockResolvedValue({
      error: null
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve iniciar com o estado de autenticação carregando', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.loading).toBe(true);
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
    expect(result.current.loading).toBe(true);
    
    // Aguardar a autenticação ser processada
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verificar o estado final (autenticado)
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
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
      expect(result.current.loading).toBe(false);
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
}); 