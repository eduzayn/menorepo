import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { useAuth, type ModulePermission, type UserRole } from '@edunexia/auth';
import AppRoutes from '../index';

// Mock dos componentes de página
jest.mock('../../pages/login', () => () => <div>Login Page</div>);
jest.mock('../../pages/portal-selector', () => () => <div>Portal Selector Page</div>);
jest.mock('../../pages/unauthorized', () => () => <div>Unauthorized Page</div>);
jest.mock('../../pages/matriculas', () => () => <div>Matrículas Page</div>);
jest.mock('../../pages/portal-aluno', () => () => <div>Portal do Aluno Page</div>);
jest.mock('../../pages/material-didatico', () => () => <div>Material Didático Page</div>);
jest.mock('../../pages/comunicacao', () => () => <div>Comunicação Page</div>);
jest.mock('../../pages/financeiro', () => () => <div>Financeiro Page</div>);
jest.mock('../../pages/relatorios', () => () => <div>Relatórios Page</div>);
jest.mock('../../pages/configuracoes', () => () => <div>Configurações Page</div>);

// Mock do hook useAuth
jest.mock('@edunexia/auth', () => ({
  useAuth: jest.fn()
}));

describe('AppRoutes', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin' as UserRole,
    permissions: [
      'matriculas.view',
      'portal-aluno.view',
      'material-didatico.view',
      'comunicacao.view',
      'financeiro.view',
      'relatorios.view',
      'configuracoes.view'
    ] as ModulePermission[]
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false
    });
  });

  it('redireciona para login quando não há usuário autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false
    });

    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('mostra o portal selector quando o usuário está autenticado', () => {
    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );

    expect(screen.getByText('Portal Selector Page')).toBeInTheDocument();
  });

  it('mostra página não autorizada quando o usuário não tem permissão', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        ...mockUser,
        permissions: [] as ModulePermission[]
      },
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={['/matriculas']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
  });

  it('permite acesso aos módulos que o usuário tem permissão', () => {
    render(
      <MemoryRouter initialEntries={['/matriculas']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Matrículas Page')).toBeInTheDocument();
  });

  it('redireciona para o portal selector na rota raiz', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Portal Selector Page')).toBeInTheDocument();
  });

  it('mostra loading durante a verificação de autenticação', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true
    });

    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );

    expect(screen.getByText('Inicializando aplicação...')).toBeInTheDocument();
  });

  it('permite acesso a todos os módulos que o usuário tem permissão', () => {
    const routes = [
      '/matriculas',
      '/portal-aluno',
      '/material-didatico',
      '/comunicacao',
      '/financeiro',
      '/relatorios',
      '/configuracoes'
    ];

    routes.forEach(route => {
      render(
        <MemoryRouter initialEntries={[route]}>
          <AppRoutes />
        </MemoryRouter>
      );

      expect(screen.getByText(`${route.slice(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Page`)).toBeInTheDocument();
    });
  });
}); 