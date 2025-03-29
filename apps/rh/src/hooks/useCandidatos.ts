import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCandidatosService } from '../contexts';
import { Candidato, StatusCandidato, Formacao, Experiencia } from '../types';

/**
 * Hook para gerenciamento de candidatos
 */
export const useCandidatos = (filtros?: {
  vaga_id?: string,
  status?: StatusCandidato,
  termo_busca?: string
}) => {
  const candidatosService = useCandidatosService();
  const queryClient = useQueryClient();
  const [currentFilters, setCurrentFilters] = useState(filtros);

  // Query para listar candidatos
  const candidatosQuery = useQuery({
    queryKey: ['candidatos', currentFilters],
    queryFn: () => candidatosService.listarCandidatos(currentFilters),
  });

  // Query para obter um candidato específico
  const getCandidato = (id: string) => {
    return useQuery({
      queryKey: ['candidato', id],
      queryFn: () => candidatosService.obterCandidato(id),
      enabled: !!id,
    });
  };

  // Query para listar formações de um candidato
  const getFormacoes = (candidatoId: string) => {
    return useQuery({
      queryKey: ['candidato-formacoes', candidatoId],
      queryFn: () => candidatosService.listarFormacoes(candidatoId),
      enabled: !!candidatoId,
    });
  };

  // Query para listar experiências de um candidato
  const getExperiencias = (candidatoId: string) => {
    return useQuery({
      queryKey: ['candidato-experiencias', candidatoId],
      queryFn: () => candidatosService.listarExperiencias(candidatoId),
      enabled: !!candidatoId,
    });
  };

  // Mutation para cadastrar candidato
  const createCandidatoMutation = useMutation({
    mutationFn: (novoCandidato: Omit<Candidato, 'id'>) => 
      candidatosService.cadastrarCandidato(novoCandidato),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
    },
  });

  // Mutation para atualizar candidato
  const updateCandidatoMutation = useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<Candidato> }) => 
      candidatosService.atualizarCandidato(id, dados),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      queryClient.invalidateQueries({ queryKey: ['candidato', variables.id] });
    },
  });

  // Mutation para alterar status do candidato
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status, observacao }: { id: string; status: StatusCandidato; observacao?: string }) => 
      candidatosService.alterarStatusCandidato(id, status, observacao),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      queryClient.invalidateQueries({ queryKey: ['candidato', variables.id] });
    },
  });

  // Mutation para adicionar formação
  const addFormacaoMutation = useMutation({
    mutationFn: ({ candidatoId, formacao }: { candidatoId: string; formacao: Omit<Formacao, 'id'> }) => 
      candidatosService.adicionarFormacao(candidatoId, formacao),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidato-formacoes', variables.candidatoId] });
    },
  });

  // Mutation para adicionar experiência
  const addExperienciaMutation = useMutation({
    mutationFn: ({ candidatoId, experiencia }: { candidatoId: string; experiencia: Omit<Experiencia, 'id'> }) => 
      candidatosService.adicionarExperiencia(candidatoId, experiencia),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidato-experiencias', variables.candidatoId] });
    },
  });

  // Mutation para enviar email
  const sendEmailMutation = useMutation({
    mutationFn: ({ candidatoId, dados }: { 
      candidatoId: string; 
      dados: {
        assunto: string,
        corpo: string,
        anexos?: Array<{ nome: string, url: string }>
      }
    }) => candidatosService.enviarEmail(candidatoId, dados),
  });

  // Mutation para agendar entrevista
  const scheduleInterviewMutation = useMutation({
    mutationFn: ({ candidatoId, dados }: { 
      candidatoId: string; 
      dados: {
        data: string,
        hora: string,
        tipo: 'PRESENCIAL' | 'REMOTO',
        local?: string,
        link_reuniao?: string,
        entrevistadores: string[]
      }
    }) => candidatosService.agendarEntrevista(candidatoId, dados),
  });

  // Função para atualizar filtros
  const updateFilters = (newFilters: typeof filtros) => {
    setCurrentFilters(newFilters);
  };

  return {
    // Queries
    candidatos: candidatosQuery.data?.data || [],
    candidatosLoading: candidatosQuery.isLoading,
    candidatosError: candidatosQuery.error,
    refetchCandidatos: candidatosQuery.refetch,
    
    // Funções para obter dados específicos
    getCandidato,
    getFormacoes,
    getExperiencias,
    
    // Mutations
    cadastrarCandidato: createCandidatoMutation.mutate,
    cadastrarCandidatoLoading: createCandidatoMutation.isPending,
    
    atualizarCandidato: updateCandidatoMutation.mutate,
    atualizarCandidatoLoading: updateCandidatoMutation.isPending,
    
    alterarStatusCandidato: changeStatusMutation.mutate,
    alterarStatusLoading: changeStatusMutation.isPending,
    
    adicionarFormacao: addFormacaoMutation.mutate,
    adicionarFormacaoLoading: addFormacaoMutation.isPending,
    
    adicionarExperiencia: addExperienciaMutation.mutate,
    adicionarExperienciaLoading: addExperienciaMutation.isPending,
    
    enviarEmail: sendEmailMutation.mutate,
    enviarEmailLoading: sendEmailMutation.isPending,
    
    agendarEntrevista: scheduleInterviewMutation.mutate,
    agendarEntrevistaLoading: scheduleInterviewMutation.isPending,
    
    // Filtros
    filtros: currentFilters,
    updateFilters,
  };
}; 