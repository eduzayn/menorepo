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
  const grupos = useQuery<Grupo[]>({
    queryKey: ['grupos'],
    queryFn: gruposService.listarGrupos,
  });

  const grupo = (id: string) =>
    useQuery<Grupo & { participantes: (GrupoParticipante & { usuario: any })[] }>({
      queryKey: ['grupo', id],
      queryFn: () => gruposService.obterGrupo(id),
      enabled: !!id,
    });

  const participantes = (grupoId: string) =>
    useQuery<(GrupoParticipante & { usuario: any })[]>({
      queryKey: ['participantes', grupoId],
      queryFn: () => gruposService.listarParticipantes(grupoId),
      enabled: !!grupoId,
    });

  // Mutations
  const criarGrupo = useMutation<Grupo, Error, InsertGrupo>({
    mutationFn: gruposService.criarGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
    },
  });

  const atualizarGrupo = useMutation<Grupo, Error, { id: string; grupo: UpdateGrupo }>({
    mutationFn: ({ id, grupo }) => gruposService.atualizarGrupo(id, grupo),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['grupo', id] });
    },
  });

  const excluirGrupo = useMutation<void, Error, string>({
    mutationFn: gruposService.excluirGrupo,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['grupo', id] });
    },
  });

  const adicionarParticipante = useMutation<
    GrupoParticipante & { usuario: any },
    Error,
    InsertGrupoParticipante
  >({
    mutationFn: gruposService.adicionarParticipante,
    onSuccess: (_, participante) => {
      queryClient.invalidateQueries({ queryKey: ['participantes', participante.grupo_id] });
      queryClient.invalidateQueries({ queryKey: ['grupo', participante.grupo_id] });
    },
  });

  const atualizarParticipante = useMutation<
    GrupoParticipante & { usuario: any },
    Error,
    {
      grupoId: string;
      usuarioId: string;
      participante: UpdateGrupoParticipante;
    }
  >({
    mutationFn: ({ grupoId, usuarioId, participante }) =>
      gruposService.atualizarParticipante(grupoId, usuarioId, participante),
    onSuccess: (_, { grupoId }) => {
      queryClient.invalidateQueries({ queryKey: ['participantes', grupoId] });
      queryClient.invalidateQueries({ queryKey: ['grupo', grupoId] });
    },
  });

  const removerParticipante = useMutation<
    void,
    Error,
    { grupoId: string; usuarioId: string }
  >({
    mutationFn: ({ grupoId, usuarioId }) =>
      gruposService.removerParticipante(grupoId, usuarioId),
    onSuccess: (_, { grupoId }) => {
      queryClient.invalidateQueries({ queryKey: ['participantes', grupoId] });
      queryClient.invalidateQueries({ queryKey: ['grupo', grupoId] });
    },
  });

  const verificarPermissao = useMutation<
    string | null,
    Error,
    { grupoId: string; usuarioId: string }
  >({
    mutationFn: ({ grupoId, usuarioId }) =>
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