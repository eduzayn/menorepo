import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@edunexia/auth';
import { toast } from 'sonner';

import {
  buscarCobrancas,
  buscarCobrancaPorId,
  criarCobranca,
  atualizarCobranca,
  cancelarCobranca,
  registrarPagamento,
  gerarLinkPagamento,
  buscarCobrancasEmAtraso
} from '../services/cobrancas';

import type { 
  Cobranca, 
  StatusCobranca, 
  MetodoPagamento, 
  GatewayPagamento 
} from '../types/financeiro';

interface FiltroCobranca {
  instituicao_id?: string;
  aluno_id?: string;
  matricula_id?: string;
  status?: StatusCobranca;
  data_inicio?: string;
  data_fim?: string;
  polo_id?: string;
  curso_id?: string;
}

interface CobrancaInput {
  aluno_id?: string;
  matricula_id?: string;
  tipo: 'mensalidade' | 'taxa' | 'matricula' | 'outros';
  valor_total: number;
  status: StatusCobranca;
  data_emissao: string;
  data_vencimento: string;
  metodo_pagamento?: MetodoPagamento;
  gateway?: GatewayPagamento;
  parcelas?: number;
  observacao?: string;
  instituicao_id: string;
  polo_id?: string;
  curso_id?: string;
  criado_por: string;
}

export function useCobrancas(filtroInicial?: FiltroCobranca) {
  const { supabase, user } = useSupabase();
  const client = { supabase };
  const queryClient = useQueryClient();
  
  const [filtros, setFiltros] = useState<FiltroCobranca>(filtroInicial || {});
  
  // Consulta para buscar todas as cobranças com os filtros aplicados
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['cobrancas', filtros],
    queryFn: () => buscarCobrancas(client, filtros),
    select: (data) => data.dados || []
  });
  
  // Consulta para buscar cobranças em atraso
  const { 
    data: cobrancasEmAtraso,
    isLoading: isLoadingAtraso,
    refetch: refetchAtraso
  } = useQuery({
    queryKey: ['cobrancas-atraso', filtros.instituicao_id],
    queryFn: () => buscarCobrancasEmAtraso(client, filtros.instituicao_id || ''),
    select: (data) => data.dados || [],
    enabled: !!filtros.instituicao_id
  });
  
  // Mutação para criar uma nova cobrança
  const criarCobrancaMutation = useMutation({
    mutationFn: (cobranca: Omit<CobrancaInput, 'criado_por'>) => {
      const novaCobranca: CobrancaInput = {
        ...cobranca,
        criado_por: user?.id || ''
      };
      
      return criarCobranca(client, novaCobranca);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cobrancas'] });
      toast.success('Cobrança criada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar cobrança: ${error.message}`);
    }
  });
  
  // Mutação para cancelar uma cobrança
  const cancelarCobrancaMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => {
      return cancelarCobranca(client, id, motivo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cobrancas'] });
      toast.success('Cobrança cancelada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao cancelar cobrança: ${error.message}`);
    }
  });
  
  // Mutação para registrar pagamento
  const registrarPagamentoMutation = useMutation({
    mutationFn: ({ 
      id, 
      valor, 
      metodo, 
      data 
    }: { 
      id: string; 
      valor: number;
      metodo: MetodoPagamento;
      data: string;
    }) => {
      return registrarPagamento(client, id, valor, metodo, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cobrancas'] });
      toast.success('Pagamento registrado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao registrar pagamento: ${error.message}`);
    }
  });
  
  // Mutação para gerar link de pagamento
  const gerarLinkPagamentoMutation = useMutation({
    mutationFn: ({ 
      id, 
      gateway 
    }: { 
      id: string; 
      gateway: GatewayPagamento;
    }) => {
      return gerarLinkPagamento(client, id, gateway);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cobrancas'] });
      return response.dados?.link_pagamento || '';
    },
    onError: (error) => {
      toast.error(`Erro ao gerar link de pagamento: ${error.message}`);
      return '';
    }
  });
  
  // Função para buscar uma cobrança por ID
  const buscarCobranca = useCallback(async (id: string) => {
    try {
      const response = await buscarCobrancaPorId(client, id);
      return response.dados;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Erro ao buscar detalhes da cobrança: ${error.message}`);
      }
      return null;
    }
  }, [client]);
  
  // Função para atualizar filtros
  const atualizarFiltros = useCallback((novosFiltros: FiltroCobranca) => {
    setFiltros((filtrosAtuais) => ({
      ...filtrosAtuais,
      ...novosFiltros
    }));
  }, []);
  
  return {
    cobrancas: data || [],
    cobrancasEmAtraso: cobrancasEmAtraso || [],
    isLoading,
    isLoadingAtraso,
    isError,
    error,
    filtros,
    atualizarFiltros,
    buscarCobranca,
    criarCobranca: criarCobrancaMutation.mutate,
    isCreating: criarCobrancaMutation.isPending,
    cancelarCobranca: cancelarCobrancaMutation.mutate,
    isCanceling: cancelarCobrancaMutation.isPending,
    registrarPagamento: registrarPagamentoMutation.mutate,
    isRegisteringPayment: registrarPagamentoMutation.isPending,
    gerarLinkPagamento: gerarLinkPagamentoMutation.mutateAsync,
    isGeneratingLink: gerarLinkPagamentoMutation.isPending,
    refetch,
    refetchAtraso
  };
} 