import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../components/tabs';
import { describe, it, expect, vi } from 'vitest';

describe('Tabs Component', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Informações Gerais', content: <div>Conteúdo da aba 1</div> },
    { id: 'tab2', label: 'Documentos', content: <div>Conteúdo da aba 2</div> },
    { id: 'tab3', label: 'Pagamentos', content: <div>Conteúdo da aba 3</div> },
  ];

  it('deve renderizar o componente de tabs corretamente', () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Verificar se a navegação de tabs foi renderizada
    const tabList = screen.getByRole('tablist');
    expect(tabList).toBeInTheDocument();
    
    // Verificar se todas as abas estão presentes
    mockTabs.forEach(tab => {
      expect(screen.getByRole('tab', { name: tab.label })).toBeInTheDocument();
    });
  });

  it('deve exibir o conteúdo da primeira aba por padrão', () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Verificar se o conteúdo da primeira aba está visível
    expect(screen.getByText('Conteúdo da aba 1')).toBeInTheDocument();
    
    // Verificar se os conteúdos das outras abas não estão visíveis
    expect(screen.queryByText('Conteúdo da aba 2')).not.toBeVisible();
    expect(screen.queryByText('Conteúdo da aba 3')).not.toBeVisible();
  });

  it('deve mudar para outra aba quando clicada', () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Clicar na segunda aba
    const secondTab = screen.getByRole('tab', { name: mockTabs[1].label });
    fireEvent.click(secondTab);
    
    // Verificar se o conteúdo da segunda aba está visível
    expect(screen.getByText('Conteúdo da aba 2')).toBeVisible();
    
    // Verificar se os conteúdos das outras abas não estão visíveis
    expect(screen.queryByText('Conteúdo da aba 1')).not.toBeVisible();
    expect(screen.queryByText('Conteúdo da aba 3')).not.toBeVisible();
    
    // Verificar se a segunda aba está marcada como ativa
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  it('deve iniciar com a aba específica quando defaultTabId é fornecido', () => {
    render(<Tabs tabs={mockTabs} defaultTabId="tab3" />);
    
    // Verificar se o conteúdo da terceira aba está visível
    expect(screen.getByText('Conteúdo da aba 3')).toBeVisible();
    
    // Verificar se os conteúdos das outras abas não estão visíveis
    expect(screen.queryByText('Conteúdo da aba 1')).not.toBeVisible();
    expect(screen.queryByText('Conteúdo da aba 2')).not.toBeVisible();
    
    // Verificar se a terceira aba está marcada como ativa
    const thirdTab = screen.getByRole('tab', { name: mockTabs[2].label });
    expect(thirdTab).toHaveAttribute('aria-selected', 'true');
  });

  it('deve chamar onTabChange quando uma aba é clicada', () => {
    const handleTabChange = vi.fn();
    render(<Tabs tabs={mockTabs} onTabChange={handleTabChange} />);
    
    // Clicar na segunda aba
    const secondTab = screen.getByRole('tab', { name: mockTabs[1].label });
    fireEvent.click(secondTab);
    
    // Verificar se a função de callback foi chamada com o ID da aba
    expect(handleTabChange).toHaveBeenCalledWith('tab2');
  });

  it('deve aplicar classes personalizadas quando fornecidas', () => {
    const customClass = 'custom-tabs-class';
    render(<Tabs tabs={mockTabs} className={customClass} />);
    
    // Verificar se a classe personalizada foi aplicada ao container principal
    const container = screen.getByTestId('tabs-container');
    expect(container).toHaveClass(customClass);
  });

  it('deve renderizar corretamente quando não há abas', () => {
    render(<Tabs tabs={[]} />);
    
    // Verificar se não há abas renderizadas
    expect(screen.queryByRole('tablist')).toBeInTheDocument();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('deve permitir abas desabilitadas', () => {
    const tabsWithDisabled = [
      ...mockTabs.slice(0, 2),
      { id: 'tab3', label: 'Desabilitada', content: <div>Conteúdo da aba 3</div>, disabled: true }
    ];
    
    render(<Tabs tabs={tabsWithDisabled} />);
    
    // Verificar se a aba desabilitada está presente e desabilitada
    const disabledTab = screen.getByRole('tab', { name: 'Desabilitada' });
    expect(disabledTab).toBeInTheDocument();
    expect(disabledTab).toHaveAttribute('disabled');
    
    // Tentar clicar na aba desabilitada
    fireEvent.click(disabledTab);
    
    // Verificar se o conteúdo da primeira aba continua visível (não mudou)
    expect(screen.getByText('Conteúdo da aba 1')).toBeVisible();
  });

  it('deve renderizar ícones nas abas quando fornecidos', () => {
    const tabsWithIcons = [
      { 
        id: 'tab1', 
        label: 'Com Ícone', 
        content: <div>Conteúdo com ícone</div>,
        icon: <svg data-testid="mock-icon" />
      },
      ...mockTabs.slice(1)
    ];
    
    render(<Tabs tabs={tabsWithIcons} />);
    
    // Verificar se o ícone está presente
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });
}); 