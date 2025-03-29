import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@edunexia/api-client';

import { createContabilidadeService, contabilidadeKeys } from '../services/contabilidadeService';
import { Balancete, ContaContabil, LancamentoContabil, ObrigacaoFiscal, IntegracaoRhResponse } from '../types/contabilidade';

/**
 * Hook para acesso aos serviços de contabilidade
 */
export function useContabilidade() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const contabilidadeService = createContabilidadeService(apiClient);
  
  return {
    // Hooks para o plano de contas
    usePlanoContas: () => useQuery({
      queryKey: contabilidadeKeys.planoContas(),
      queryFn: () => contabilidadeService.obterPlanoContas(),
    }),
    
    useContaContabil: (id: string) => useQuery({
      queryKey: [...contabilidadeKeys.planoContas(), id],
      queryFn: () => contabilidadeService.obterContaContabil(id),
      enabled: !!id,
    }),
    
    useCriarContaContabil: () => useMutation({
      mutationFn: (conta: Omit<ContaContabil, 'id'>) => 
        contabilidadeService.criarContaContabil(conta),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.planoContas() });
      },
    }),
    
    useAtualizarContaContabil: () => useMutation({
      mutationFn: ({ id, conta }: { id: string; conta: Partial<ContaContabil> }) => 
        contabilidadeService.atualizarContaContabil(id, conta),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.planoContas() });
        queryClient.invalidateQueries({ queryKey: [...contabilidadeKeys.planoContas(), variables.id] });
      },
    }),
    
    // Hooks para lançamentos contábeis
    useLancamentos: (filtros: {
      dataInicio?: string;
      dataFim?: string;
      contaId?: string;
      tipoLancamento?: string;
    } = {}) => useQuery({
      queryKey: contabilidadeKeys.lancamentos(filtros),
      queryFn: () => contabilidadeService.listarLancamentos(filtros),
    }),
    
    useCriarLancamento: () => useMutation({
      mutationFn: (lancamento: Omit<LancamentoContabil, 'id' | 'criadoEm' | 'atualizadoEm'>) => 
        contabilidadeService.criarLancamento(lancamento),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.lancamentos() });
      },
    }),
    
    // Hooks para obrigações fiscais
    useObrigacoesFiscais: (filtros: {
      status?: string;
      regimeTributario?: string;
    } = {}) => useQuery({
      queryKey: contabilidadeKeys.obrigacoesFiscais(filtros),
      queryFn: () => contabilidadeService.obterObrigacoesFiscais(filtros),
    }),
    
    // Hook para balancete
    useBalancete: (mesAno: string) => useQuery({
      queryKey: contabilidadeKeys.balancete(mesAno),
      queryFn: () => contabilidadeService.gerarBalancete(mesAno),
      enabled: !!mesAno,
    }),
    
    // Hook para integração com financeiro
    useIntegracoes: (status?: string) => useQuery({
      queryKey: contabilidadeKeys.integracoes(status),
      queryFn: () => contabilidadeService.obterIntegracoes(status),
    }),
    
    useSincronizarFinanceiro: () => useMutation({
      mutationFn: contabilidadeService.sincronizarComFinanceiro,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.integracoes() });
      },
    }),
    
    // Hooks para integração com RH - Folha de Pagamento
    useFolhaPagamento: (mesAno: string) => useQuery({
      queryKey: contabilidadeKeys.rh.folhaPagamento(mesAno),
      queryFn: () => contabilidadeService.obterDadosFolhaPagamento(mesAno),
      enabled: !!mesAno,
    }),
    
    useContabilizarFolha: () => useMutation({
      mutationFn: ({ mesAno, idFolha }: { mesAno: string; idFolha: string }) => 
        contabilidadeService.contabilizarFolhaPagamento(mesAno, idFolha),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.rh.folhaPagamento(variables.mesAno) });
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.lancamentos() });
      },
    }),
    
    // Hooks para integração com RH - Férias
    useDadosFerias: (filtros: {
      dataInicio?: string;
      dataFim?: string;
      status?: string;
    } = {}) => useQuery({
      queryKey: contabilidadeKeys.rh.ferias(filtros),
      queryFn: () => contabilidadeService.obterDadosFerias(filtros),
    }),
    
    useContabilizarProvisaoFerias: () => useMutation({
      mutationFn: (mesAno: string) => contabilidadeService.contabilizarProvisaoFerias(mesAno),
      onSuccess: (_data, mesAno) => {
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.rh.ferias() });
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.lancamentos() });
      },
    }),
    
    // Hooks para integração com RH - Benefícios
    useDadosBeneficios: (mesAno: string) => useQuery({
      queryKey: contabilidadeKeys.rh.beneficios(mesAno),
      queryFn: () => contabilidadeService.obterDadosBeneficios(mesAno),
      enabled: !!mesAno,
    }),
    
    useContabilizarBeneficios: () => useMutation({
      mutationFn: ({ mesAno, idPeriodo }: { mesAno: string; idPeriodo: string }) => 
        contabilidadeService.contabilizarBeneficios(mesAno, idPeriodo),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.rh.beneficios(variables.mesAno) });
        queryClient.invalidateQueries({ queryKey: contabilidadeKeys.lancamentos() });
      },
    }),
    
    // Hook para relatório de custos de pessoal
    useRelatorioCustosPessoal: (filtros: {
      dataInicio: string;
      dataFim: string;
      departamento?: string;
      cargo?: string;
    }) => useQuery({
      queryKey: contabilidadeKeys.rh.relatorios(filtros),
      queryFn: () => contabilidadeService.gerarRelatorioCustosPessoal(filtros),
      enabled: !!(filtros.dataInicio && filtros.dataFim),
    }),
  };
} 