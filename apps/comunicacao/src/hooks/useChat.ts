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
    const mensagensSubscription = supabase
      .channel(`conversa:${conversaId}`)
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

    return () => {
      mensagensSubscription.unsubscribe();
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
      await supabase.rpc('atualizar_status_digitando', {
        p_conversa_id: conversaId,
        p_usuario_id: user.id,
        p_digitando: digitando
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
    enviarMensagem,
    marcarComoLida,
    indicarDigitando
  };
} 