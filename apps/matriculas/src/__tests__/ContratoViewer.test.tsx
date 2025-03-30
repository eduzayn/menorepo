import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@edunexia/test-config';
import { ContratoViewer } from '../components/contratos/ContratoViewer';
import { contratoService } from '../services/contratoService';

// Mock dos hooks e serviços externos
vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'contrato-123' }),
  useNavigate: () => vi.fn()
}));

vi.mock('../services/contratoService', () => ({
  contratoService: {
    buscarContrato: vi.fn(),
    assinarContrato: vi.fn()
  }
}));

// Mock do componente de assinatura
vi.mock('react-signature-canvas', () => ({
  default: vi.fn().mockImplementation(({ canvasProps }) => {
    const { className } = canvasProps;
    
    return (
      <div data-testid="mock-signature-canvas" className={className}>
        <button data-testid="mock-clear" onClick={() => mockSignatureCanvas.clear()}>Clear</button>
      </div>
    );
  })
}));

const mockSignatureCanvas = {
  clear: vi.fn(),
  isEmpty: vi.fn(),
  toDataURL: vi.fn()
};

// Mock da função formatDate
vi.mock('../utils/formatters', () => ({
  formatDate: vi.fn((date) => '01/04/2024')
}));

describe('ContratoViewer', () => {
  const mockContrato = {
    id: 'contrato-123',
    aluno_id: 'aluno-123',
    matricula_id: 'matricula-123',
    html_content: '<div>Conteúdo do contrato para teste</div>',
    assinado: false,
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2024-04-01T10:00:00Z'
  };

  const mockContratoAssinado = {
    ...mockContrato,
    assinado: true,
    data_assinatura: '2024-04-02T15:30:00Z',
    assinatura_url: 'https://exemplo.com/assinatura.png',
    assinatura_aluno: 'https://exemplo.com/assinatura.png'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configurar o mock das instâncias do SignatureCanvas
    vi.mock.resetModules();
    Object.defineProperty(global, 'SignatureCanvas', {
      value: mockSignatureCanvas
    });
  });

  it('deve renderizar o loading state inicialmente', () => {
    vi.mocked(contratoService.buscarContrato).mockResolvedValueOnce(mockContrato);
    
    render(<ContratoViewer />);
    
    // Verificar o loading indicator
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('deve renderizar o contrato quando carregado com sucesso', async () => {
    vi.mocked(contratoService.buscarContrato).mockResolvedValueOnce(mockContrato);
    
    render(<ContratoViewer />);
    
    // Esperar pelo carregamento
    await waitFor(() => {
      expect(screen.getByText('Contrato de Matrícula')).toBeInTheDocument();
    });
    
    // Verificar se o conteúdo do contrato foi renderizado
    expect(screen.getByText('Conteúdo do contrato para teste')).toBeInTheDocument();
    
    // Verificar se o botão de assinar contrato está presente para contratos não assinados
    expect(screen.getByText('Assinar Contrato')).toBeInTheDocument();
  });

  it('deve renderizar mensagem de erro quando falhar ao carregar o contrato', async () => {
    vi.mocked(contratoService.buscarContrato).mockRejectedValueOnce(new Error('Erro ao carregar contrato'));
    
    render(<ContratoViewer />);
    
    // Esperar pela mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('Não foi possível carregar o contrato.')).toBeInTheDocument();
    });
    
    // Verificar se o botão para voltar está presente
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  it('deve exibir área de assinatura ao clicar no botão de assinar', async () => {
    vi.mocked(contratoService.buscarContrato).mockResolvedValueOnce(mockContrato);
    
    render(<ContratoViewer />);
    
    // Esperar pelo carregamento
    await waitFor(() => {
      expect(screen.getByText('Contrato de Matrícula')).toBeInTheDocument();
    });
    
    // Clicar no botão de assinar
    fireEvent.click(screen.getByText('Assinar Contrato'));
    
    // Verificar se a área de assinatura foi exibida
    expect(screen.getByText('Assinatura Digital')).toBeInTheDocument();
    expect(screen.getByTestId('mock-signature-canvas')).toBeInTheDocument();
    expect(screen.getByText('Limpar')).toBeInTheDocument();
    expect(screen.getByText('Li e concordo com todos os termos do contrato acima.')).toBeInTheDocument();
  });

  it('deve limpar a assinatura ao clicar no botão limpar', async () => {
    vi.mocked(contratoService.buscarContrato).mockResolvedValueOnce(mockContrato);
    
    render(<ContratoViewer />);
    
    // Esperar pelo carregamento
    await waitFor(() => {
      expect(screen.getByText('Contrato de Matrícula')).toBeInTheDocument();
    });
    
    // Clicar no botão de assinar
    fireEvent.click(screen.getByText('Assinar Contrato'));
    
    // Clicar no botão de limpar
    fireEvent.click(screen.getByText('Limpar'));
    
    // Verificar se o método clear foi chamado
    expect(mockSignatureCanvas.clear).toHaveBeenCalled();
  });

  it('deve apresentar alerta se tentar finalizar sem assinatura ou concordância', async () => {
    vi.mocked(contratoService.buscarContrato).mockResolvedValueOnce(mockContrato);
    mockSignatureCanvas.isEmpty.mockReturnValueOnce(true);
    
    // Mock do alert
    const alertMock = vi.fn();
    global.alert = alertMock;
    
    render(<ContratoViewer />);
    
    // Esperar pelo carregamento
    await waitFor(() => {
      expect(screen.getByText('Contrato de Matrícula')).toBeInTheDocument();
    });
    
    // Clicar no botão de assinar
    fireEvent.click(screen.getByText('Assinar Contrato'));
    
    // Tentar finalizar sem assinatura
    fireEvent.click(screen.getByText('Finalizar'));
    
    // Verificar se o alerta foi exibido
    expect(alertMock).toHaveBeenCalledWith('Por favor, assine o contrato antes de finalizar.');
    
    // Simular uma assinatura válida
    mockSignatureCanvas.isEmpty.mockReturnValueOnce(false);
    
    // Tentar finalizar sem concordar com os termos
    fireEvent.click(screen.getByText('Finalizar'));
    
    // Verificar se o alerta foi exibido
    expect(alertMock).toHaveBeenCalledWith('Você precisa concordar com os termos do contrato para continuar.');
  });

  it('deve enviar a assinatura ao finalizar corretamente', async () => {
    vi.mocked(contratoService.buscarContrato).mockResolvedValueOnce(mockContrato);
    vi.mocked(contratoService.assinarContrato).mockResolvedValueOnce({ success: true });
    
    // Mock para SignatureCanvas
    mockSignatureCanvas.isEmpty.mockReturnValue(false);
    mockSignatureCanvas.toDataURL.mockReturnValue('data:image/png;base64,assinatura-mock');
    
    render(<ContratoViewer />);
    
    // Esperar pelo carregamento
    await waitFor(() => {
      expect(screen.getByText('Contrato de Matrícula')).toBeInTheDocument();
    });
    
    // Clicar no botão de assinar
    fireEvent.click(screen.getByText('Assinar Contrato'));
    
    // Marcar a concordância com os termos
    fireEvent.click(screen.getByLabelText('Li e concordo com todos os termos do contrato acima.'));
    
    // Finalizar a assinatura
    fireEvent.click(screen.getByText('Finalizar'));
    
    // Verificar se o serviço foi chamado corretamente
    await waitFor(() => {
      expect(contratoService.assinarContrato).toHaveBeenCalledWith('contrato-123', {
        assinado: true,
        data_assinatura: expect.any(String),
        assinatura_url: 'data:image/png;base64,assinatura-mock',
        assinatura_aluno: 'data:image/png;base64,assinatura-mock'
      });
    });
  });

  it('deve mostrar botão de imprimir para contratos já assinados', async () => {
    vi.mocked(contratoService.buscarContrato).mockResolvedValueOnce(mockContratoAssinado);
    
    // Mock da função window.print
    global.print = vi.fn();
    window.print = global.print;
    
    render(<ContratoViewer />);
    
    // Esperar pelo carregamento
    await waitFor(() => {
      expect(screen.getByText('Contrato de Matrícula')).toBeInTheDocument();
    });
    
    // Verificar se exibe a mensagem de contrato assinado
    expect(screen.getByText('Este contrato foi assinado em 01/04/2024.')).toBeInTheDocument();
    
    // Verificar se o botão de imprimir está presente
    expect(screen.getByText('Imprimir')).toBeInTheDocument();
    
    // Clicar no botão de imprimir
    fireEvent.click(screen.getByText('Imprimir'));
    
    // Verificar se a função print foi chamada
    expect(global.print).toHaveBeenCalled();
  });

  it('deve tratar erros ao assinar o contrato', async () => {
    vi.mocked(contratoService.buscarContrato).mockResolvedValueOnce(mockContrato);
    vi.mocked(contratoService.assinarContrato).mockRejectedValueOnce(new Error('Erro ao assinar contrato'));
    
    // Mock para SignatureCanvas
    mockSignatureCanvas.isEmpty.mockReturnValue(false);
    mockSignatureCanvas.toDataURL.mockReturnValue('data:image/png;base64,assinatura-mock');
    
    // Mock do alert
    const alertMock = vi.fn();
    global.alert = alertMock;
    
    render(<ContratoViewer />);
    
    // Esperar pelo carregamento
    await waitFor(() => {
      expect(screen.getByText('Contrato de Matrícula')).toBeInTheDocument();
    });
    
    // Clicar no botão de assinar
    fireEvent.click(screen.getByText('Assinar Contrato'));
    
    // Marcar a concordância com os termos
    fireEvent.click(screen.getByLabelText('Li e concordo com todos os termos do contrato acima.'));
    
    // Finalizar a assinatura
    fireEvent.click(screen.getByText('Finalizar'));
    
    // Verificar se o alerta de erro foi exibido
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Erro ao assinar o contrato: Erro ao assinar contrato');
    });
  });
}); 