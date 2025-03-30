import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseClient } from '@supabase/supabase-js';

import { AuthProvider } from '../AuthProvider';
import { AuthError } from '../types';
import { useAuth } from '../hooks/useAuth';

// Componente de teste para simular interações de login
const TestSignInComponent = () => {
  const auth = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  
  const handleLogin = async () => {
    try {
      await auth.signIn({
        email: 'user@example.com',
        password: 'wrong'
      });
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="error">{error || auth.error?.message || 'none'}</div>
      <button data-testid="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

// Componente de teste para simular interações de logout
const TestSignOutComponent = () => {
  const auth = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="error">{error || auth.error?.message || 'none'}</div>
      <button data-testid="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

describe('Erros de autenticação', () => {
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

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Configuração padrão para onAuthStateChange
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));
  });
  
  describe('signIn', () => {
    it('deve lançar erro quando a autenticação falha', async () => {
      // Configurar o mock para simular erro de autenticação
      const authError = new Error('Credenciais inválidas') as AuthError;
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { session: null, user: null },
        error: authError
      });
      
      // Configurar o mock para getSession
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      // Renderizar o componente
      render(
        <AuthProvider supabaseClient={mockSupabaseClient}>
          <TestSignInComponent />
        </AuthProvider>
      );
      
      // Esperar o carregamento inicial
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      // Clicar no botão de login
      await act(async () => {
        screen.getByTestId('login-button').click();
      });
      
      // Verificar que o método foi chamado
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'wrong'
      });
      
      // Verificar que o erro foi capturado no estado
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Credenciais inválidas');
      });
    });
    
    it('deve lançar erro quando a sessão é inválida após login', async () => {
      // Configurar o mock para simular login bem-sucedido, mas sem sessão válida
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'user@example.com' }, session: null },
        error: null
      });
      
      // Configurar o mock para getSession (após login)
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: new Error('Sessão inválida após login') as AuthError
      });
      
      // Renderizar o componente
      render(
        <AuthProvider supabaseClient={mockSupabaseClient}>
          <TestSignInComponent />
        </AuthProvider>
      );
      
      // Esperar o carregamento inicial
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      // Clicar no botão de login
      await act(async () => {
        screen.getByTestId('login-button').click();
      });
      
      // Verificar que o método foi chamado
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'wrong'
      });
      
      // Verificar que o erro foi capturado no estado
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Sessão inválida após login');
      });
    });
    
    it('deve lançar erro quando não encontra os dados do usuário', async () => {
      // Mock da sessão após login bem-sucedido
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'user@example.com'
        },
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        expires_at: Date.now() + 3600,
        token_type: 'bearer'
      };
      
      // Configurar o mock para simular login bem-sucedido
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockSession.user, session: mockSession },
        error: null
      });
      
      // Configurar o mock para getSession
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });
      
      // Configurar o mock para from (consulta ao banco)
      mockSupabaseClient.from.mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null, // Nenhum usuário encontrado
          error: null
        })
      }));
      
      // Renderizar o componente
      render(
        <AuthProvider supabaseClient={mockSupabaseClient}>
          <TestSignInComponent />
        </AuthProvider>
      );
      
      // Esperar o carregamento inicial
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      // Clicar no botão de login
      await act(async () => {
        screen.getByTestId('login-button').click();
      });
      
      // Verificar que o método foi chamado
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'wrong'
      });
      
      // Verificar que o erro foi capturado no estado
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Dados do usuário não encontrados');
      });
    });
    
    it('deve lançar erro quando falha ao buscar dados do usuário', async () => {
      // Mock da sessão após login bem-sucedido
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'user@example.com'
        },
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        expires_at: Date.now() + 3600,
        token_type: 'bearer'
      };
      
      // Configurar o mock para simular login bem-sucedido
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockSession.user, session: mockSession },
        error: null
      });
      
      // Configurar o mock para getSession
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });
      
      // Configurar o mock para from (consulta ao banco com erro)
      const dbError = new Error('Erro ao consultar o banco de dados');
      mockSupabaseClient.from.mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: dbError
        })
      }));
      
      // Renderizar o componente
      render(
        <AuthProvider supabaseClient={mockSupabaseClient}>
          <TestSignInComponent />
        </AuthProvider>
      );
      
      // Esperar o carregamento inicial
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      // Clicar no botão de login
      await act(async () => {
        screen.getByTestId('login-button').click();
      });
      
      // Verificar que o método foi chamado
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'wrong'
      });
      
      // Verificar que o erro foi capturado no estado
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Erro ao consultar o banco de dados');
      });
    });
  });
  
  describe('signOut', () => {
    it('deve lançar erro quando o logout falha', async () => {
      // Mock da sessão inicial (usuário autenticado)
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'user@example.com'
        },
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        expires_at: Date.now() + 3600,
        token_type: 'bearer'
      };
      
      // Configurar o mock para getSession (usuário logado)
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });
      
      // Configurar o mock para from (dados do usuário)
      mockSupabaseClient.from.mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'user-123',
            email: 'user@example.com',
            nome: 'Usuário Teste'
          },
          error: null
        })
      }));
      
      // Configurar erro no logout
      const logoutError = new Error('Falha ao fazer logout') as AuthError;
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: logoutError
      });
      
      // Renderizar o componente
      render(
        <AuthProvider supabaseClient={mockSupabaseClient}>
          <TestSignOutComponent />
        </AuthProvider>
      );
      
      // Esperar o carregamento inicial
      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
      });
      
      // Clicar no botão de logout
      await act(async () => {
        screen.getByTestId('logout-button').click();
      });
      
      // Verificar que o método foi chamado
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
      
      // Verificar que o erro foi capturado no estado
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Falha ao fazer logout');
      });
    });
  });
}); 