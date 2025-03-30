import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SupabaseClient } from '@supabase/supabase-js';

import { AuthProvider } from '../AuthProvider';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

// Mock do cliente Supabase
const mockSupabaseClient = {
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn()
  },
  from: vi.fn()
} as unknown as SupabaseClient;

// Componente de teste que consome o contexto de autenticação
const TestAuthConsumer = () => {
  const auth = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="userId">{auth.user?.id || 'none'}</div>
      <div data-testid="userEmail">{auth.user?.email || 'none'}</div>
      <div data-testid="errorMessage">{auth.error?.message || 'none'}</div>
      
      <button 
        data-testid="checkAdmin" 
        onClick={() => auth.hasRole('admin')}
      >
        Check Admin
      </button>
      
      <button 
        data-testid="checkPermission" 
        onClick={() => auth.hasPermission('edit_users')}
      >
        Check Permission
      </button>
      
      <button 
        data-testid="updateProfile" 
        onClick={() => auth.updateProfile({ nome: 'Nome Atualizado' })}
      >
        Update Profile
      </button>
    </div>
  );
};

// Componente para testar o hasRole e hasPermission
const TestRolePermissionComponent = () => {
  const auth = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="is-admin">{auth.hasRole('admin').toString()}</div>
      <div data-testid="is-aluno">{auth.hasRole('aluno').toString()}</div>
      <div data-testid="is-visitante">{auth.hasRole('visitante').toString()}</div>
      <div data-testid="can-read">{auth.hasPermission('read_content').toString()}</div>
      <div data-testid="can-edit">{auth.hasPermission('edit_content').toString()}</div>
    </div>
  );
};

