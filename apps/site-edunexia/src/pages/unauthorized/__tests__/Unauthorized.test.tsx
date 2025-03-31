import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UnauthorizedPage from '../index';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('UnauthorizedPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renderiza corretamente', () => {
    render(
      <BrowserRouter>
        <UnauthorizedPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Acesso Não Autorizado')).toBeInTheDocument();
    expect(screen.getByText(/Você não tem permissão para acessar esta página/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar para o portal/i })).toBeInTheDocument();
  });

  it('navega para o portal selector ao clicar no botão voltar', () => {
    render(
      <BrowserRouter>
        <UnauthorizedPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /voltar para o portal/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/portal-selector');
  });
}); 