import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@edunexia/auth';
import PortalSelectorPage from '../index';

// Mock do hook useAuth
jest.mock('@edunexia/auth', () => ({
  useAuth: jest.fn()
}));

// Mock do hook useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('PortalSelectorPage', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    permissions: {
      matriculas: { read: true, write: true, delete: true },
      portal_aluno: { read: true, write: false, delete: false },
      material_didatico: { read: true, write: true, delete: false },
      comunicacao: { read: true, write: true, delete: true },
      financeiro: { read: true, write: false, delete: false },
      relatorios: { read: true, write: false, delete: false },
      configuracoes: { read: true, write: true, delete: true }
    }
  };

  const mockSignOut = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      signOut: mockSignOut
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com os módulos disponíveis', () => {
    render(
      <BrowserRouter>
        <PortalSelectorPage />
      </BrowserRouter>
    );

    // Verifica se o título está presente
    expect(screen.getByText('Escolha seu portal')).toBeInTheDocument();

    // Verifica se o nome do usuário está presente
    expect(screen.getByText('Bem-vindo(a), Test User!')).toBeInTheDocument();

    // Verifica se os módulos estão presentes
    expect(screen.getByText('Sistema de Matrículas')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Material Didático')).toBeInTheDocument();
    expect(screen.getByText('Comunicação')).toBeInTheDocument();
    expect(screen.getByText('Gestão Financeira')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('redireciona para o login quando não há usuário autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      signOut: mockSignOut
    });

    render(
      <BrowserRouter>
        <PortalSelectorPage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('mostra loading state quando isLoading é true', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: true,
      signOut: mockSignOut
    });

    render(
      <BrowserRouter>
        <PortalSelectorPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('navega para o módulo correto ao clicar em um card', () => {
    render(
      <BrowserRouter>
        <PortalSelectorPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Sistema de Matrículas'));
    expect(mockNavigate).toHaveBeenCalledWith('/matriculas');
  });

  it('executa logout corretamente', async () => {
    render(
      <BrowserRouter>
        <PortalSelectorPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Sair do sistema'));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('mostra mensagem quando usuário não tem acesso a nenhum módulo', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        ...mockUser,
        permissions: {
          matriculas: { read: false, write: false, delete: false },
          portal_aluno: { read: false, write: false, delete: false },
          material_didatico: { read: false, write: false, delete: false },
          comunicacao: { read: false, write: false, delete: false },
          financeiro: { read: false, write: false, delete: false },
          relatorios: { read: false, write: false, delete: false },
          configuracoes: { read: false, write: false, delete: false }
        }
      },
      isLoading: false,
      signOut: mockSignOut
    });

    render(
      <BrowserRouter>
        <PortalSelectorPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Você não tem acesso a nenhum módulo.')).toBeInTheDocument();
    expect(screen.getByText('Entre em contato com o administrador do sistema.')).toBeInTheDocument();
  });
}); 