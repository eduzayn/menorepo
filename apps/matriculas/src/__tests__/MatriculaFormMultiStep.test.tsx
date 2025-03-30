import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '@edunexia/test-config';
import { MatriculaFormMultiStep } from '../components/MatriculaFormMultiStep';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock de React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock dos serviços
vi.mock('../services/alunoService', () => ({
  alunoService: {
    buscarAlunos: vi.fn().mockResolvedValue([
      { id: 'aluno-1', nome: 'João Silva', cpf: '123.456.789-00' },
      { id: 'aluno-2', nome: 'Maria Santos', cpf: '987.654.321-00' }
    ]),
    buscarAluno: vi.fn().mockResolvedValue({ id: 'aluno-1', nome: 'João Silva', cpf: '123.456.789-00' })
  }
}));

vi.mock('../services/cursoService', () => ({
  cursoService: {
    listarCursos: vi.fn().mockResolvedValue([
      { id: 'curso-1', nome: 'Desenvolvimento Web', valor: 1200.00 },
      { id: 'curso-2', nome: 'Data Science', valor: 1500.00 }
    ])
  }
}));

vi.mock('../services/planoService', () => ({
  planoService: {
    listarPlanos: vi.fn().mockResolvedValue([
      { id: 'plano-1', nome: 'Mensal', parcelas: 12 },
      { id: 'plano-2', nome: 'Trimestral', parcelas: 4 }
    ])
  }
}));

// Mock do hook de matrícula
vi.mock('../hooks/useMatriculas', () => ({
  useCriarMatricula: () => ({
    mutate: vi.fn().mockImplementation((data, options) => {
      options.onSuccess({ id: 'matricula-1', ...data });
    }),
    isPending: false
  })
}));

// Mock dos componentes de documentos e contratos
vi.mock('../components/documentos/DocumentoUpload', () => ({
  DocumentoUpload: vi.fn().mockImplementation(({ matriculaId, onComplete }) => (
    <div data-testid="documento-upload">
      <p>Upload de documentos para: {matriculaId}</p>
      <button onClick={() => onComplete()}>Concluir Upload</button>
    </div>
  ))
}));

vi.mock('../components/contratos/ContratoViewer', () => ({
  ContratoViewer: vi.fn().mockImplementation(({ matriculaId, onAccept }) => (
    <div data-testid="contrato-viewer">
      <p>Contrato para: {matriculaId}</p>
      <button onClick={() => onAccept()}>Aceitar Contrato</button>
    </div>
  ))
}));

// Mock do componente de toast
vi.mock('@edunexia/ui-components', async () => {
  const actual = await vi.importActual('@edunexia/ui-components');
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn()
    }
  };
});

