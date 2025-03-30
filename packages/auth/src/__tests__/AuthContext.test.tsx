import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { AuthContext, AuthContextType } from '../hooks/AuthContext';

// Componente de teste que consome o contexto
const TestAuthConsumer = () => {
  return (
    <AuthContext.Consumer>
      {(context) => (
        <div>
          <span data-testid="loading">{context.loading ? 'Carregando' : 'Pronto'}</span>
          <span data-testid="authenticated">{context.isAuthenticated ? 'Autenticado' : 'Não autenticado'}</span>
          <span data-testid="user-id">{context.user?.id || 'Sem usuário'}</span>
        </div>
      )}
    </AuthContext.Consumer>
  );
};

describe('AuthContext', () => {
  it('deve usar valores padrão quando não há provider', () => {
    render(<TestAuthConsumer />);
    
    expect(screen.getByTestId('loading').textContent).toBe('Pronto');
    expect(screen.getByTestId('authenticated').textContent).toBe('Não autenticado');
    expect(screen.getByTestId('user-id').textContent).toBe('Sem usuário');
  });
  
  it('deve usar os valores fornecidos pelo provider', () => {
    // Valores de contexto para teste
    const mockContextValue: AuthContextType = {
      user: { id: 'user-123', email: 'teste@edunexia.com' } as any,
      session: { 
        user: { id: 'user-123' } as any, 
        token: { access_token: 'token-123' } as any, 
        expires_at: Date.now() + 3600 
      },
      loading: true,
      error: null,
      isAuthenticated: true,
      signIn: async () => ({}),
      signOut: async () => ({}),
      hasPermission: () => true,
      hasRole: () => true,
      updateProfile: async () => ({})
    };
    
    render(
      <AuthContext.Provider value={mockContextValue}>
        <TestAuthConsumer />
      </AuthContext.Provider>
    );
    
    expect(screen.getByTestId('loading').textContent).toBe('Carregando');
    expect(screen.getByTestId('authenticated').textContent).toBe('Autenticado');
    expect(screen.getByTestId('user-id').textContent).toBe('user-123');
  });
}); 