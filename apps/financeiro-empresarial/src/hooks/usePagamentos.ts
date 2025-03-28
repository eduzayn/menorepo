import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@edunexia/auth';
import { toast } from 'sonner';

import {
  buscarPagamentos,
  buscarPagamentoPorId,
  criarPagamento,
  atualizarPagamento,
  cancelarPagamento,
  buscarPagamentosPorCategoria,
  gerarComprovante
} from '../services/pagamentos';

import type { 
  Pagamento, 
  CategoriaFinanceira, 
  MetodoPagamento 
} from '../types/financeiro';

interface FiltroPagamento {
  instituicao_id?: string;
  tipo?: 'entrada' | 'saida';
  categoria?: CategoriaFinanceira;
  data_inicio?: string;
  data_fim?: string;
  status?: 'confirmado' | 'pendente' | 'cancelado' | 'estornado';
  destinatario_id?: string;
  destinatario_tipo?: 'aluno' | 'polo' | 'consultor' | 'fornecedor';
}

interface PagamentoInput {
  cobranca_id?: string;
  tipo: 'entrada' | 'saida';
  categoria: CategoriaFinanceira;
  valor: number;
  data_pagamento: string;
  forma_pagamento: MetodoPagamento;
  status: 'confirmado' | 'pendente' | 'cancelado' | 'estornado';
  destinatario_id?: string;
  destinatario_tipo?: 'aluno' | 'polo' | 'consultor' | 'fornecedor';
  descricao: string;
  comprovante_url?: string;
  instituicao_id: string;
  criado_por: string;
}

export function usePagamentos(filtroInicial?: FiltroPagamento) {
  const { supabase, user } = useSupabase();
  const client = { supabase };
  const queryClient = useQueryClient();
  
  const [filtros, setFiltros] = useState<FiltroPagamento>(filtroInicial || {});
  
  // Consulta para buscar todos os pagamentos com os filtros aplicados
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['pagamentos', filtros],
    queryFn: () => buscarPagamentos(client, filtros),
    select: (data) => data.dados || []
  });
  
  // Consulta para buscar pagamentos por categoria
  const buscarPorCategoria = useCallback((categoria: CategoriaFinanceira) => {
    return useQuery({
      queryKey: ['pagamentos-categoria', categoria, filtros.instituicao_id],
      queryFn: () => buscarPagamentosPorCategoria(client, categoria, filtros.instituicao_id || ''),
      select: (data) => data.dados || [],
      enabled: !!filtros.instituicao_id
    });
  }, [client, filtros.instituicao_id]);
  
  // Mutação para criar um novo pagamento
  const criarPagamentoMutation = useMutation({
    mutationFn: (pagamento: Omit<PagamentoInput, 'criado_por'>) => {
      const novoPagamento: PagamentoInput = {
        ...pagamento,
        criado_por: user?.id || ''
      };
      
      return criarPagamento(client, novoPagamento);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      toast.success('Pagamento registrado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao registrar pagamento: ${error.message}`);
    }
  });
  
  // Mutação para cancelar um pagamento
  const cancelarPagamentoMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => {
      return cancelarPagamento(client, id, motivo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      toast.success('Pagamento cancelado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao cancelar pagamento: ${error.message}`);
    }
  });
  
  // Mutação para atualizar um pagamento
  const atualizarPagamentoMutation = useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<PagamentoInput> }) => {
      return atualizarPagamento(client, id, dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      toast.success('Pagamento atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar pagamento: ${error.message}`);
    }
  });
  
  // Mutação para gerar comprovante
  const gerarComprovanteMutation = useMutation({
    mutationFn: (id: string) => {
      return gerarComprovante(client, id);
    },
    onSuccess: (response) => {
      return response.dados?.comprovante_url || '';
    },
    onError: (error) => {
      toast.error(`Erro ao gerar comprovante: ${error.message}`);
      return '';
    }
  });
  
  // Função para buscar um pagamento por ID
  const buscarPagamento = useCallback(async (id: string) => {
    try {
      const response = await buscarPagamentoPorId(client, id);
      return response.dados;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Erro ao buscar detalhes do pagamento: ${error.message}`);
      }
      return null;
    }
  }, [client]);
  
  // Função para atualizar filtros
  const atualizarFiltros = useCallback((novosFiltros: FiltroPagamento) => {
    setFiltros((filtrosAtuais) => ({
      ...filtrosAtuais,
      ...novosFiltros
    }));
  }, []);
  
  // Função para calcular totais por tipo
  const calcularTotais = useCallback(() => {
    if (!data) return { totalEntradas: 0, totalSaidas: 0, saldo: 0 };
    
    const totalEntradas = data
      .filter(p => p.tipo === 'entrada' && p.status === 'confirmado')
      .reduce((acc, curr) => acc + curr.valor, 0);
      
    const totalSaidas = data
      .filter(p => p.tipo === 'saida' && p.status === 'confirmado')
      .reduce((acc, curr) => acc + curr.valor, 0);
      
    return {
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas
    };
  }, [data]);
  
  return {
    pagamentos: data || [],
    isLoading,
    isError,
    error,
    filtros,
    atualizarFiltros,
    buscarPagamento,
    buscarPorCategoria,
    criarPagamento: criarPagamentoMutation.mutate,
    isCreating: criarPagamentoMutation.isPending,
    cancelarPagamento: cancelarPagamentoMutation.mutate,
    isCanceling: cancelarPagamentoMutation.isPending,
    atualizarPagamento: atualizarPagamentoMutation.mutate,
    isUpdating: atualizarPagamentoMutation.isPending,
    gerarComprovante: gerarComprovanteMutation.mutateAsync,
    isGeneratingVoucher: gerarComprovanteMutation.isPending,
    calcularTotais,
    refetch
  };
} 