import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MatriculaFormMultiStep } from '../components/MatriculaFormMultiStep';
import { MemoryRouter } from 'react-router-dom';

// Mock do hook useMatriculas
vi.mock('../hooks/useMatriculas', () => ({
  useCriarMatricula: () => ({
    mutate: vi.fn((data, options) => {
      // Simula uma chamada de API bem-sucedida
      if (options && options.onSuccess) {
        setTimeout(() => options.onSuccess(), 0);
      }
    }),
    isPending: false
  })
}));

// Mock dos componentes de documentos e contratos
vi.mock('../components/documentos/DocumentoUpload', () => ({
  DocumentoUpload: () => <div data-testid="documento-upload">Mock de Upload de Documentos</div>
}));

vi.mock('../components/contratos/ContratoViewer', () => ({
  ContratoViewer: () => <div data-testid="contrato-viewer">Mock de Visualizador de Contrato</div>
}));

describe('MatriculaFormMultiStep', () => {
  const mockOnSuccess = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('deve renderizar o primeiro passo (Dados Básicos) corretamente', () => {
    render(
      <MemoryRouter>
        <MatriculaFormMultiStep onSuccess={mockOnSuccess} />
      </MemoryRouter>
    );
    
    // Verificar se o título do passo está presente
    expect(screen.getByText('Dados Básicos')).toBeInTheDocument();
    
    // Verificar se os campos obrigatórios do primeiro passo estão presentes
    expect(screen.getByLabelText('Aluno')).toBeInTheDocument();
    expect(screen.getByLabelText('Curso')).toBeInTheDocument();
    expect(screen.getByLabelText('Plano de Pagamento')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Data de Início')).toBeInTheDocument();
    expect(screen.getByLabelText('Data de Fim')).toBeInTheDocument();
    expect(screen.getByLabelText('Observações')).toBeInTheDocument();
    
    // Verificar se o botão de próximo está presente
    expect(screen.getByRole('button', { name: /próximo/i })).toBeInTheDocument();
  });
  
  it('deve avançar para o segundo passo (Documentação) ao preencher e enviar o primeiro formulário', async () => {
    render(
      <MemoryRouter>
        <MatriculaFormMultiStep onSuccess={mockOnSuccess} />
      </MemoryRouter>
    );
    
    // Preencher os campos obrigatórios
    fireEvent.change(screen.getByLabelText('Aluno'), { target: { value: 'aluno-123' } });
    fireEvent.change(screen.getByLabelText('Curso'), { target: { value: 'curso-123' } });
    fireEvent.change(screen.getByLabelText('Plano de Pagamento'), { target: { value: 'plano-123' } });
    
    // Selecionar o status
    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.click(statusSelect);
    fireEvent.click(screen.getByRole('option', { name: /pendente/i }));
    
    // Preencher datas
    fireEvent.change(screen.getByLabelText('Data de Início'), { target: { value: '2024-04-01' } });
    fireEvent.change(screen.getByLabelText('Data de Fim'), { target: { value: '2025-04-01' } });
    
    // Adicionar observações
    fireEvent.change(screen.getByLabelText('Observações'), { target: { value: 'Observações de teste' } });
    
    // Clicar no botão de próximo
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Aguardar o avanço para o próximo passo
    await waitFor(() => {
      expect(screen.getByText('Documentação')).toBeInTheDocument();
      expect(screen.getByTestId('documento-upload')).toBeInTheDocument();
    });
  });
  
  it('deve permitir navegar entre os passos', async () => {
    render(
      <MemoryRouter>
        <MatriculaFormMultiStep onSuccess={mockOnSuccess} />
      </MemoryRouter>
    );
    
    // Preencher o primeiro formulário
    fireEvent.change(screen.getByLabelText('Aluno'), { target: { value: 'aluno-123' } });
    fireEvent.change(screen.getByLabelText('Curso'), { target: { value: 'curso-123' } });
    fireEvent.change(screen.getByLabelText('Plano de Pagamento'), { target: { value: 'plano-123' } });
    
    // Clicar no botão de próximo
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Aguardar o avanço para o próximo passo
    await waitFor(() => {
      expect(screen.getByText('Documentação')).toBeInTheDocument();
    });
    
    // Clicar no botão de voltar
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
    
    // Verificar se voltou para o primeiro passo
    await waitFor(() => {
      expect(screen.getByText('Dados Básicos')).toBeInTheDocument();
    });
  });
  
  it('deve chamar onSuccess ao finalizar todos os passos', async () => {
    render(
      <MemoryRouter>
        <MatriculaFormMultiStep onSuccess={mockOnSuccess} />
      </MemoryRouter>
    );
    
    // Navegar através de todos os passos
    // Passo 1: Preencher dados básicos
    fireEvent.change(screen.getByLabelText('Aluno'), { target: { value: 'aluno-123' } });
    fireEvent.change(screen.getByLabelText('Curso'), { target: { value: 'curso-123' } });
    fireEvent.change(screen.getByLabelText('Plano de Pagamento'), { target: { value: 'plano-123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Passo 2: Documentação
    await waitFor(() => {
      expect(screen.getByText('Documentação')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Passo 3: Contrato
    await waitFor(() => {
      expect(screen.getByText('Contrato')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Passo 4: Pagamento
    await waitFor(() => {
      expect(screen.getByText('Pagamento')).toBeInTheDocument();
    });
    
    // Finalizar o processo
    fireEvent.click(screen.getByRole('button', { name: /concluir/i }));
    
    // Verificar se onSuccess foi chamado
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
}); 