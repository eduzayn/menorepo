import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RespostasRapidas } from '../components/RespostasRapidas';

// Mock do módulo supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  }
}));

// Mock do componente Select do pacote UI
vi.mock('@repo/ui-components', () => ({
  Select: ({ placeholder, disabled, onChange, options }) => (
    <div data-testid="mock-select">
      <span>{placeholder}</span>
      <select 
        disabled={disabled} 
        onChange={(e) => onChange(e.target.value)}
        data-testid="select-input"
      >
        <option value="">Selecione</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}));

describe('RespostasRapidas', () => {
  const mockOnSelecionar = vi.fn();
  const mockRespostas = [
    { id: 'resp-1', titulo: 'Saudação', conteudo: 'Olá, como posso ajudar?' },
    { id: 'resp-2', titulo: 'Agradecimento', conteudo: 'Obrigado pelo contato.' },
    { id: 'resp-3', titulo: 'Despedida', conteudo: 'Até mais! Qualquer dúvida estamos à disposição.' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock da resposta do supabase para carregar as respostas rápidas
    const mockFrom = vi.spyOn(vi.mocked(supabase), 'from');
    mockFrom.mockImplementation(() => ({
      select: () => ({
        order: () => Promise.resolve({
          data: mockRespostas,
          error: null
        })
      })
    }));
  });

  it('deve renderizar o componente com placeholder de carregamento', async () => {
    render(<RespostasRapidas onSelecionar={mockOnSelecionar} />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve carregar as respostas rápidas e exibir as opções', async () => {
    render(<RespostasRapidas onSelecionar={mockOnSelecionar} />);
    
    // Aguardar o carregamento das opções
    await waitFor(() => {
      expect(screen.getByText('Selecione uma resposta rápida')).toBeInTheDocument();
    });
    
    // Verificar as opções do select
    const selectInput = screen.getByTestId('select-input');
    expect(selectInput).toBeInTheDocument();
    
    // Verificar se as opções estão presentes
    const options = selectInput.querySelectorAll('option');
    expect(options.length).toBe(mockRespostas.length + 1); // +1 pela opção default
  });

  it('deve chamar onSelecionar com o conteúdo da resposta quando uma opção é selecionada', async () => {
    render(<RespostasRapidas onSelecionar={mockOnSelecionar} />);
    
    // Aguardar o carregamento das opções
    await waitFor(() => {
      expect(screen.getByText('Selecione uma resposta rápida')).toBeInTheDocument();
    });
    
    // Selecionar uma opção
    const selectInput = screen.getByTestId('select-input');
    fireEvent.change(selectInput, { target: { value: 'resp-2' } });
    
    // Verificar se o callback foi chamado com o conteúdo correto
    expect(mockOnSelecionar).toHaveBeenCalledWith('Obrigado pelo contato.');
  });

  it('deve exibir mensagem de erro quando falha ao carregar respostas', async () => {
    // Mock da resposta do supabase para simular erro
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockFrom = vi.spyOn(vi.mocked(supabase), 'from');
    mockFrom.mockImplementation(() => ({
      select: () => ({
        order: () => Promise.resolve({
          data: null,
          error: new Error('Erro ao carregar dados')
        })
      })
    }));
    
    render(<RespostasRapidas onSelecionar={mockOnSelecionar} />);
    
    // Aguardar a tentativa de carregamento
    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Erro ao carregar respostas rápidas:',
        expect.any(Error)
      );
    });
    
    // Verificar que o componente está no estado não carregando, mas sem opções
    expect(screen.getByText('Selecione uma resposta rápida')).toBeInTheDocument();
    
    mockConsoleError.mockRestore();
  });
}); 