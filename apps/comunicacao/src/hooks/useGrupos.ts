import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gruposService } from '../services';
import type {
  Grupo,
  GrupoParticipante,
  InsertGrupo,
  UpdateGrupo,
  InsertGrupoParticipante,
  UpdateGrupoParticipante,
} from '../types/comunicacao';

export const useGrupos = () => {
  const queryClient = useQueryClient();

  // Queries
  const grupos = useQuery({
    queryKey: ['grupos'],
    queryFn: gruposService.listarGrupos,
  });

  const grupo = (id: string) =>
    useQuery({
      queryKey: ['grupo', id],
      queryFn: () => gruposService.obterGrupo(id),
      enabled: !!id,
    });

  const participantes = (grupoId: string) =>
    useQuery({
      queryKey: ['participantes', grupoId],
      queryFn: () => gruposService.listarParticipantes(grupoId),
      enabled: !!grupoId,
    });

  // Mutations
  const criarGrupo = useMutation({
    mutationFn: gruposService.criarGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
    },
  });

  const atualizarGrupo = useMutation({
    mutationFn: ({ id, grupo }: { id: string; grupo: UpdateGrupo }) =>
      gruposService.atualizarGrupo(id, grupo),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['grupo', id] });
    },
  });

  const excluirGrupo = useMutation({
    mutationFn: gruposService.excluirGrupo,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['grupo', id] });
    },
  });

  const adicionarParticipante = useMutation({
    mutationFn: gruposService.adicionarParticipante,
    onSuccess: (_, participante) => {
      queryClient.invalidateQueries({ queryKey: ['participantes', participante.grupo_id] });
      queryClient.invalidateQueries({ queryKey: ['grupo', participante.grupo_id] });
    },
  });

  const atualizarParticipante = useMutation({
    mutationFn: ({
      grupoId,
      usuarioId,
      participante,
    }: {
      grupoId: string;
      usuarioId: string;
      participante: UpdateGrupoParticipante;
    }) => gruposService.atualizarParticipante(grupoId, usuarioId, participante),
    onSuccess: (_, { grupoId }) => {
      queryClient.invalidateQueries({ queryKey: ['participantes', grupoId] });
      queryClient.invalidateQueries({ queryKey: ['grupo', grupoId] });
    },
  });

  const removerParticipante = useMutation({
    mutationFn: ({ grupoId, usuarioId }: { grupoId: string; usuarioId: string }) =>
      gruposService.removerParticipante(grupoId, usuarioId),
    onSuccess: (_, { grupoId }) => {
      queryClient.invalidateQueries({ queryKey: ['participantes', grupoId] });
      queryClient.invalidateQueries({ queryKey: ['grupo', grupoId] });
    },
  });

  const verificarPermissao = useMutation({
    mutationFn: ({ grupoId, usuarioId }: { grupoId: string; usuarioId: string }) =>
      gruposService.verificarPermissao(grupoId, usuarioId),
  });

  return {
    // Queries
    grupos,
    grupo,
    participantes,
    // Mutations
    criarGrupo,
    atualizarGrupo,
    excluirGrupo,
    adicionarParticipante,
    atualizarParticipante,
    removerParticipante,
    verificarPermissao,
  };
}; 