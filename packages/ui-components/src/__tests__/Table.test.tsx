import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { Table } from '../components/table';
import { describe, it, expect } from 'vitest';

describe('Table Component', () => {
  const mockData = [
    { id: 1, nome: 'João Silva', email: 'joao@example.com', status: 'Ativo' },
    { id: 2, nome: 'Maria Santos', email: 'maria@example.com', status: 'Inativo' },
    { id: 3, nome: 'Pedro Oliveira', email: 'pedro@example.com', status: 'Pendente' },
  ];

  const mockColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'nome' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', accessor: 'status' },
  ];

  it('deve renderizar o componente de tabela corretamente', () => {
    render(<Table data={mockData} columns={mockColumns} />);
    
    // Verificar se a tabela foi renderizada
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', () => {
    render(<Table data={mockData} columns={mockColumns} />);
    
    // Verificar se todos os cabeçalhos estão presentes
    mockColumns.forEach(column => {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    });
  });

  it('deve renderizar as linhas da tabela corretamente', () => {
    render(<Table data={mockData} columns={mockColumns} />);
    
    // Verificar se todas as linhas foram renderizadas
    const rows = screen.getAllByRole('row');
    
    // A primeira linha é o cabeçalho, então deve haver dados.length + 1 linhas
    expect(rows).toHaveLength(mockData.length + 1);
    
    // Verificar dados da primeira linha
    const firstRowCells = within(rows[1]).getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('1');
    expect(firstRowCells[1]).toHaveTextContent('João Silva');
    expect(firstRowCells[2]).toHaveTextContent('joao@example.com');
    expect(firstRowCells[3]).toHaveTextContent('Ativo');
    
    // Verificar dados da segunda linha
    const secondRowCells = within(rows[2]).getAllByRole('cell');
    expect(secondRowCells[0]).toHaveTextContent('2');
    expect(secondRowCells[1]).toHaveTextContent('Maria Santos');
    expect(secondRowCells[2]).toHaveTextContent('maria@example.com');
    expect(secondRowCells[3]).toHaveTextContent('Inativo');
  });

  it('deve renderizar uma mensagem quando não há dados', () => {
    render(<Table data={[]} columns={mockColumns} />);
    
    // Verificar se a mensagem "Nenhum registro encontrado" aparece
    expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
  });

  it('deve renderizar o footer quando fornecido', () => {
    const footerContent = 'Texto do rodapé';
    render(
      <Table 
        data={mockData} 
        columns={mockColumns} 
        footer={<div>{footerContent}</div>}
      />
    );
    
    // Verificar se o footer foi renderizado
    expect(screen.getByText(footerContent)).toBeInTheDocument();
  });

  it('deve aplicar classes personalizadas quando fornecidas', () => {
    const customClass = 'custom-table-class';
    render(
      <Table 
        data={mockData} 
        columns={mockColumns} 
        className={customClass}
      />
    );
    
    // Verificar se a classe personalizada foi aplicada
    const table = screen.getByRole('table');
    expect(table).toHaveClass(customClass);
  });

  it('deve renderizar conteúdo personalizado em células quando renderCell é fornecido', () => {
    const customColumns = [
      ...mockColumns.slice(0, 3),
      { 
        header: 'Status', 
        accessor: 'status',
        renderCell: (row: any) => (
          <span data-testid="custom-status">Status: {row.status}</span>
        )
      },
    ];
    
    render(<Table data={mockData} columns={customColumns} />);
    
    // Verificar se o conteúdo personalizado foi renderizado
    const customCells = screen.getAllByTestId('custom-status');
    expect(customCells).toHaveLength(mockData.length);
    expect(customCells[0]).toHaveTextContent('Status: Ativo');
    expect(customCells[1]).toHaveTextContent('Status: Inativo');
    expect(customCells[2]).toHaveTextContent('Status: Pendente');
  });

  it('deve renderizar com tamanho zebrado quando striped é verdadeiro', () => {
    render(<Table data={mockData} columns={mockColumns} striped />);
    
    // Verificar se as linhas zebradas foram aplicadas
    const rows = screen.getAllByRole('row');
    
    // A primeira linha é o cabeçalho, então verificamos a partir da segunda
    expect(rows[2]).toHaveClass('bg-gray-50');
    // As linhas ímpares não devem ter a classe
    expect(rows[1]).not.toHaveClass('bg-gray-50');
    expect(rows[3]).not.toHaveClass('bg-gray-50');
  });
}); 