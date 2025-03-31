import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { createClient } from '@supabase/supabase-js';
import { AuthProvider } from '../../AuthProvider';
import { useAuth } from '../../hooks/AuthContext';

// Configuração do cliente Supabase para testes
const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

describe('Integração de Autenticação', () => {
  let testUser: {
    email: string;
    password: string;
    name: string;
  };

  beforeAll(() => {
    // Criar usuário de teste
    testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'test-password-123',
      name: 'Test User'
    };
  });

  afterAll(async () => {
    // Limpar dados de teste
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.auth.admin.deleteUser(user.id);
    }
  });

  it('deve realizar o fluxo completo de autenticação', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={supabase}>
          {children}
        </AuthProvider>
      )
    });

    // 1. Verificar estado inicial
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.session).toBe(null);
    expect(result.current.error).toBe(null);

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 2. Realizar cadastro
    const signUpResponse = await act(async () => {
      return result.current.signUp({
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
        role: 'student'
      });
    });

    expect(signUpResponse.error).toBe(null);
    expect(signUpResponse.user).toBeTruthy();
    expect(signUpResponse.user?.email).toBe(testUser.email);
    expect(signUpResponse.user?.name).toBe(testUser.name);
    expect(signUpResponse.user?.role).toBe('student');
    expect(signUpResponse.session).toBeTruthy();

    // 3. Verificar estado após cadastro
    expect(result.current.user).toBeTruthy();
    expect(result.current.session).toBeTruthy();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    // 4. Realizar logout
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBe(null);
    expect(result.current.session).toBe(null);

    // 5. Realizar login
    const signInResponse = await act(async () => {
      return result.current.signIn({
        email: testUser.email,
        password: testUser.password
      });
    });

    expect(signInResponse.error).toBe(null);
    expect(signInResponse.user).toBeTruthy();
    expect(signInResponse.user?.email).toBe(testUser.email);
    expect(signInResponse.user?.name).toBe(testUser.name);
    expect(signInResponse.session).toBeTruthy();

    // 6. Verificar estado após login
    expect(result.current.user).toBeTruthy();
    expect(result.current.session).toBeTruthy();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    // 7. Atualizar perfil
    const updatedUser = await act(async () => {
      return result.current.updateProfile({
        name: 'Updated Test User'
      });
    });

    expect(updatedUser.name).toBe('Updated Test User');
    expect(result.current.user?.name).toBe('Updated Test User');

    // 8. Atualizar preferências
    const userWithPreferences = await act(async () => {
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

    expect(userWithPreferences.preferences).toBeTruthy();
    expect(userWithPreferences.preferences?.theme).toBe('dark');
    expect(userWithPreferences.preferences?.language).toBe('pt-BR');
    expect(userWithPreferences.preferences?.notifications?.email).toBe(true);
    expect(userWithPreferences.preferences?.notifications?.push).toBe(true);
    expect(userWithPreferences.preferences?.notifications?.sms).toBe(false);
    expect(userWithPreferences.preferences?.timezone).toBe('America/Sao_Paulo');
  });

  it('deve lidar com erros de autenticação', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={supabase}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Tentar login com credenciais inválidas
    const signInResponse = await act(async () => {
      return result.current.signIn({
        email: 'invalid@example.com',
        password: 'wrong-password'
      });
    });

    expect(signInResponse.error).toBeTruthy();
    expect(signInResponse.user).toBeFalsy();
    expect(signInResponse.session).toBeFalsy();
    expect(result.current.error).toBeTruthy();
  });

  it('deve manter a sessão após recarregar a página', async () => {
    // Primeiro, fazer login
    const { result: firstResult } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={supabase}>
          {children}
        </AuthProvider>
      )
    });

    await act(async () => {
      await firstResult.current.signIn({
        email: testUser.email,
        password: testUser.password
      });
    });

    // Simular recarregamento da página
    const { result: secondResult } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider supabaseClient={supabase}>
          {children}
        </AuthProvider>
      )
    });

    // Aguardar carregamento inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verificar se a sessão foi mantida
    expect(secondResult.current.user).toBeTruthy();
    expect(secondResult.current.user?.email).toBe(testUser.email);
    expect(secondResult.current.session).toBeTruthy();
  });
}); 