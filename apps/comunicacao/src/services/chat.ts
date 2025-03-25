import { supabase } from './supabase';
import type { Conversa, Mensagem, ComunicacaoTipoMensagem } from '../types/comunicacao';

export async function getConversas(): Promise<Conversa[]> {
  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .order('atualizado_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getConversa(id: string): Promise<Conversa | null> {
  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getMensagens(conversaId: string): Promise<Mensagem[]> {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('conversa_id', conversaId)
    .order('criado_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function enviarMensagem(
  conversaId: string,
  conteudo: string,
  tipo: ComunicacaoTipoMensagem = 'TEXTO'
): Promise<Mensagem> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('mensagens')
    .insert({
      conversa_id: conversaId,
      remetente_id: user.id,
      conteudo,
      tipo,
      lida: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function marcarMensagemComoLida(mensagemId: string): Promise<void> {
  const { error } = await supabase
    .from('mensagens')
    .update({ lida: true })
    .eq('id', mensagemId);

  if (error) throw error;
}

export async function uploadArquivo(
  arquivo: File,
  pasta: string
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`${pasta}/${Date.now()}-${arquivo.name}`, arquivo);

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(data.path);

  return publicUrl;
}

export function subscribeToConversa(
  conversaId: string,
  callback: (mensagem: Mensagem) => void
) {
  return supabase
    .channel(`conversa:${conversaId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensagens',
        filter: `conversa_id=eq.${conversaId}`
      },
      (payload) => {
        callback(payload.new as Mensagem);
      }
    )
    .subscribe();
}

export async function atualizarStatusDigitando(
  conversaId: string,
  digitando: boolean
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  await supabase.rpc('atualizar_status_digitando', {
    p_conversa_id: conversaId,
    p_usuario_id: user.id,
    p_digitando: digitando
  });
} 