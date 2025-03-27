import { supabase } from './supabase';
import type { Database } from '../types/database';

export interface Consentimento {
  id: string;
  usuario_id: string;
  tipo: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP' | 'MARKETING';
  consentido: boolean;
  data_consentimento: string;
  ip_consentimento: string;
  versao_termos: string;
  dados_consentidos: string[];
  criado_at: string;
  atualizado_at: string;
}

export interface RegistrarConsentimentoParams {
  usuario_id: string;
  tipo: Consentimento['tipo'];
  consentido: boolean;
  ip_consentimento: string;
  versao_termos: string;
  dados_consentidos: string[];
}

export const consentimentoService = {
  // Registrar novo consentimento
  async registrarConsentimento(params: RegistrarConsentimentoParams): Promise<Consentimento> {
    const { data, error } = await supabase
      .from('consentimentos')
      .insert({
        ...params,
        data_consentimento: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar consentimentos de um usuário
  async buscarConsentimentosUsuario(usuarioId: string): Promise<Consentimento[]> {
    const { data, error } = await supabase
      .from('consentimentos')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('criado_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Verificar se usuário consentiu com um tipo específico
  async verificarConsentimento(
    usuarioId: string,
    tipo: Consentimento['tipo']
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('consentimentos')
      .select('consentido')
      .eq('usuario_id', usuarioId)
      .eq('tipo', tipo)
      .order('criado_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return false;
    return data?.consentido || false;
  },

  // Revogar consentimento
  async revogarConsentimento(
    usuarioId: string,
    tipo: Consentimento['tipo']
  ): Promise<void> {
    const { error } = await supabase
      .from('consentimentos')
      .insert({
        usuario_id: usuarioId,
        tipo,
        consentido: false,
        ip_consentimento: '', // TODO: Implementar captura de IP
        versao_termos: '1.0', // TODO: Implementar versionamento de termos
        dados_consentidos: []
      });

    if (error) throw error;
  },

  // Exportar dados do usuário (LGPD)
  async exportarDadosUsuario(usuarioId: string): Promise<{
    consentimentos: Consentimento[];
    mensagens: any[];
    campanhas: any[];
  }> {
    const [consentimentos, mensagens, campanhas] = await Promise.all([
      this.buscarConsentimentosUsuario(usuarioId),
      supabase
        .from('mensagens')
        .select('*')
        .eq('remetente_id', usuarioId)
        .order('criado_at', { ascending: true }),
      supabase
        .from('campanhas')
        .select('*')
        .eq('criado_por', usuarioId)
        .order('criado_at', { ascending: true })
    ]);

    return {
      consentimentos,
      mensagens: mensagens.data || [],
      campanhas: campanhas.data || []
    };
  }
}; 