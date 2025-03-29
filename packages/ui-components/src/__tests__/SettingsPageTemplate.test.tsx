import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPageTemplate } from '../templates/SettingsPage';

const mockTabs = [
  {
    id: 'general',
    title: 'Geral',
    content: <div data-testid="general-content">Configurações Gerais</div>
  },
  {
    id: 'security',
    title: 'Segurança',
    content: <div data-testid="security-content">Configurações de Segurança</div>
  },
  {
    id: 'notifications',
    title: 'Notificações',
    content: <div data-testid="notifications-content">Configurações de Notificações</div>
  }
];

describe('SettingsPageTemplate', () => {
  test('renderiza corretamente o título e a primeira aba por padrão', () => {
    render(
      <SettingsPageTemplate 
        title="Configurações do Sistema" 
        tabs={mockTabs}
      />
    );
    
    expect(screen.getByText('Configurações do Sistema')).toBeInTheDocument();
    expect(screen.getByTestId('general-content')).toBeInTheDocument();
    expect(screen.queryByTestId('security-content')).not.toBeInTheDocument();
  });

  test('renderiza subtítulo quando fornecido', () => {
    render(
      <SettingsPageTemplate 
        title="Configurações" 
        subtitle="Gerencie as preferências do sistema"
        tabs={mockTabs}
      />
    );
    
    expect(screen.getByText('Gerencie as preferências do sistema')).toBeInTheDocument();
  });

  test('renderiza a aba especificada em defaultActiveTab', () => {
    render(
      <SettingsPageTemplate 
        title="Configurações" 
        tabs={mockTabs}
        defaultActiveTab="security"
      />
    );
    
    expect(screen.queryByTestId('general-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('security-content')).toBeInTheDocument();
  });

  test('permite mudar de aba ao clicar', () => {
    render(
      <SettingsPageTemplate 
        title="Configurações" 
        tabs={mockTabs}
      />
    );
    
    // Inicialmente a primeira aba deve estar ativa
    expect(screen.getByTestId('general-content')).toBeInTheDocument();
    
    // Clicar na aba de segurança
    fireEvent.click(screen.getByText('Segurança'));
    
    // Agora o conteúdo da segunda aba deve estar visível
    expect(screen.queryByTestId('general-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('security-content')).toBeInTheDocument();
  });

  test('exibe indicador de carregamento quando isLoading é true', () => {
    const { container } = render(
      <SettingsPageTemplate 
        title="Configurações" 
        tabs={mockTabs}
        isLoading={true}
      />
    );
    
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByTestId('general-content')).not.toBeInTheDocument();
  });

  test('renderiza mensagem de erro quando fornecida', () => {
    render(
      <SettingsPageTemplate 
        title="Configurações" 
        tabs={mockTabs}
        error="Falha ao carregar configurações"
      />
    );
    
    expect(screen.getByText('Falha ao carregar configurações')).toBeInTheDocument();
  });

  test('chama onTabChange quando uma aba é alterada', () => {
    const handleTabChange = jest.fn();
    
    render(
      <SettingsPageTemplate 
        title="Configurações" 
        tabs={mockTabs}
        onTabChange={handleTabChange}
      />
    );
    
    // Clicar na aba de notificações
    fireEvent.click(screen.getByText('Notificações'));
    
    // O callback deve ser chamado com o ID da aba clicada
    expect(handleTabChange).toHaveBeenCalledWith('notifications');
  });
}); 