import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import type { Mensagem, ComunicacaoTipoMensagem } from '../types/comunicacao';

interface UseChatOptions {
  conversaId?: string;
}

interface UseChatResult {
  mensagens: Mensagem[];
  loading: boolean;
  error?: Error;
  enviarMensagem: (texto: string) => void;
  marcarComoLida: () => void;
  indicarDigitando: (digitando: boolean) => void;
  digitando: boolean;
}

export function useChat({ conversaId }: UseChatOptions = {}): UseChatResult {
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [digitando, setDigitando] = useState(false);

  // Carregar mensagens
  useEffect(() => {
    if (!conversaId || !user) return;

    const carregarMensagens = async () => {
      try {
        setLoading(true);
        setError(undefined);

        const { data, error } = await supabase
          .from('mensagens')
          .select('*')
          .eq('conversa_id', conversaId)
          .order('criado_at', { ascending: true });

        if (error) throw error;
        setMensagens(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar mensagens'));
      } finally {
        setLoading(false);
      }
    };

    carregarMensagens();

    // Inscrever para atualizações em tempo real
    const subscription = supabase
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
          setMensagens((prev) => [...prev, payload.new as Mensagem]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversaId, user]);

  // Enviar mensagem
  const enviarMensagem = async (texto: string) => {
    if (!conversaId || !user) return;

    try {
      const mensagem: Omit<Mensagem, 'id' | 'criado_at' | 'atualizado_at'> = {
        conversa_id: conversaId,
        remetente_id: user.id,
        conteudo: texto,
        tipo: 'TEXTO',
        lida: false
      };

      const { error } = await supabase
        .from('mensagens')
        .insert([mensagem]);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao enviar mensagem'));
    }
  };

  // Marcar mensagens como lidas
  const marcarComoLida = async () => {
    if (!conversaId || !user) return;

    try {
      const { error } = await supabase
        .from('mensagens')
        .update({ lida: true })
        .eq('conversa_id', conversaId)
        .neq('remetente_id', user.id);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao marcar mensagens como lidas'));
    }
  };

  // Indicar que está digitando
  const indicarDigitando = async (digitando: boolean) => {
    if (!conversaId || !user) return;

    try {
      setDigitando(digitando);

      const { error } = await supabase
        .from('conversas')
        .update({ digitando: digitando ? user.id : null })
        .eq('id', conversaId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao indicar status de digitação'));
    }
  };

  return {
    mensagens,
    loading,
    error,
    enviarMensagem,
    marcarComoLida,
    indicarDigitando,
    digitando
  };
} 