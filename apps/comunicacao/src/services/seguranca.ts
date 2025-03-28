import { supabase } from './supabase';
import type { Database } from '../types/database';
import { auditoriaService } from './auditoria';
import { getRequestInfo, parseUserAgent } from '../utils/request-info';

export interface ConfiguracaoSeguranca {
  id: string;
  usuario_id: string;
  autenticacao_2fatores: boolean;
  notificacoes_seguranca: boolean;
  sessao_ativa: boolean;
  ultimo_acesso: string;
  ip_ultimo_acesso: string;
  dispositivo_ultimo_acesso: string;
  criado_at: string;
  atualizado_at: string;
}

export interface TentativaLogin {
  id: string;
  usuario_id: string;
  ip: string;
  user_agent: string;
  sucesso: boolean;
  motivo_falha?: string;
  criado_at: string;
}

export interface BloqueioTemporario {
  id: string;
  usuario_id: string;
  tipo: 'LOGIN' | 'API' | 'SMS' | 'EMAIL';
  motivo: string;
  data_inicio: string;
  data_fim: string;
  criado_at: string;
}

export const segurancaService = {
  // Configurações de Segurança

  async obterConfiguracaoSeguranca(usuarioId: string): Promise<ConfiguracaoSeguranca | null> {
    const { data, error } = await supabase
      .from('configuracoes_seguranca')
      .select('*')
      .eq('usuario_id', usuarioId)
      .single();

    if (error) throw error;
    return data;
  },

  async atualizarConfiguracaoSeguranca(
    usuarioId: string,
    config: Partial<ConfiguracaoSeguranca>
  ): Promise<ConfiguracaoSeguranca> {
    const { data, error } = await supabase
      .from('configuracoes_seguranca')
      .update({
        ...config,
        atualizado_at: new Date().toISOString()
      })
      .eq('usuario_id', usuarioId)
      .select()
      .single();

    if (error) throw error;

    // Registrar na auditoria
    await auditoriaService.registrarLog({
      usuario_id: usuarioId,
      acao: 'Atualização de configurações de segurança',
      tipo: 'ATUALIZACAO',
      entidade: 'configuracoes_seguranca',
      entidade_id: data.id,
      dados_novos: config,
      ip: '', // TODO: Implementar captura de IP
      user_agent: '' // TODO: Implementar captura de User Agent
    });

    return data;
  },

  // Tentativas de Login

  async registrarTentativaLogin(
    usuarioId: string,
    params: {
      sucesso: boolean;
      motivo_falha?: string;
    }
  ): Promise<TentativaLogin> {
    const requestInfo = getRequestInfo();
    const userAgentInfo = parseUserAgent(requestInfo.userAgent);

    const { data, error } = await supabase
      .from('tentativas_login')
      .insert({
        usuario_id: usuarioId,
        ip: requestInfo.ip,
        user_agent: requestInfo.userAgent,
        sucesso: params.sucesso,
        motivo_falha: params.motivo_falha,
        dispositivo: userAgentInfo.device,
        navegador: userAgentInfo.browser,
        sistema_operacional: userAgentInfo.os,
        criado_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Registrar na auditoria
    await auditoriaService.registrarLog({
      usuario_id: usuarioId,
      acao: `Tentativa de login ${params.sucesso ? 'bem-sucedida' : 'falhou'}`,
      tipo: 'ACESSO',
      entidade: 'tentativas_login',
      entidade_id: data.id,
      dados_novos: {
        ...params,
        ip: requestInfo.ip,
        user_agent: requestInfo.userAgent,
        dispositivo: userAgentInfo.device,
        navegador: userAgentInfo.browser,
        sistema_operacional: userAgentInfo.os
      },
      ip: requestInfo.ip,
      user_agent: requestInfo.userAgent
    });

    return data;
  },

  async verificarBloqueioLogin(usuarioId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bloqueios_temporarios')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('tipo', 'LOGIN')
      .gte('data_fim', new Date().toISOString())
      .single();

    if (error) return false;
    return !!data;
  },

  // Bloqueios Temporários

  async criarBloqueioTemporario(
    usuarioId: string,
    params: {
      tipo: BloqueioTemporario['tipo'];
      motivo: string;
      duracao_minutos: number;
    }
  ): Promise<BloqueioTemporario> {
    const requestInfo = getRequestInfo();
    const dataInicio = new Date();
    const dataFim = new Date(dataInicio.getTime() + params.duracao_minutos * 60000);

    const { data, error } = await supabase
      .from('bloqueios_temporarios')
      .insert({
        usuario_id: usuarioId,
        tipo: params.tipo,
        motivo: params.motivo,
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
        ip_bloqueio: requestInfo.ip,
        user_agent_bloqueio: requestInfo.userAgent,
        criado_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Registrar na auditoria
    await auditoriaService.registrarLog({
      usuario_id: usuarioId,
      acao: 'Criação de bloqueio temporário',
      tipo: 'CRIACAO',
      entidade: 'bloqueios_temporarios',
      entidade_id: data.id,
      dados_novos: {
        ...params,
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
        ip: requestInfo.ip,
        user_agent: requestInfo.userAgent
      },
      ip: requestInfo.ip,
      user_agent: requestInfo.userAgent
    });

    return data;
  },

  // Validações de Segurança

  async validarToken2FA(usuarioId: string, token: string): Promise<boolean> {
    // TODO: Implementar validação de token 2FA
    return true;
  },

  async validarIP(ip: string): Promise<boolean> {
    // TODO: Implementar validação de IP (geolocalização, blacklist, etc)
    return true;
  },

  async validarUserAgent(userAgent: string): Promise<boolean> {
    const userAgentInfo = parseUserAgent(userAgent);
    
    // Validações básicas de User Agent
    if (!userAgentInfo.browser || userAgentInfo.browser === 'Unknown') {
      return false;
    }

    if (!userAgentInfo.os || userAgentInfo.os === 'Unknown') {
      return false;
    }

    return true;
  }
}; 