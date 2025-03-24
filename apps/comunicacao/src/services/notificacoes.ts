import { supabase } from './supabase';
import type {
  NotificacaoConfig,
  InsertNotificacaoConfig,
  UpdateNotificacaoConfig,
  TipoNotificacao,
  ComunicacaoCanal
} from '../types/comunicacao';

export const notificacoesService = {
  // Operações de Configuração
  listarConfiguracoes: async (usuarioId: string) => {
    const { data, error } = await supabase
      .from('notificacoes_config')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('criado_at', { ascending: false });

    if (error) throw error;
    return data as NotificacaoConfig[];
  },

  obterConfiguracao: async (id: string) => {
    const { data, error } = await supabase
      .from('notificacoes_config')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as NotificacaoConfig;
  },

  criarConfiguracao: async (config: InsertNotificacaoConfig) => {
    const { data, error } = await supabase
      .from('notificacoes_config')
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    return data as NotificacaoConfig;
  },

  atualizarConfiguracao: async (id: string, config: UpdateNotificacaoConfig) => {
    const { data, error } = await supabase
      .from('notificacoes_config')
      .update(config)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as NotificacaoConfig;
  },

  excluirConfiguracao: async (id: string) => {
    const { error } = await supabase
      .from('notificacoes_config')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Operações por Tipo e Canal
  obterConfiguracaoPorTipoECanal: async (
    usuarioId: string,
    tipo: TipoNotificacao,
    canal: ComunicacaoCanal
  ) => {
    const { data, error } = await supabase
      .from('notificacoes_config')
      .select('*')
      .match({
        usuario_id: usuarioId,
        tipo_notificacao: tipo,
        canal: canal
      })
      .single();

    if (error) return null;
    return data as NotificacaoConfig;
  },

  // Verificações de Horário
  verificarHorarioPermitido: (config: NotificacaoConfig): boolean => {
    if (!config.ativo) return false;
    if (!config.horario_inicio || !config.horario_fim) return true;

    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    
    const [horaInicio, minInicio] = config.horario_inicio.split(':').map(Number);
    const [horaFim, minFim] = config.horario_fim.split(':').map(Number);
    
    const inicioMinutos = horaInicio * 60 + minInicio;
    const fimMinutos = horaFim * 60 + minFim;
    
    // Verifica se o horário atual está dentro do intervalo permitido
    if (fimMinutos > inicioMinutos) {
      return horaAtual >= inicioMinutos && horaAtual <= fimMinutos;
    } else {
      // Caso o intervalo cruze a meia-noite
      return horaAtual >= inicioMinutos || horaAtual <= fimMinutos;
    }
  },

  verificarDiaSemanaPermitido: (config: NotificacaoConfig): boolean => {
    if (!config.dias_semana || config.dias_semana.length === 0) return true;
    
    const diaAtual = new Date().getDay(); // 0 = Domingo, 6 = Sábado
    return config.dias_semana.includes(diaAtual);
  },

  // Verificação completa de permissão
  verificarPermissaoNotificacao: async (
    usuarioId: string,
    tipo: TipoNotificacao,
    canal: ComunicacaoCanal
  ): Promise<boolean> => {
    const config = await notificacoesService.obterConfiguracaoPorTipoECanal(
      usuarioId,
      tipo,
      canal
    );

    if (!config || !config.ativo) return false;

    return (
      notificacoesService.verificarHorarioPermitido(config) &&
      notificacoesService.verificarDiaSemanaPermitido(config)
    );
  }
}; 