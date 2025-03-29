import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardPageTemplate } from '../templates/DashboardPage';

describe('DashboardPageTemplate', () => {
  test('renderiza corretamente o título e conteúdo principal', () => {
    render(
      <DashboardPageTemplate title="Dashboard Principal">
        <div data-testid="content">Conteúdo do dashboard</div>
      </DashboardPageTemplate>
    );
    
    expect(screen.getByText('Dashboard Principal')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  test('renderiza subtítulo quando fornecido', () => {
    render(
      <DashboardPageTemplate 
        title="Dashboard de Vendas" 
        subtitle="Análise de vendas mensal"
      >
        <div>Conteúdo</div>
      </DashboardPageTemplate>
    );
    
    expect(screen.getByText('Análise de vendas mensal')).toBeInTheDocument();
  });

  test('renderiza ações de cabeçalho quando fornecidas', () => {
    render(
      <DashboardPageTemplate 
        title="Dashboard" 
        headerActions={<button>Nova Ação</button>}
      >
        <div>Conteúdo</div>
      </DashboardPageTemplate>
    );
    
    expect(screen.getByRole('button', { name: 'Nova Ação' })).toBeInTheDocument();
  });

  test('renderiza cards de estatísticas quando fornecidos', () => {
    render(
      <DashboardPageTemplate 
        title="Dashboard" 
        statsCards={<div data-testid="stats-cards">Cards de estatísticas</div>}
      >
        <div>Conteúdo</div>
      </DashboardPageTemplate>
    );
    
    expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
  });

  test('exibe indicador de carregamento quando isLoading é true', () => {
    const { container } = render(
      <DashboardPageTemplate 
        title="Dashboard" 
        isLoading={true}
      >
        <div>Este conteúdo não deve ser visível</div>
      </DashboardPageTemplate>
    );
    
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Este conteúdo não deve ser visível')).not.toBeInTheDocument();
  });

  test('renderiza mensagem de erro quando fornecida', () => {
    render(
      <DashboardPageTemplate 
        title="Dashboard" 
        error="Erro ao carregar dados"
      >
        <div>Conteúdo</div>
      </DashboardPageTemplate>
    );
    
    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
  });

  test('renderiza filtros quando fornecidos', () => {
    render(
      <DashboardPageTemplate 
        title="Dashboard" 
        filters={<div data-testid="filters">Filtros do dashboard</div>}
      >
        <div>Conteúdo</div>
      </DashboardPageTemplate>
    );
    
    expect(screen.getByTestId('filters')).toBeInTheDocument();
  });
}); 