import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../components/data-display/StatsCard';

describe('StatsCard', () => {
  test('renderiza corretamente o título e valor', () => {
    render(<StatsCard title="Total de Alunos" value={1500} />);
    
    expect(screen.getByText('Total de Alunos')).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument();
  });

  test('renderiza descrição quando fornecida', () => {
    render(
      <StatsCard 
        title="Total de Matrículas" 
        value={2500} 
        description="Dados atualizados em tempo real" 
      />
    );
    
    expect(screen.getByText('Dados atualizados em tempo real')).toBeInTheDocument();
  });

  test('renderiza informações de tendência quando fornecidas', () => {
    render(
      <StatsCard 
        title="Receita Mensal" 
        value="R$ 15.000" 
        trend={{ value: 12, isPositive: true, text: "vs. mês anterior" }} 
      />
    );
    
    expect(screen.getByText('↑ 12%')).toBeInTheDocument();
    expect(screen.getByText('vs. mês anterior')).toBeInTheDocument();
  });

  test('exibe indicador de carregamento quando isLoading é true', () => {
    const { container } = render(
      <StatsCard 
        title="Inscrições" 
        value={750} 
        isLoading={true} 
      />
    );
    
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('aplica classes CSS adicionais quando fornecidas', () => {
    const { container } = render(
      <StatsCard 
        title="Usuários Ativos" 
        value={325} 
        className="custom-class" 
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('renderiza como link quando a prop "to" é fornecida', () => {
    render(
      <StatsCard 
        title="Relatórios" 
        value={42} 
        to="/relatorios" 
      />
    );
    
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/relatorios');
  });
}); 