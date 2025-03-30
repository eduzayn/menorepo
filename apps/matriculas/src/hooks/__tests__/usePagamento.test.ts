import { renderHook, waitFor } from '@edunexia/test-config';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useBuscarPagamento, useListarPagamentos, useRegistrarPagamento } from '../usePagamento';
import { pagamentoService } from '../../services/pagamentoService';
import { toast } from 'react-hot-toast';

// Mock do serviço de pagamento
vi.mock('../../services/pagamentoService', () => ({
  pagamentoService: {
    listarPagamentos: vi.fn(),
    buscarPagamento: vi.fn(),
    registrarPagamento: vi.fn(),
    estornarPagamento: vi.fn()
  }
}));

// Mock do toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Wrapper do React Query
const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Hooks de Pagamento', () => {
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    wrapper = createQueryClientWrapper();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('useListarPagamentos', () => {
    it('deve retornar a lista de pagamentos de uma matrícula', async () => {
      // Mock de dados
      const mockPagamentos = [
        {
          id: '1',
          matricula_id: 'matricula-1',
          valor: 150.5,
          data_vencimento: '2025-04-10',
          status: 'pendente'
        },
        {
          id: '2',
          matricula_id: 'matricula-1',
          valor: 150.5,
          data_vencimento: '2025-05-10',
          status: 'pendente'
        }
      ];

      // Configura o retorno do mock
      vi.mocked(pagamentoService.listarPagamentos).mockResolvedValue(mockPagamentos);

      // Renderiza o hook
      const { result } = renderHook(() => useListarPagamentos('matricula-1'), { wrapper });

      // Aguarda o carregamento dos dados
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verifica se o serviço foi chamado corretamente
      expect(pagamentoService.listarPagamentos).toHaveBeenCalledWith('matricula-1');

      // Verifica se os dados retornados estão corretos
      expect(result.current.data).toEqual(mockPagamentos);
    });

    it('deve lidar com erros na listagem de pagamentos', async () => {
      // Configura o erro no mock
      const mockError = new Error('Erro ao listar pagamentos');
      vi.mocked(pagamentoService.listarPagamentos).mockRejectedValue(mockError);

      // Renderiza o hook
      const { result } = renderHook(() => useListarPagamentos('matricula-1'), { wrapper });

      // Aguarda o erro
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Verifica a mensagem de erro
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useBuscarPagamento', () => {
    it('deve buscar os detalhes de um pagamento específico', async () => {
      // Mock de dados
      const mockPagamento = {
        id: '1',
        matricula_id: 'matricula-1',
        valor: 150.5,
        data_vencimento: '2025-04-10',
        status: 'pendente'
      };

      // Configura o retorno do mock
      vi.mocked(pagamentoService.buscarPagamento).mockResolvedValue(mockPagamento);

      // Renderiza o hook
      const { result } = renderHook(() => useBuscarPagamento('1'), { wrapper });

      // Aguarda o carregamento dos dados
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verifica se o serviço foi chamado corretamente
      expect(pagamentoService.buscarPagamento).toHaveBeenCalledWith('1');

      // Verifica se os dados retornados estão corretos
      expect(result.current.data).toEqual(mockPagamento);
    });

    it('não deve buscar dados com ID vazio', async () => {
      // Renderiza o hook com ID vazio
      const { result } = renderHook(() => useBuscarPagamento(''), { wrapper });

      // Verifica que a query está inativa
      expect(result.current.isIdle).toBe(true);

      // Verifica que o serviço não foi chamado
      expect(pagamentoService.buscarPagamento).not.toHaveBeenCalled();
    });
  });

  describe('useRegistrarPagamento', () => {
    it('deve registrar um pagamento com sucesso', async () => {
      // Mock de dados
      const mockPagamentoRegistrado = {
        id: '1',
        matricula_id: 'matricula-1',
        valor: 150.5,
        data_vencimento: '2025-04-10',
        status: 'aprovado',
        data_pagamento: '2025-04-05',
        forma_pagamento: 'pix'
      };

      // Configura o retorno do mock
      vi.mocked(pagamentoService.registrarPagamento).mockResolvedValue(mockPagamentoRegistrado);

      // Renderiza o hook
      const { result } = renderHook(() => useRegistrarPagamento(), { wrapper });

      // Dados do pagamento
      const dadosPagamento = {
        id: '1',
        formaPagamento: 'pix',
        comprovante: undefined
      };

      // Executa a mutação
      result.current.mutate(dadosPagamento);

      // Aguarda o sucesso
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verifica se o serviço foi chamado corretamente
      expect(pagamentoService.registrarPagamento).toHaveBeenCalledWith(
        dadosPagamento.id,
        dadosPagamento.formaPagamento,
        dadosPagamento.comprovante
      );

      // Verifica se o toast foi exibido
      expect(toast.success).toHaveBeenCalledWith('Pagamento registrado com sucesso');
    });

    it('deve lidar com erros no registro de pagamento', async () => {
      // Configura o erro no mock
      const mockError = new Error('Erro ao registrar pagamento');
      vi.mocked(pagamentoService.registrarPagamento).mockRejectedValue(mockError);

      // Renderiza o hook
      const { result } = renderHook(() => useRegistrarPagamento(), { wrapper });

      // Dados do pagamento
      const dadosPagamento = {
        id: '1',
        formaPagamento: 'pix',
        comprovante: undefined
      };

      // Executa a mutação
      result.current.mutate(dadosPagamento);

      // Aguarda o erro
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Verifica se o toast de erro foi exibido
      expect(toast.error).toHaveBeenCalledWith('Erro ao registrar pagamento');
    });
  });
}); 