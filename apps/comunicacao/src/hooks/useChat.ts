import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import type { Conversa, Mensagem, ComunicacaoTipoMensagem } from '../types/comunicacao';

interface UseChatOptions {
  conversaId?: string;
}

interface UseChatResult {
  conversa?: Conversa;
  mensagens: Mensagem[];
  loading: boolean;
  error?: Error;
  usuarioDigitando?: string;
  enviarMensagem: (conteudo: string, tipo: ComunicacaoTipoMensagem) => Promise<void>;
  marcarComoLida: (mensagemId: string) => Promise<void>;
  indicarDigitando: (digitando: boolean) => Promise<void>;
}

export function useChat({ conversaId }: UseChatOptions): UseChatResult {
  const { user } = useAuth();
  const [conversa, setConversa] = useState<Conversa>();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [usuarioDigitando, setUsuarioDigitando] = useState<string>();

  // Carregar conversa e mensagens
  useEffect(() => {
    if (!conversaId || !user) return;

    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carregar conversa
        const { data: conversaData, error: conversaError } = await supabase
          .from('conversas')
          .select('*')
          .eq('id', conversaId)
          .single();

        if (conversaError) throw conversaError;
        setConversa(conversaData);

        // Carregar mensagens
        const { data: mensagensData, error: mensagensError } = await supabase
          .from('mensagens')
          .select('*')
          .eq('conversa_id', conversaId)
          .order('criado_at', { ascending: true });

        if (mensagensError) throw mensagensError;
        setMensagens(mensagensData);

      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar dados'));
      } finally {
        setLoading(false);
      }
    };

    carregarDados();

    // Inscrever para atualizações em tempo real
    const channel = supabase.channel(`conversa:${conversaId}`);

    // Inscrever para mensagens
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mensagens',
        filter: `conversa_id=eq.${conversaId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMensagens(prev => [...prev, payload.new as Mensagem]);
        }
      })
      .subscribe();

    // Inscrever para status de digitação
    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.usuario_id !== user.id) {
          setUsuarioDigitando(payload.digitando ? payload.usuario_nome : undefined);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversaId, user]);

  // Enviar mensagem
  const enviarMensagem = async (conteudo: string, tipo: ComunicacaoTipoMensagem) => {
    if (!conversaId || !user) return;

    try {
      const { error: insertError } = await supabase
        .from('mensagens')
        .insert({
          conversa_id: conversaId,
          remetente_id: user.id,
          conteudo,
          tipo,
          lida: false
        });

      if (insertError) throw insertError;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao enviar mensagem'));
      throw err;
    }
  };

  // Marcar mensagem como lida
  const marcarComoLida = async (mensagemId: string) => {
    if (!user) return;

    try {
      const { error: updateError } = await supabase
        .from('mensagens')
        .update({ lida: true })
        .eq('id', mensagemId);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao marcar mensagem como lida'));
      throw err;
    }
  };

  // Indicar que está digitando
  const indicarDigitando = async (digitando: boolean) => {
    if (!conversaId || !user) return;

    try {
      await supabase
        .channel(`conversa:${conversaId}`)
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            usuario_id: user.id,
            usuario_nome: user.user_metadata?.nome || user.email,
            digitando
          }
        });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar status de digitação'));
      throw err;
    }
  };

  return {
    conversa,
    mensagens,
    loading,
    error,
    usuarioDigitando,
    enviarMensagem,
    marcarComoLida,
    indicarDigitando
  };
} 