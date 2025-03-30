import { createClient } from '@supabase/supabase-js';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { renderHook, act } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider } from '../AuthProvider';
import { useAuth } from '../hooks/useAuth';
import { AuthContext, AuthContextType } from '../hooks/AuthContext';
import { User, UserSession } from '../types';

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

// Componente de provedor de contexto dinâmico para testes
function DynamicContextProvider({
  children,
  initialValue
}: {
  children: React.ReactNode;
  initialValue: AuthContextType;
}) {
  const [value, setValue] = useState(initialValue);
  
  // Atualizar o valor do contexto quando as props mudarem
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

describe('useAuth', () => {
  // Mock do contexto de autenticação
  const mockUser: User = {
    id: 'user-123',
    email: 'usuario@edunexia.com',
    nome: 'Usuário Teste',
    perfil: 'aluno',
    status: 'ativo'
  };

  const mockSession: UserSession = {
    user: mockUser,
    token: {
      access_token: 'token-123',
      refresh_token: 'refresh-123',
      expires_at: Date.now() + 3600,
      token_type: 'bearer'
    },
    expires_at: Date.now() + 3600
  };

  // Mock inicial do contexto
  const createMockContextValue = (overrides?: Partial<AuthContextType>): AuthContextType => ({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    hasPermission: vi.fn().mockReturnValue(false),
    hasRole: vi.fn().mockReturnValue(false),
    updateProfile: vi.fn(),
    ...overrides
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve iniciar com o estado de autenticação carregando', () => {
    // Criar mock do contexto no estado inicial (carregando)
    const mockContextValue = createMockContextValue();
    
    // Renderizar o hook com o provedor de contexto
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockContextValue}>
          {children}
        </AuthContext.Provider>
      )
    });
    
    // Verificar que o hook retorna os valores do contexto corretamente
    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('deve validar a sessão existente durante a inicialização', () => {
    // Criar mock do contexto com autenticação
    const mockContextValue = createMockContextValue({
      user: mockUser,
      session: mockSession,
      loading: false,
      isAuthenticated: true
    });
    
    // Renderizar o hook com o provedor de contexto
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockContextValue}>
          {children}
        </AuthContext.Provider>
      )
    });
    
    // Verificar que o hook reflete os valores do contexto
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('deve autenticar o usuário com sucesso', async () => {
    // Mock da função signIn
    const signInMock = vi.fn().mockResolvedValue({
      user: mockUser,
      session: mockSession,
      error: null
    });
    
    // Criar componente wrapper com estado para simular troca de contexto
    const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const [contextValue, setContextValue] = React.useState<AuthContextType>(
        createMockContextValue({
          loading: false,
          signIn: async (credentials) => {
            // Chamar o mock original para testes
            const result = await signInMock(credentials);
            
            // Após o login simulado, atualizar o contexto
            setContextValue(createMockContextValue({
              user: mockUser,
              session: mockSession,
              loading: false,
              isAuthenticated: true,
              signIn: signInMock
            }));
            
            return result;
          }
        })
      );
      
      return (
        <AuthContext.Provider value={contextValue}>
          {children}
        </AuthContext.Provider>
      );
    };
    
    // Renderizar o hook com o wrapper que possui estado
    const { result } = renderHook(() => useAuth(), {
      wrapper: TestWrapper
    });
    
    // Verificar estado inicial
    expect(result.current.isAuthenticated).toBe(false);
    
    // Realizar o login
    await act(async () => {
      await result.current.signIn({
        email: 'usuario@edunexia.com',
        password: 'senha123'
      });
    });
    
    // Verificar que a função de login foi chamada com os parâmetros corretos
    expect(signInMock).toHaveBeenCalledWith({
      email: 'usuario@edunexia.com',
      password: 'senha123'
    });
    
    // Verificar que o hook reflete a mudança no contexto
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('deve fazer logout com sucesso', async () => {
    // Mock da função signOut
    const signOutMock = vi.fn().mockResolvedValue({
      success: true,
      error: null
    });
    
    // Criar componente wrapper com estado para simular troca de contexto
    const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const [contextValue, setContextValue] = React.useState<AuthContextType>(
        createMockContextValue({
          user: mockUser,
          session: mockSession,
          loading: false,
          isAuthenticated: true,
          signOut: async () => {
            // Chamar o mock original para testes
            const result = await signOutMock();
            
            // Após o logout simulado, atualizar o contexto
            setContextValue(createMockContextValue({
              loading: false,
              signOut: signOutMock
            }));
            
            return result;
          }
        })
      );
      
      return (
        <AuthContext.Provider value={contextValue}>
          {children}
        </AuthContext.Provider>
      );
    };
    
    // Renderizar o hook com o wrapper que possui estado
    const { result } = renderHook(() => useAuth(), {
      wrapper: TestWrapper
    });
    
    // Verificar o estado inicial
    expect(result.current.isAuthenticated).toBe(true);
    
    // Realizar o logout
    await act(async () => {
      await result.current.signOut();
    });
    
    // Verificar que a função de logout foi chamada
    expect(signOutMock).toHaveBeenCalled();
    
    // Verificar que o hook reflete a mudança no contexto
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
}); 