// Setup do QueryClient para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Wrapper para prover o contexto do React Query
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('MatriculaFormMultiStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('deve renderizar o formulário com a primeira etapa', async () => {
    render(<MatriculaFormMultiStep />, { wrapper });
    
    // Verificar se o título da primeira etapa está presente
    expect(await screen.findByText('Dados Básicos')).toBeInTheDocument();
    expect(screen.getByText('Informações iniciais da matrícula')).toBeInTheDocument();
  });

  it('deve permitir buscar e selecionar um aluno', async () => {
    render(<MatriculaFormMultiStep />, { wrapper });
    
    // Buscar o campo de busca de aluno
    const buscaInput = await screen.findByPlaceholderText('Busque pelo nome ou CPF do aluno');
    
    // Digitar o termo de busca
    const user = userEvent.setup();
    await user.type(buscaInput, 'João');
    
    // Esperar pelos resultados da busca
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
    
    // Selecionar o aluno
    await user.click(screen.getByText('João Silva'));
    
    // Verificar se o aluno foi selecionado
    expect(screen.getByText(/Selecionado/)).toBeInTheDocument();
  });

  it('deve permitir selecionar curso e plano', async () => {
    render(<MatriculaFormMultiStep />, { wrapper });
    
    // Esperar pelos seletores de curso e plano
    await waitFor(() => {
      expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
    });
    
    const user = userEvent.setup();
    
    // Selecionar curso
    const cursosSelects = screen.getAllByRole('combobox');
    await user.click(cursosSelects[0]);
    
    // Esperar pelas opções de curso
    await waitFor(() => {
      expect(screen.getByText('Desenvolvimento Web')).toBeInTheDocument();
    });
    
    // Selecionar o curso
    await user.click(screen.getByText('Desenvolvimento Web'));
    
    // Selecionar plano
    await user.click(cursosSelects[1]);
    
    // Esperar pelas opções de plano
    await waitFor(() => {
      expect(screen.getByText('Mensal')).toBeInTheDocument();
    });
    
    // Selecionar o plano
    await user.click(screen.getByText('Mensal'));
  });

  it('deve avançar para a próxima etapa ao preencher os dados básicos', async () => {
    render(<MatriculaFormMultiStep />, { wrapper });
    
    const user = userEvent.setup();
    
    // Preencher dados do aluno
    const buscaInput = await screen.findByPlaceholderText('Busque pelo nome ou CPF do aluno');
    await user.type(buscaInput, 'João');
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('João Silva'));
    
    // Selecionar curso e plano
    const selects = screen.getAllByRole('combobox');
    
    // Curso
    await user.click(selects[0]);
    await waitFor(() => {
      expect(screen.getByText('Desenvolvimento Web')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Desenvolvimento Web'));
    
    // Plano
    await user.click(selects[1]);
    await waitFor(() => {
      expect(screen.getByText('Mensal')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Mensal'));
    
    // Clicar no botão próximo
    const proximoButton = screen.getByRole('button', { name: /Próximo/i });
    await user.click(proximoButton);
    
    // Verificar se avançou para a etapa de documentos
    await waitFor(() => {
      expect(screen.getByTestId('documento-upload')).toBeInTheDocument();
    });
  });

  it('deve completar todo o fluxo de matrícula até o final', async () => {
    render(<MatriculaFormMultiStep />, { wrapper });
    
    const user = userEvent.setup();
    
    // Etapa 1: Dados Básicos
    // Preencher dados do aluno
    const buscaInput = await screen.findByPlaceholderText('Busque pelo nome ou CPF do aluno');
    await user.type(buscaInput, 'João');
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('João Silva'));
    
    // Selecionar curso e plano
    const selects = screen.getAllByRole('combobox');
    
    // Curso
    await user.click(selects[0]);
    await waitFor(() => {
      expect(screen.getByText('Desenvolvimento Web')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Desenvolvimento Web'));
    
    // Plano
    await user.click(selects[1]);
    await waitFor(() => {
      expect(screen.getByText('Mensal')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Mensal'));
    
    // Avançar para a próxima etapa
    const proximoButton = screen.getByRole('button', { name: /Próximo/i });
    await user.click(proximoButton);
    
    // Etapa 2: Documentos
    await waitFor(() => {
      expect(screen.getByTestId('documento-upload')).toBeInTheDocument();
    });
    
    // Concluir upload de documentos
    const concluirUploadButton = screen.getByRole('button', { name: /Concluir Upload/i });
    await user.click(concluirUploadButton);
    
    // Etapa 3: Contrato
    await waitFor(() => {
      expect(screen.getByTestId('contrato-viewer')).toBeInTheDocument();
    });
    
    // Aceitar contrato
    const aceitarContratoButton = screen.getByRole('button', { name: /Aceitar Contrato/i });
    await user.click(aceitarContratoButton);
    
    // Etapa 4: Pagamento
    await waitFor(() => {
      expect(screen.getByText(/Escolha a forma de pagamento/i)).toBeInTheDocument();
    });
    
    // Selecionar forma de pagamento e avançar
    const finalizarButton = screen.getByRole('button', { name: /Finalizar/i });
    await user.click(finalizarButton);
    
    // Etapa 5: Conclusão
    await waitFor(() => {
      expect(screen.getByText(/Matrícula realizada com sucesso/i)).toBeInTheDocument();
    });
  });
}); 