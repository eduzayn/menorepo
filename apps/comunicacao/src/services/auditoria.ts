import { supabase } from './supabase';
import type { Database } from '../types/database';

export interface LogAuditoria {
  id: string;
  usuario_id: string;
  acao: string;
  tipo: 'CRIACAO' | 'ATUALIZACAO' | 'DELECAO' | 'ACESSO' | 'CONSENTIMENTO';
  entidade: string;
  entidade_id: string;
  dados_anteriores?: Record<string, any>;
  dados_novos?: Record<string, any>;
  ip: string;
  user_agent: string;
  criado_at: string;
}

export interface RegistrarLogParams {
  usuario_id: string;
  acao: string;
  tipo: LogAuditoria['tipo'];
  entidade: string;
  entidade_id: string;
  dados_anteriores?: Record<string, any>;
  dados_novos?: Record<string, any>;
  ip: string;
  user_agent: string;
}

export const auditoriaService = {
  // Registrar novo log de auditoria
  async registrarLog(params: RegistrarLogParams): Promise<LogAuditoria> {
    const { data, error } = await supabase
      .from('logs_auditoria')
      .insert({
        ...params,
        criado_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar logs por usuário
  async buscarLogsUsuario(
    usuarioId: string,
    options: {
      tipo?: LogAuditoria['tipo'];
      entidade?: string;
      dataInicio?: string;
      dataFim?: string;
      pagina?: number;
      porPagina?: number;
    } = {}
  ): Promise<{ logs: LogAuditoria[]; total: number }> {
    let query = supabase
      .from('logs_auditoria')
      .select('*', { count: 'exact' })
      .eq('usuario_id', usuarioId);

    if (options.tipo) {
      query = query.eq('tipo', options.tipo);
    }

    if (options.entidade) {
      query = query.eq('entidade', options.entidade);
    }

    if (options.dataInicio) {
      query = query.gte('criado_at', options.dataInicio);
    }

    if (options.dataFim) {
      query = query.lte('criado_at', options.dataFim);
    }

    if (options.pagina && options.porPagina) {
      const inicio = (options.pagina - 1) * options.porPagina;
      query = query.range(inicio, inicio + options.porPagina - 1);
    }

    query = query.order('criado_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      logs: data || [],
      total: count || 0
    };
  },

  // Buscar logs por entidade
  async buscarLogsEntidade(
    entidade: string,
    entidadeId: string,
    options: {
      tipo?: LogAuditoria['tipo'];
      dataInicio?: string;
      dataFim?: string;
      pagina?: number;
      porPagina?: number;
    } = {}
  ): Promise<{ logs: LogAuditoria[]; total: number }> {
    let query = supabase
      .from('logs_auditoria')
      .select('*', { count: 'exact' })
      .eq('entidade', entidade)
      .eq('entidade_id', entidadeId);

    if (options.tipo) {
      query = query.eq('tipo', options.tipo);
    }

    if (options.dataInicio) {
      query = query.gte('criado_at', options.dataInicio);
    }

    if (options.dataFim) {
      query = query.lte('criado_at', options.dataFim);
    }

    if (options.pagina && options.porPagina) {
      const inicio = (options.pagina - 1) * options.porPagina;
      query = query.range(inicio, inicio + options.porPagina - 1);
    }

    query = query.order('criado_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      logs: data || [],
      total: count || 0
    };
  },

  // Exportar logs para auditoria externa
  async exportarLogs(
    options: {
      dataInicio: string;
      dataFim: string;
      tipos?: LogAuditoria['tipo'][];
      entidades?: string[];
    }
  ): Promise<LogAuditoria[]> {
    let query = supabase
      .from('logs_auditoria')
      .select('*')
      .gte('criado_at', options.dataInicio)
      .lte('criado_at', options.dataFim);

    if (options.tipos?.length) {
      query = query.in('tipo', options.tipos);
    }

    if (options.entidades?.length) {
      query = query.in('entidade', options.entidades);
    }

    query = query.order('criado_at', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  }
}; 