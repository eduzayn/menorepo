import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth, type ModulePermission, type UserRole } from '@edunexia/auth';
import ModuleRoute from '../index';

// Mock do hook useAuth
jest.mock('@edunexia/auth', () => ({
  useAuth: jest.fn()
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const TestComponent = () => <div>Conteúdo do Módulo</div>;

describe('ModuleRoute', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renderiza o conteúdo quando o usuário tem permissão', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin' as UserRole,
        permissions: ['matriculas.view'] as ModulePermission[]
      },
      isLoading: false
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ModuleRoute requiredPermission="matriculas.view">
                <TestComponent />
              </ModuleRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Conteúdo do Módulo')).toBeInTheDocument();
  });

  it('redireciona para página não autorizada quando o usuário não tem permissão', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student' as UserRole,
        permissions: [] as ModulePermission[]
      },
      isLoading: false
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ModuleRoute requiredPermission="matriculas.view">
                <TestComponent />
              </ModuleRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/unauthorized');
  });

  it('mostra loading quando está verificando autenticação', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ModuleRoute requiredPermission="matriculas.view">
                <TestComponent />
              </ModuleRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Verificando permissões...')).toBeInTheDocument();
  });

  it('redireciona para login quando o usuário não está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ModuleRoute requiredPermission="matriculas.view">
                <TestComponent />
              </ModuleRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
}); 