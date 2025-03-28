import { supabase } from '../lib/supabase';
import type { InsertNotificacao, UpdateNotificacao, InsertConfiguracao, UpdateConfiguracao } from '../types/notificacoes';

export async function getNotificacoes(usuarioId: string) {
  const { data, error } = await supabase
    .from('notificacoes')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('criado_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getNotificacao(id: string) {
  const { data, error } = await supabase
    .from('notificacoes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function criarNotificacao(notificacao: InsertNotificacao) {
  const { data, error } = await supabase
    .from('notificacoes')
    .insert([notificacao])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarNotificacao(id: string, notificacao: UpdateNotificacao) {
  const { data, error } = await supabase
    .from('notificacoes')
    .update(notificacao)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function excluirNotificacao(id: string) {
  const { error } = await supabase
    .from('notificacoes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function marcarComoLida(id: string) {
  const { data, error } = await supabase
    .from('notificacoes')
    .update({ lida: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getConfiguracoes(usuarioId: string) {
  const { data, error } = await supabase
    .from('configuracoes_notificacao')
    .select('*')
    .eq('usuario_id', usuarioId);

  if (error) throw error;
  return data;
}

export async function atualizarConfiguracoes(id: string, config: UpdateConfiguracao) {
  const { data, error } = await supabase
    .from('configuracoes_notificacao')
    .update(config)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
} 