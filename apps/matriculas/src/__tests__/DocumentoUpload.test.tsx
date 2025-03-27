import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentoUpload } from '../components/documentos/DocumentoUpload';
import { documentoService } from '../services/documentoService';

// Mock dos hooks e serviços externos
vi.mock('react-router-dom', () => ({
  useParams: () => ({ alunoId: 'aluno-123' }),
  useNavigate: () => vi.fn()
}));

vi.mock('../services/documentoService', () => ({
  documentoService: {
    criarDocumento: vi.fn()
  }
}));

describe('DocumentoUpload', () => {
  // Mock do arquivo para os testes
  const createMockFile = (name = 'documento.pdf', type = 'application/pdf', size = 1024 * 1024) => {
    const file = new File(["mock file content"], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock para URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'https://exemplo.com/mock-url');
  });

  it('deve renderizar o formulário de upload corretamente', () => {
    render(<DocumentoUpload />);
    
    expect(screen.getByText('Upload de Documento')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo de Documento*')).toBeInTheDocument();
    expect(screen.getByLabelText('Arquivo*')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome do Arquivo (opcional)')).toBeInTheDocument();
    expect(screen.getByText('Enviar Documento')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('deve exibir campo para especificar tipo quando selecionar "outros"', () => {
    render(<DocumentoUpload />);
    
    // Inicialmente o campo não está visível
    expect(screen.queryByLabelText('Especifique o Tipo*')).not.toBeInTheDocument();
    
    // Selecionar "outros" como tipo de documento
    fireEvent.change(screen.getByLabelText('Tipo de Documento*'), { target: { value: 'outros' } });
    
    // Agora o campo deve estar visível
    expect(screen.getByLabelText('Especifique o Tipo*')).toBeInTheDocument();
  });

  it('deve exibir erro para arquivo com tamanho maior que o permitido', async () => {
    render(<DocumentoUpload />);
    
    // Criar um arquivo grande (11MB)
    const largeFile = createMockFile('documento-grande.pdf', 'application/pdf', 11 * 1024 * 1024);
    
    // Mock do FileList
    const fileList = {
      0: largeFile,
      length: 1,
      item: (index: number) => fileList[index]
    };
    
    // Simular o upload do arquivo grande
    const fileInput = screen.getByLabelText('Arquivo*');
    fireEvent.change(fileInput, { target: { files: fileList } });
    
    // Verificar se a mensagem de erro aparece
    expect(screen.getByText('O arquivo excede o tamanho máximo de 10MB.')).toBeInTheDocument();
  });

  it('deve exibir erro para formato de arquivo não suportado', async () => {
    render(<DocumentoUpload />);
    
    // Criar um arquivo de formato não suportado
    const invalidFile = createMockFile('documento.exe', 'application/x-msdownload', 1024 * 1024);
    
    // Mock do FileList
    const fileList = {
      0: invalidFile,
      length: 1,
      item: (index: number) => fileList[index]
    };
    
    // Simular o upload do arquivo inválido
    const fileInput = screen.getByLabelText('Arquivo*');
    fireEvent.change(fileInput, { target: { files: fileList } });
    
    // Verificar se a mensagem de erro aparece
    expect(screen.getByText('Formato de arquivo não suportado. Utilize PDF, JPEG, PNG ou DOC/DOCX.')).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios no envio do formulário', async () => {
    render(<DocumentoUpload />);
    
    // Tentar enviar o formulário sem preencher os campos
    fireEvent.click(screen.getByText('Enviar Documento'));
    
    // Verificar se as mensagens de erro aparecem
    expect(screen.getByText('Selecione um arquivo para upload.')).toBeInTheDocument();
    
    // Selecionar tipo, mas não selecionar arquivo
    fireEvent.change(screen.getByLabelText('Tipo de Documento*'), { target: { value: 'rg' } });
    fireEvent.click(screen.getByText('Enviar Documento'));
    
    // Verificar que ainda exibe o erro de arquivo
    expect(screen.getByText('Selecione um arquivo para upload.')).toBeInTheDocument();
  });

  it('deve enviar o documento quando o formulário for preenchido corretamente', async () => {
    render(<DocumentoUpload />);
    
    // Preencher o formulário
    fireEvent.change(screen.getByLabelText('Tipo de Documento*'), { target: { value: 'rg' } });
    
    // Criar um arquivo válido
    const validFile = createMockFile('rg.pdf', 'application/pdf', 2 * 1024 * 1024);
    
    // Mock do FileList
    const fileList = {
      0: validFile,
      length: 1,
      item: (index: number) => fileList[index]
    };
    
    // Simular o upload do arquivo
    const fileInput = screen.getByLabelText('Arquivo*');
    fireEvent.change(fileInput, { target: { files: fileList } });
    
    // Verificar se o nome do arquivo é preenchido automaticamente
    expect(screen.getByLabelText('Nome do Arquivo (opcional)')).toHaveValue('rg.pdf');
    
    // Alterar o nome personalizado
    fireEvent.change(screen.getByLabelText('Nome do Arquivo (opcional)'), { target: { value: 'RG_Aluno123' } });
    
    // Enviar o formulário
    fireEvent.click(screen.getByText('Enviar Documento'));
    
    // Verificar se o serviço foi chamado com os parâmetros corretos
    expect(documentoService.criarDocumento).toHaveBeenCalledWith({
      aluno_id: 'aluno-123',
      tipo: 'RG',
      nome_arquivo: 'RG_Aluno123',
      url: expect.any(String),
      status: 'pendente',
      observacao: ''
    });
  });

  it('deve tratar erros ao enviar o documento', async () => {
    // Mock para simular erro no envio
    vi.mocked(documentoService.criarDocumento).mockRejectedValueOnce(new Error('Erro ao salvar documento'));
    
    render(<DocumentoUpload />);
    
    // Preencher o formulário
    fireEvent.change(screen.getByLabelText('Tipo de Documento*'), { target: { value: 'rg' } });
    
    // Criar um arquivo válido
    const validFile = createMockFile('rg.pdf', 'application/pdf', 2 * 1024 * 1024);
    
    // Mock do FileList
    const fileList = {
      0: validFile,
      length: 1,
      item: (index: number) => fileList[index]
    };
    
    // Simular o upload do arquivo
    const fileInput = screen.getByLabelText('Arquivo*');
    fireEvent.change(fileInput, { target: { files: fileList } });
    
    // Enviar o formulário
    fireEvent.click(screen.getByText('Enviar Documento'));
    
    // Esperar pelo tratamento do erro
    await waitFor(() => {
      expect(screen.getByText('Não foi possível fazer o upload do documento. Tente novamente.')).toBeInTheDocument();
    });
  });
}); 