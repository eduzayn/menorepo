import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GerarBoleto } from '../components/pagamentos/GerarBoleto';

// Mock dos hooks e serviços externos
vi.mock('react-router-dom', () => ({
  useParams: () => ({ matriculaId: 'matricula-123' }),
  useNavigate: () => vi.fn()
}));

// Mock das funções de formatação
vi.mock('../utils/formatters', () => ({
  formatCurrency: (value: number) => `R$ ${value.toFixed(2)}`,
  formatDate: (date: string) => '01/04/2024'
}));

describe('GerarBoleto', () => {
  const mockAlert = vi.fn();
  const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined)
  };
  const mockWindow = {
    open: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock das APIs do navegador
    global.alert = mockAlert;
    global.navigator.clipboard = mockClipboard;
    global.window.open = mockWindow.open;
    
    // Mock para setTimeout (para acelerar os testes)
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve renderizar o estado de carregamento inicialmente', () => {
    render(<GerarBoleto />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('deve renderizar a lista de parcelas após o carregamento', async () => {
    render(<GerarBoleto />);
    
    // Avançar os timers para simular o carregamento de dados
    vi.advanceTimersByTime(1500);
    
    // Verificar se o título foi carregado
    await waitFor(() => {
      expect(screen.getByText('Boletos e Pagamentos')).toBeInTheDocument();
    });
    
    // Verificar dados do aluno e curso
    expect(screen.getByText(/João da Silva/)).toBeInTheDocument();
    expect(screen.getByText(/Desenvolvimento Web/)).toBeInTheDocument();
    
    // Verificar parcelas carregadas
    expect(screen.getAllByText('R$ 199.90').length).toBe(3);
    expect(screen.getAllByText('pendente').length).toBe(3);
    expect(screen.getAllByRole('button', { name: /Gerar Boleto/i }).length).toBe(3);
  });

  it('deve gerar boleto ao clicar no botão "Gerar Boleto"', async () => {
    render(<GerarBoleto />);
    
    // Avançar os timers para simular o carregamento de dados
    vi.advanceTimersByTime(1500);
    
    // Esperar pelo carregamento da página
    await waitFor(() => {
      expect(screen.getByText('Boletos e Pagamentos')).toBeInTheDocument();
    });
    
    // Clicar no botão de gerar boleto da primeira parcela
    const botoesGerarBoleto = screen.getAllByRole('button', { name: /Gerar Boleto/i });
    fireEvent.click(botoesGerarBoleto[0]);
    
    // Verificar se o botão mostra "Gerando..." enquanto processa
    expect(screen.getByText('Gerando...')).toBeInTheDocument();
    
    // Avançar o tempo para permitir que a operação seja concluída
    vi.advanceTimersByTime(2500);
    
    // Verificar se o estado de sucesso aparece
    await waitFor(() => {
      expect(screen.getByText('Boleto gerado com sucesso para a parcela 1.')).toBeInTheDocument();
    });
    
    // Verificar se os botões de visualizar e copiar PIX aparecem
    expect(screen.getByText('Visualizar Boleto')).toBeInTheDocument();
    expect(screen.getByText('Copiar Código PIX')).toBeInTheDocument();
  });

  it('deve permitir visualizar o boleto', async () => {
    render(<GerarBoleto />);
    
    // Avançar os timers para simular o carregamento de dados
    vi.advanceTimersByTime(1500);
    
    // Esperar pelo carregamento da página
    await waitFor(() => {
      expect(screen.getByText('Boletos e Pagamentos')).toBeInTheDocument();
    });
    
    // Gerar boleto para a primeira parcela
    const botoesGerarBoleto = screen.getAllByRole('button', { name: /Gerar Boleto/i });
    fireEvent.click(botoesGerarBoleto[0]);
    
    // Avançar o tempo para permitir que a operação seja concluída
    vi.advanceTimersByTime(2500);
    
    // Clicar no botão de visualizar boleto
    await waitFor(() => {
      expect(screen.getByText('Visualizar Boleto')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Visualizar Boleto'));
    
    // Verificar se o método de abrir nova janela foi chamado
    expect(mockWindow.open).toHaveBeenCalledWith('https://exemplo.com/boleto/123456', '_blank');
  });

  it('deve permitir copiar o código PIX', async () => {
    render(<GerarBoleto />);
    
    // Avançar os timers para simular o carregamento de dados
    vi.advanceTimersByTime(1500);
    
    // Esperar pelo carregamento da página
    await waitFor(() => {
      expect(screen.getByText('Boletos e Pagamentos')).toBeInTheDocument();
    });
    
    // Gerar boleto para a primeira parcela
    const botoesGerarBoleto = screen.getAllByRole('button', { name: /Gerar Boleto/i });
    fireEvent.click(botoesGerarBoleto[0]);
    
    // Avançar o tempo para permitir que a operação seja concluída
    vi.advanceTimersByTime(2500);
    
    // Clicar no botão de copiar código PIX
    await waitFor(() => {
      expect(screen.getByText('Copiar Código PIX')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Copiar Código PIX'));
    
    // Verificar se o método de copiar para a área de transferência foi chamado
    expect(mockClipboard.writeText).toHaveBeenCalled();
    
    // Verificar se o alerta foi exibido
    expect(mockAlert).toHaveBeenCalledWith('Código PIX copiado para a área de transferência!');
  });

  it('deve tratar falha ao copiar o código PIX', async () => {
    // Mock para simular falha na API de clipboard
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Falha ao copiar'));
    
    render(<GerarBoleto />);
    
    // Avançar os timers para simular o carregamento de dados
    vi.advanceTimersByTime(1500);
    
    // Esperar pelo carregamento da página
    await waitFor(() => {
      expect(screen.getByText('Boletos e Pagamentos')).toBeInTheDocument();
    });
    
    // Gerar boleto para a primeira parcela
    const botoesGerarBoleto = screen.getAllByRole('button', { name: /Gerar Boleto/i });
    fireEvent.click(botoesGerarBoleto[0]);
    
    // Avançar o tempo para permitir que a operação seja concluída
    vi.advanceTimersByTime(2500);
    
    // Clicar no botão de copiar código PIX
    await waitFor(() => {
      expect(screen.getByText('Copiar Código PIX')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Copiar Código PIX'));
    
    // Verificar se o alerta de erro foi exibido
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Não foi possível copiar o código PIX. Tente copiar manualmente.');
    });
  });

  it('deve limpar a mensagem de sucesso após o tempo definido', async () => {
    render(<GerarBoleto />);
    
    // Avançar os timers para simular o carregamento de dados
    vi.advanceTimersByTime(1500);
    
    // Esperar pelo carregamento da página
    await waitFor(() => {
      expect(screen.getByText('Boletos e Pagamentos')).toBeInTheDocument();
    });
    
    // Gerar boleto para a primeira parcela
    const botoesGerarBoleto = screen.getAllByRole('button', { name: /Gerar Boleto/i });
    fireEvent.click(botoesGerarBoleto[0]);
    
    // Avançar o tempo para permitir que a operação seja concluída
    vi.advanceTimersByTime(2500);
    
    // Verificar se o estado de sucesso aparece
    await waitFor(() => {
      expect(screen.getByText('Boleto gerado com sucesso para a parcela 1.')).toBeInTheDocument();
    });
    
    // Avançar o tempo para a mensagem desaparecer (5 segundos no componente)
    vi.advanceTimersByTime(5500);
    
    // Verificar se a mensagem desapareceu
    await waitFor(() => {
      expect(screen.queryByText('Boleto gerado com sucesso para a parcela 1.')).not.toBeInTheDocument();
    });
  });
}); 