// Componente para testar o updateProfile
const TestUpdateProfileComponent = () => {
  const auth = useAuth();
  const [updateResult, setUpdateResult] = React.useState<any>(null);
  const [updateError, setUpdateError] = React.useState<Error | null>(null);
  
  const handleUpdateProfile = async () => {
    try {
      const result = await auth.updateProfile({ nome: 'Nome Atualizado' });
      setUpdateResult(result);
    } catch (error) {
      setUpdateError(error as Error);
    }
  };
  
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="update-success">{updateResult?.success?.toString() || 'none'}</div>
      <div data-testid="update-error">{updateError?.message || 'none'}</div>
      <button 
        data-testid="update-profile-btn" 
        onClick={handleUpdateProfile}
      >
        Update Profile
      </button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });
  
  it('deve iniciar com estado de carregamento', async () => {
    // Configurar o mock para atrasar a resposta
    mockSupabaseClient.auth.getSession.mockReturnValue(
      new Promise(resolve => setTimeout(() => {
        resolve({
          data: { session: null },
          error: null
        });
      }, 100))
    );
    
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));
    
    // Renderizar o componente com o provider
    render(
      <AuthProvider supabaseClient={mockSupabaseClient}>
        <TestAuthConsumer />
      </AuthProvider>
    );
    
    // Verificar o estado inicial (carregando)
    expect(screen.getByTestId('loading').textContent).toBe('true');
    
    // Aguardar o carregamento ser finalizado
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });
  
  it('deve lidar com erro ao verificar sessão', async () => {
    // Configurar o mock para retornar erro
    const sessionError = new Error('Erro ao verificar sessão');
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: sessionError
    });
    
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));
    
    // Espionar console.error para evitar poluição nos logs de teste
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Renderizar o componente com o provider
    render(
      <AuthProvider supabaseClient={mockSupabaseClient}>
        <TestAuthConsumer />
      </AuthProvider>
    );
    
    // Aguardar o carregamento ser finalizado
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Verificar que o erro foi capturado
    expect(screen.getByTestId('errorMessage').textContent).toBe('Erro ao verificar sessão');
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    
    // Restaurar mock do console
    consoleSpy.mockRestore();
  });
  
  it('deve carregar os dados do usuário quando há sessão', async () => {
    // Criar dados mockados
    const mockUser: User = {
      id: 'user-123',
      email: 'teste@edunexia.com',
      nome: 'Usuário Teste',
      perfil: 'aluno',
      status: 'ativo',
      permissoes: ['read_content', 'submit_assignments']
    };
    
    const mockSessionData = {
      user: {
        id: mockUser.id,
        email: mockUser.email
      },
      access_token: 'token-123',
      refresh_token: 'refresh-123',
      expires_at: Date.now() + 3600,
      token_type: 'bearer'
    };
    
    // Configurar mocks
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSessionData },
      error: null
    });
    
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));
    
    mockSupabaseClient.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockUser,
        error: null
      })
    }));
    
    // Renderizar o componente com o provider
    render(
      <AuthProvider supabaseClient={mockSupabaseClient}>
        <TestAuthConsumer />
      </AuthProvider>
    );
    
    // Aguardar o carregamento ser finalizado
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Verificar que os dados do usuário foram carregados
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(screen.getByTestId('userId').textContent).toBe(mockUser.id);
    expect(screen.getByTestId('userEmail').textContent).toBe(mockUser.email);
  });
  
  it('deve verificar permissões e papéis do usuário corretamente', async () => {
    // Criar dados mockados
    const mockUser: User = {
      id: 'user-123',
      email: 'teste@edunexia.com',
      nome: 'Usuário Teste',
      perfil: 'aluno',
      status: 'ativo',
      permissoes: ['read_content', 'submit_assignments']
    };
    
    const mockSessionData = {
      user: {
        id: mockUser.id,
        email: mockUser.email
      },
      access_token: 'token-123',
      refresh_token: 'refresh-123',
      expires_at: Date.now() + 3600,
      token_type: 'bearer'
    };
    
    // Configurar mocks
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSessionData },
      error: null
    });
    
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));
    
    mockSupabaseClient.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockUser,
        error: null
      })
    }));
    
    // Renderizar o componente com o provider
    render(
      <AuthProvider supabaseClient={mockSupabaseClient}>
        <TestRolePermissionComponent />
      </AuthProvider>
    );
    
    // Aguardar o carregamento ser finalizado
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Verificar que o usuário está autenticado
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    
    // Verificar os papéis (roles)
    expect(screen.getByTestId('is-admin').textContent).toBe('false');
    expect(screen.getByTestId('is-aluno').textContent).toBe('true');
    expect(screen.getByTestId('is-visitante').textContent).toBe('true');
    
    // Verificar as permissões
    expect(screen.getByTestId('can-read').textContent).toBe('true');
    expect(screen.getByTestId('can-edit').textContent).toBe('false');
  });
  
  it('deve atualizar o perfil do usuário corretamente', async () => {
    // Criar dados mockados
    const mockUser: User = {
      id: 'user-123',
      email: 'teste@edunexia.com',
      nome: 'Usuário Teste',
      perfil: 'aluno',
      status: 'ativo',
      permissoes: ['read_content', 'submit_assignments']
    };
    
    const mockSessionData = {
      user: {
        id: mockUser.id,
        email: mockUser.email
      },
      access_token: 'token-123',
      refresh_token: 'refresh-123',
      expires_at: Date.now() + 3600,
      token_type: 'bearer'
    };
    
    // Configurar mock para getSession
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSessionData },
      error: null
    });
    
    // Configurar mock para onAuthStateChange
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));
    
    // Configurar mock para from (consultas ao banco)
    const updateMock = vi.fn().mockResolvedValue({
      error: null
    });
    
    const eqMock = vi.fn().mockReturnThis();
    
    mockSupabaseClient.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: eqMock,
      update: updateMock,
      single: vi.fn().mockResolvedValue({
        data: mockUser,
        error: null
      })
    }));
    
    // Renderizar o componente com o provider
    render(
      <AuthProvider supabaseClient={mockSupabaseClient}>
        <TestUpdateProfileComponent />
      </AuthProvider>
    );
    
    // Aguardar o carregamento ser finalizado
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Clicar no botão para atualizar o perfil
    await act(async () => {
      screen.getByTestId('update-profile-btn').click();
    });
    
    // Verificar que a função update foi chamada
    expect(updateMock).toHaveBeenCalledWith({ nome: 'Nome Atualizado' });
    
    // Verificar que o update foi bem-sucedido
    await waitFor(() => {
      expect(screen.getByTestId('update-success').textContent).toBe('true');
    });
  });
  
  it('deve lidar com erros ao atualizar o perfil', async () => {
    // Criar dados mockados
    const mockUser: User = {
      id: 'user-123',
      email: 'teste@edunexia.com',
      nome: 'Usuário Teste',
      perfil: 'aluno',
      status: 'ativo'
    };
    
    const mockSessionData = {
      user: {
        id: mockUser.id,
        email: mockUser.email
      },
      access_token: 'token-123',
      refresh_token: 'refresh-123',
      expires_at: Date.now() + 3600,
      token_type: 'bearer'
    };
    
    // Configurar mocks
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSessionData },
      error: null
    });
    
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));
    
    // Configurar erro ao atualizar
    const updateError = new Error('Erro ao atualizar perfil');
    
    mockSupabaseClient.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      update: vi.fn().mockResolvedValue({
        error: updateError
      }),
      single: vi.fn().mockResolvedValue({
        data: mockUser,
        error: null
      })
    }));
    
    // Espionar console.error para evitar poluição nos logs de teste
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Renderizar o componente com o provider
    render(
      <AuthProvider supabaseClient={mockSupabaseClient}>
        <TestUpdateProfileComponent />
      </AuthProvider>
    );
    
    // Aguardar o carregamento ser finalizado
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Clicar no botão para atualizar o perfil
    await act(async () => {
      screen.getByTestId('update-profile-btn').click();
    });
    
    // Verificar que o erro foi capturado
    await waitFor(() => {
      expect(screen.getByTestId('update-error').textContent).toBe('Erro ao atualizar perfil');
    });
    
    // Restaurar mock do console
    consoleSpy.mockRestore();
  });
  
  it('deve reagir a eventos de autenticação', async () => {
    // Configurar mock inicial sem sessão
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    // Simular callback de onAuthStateChange
    let authCallback: Function;
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } }
      };
    });
    
    // Mock para consulta de usuário
    const mockUser: User = {
      id: 'user-123',
      email: 'teste@edunexia.com',
      nome: 'Usuário Teste',
      perfil: 'aluno',
      status: 'ativo'
    };
    
    mockSupabaseClient.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockUser,
        error: null
      })
    }));
    
    // Renderizar o componente com o provider
    render(
      <AuthProvider supabaseClient={mockSupabaseClient}>
        <TestAuthConsumer />
      </AuthProvider>
    );
    
    // Aguardar o carregamento ser finalizado
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Estado inicial (não autenticado)
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    
    // Simular evento de login
    const mockSessionData = {
      user: {
        id: mockUser.id,
        email: mockUser.email
      },
      access_token: 'token-123',
      refresh_token: 'refresh-123',
      expires_at: Date.now() + 3600,
      token_type: 'bearer'
    };
    
    await act(async () => {
      if (authCallback) {
        await authCallback('SIGNED_IN', mockSessionData);
      }
    });
    
    // Aguardar a atualização do estado
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });
    
    // Verificar que os dados do usuário foram carregados
    expect(screen.getByTestId('userId').textContent).toBe(mockUser.id);
    
    // Simular evento de logout
    await act(async () => {
      if (authCallback) {
        await authCallback('SIGNED_OUT', null);
      }
    });
    
    // Aguardar a atualização do estado
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    });
  });
}); 