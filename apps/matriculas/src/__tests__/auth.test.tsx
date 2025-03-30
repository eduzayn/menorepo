import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, mockSupabaseClient, testUser, testSession } from '@edunexia/test-config';
import React from 'react';

// Componente de exemplo para teste
const PerfilUsuario = ({ usuarioId }: { usuarioId: string }) => {
  // Este é apenas um componente de exemplo
  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p data-testid="usuario-id">ID: {usuarioId}</p>
      <button>Editar Perfil</button>
    </div>
  );
};

// Mock do módulo de API
vi.mock('@edunexia/api-client', () => ({
  useSupabaseClient: () => mockSupabaseClient({
    authSession: testSession,
    userData: testUser,
  }),
}));

describe('Autenticação', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o perfil do usuário com dados de mock', () => {
    render(<PerfilUsuario usuarioId={testUser.id} />);
    
    // Verificar se os elementos foram renderizados
    expect(screen.getByText('Perfil do Usuário')).toBeInTheDocument();
    expect(screen.getByTestId('usuario-id').textContent).toContain(testUser.id);
    expect(screen.getByRole('button', { name: 'Editar Perfil' })).toBeInTheDocument();
  });
}); 