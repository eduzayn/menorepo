import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient, createApiClient } from '../client';
import { ApiError } from '../types';

// Mock do Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn((table) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis()
    })),
    storage: {
      from: vi.fn()
    },
    functions: {
      invoke: vi.fn()
    }
  }))
}));

describe('ApiClient', () => {
  const defaultOptions = {
    supabaseUrl: 'https://example.com',
    supabaseAnonKey: 'test-key',
    enableLogging: false
  };

  let client: ApiClient;
  let mockConsoleError: any;
  let mockConsoleInfo: any;
  let mockOnError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock para o console
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockConsoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {});
    
    // Mock para a função onError
    mockOnError = vi.fn();
    
    // Limpar mocks
    vi.clearAllMocks();
    
    // Criar cliente para os testes
    client = createApiClient(defaultOptions);
  });

  it('deve criar uma instância do cliente corretamente', () => {
    expect(client).toBeInstanceOf(ApiClient);
  });

  it('deve permitir acesso ao cliente Supabase subjacente', () => {
    expect(client.supabase).toBeDefined();
  });

  it('deve fornecer acesso ao módulo de autenticação', () => {
    expect(client.auth).toBeDefined();
  });

  it('deve fornecer acesso ao módulo de armazenamento', () => {
    expect(client.storage).toBeDefined();
  });

  it('deve fornecer acesso ao módulo de funções', () => {
    expect(client.functions).toBeDefined();
  });

  it('deve fornecer método from para acesso às tabelas', () => {
    const query = client.from('matriculas');
    expect(query).toBeDefined();
  });

  it('deve tratar erros com a função handleError', () => {
    const error = new Error('Teste de erro');
    const operation = 'operacao_teste';
    
    const apiError = client.handleError(error, operation);
    
    expect(apiError).toBeDefined();
    expect(apiError.message).toBe('Teste de erro');
    expect(apiError.operation).toBe(operation);
    expect(apiError.timestamp).toBeInstanceOf(Date);
    expect(apiError.originalError).toBe(error);
  });

  it('deve chamar onError quando fornecido', () => {
    // Criar cliente com onError
    const clientWithOnError = createApiClient({
      ...defaultOptions,
      onError: mockOnError
    });
    
    const error = new Error('Teste de erro');
    clientWithOnError.handleError(error, 'operacao_teste');
    
    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(mockOnError).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Teste de erro',
      operation: 'operacao_teste'
    }));
  });

  it('deve registrar logs quando enableLogging é true', () => {
    // Criar cliente com logs habilitados
    const clientWithLogging = createApiClient({
      ...defaultOptions,
      enableLogging: true
    });
    
    const error = new Error('Teste de erro');
    clientWithLogging.handleError(error, 'operacao_teste');
    
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      '[API Error] operacao_teste:',
      expect.objectContaining({
        message: 'Teste de erro',
        operation: 'operacao_teste'
      })
    );
  });

  it('deve executar operações com executeOperation', async () => {
    const mockFn = vi.fn().mockResolvedValue({ success: true });
    
    const result = await client.executeOperation('teste', mockFn);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true });
  });

  it('deve registrar logs de operação quando enableLogging é true', async () => {
    // Criar cliente com logs habilitados
    const clientWithLogging = createApiClient({
      ...defaultOptions,
      enableLogging: true
    });
    
    const mockFn = vi.fn().mockResolvedValue({ success: true });
    
    await clientWithLogging.executeOperation('teste', mockFn);
    
    expect(mockConsoleInfo).toHaveBeenCalledTimes(2);
    expect(mockConsoleInfo).toHaveBeenNthCalledWith(1, '[API] Executando operação: teste');
    expect(mockConsoleInfo).toHaveBeenNthCalledWith(2, '[API] Operação concluída: teste');
  });

  it('deve tratar erros durante executeOperation', async () => {
    const error = new Error('Erro na operação');
    const mockFn = vi.fn().mockRejectedValue(error);
    
    await expect(client.executeOperation('operacao_falha', mockFn)).rejects.toThrow();
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('deve criar um error padronizado com handleError e unknownError', () => {
    const unknownError = { status: 500 };
    const apiError = client.handleError(unknownError, 'operacao_teste');
    
    expect(apiError.message).toBe('Erro desconhecido');
    expect(apiError.originalError).toBe(unknownError);
  });

  it('deve manter db como método legado', () => {
    expect(client.db).toBeDefined();
    // @ts-ignore - ignoramos erro de tipagem pois estamos testando método legado
    expect(typeof client.db).toBe('function');
  });
}); 