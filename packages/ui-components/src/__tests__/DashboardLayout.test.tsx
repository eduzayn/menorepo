import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

describe('DashboardLayout', () => {
  test('renderiza conteúdo principal corretamente', () => {
    render(
      <DashboardLayout>
        <div data-testid="main-content">Conteúdo do Dashboard</div>
      </DashboardLayout>
    );
    
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  test('renderiza título quando fornecido', () => {
    render(
      <DashboardLayout title="Painel Administrativo">
        <div>Conteúdo</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
  });

  test('renderiza informações do usuário quando fornecidas', () => {
    render(
      <DashboardLayout 
        user={{ name: 'João Silva', email: 'joao@exemplo.com' }}
      >
        <div>Conteúdo</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  test('renderiza avatar do usuário com inicial quando nome é fornecido mas sem avatar', () => {
    const { container } = render(
      <DashboardLayout 
        user={{ name: 'João Silva' }}
      >
        <div>Conteúdo</div>
      </DashboardLayout>
    );
    
    const avatarElement = container.querySelector('.rounded-full');
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement?.textContent).toBe('J');
  });

  test('exibe email quando nome não é fornecido', () => {
    render(
      <DashboardLayout 
        user={{ email: 'joao@exemplo.com' }}
      >
        <div>Conteúdo</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('joao@exemplo.com')).toBeInTheDocument();
  });

  test('chama onLogout quando botão de sair é clicado', () => {
    const handleLogout = jest.fn();
    
    render(
      <DashboardLayout onLogout={handleLogout}>
        <div>Conteúdo</div>
      </DashboardLayout>
    );
    
    fireEvent.click(screen.getByText('Sair'));
    
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  test('renderiza sidebar personalizado quando fornecido', () => {
    render(
      <DashboardLayout 
        sidebar={<div data-testid="custom-sidebar">Menu Lateral Personalizado</div>}
      >
        <div>Conteúdo</div>
      </DashboardLayout>
    );
    
    expect(screen.getByTestId('custom-sidebar')).toBeInTheDocument();
    expect(screen.queryByText('Edunéxia')).not.toBeInTheDocument(); // O sidebar padrão não deve ser renderizado
  });

  test('renderiza conteúdo de cabeçalho personalizado quando fornecido', () => {
    render(
      <DashboardLayout 
        headerContent={<div data-testid="custom-header">Cabeçalho Personalizado</div>}
      >
        <div>Conteúdo</div>
      </DashboardLayout>
    );
    
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  test('renderiza rodapé personalizado quando fornecido', () => {
    const currentYear = new Date().getFullYear();
    
    render(
      <DashboardLayout 
        footer={<footer data-testid="custom-footer">Rodapé Personalizado</footer>}
      >
        <div>Conteúdo</div>
      </DashboardLayout>
    );
    
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(`${currentYear} Edunéxia`))).not.toBeInTheDocument(); // O rodapé padrão não deve ser renderizado
  });
}); 