import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@edunexia/test-config';
import { AuthProvider, useAuth } from '@edunexia/auth';

// Mock do componente de autenticação
const TestAuthComponent = () => {
  const { user, signIn, signOut } = useAuth();
  
  return (
    <div>
      {user ? (
        <>
          <p>Usuário logado: {user.email}</p>
          <button onClick={signOut}>Sair</button>
        </>
      ) : (
        <>
          <p>Usuário não logado</p>
          <button onClick={() => signIn({ email: 'teste@exemplo.com', password: '123456' })}>
            Entrar
          </button>
        </>
      )}
    </div>
  );
};

// Mock da biblioteca de autenticação
vi.mock('@edunexia/auth', async () => {
  const actual = await vi.importActual('@edunexia/auth');
  
  return {
    ...actual,
    useAuth: vi.fn().mockReturnValue({
      user: null,
      signIn: vi.fn(),
      signOut: vi.fn()
    })
  };
});

describe('Autenticação', () => {
  it('deve renderizar o componente com usuário não logado', () => {
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Usuário não logado')).toBeInTheDocument();
  });
}); 