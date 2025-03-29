import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useVagasService } from '../contexts';
import { Vaga, StatusVaga } from '../types';

/**
 * Hook para gerenciamento de vagas
 */
export const useVagas = (filtros?: {
  status?: StatusVaga,
  departamento?: string,
  data_inicio?: string,
  data_fim?: string
}) => {
  const vagasService = useVagasService();
  const queryClient = useQueryClient();
  const [currentFilters, setCurrentFilters] = useState(filtros);

  // Query para listar vagas
  const vagasQuery = useQuery({
    queryKey: ['vagas', currentFilters],
    queryFn: () => vagasService.listarVagas(currentFilters),
  });

  // Mutation para criar vaga
  const createVagaMutation = useMutation({
    mutationFn: (novaVaga: Omit<Vaga, 'id'>) => vagasService.criarVaga(novaVaga),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
    },
  });

  // Mutation para atualizar vaga
  const updateVagaMutation = useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<Vaga> }) => 
      vagasService.atualizarVaga(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
    },
  });

  // Mutation para remover vaga
  const deleteVagaMutation = useMutation({
    mutationFn: (id: string) => vagasService.removerVaga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
    },
  });

  // Mutation para alterar status da vaga
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusVaga }) => 
      vagasService.alterarStatusVaga(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
    },
  });

  // Query para estatísticas
  const estatisticasQuery = useQuery({
    queryKey: ['vagas-estatisticas'],
    queryFn: () => vagasService.obterEstatisticas(),
  });

  // Função para atualizar filtros
  const updateFilters = (newFilters: typeof filtros) => {
    setCurrentFilters(newFilters);
  };

  return {
    // Queries
    vagas: vagasQuery.data?.data || [],
    vagasLoading: vagasQuery.isLoading,
    vagasError: vagasQuery.error,
    refetchVagas: vagasQuery.refetch,
    
    // Estatísticas
    estatisticas: estatisticasQuery.data?.data,
    estatisticasLoading: estatisticasQuery.isLoading,
    
    // Mutations
    criarVaga: createVagaMutation.mutate,
    criarVagaLoading: createVagaMutation.isPending,
    
    atualizarVaga: updateVagaMutation.mutate,
    atualizarVagaLoading: updateVagaMutation.isPending,
    
    removerVaga: deleteVagaMutation.mutate,
    removerVagaLoading: deleteVagaMutation.isPending,
    
    alterarStatusVaga: changeStatusMutation.mutate,
    alterarStatusLoading: changeStatusMutation.isPending,
    
    // Filtros
    filtros: currentFilters,
    updateFilters,
  };
};