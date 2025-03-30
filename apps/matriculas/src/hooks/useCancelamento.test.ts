import { renderHook, waitFor } from '@edunexia/test-config';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { 
  useSolicitarCancelamento, 
  useListarSolicitacoesCancelamento,
  useObterSolicitacaoCancelamento,
  useAnalisarSolicitacaoCancelamento
} from './useCancelamento';
import { matriculaService } from '../services/matriculaService';
import { toast } from 'react-hot-toast';

// Mock dos serviços e dependências
vi.mock('../services/matriculaService', () => ({
  matriculaService: {
    solicitarCancelamento: vi.fn(),
    listarSolicitacoesCancelamento: vi.fn(),
    obterSolicitacaoCancelamento: vi.fn(),
    analisarSolicitacaoCancelamento: vi.fn(),
    processarCancelamentosAutomaticos: vi.fn()
  }
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Hooks de Cancelamento', () => {
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
  
  beforeEach(() => {
    wrapper = createWrapper();
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('useSolicitarCancelamento', () => {
    it('deve chamar o serviço de solicitar cancelamento corretamente', async () => {
      // Mock do retorno da função
      const mockResposta = { id: '123', status: 'pendente' };
      vi.mocked(matriculaService.solicitarCancelamento).mockResolvedValue(mockResposta);

      // Renderiza o hook
      const { result } = renderHook(() => useSolicitarCancelamento(), { wrapper });
      
      // Dados da solicitação
      const dados = {
        matriculaId: '456',
        dados: {
          motivoCancelamento: 'Motivo de teste',
          observacoes: 'Observações de teste'
        }
      };
      
      // Executa a mutação
      result.current.mutate(dados);
      
      // Espera a conclusão da mutação
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Verifica se o serviço foi chamado corretamente
      expect(matriculaService.solicitarCancelamento).toHaveBeenCalledWith(
        dados.matriculaId,
        dados.dados
      );
      
      // Verifica se o toast de sucesso foi exibido
      expect(toast.success).toHaveBeenCalledWith('Solicitação de cancelamento enviada com sucesso');
    });
    
    it('deve tratar erros na solicitação de cancelamento', async () => {
      // Mock de erro na função
      const mockErro = new Error('Erro no serviço');
      vi.mocked(matriculaService.solicitarCancelamento).mockRejectedValue(mockErro);
      
      // Renderiza o hook
      const { result } = renderHook(() => useSolicitarCancelamento(), { wrapper });
      
      // Executa a mutação com dados
      result.current.mutate({
        matriculaId: '456',
        dados: {
          motivoCancelamento: 'Motivo de teste',
          observacoes: 'Observações de teste'
        }
      });
      
      // Espera a conclusão da mutação com erro
      await waitFor(() => expect(result.current.isError).toBe(true));
      
      // Verifica se o toast de erro foi exibido
      expect(toast.error).toHaveBeenCalledWith('Erro ao solicitar cancelamento');
    });
  });
  
  describe('useListarSolicitacoesCancelamento', () => {
    it('deve retornar dados das solicitações de cancelamento', async () => {
      // Mock do retorno da função
      const mockSolicitacoes = {
        items: [
          { id: '1', matriculaId: '101', status: 'pendente' },
          { id: '2', matriculaId: '102', status: 'aprovado' }
        ],
        total: 2,
        page: 1,
        perPage: 10
      };
      
      vi.mocked(matriculaService.listarSolicitacoesCancelamento).mockResolvedValue(mockSolicitacoes);
      
      // Filtros para a consulta
      const filtros = {
        status: 'pendente',
        page: 1,
        perPage: 10
      };
      
      // Renderiza o hook
      const { result } = renderHook(() => useListarSolicitacoesCancelamento(filtros), { wrapper });
      
      // Espera a conclusão da consulta
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Verifica se o serviço foi chamado com os filtros corretos
      expect(matriculaService.listarSolicitacoesCancelamento).toHaveBeenCalledWith(filtros);
      
      // Verifica os dados retornados
      expect(result.current.data).toEqual(mockSolicitacoes);
    });
  });
  
  describe('useObterSolicitacaoCancelamento', () => {
    it('deve obter os detalhes de uma solicitação específica', async () => {
      // Mock do retorno da função
      const mockDetalhes = {
        id: '123',
        matriculaId: '456',
        status: 'pendente',
        motivoCancelamento: 'Motivo de teste',
        observacoes: 'Observações de teste',
        datasolicitacao: '2025-03-29T14:30:00Z'
      };
      
      vi.mocked(matriculaService.obterSolicitacaoCancelamento).mockResolvedValue(mockDetalhes);
      
      // Renderiza o hook
      const { result } = renderHook(() => useObterSolicitacaoCancelamento('123'), { wrapper });
      
      // Espera a conclusão da consulta
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Verifica se o serviço foi chamado com o ID correto
      expect(matriculaService.obterSolicitacaoCancelamento).toHaveBeenCalledWith('123');
      
      // Verifica os dados retornados
      expect(result.current.data).toEqual(mockDetalhes);
    });
    
    it('não deve fazer a chamada se o ID for falsy', async () => {
      // Renderiza o hook sem ID
      const { result } = renderHook(() => useObterSolicitacaoCancelamento(''), { wrapper });
      
      // Verifica que a consulta está desabilitada
      expect(result.current.isIdle).toBe(true);
      
      // Verifica que o serviço não foi chamado
      expect(matriculaService.obterSolicitacaoCancelamento).not.toHaveBeenCalled();
    });
  });
  
  describe('useAnalisarSolicitacaoCancelamento', () => {
    it('deve analisar corretamente uma solicitação de cancelamento', async () => {
      // Mock do retorno da função
      const mockResposta = { success: true };
      vi.mocked(matriculaService.analisarSolicitacaoCancelamento).mockResolvedValue(mockResposta);
      
      // Renderiza o hook
      const { result } = renderHook(() => useAnalisarSolicitacaoCancelamento(), { wrapper });
      
      // Dados da análise
      const analiseData = {
        id: '123',
        analise: {
          status: 'aprovado',
          observacoesAnalise: 'Aprovado conforme solicitação'
        }
      };
      
      // Executa a mutação
      result.current.mutate(analiseData);
      
      // Espera a conclusão da mutação
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Verifica se o serviço foi chamado corretamente
      expect(matriculaService.analisarSolicitacaoCancelamento).toHaveBeenCalledWith(
        analiseData.id,
        analiseData.analise
      );
      
      // Verifica se o toast de sucesso foi exibido
      expect(toast.success).toHaveBeenCalledWith('Solicitação de cancelamento analisada com sucesso');
    });
  });
}); 