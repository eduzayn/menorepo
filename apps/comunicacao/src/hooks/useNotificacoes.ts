import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificacoesService } from '../services';
import type {
  NotificacaoConfig,
  InsertNotificacaoConfig,
  UpdateNotificacaoConfig,
  TipoNotificacao,
  ComunicacaoCanal,
} from '../types/comunicacao';

export const useNotificacoes = () => {
  const queryClient = useQueryClient();

  // Queries
  const configuracoes = (usuarioId: string) =>
    useQuery({
      queryKey: ['notificacoes', usuarioId],
      queryFn: () => notificacoesService.listarConfiguracoes(usuarioId),
      enabled: !!usuarioId,
    });

  const configuracao = (id: string) =>
    useQuery({
      queryKey: ['notificacao', id],
      queryFn: () => notificacoesService.obterConfiguracao(id),
      enabled: !!id,
    });

  // Mutations
  const criarConfiguracao = useMutation({
    mutationFn: notificacoesService.criarConfiguracao,
    onSuccess: (_, config) => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes', config.usuario_id] });
    },
  });

  const atualizarConfiguracao = useMutation({
    mutationFn: ({ id, config }: { id: string; config: UpdateNotificacaoConfig }) =>
      notificacoesService.atualizarConfiguracao(id, config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes', data.usuario_id] });
      queryClient.invalidateQueries({ queryKey: ['notificacao', data.id] });
    },
  });

  const excluirConfiguracao = useMutation({
    mutationFn: notificacoesService.excluirConfiguracao,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['notificacao', id] });
    },
  });

  const obterConfiguracaoPorTipoECanal = useMutation({
    mutationFn: ({
      usuarioId,
      tipo,
      canal,
    }: {
      usuarioId: string;
      tipo: TipoNotificacao;
      canal: ComunicacaoCanal;
    }) => notificacoesService.obterConfiguracaoPorTipoECanal(usuarioId, tipo, canal),
  });

  const verificarPermissaoNotificacao = useMutation({
    mutationFn: ({
      usuarioId,
      tipo,
      canal,
    }: {
      usuarioId: string;
      tipo: TipoNotificacao;
      canal: ComunicacaoCanal;
    }) => notificacoesService.verificarPermissaoNotificacao(usuarioId, tipo, canal),
  });

  return {
    // Queries
    configuracoes,
    configuracao,
    // Mutations
    criarConfiguracao,
    atualizarConfiguracao,
    excluirConfiguracao,
    obterConfiguracaoPorTipoECanal,
    verificarPermissaoNotificacao,
  };
}; 