import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../AuthProvider';
import { useAuth } from '../hooks/AuthContext';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock do Supabase Client
const mockSupabaseClient = {
  auth: {
    getSession: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn()
  },
  from: jest.fn()
} as unknown as SupabaseClient;

// Mock dos dados de teste
const mockUser = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'student',
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  permissions: {
    matriculas: { read: true, write: false, delete: false },
    comunicacao: { read: true, write: false, delete: false },
    material_didatico: { read: true, write: false, delete: false },
    portal_aluno: { read: true, write: true, delete: false },
    financeiro: { read: false, write: false, delete: false },
    vendas: { read: false, write: false, delete: false },
    portal_parceiro: { read: false, write: false, delete: false },
    portal_polo: { read: false, write: false, delete: false },
    contabilidade: { read: false, write: false, delete: false },
    rh: { read: false, write: false, delete: false },
    configuracoes: { read: false, write: false, delete: false }
  }
};

const mockSession = {
  user: mockUser,
  token: {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600000,
    token_type: 'bearer'
  },
  expires_at: Date.now() + 3600000
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve inicializar com estado de carregamento', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={mockSupabaseClient}>
          {children}
        </AuthProvider>
      )
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.session).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('deve carregar sessão existente ao inicializar', async () => {
    // Mock da sessão existente
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    // Mock do perfil do usuário
    mockSupabaseClient.from.mockImplementation((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockUser,
        error: null
      })
    }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={mockSupabaseClient}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.error).toBe(null);
  });

  it('deve realizar login com sucesso', async () => {
    // Mock do login
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    // Mock do perfil do usuário
    mockSupabaseClient.from.mockImplementation((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockUser,
        error: null
      })
    }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={mockSupabaseClient}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Realizar login
    const response = await act(async () => {
      return result.current.signIn({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(response.user).toEqual(mockUser);
    expect(response.session).toEqual(mockSession);
    expect(response.error).toBe(null);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual(mockSession);
  });

  it('deve realizar cadastro com sucesso', async () => {
    // Mock do cadastro
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null
    });

    // Mock do perfil do usuário
    mockSupabaseClient.from.mockImplementation((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockUser,
        error: null
      }),
      insert: jest.fn().mockResolvedValue({
        error: null
      })
    }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={mockSupabaseClient}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Realizar cadastro
    const response = await act(async () => {
      return result.current.signUp({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      });
    });

    expect(response.user).toEqual(mockUser);
    expect(response.session).toEqual(mockSession);
    expect(response.error).toBe(null);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual(mockSession);
  });

  it('deve realizar logout com sucesso', async () => {
    // Mock do logout
    mockSupabaseClient.auth.signOut.mockResolvedValue({
      error: null
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={mockSupabaseClient}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Realizar logout
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBe(null);
    expect(result.current.session).toBe(null);
  });

  it('deve atualizar perfil com sucesso', async () => {
    // Mock do perfil do usuário
    mockSupabaseClient.from.mockImplementation((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockUser,
        error: null
      }),
      update: jest.fn().mockReturnThis()
    }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={mockSupabaseClient}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Atualizar perfil
    const updatedUser = await act(async () => {
      return result.current.updateProfile({
        name: 'Updated Name'
      });
    });

    expect(updatedUser).toEqual({
      ...mockUser,
      name: 'Updated Name'
    });
    expect(result.current.user).toEqual({
      ...mockUser,
      name: 'Updated Name'
    });
  });

  it('deve atualizar preferências com sucesso', async () => {
    // Mock do perfil do usuário
    mockSupabaseClient.from.mockImplementation((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockUser,
        error: null
      }),
      update: jest.fn().mockReturnThis()
    }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={mockSupabaseClient}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Atualizar preferências
    const updatedUser = await act(async () => {
      return result.current.updatePreferences({
        theme: 'dark',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        timezone: 'America/Sao_Paulo'
      });
    });

    expect(updatedUser).toEqual({
      ...mockUser,
      preferences: {
        theme: 'dark',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        timezone: 'America/Sao_Paulo'
      }
    });
    expect(result.current.user).toEqual({
      ...mockUser,
      preferences: {
        theme: 'dark',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        timezone: 'America/Sao_Paulo'
      }
    });
  });

  it('deve lidar com erros de autenticação', async () => {
    // Mock de erro no login
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: new Error('Invalid credentials')
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={mockSupabaseClient}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Tentar login com credenciais inválidas
    const response = await act(async () => {
      return result.current.signIn({
        email: 'test@example.com',
        password: 'wrong-password'
      });
    });

    expect(response.error).toBeInstanceOf(Error);
    expect(response.error?.message).toBe('Invalid credentials');
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Invalid credentials');
  });
}); 