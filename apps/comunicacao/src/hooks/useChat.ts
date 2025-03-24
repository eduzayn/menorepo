import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import type { Mensagem, ComunicacaoTipoMensagem, Lead, Aluno, Interacao } from '../types/comunicacao';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UseChatOptions {
  conversaId?: string;
}

interface UseChatResult {
  mensagens: Mensagem[];
  loading: boolean;
  error: Error | null;
  enviarMensagem: (conversaId: string, texto: string) => Promise<Mensagem>;
  marcarComoLida: (conversaId: string) => Promise<void>;
  indicarDigitando: (conversaId: string, digitando: boolean) => Promise<void>;
  carregarMensagens: (conversaId: string) => Promise<Mensagem[]>;
  carregarParticipante: (participanteId: string, tipo: 'LEAD' | 'ALUNO') => Promise<Lead | Aluno>;
  carregarHistoricoInteracoes: (participanteId: string, tipo: 'LEAD' | 'ALUNO') => Promise<Interacao[]>;
}

export function useChat({ conversaId }: UseChatOptions = {}): UseChatResult {
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
        (payload: RealtimePostgresChangesPayload<Mensagem>) => {
          setMensagens((prev: Mensagem[]) => [...prev, payload.new as Mensagem]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversaId, user]);

  // Enviar mensagem
  const enviarMensagem = useCallback(async (conversaId: string, texto: string): Promise<Mensagem> => {
    if (!conversaId || !user) return Promise.reject(new Error('Usuário ou conversa não definida'));

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mensagens')
        .insert([
          {
            conversa_id: conversaId,
            remetente_id: user.id,
            conteudo: texto,
            tipo: 'TEXTO',
            lida: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setMensagens((prev: Mensagem[]) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao enviar mensagem'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Marcar mensagens como lidas
  const marcarComoLida = useCallback(async (conversaId: string): Promise<void> => {
    if (!conversaId || !user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('mensagens')
        .update({ lida: true })
        .eq('conversa_id', conversaId)
        .eq('lida', false);

      if (error) throw error;

      setMensagens((prev: Mensagem[]) =>
        prev.map((msg: Mensagem) =>
          msg.conversa_id === conversaId ? { ...msg, lida: true } : msg
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao marcar mensagens como lidas'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Indicar que está digitando
  const indicarDigitando = useCallback(async (conversaId: string, digitando: boolean): Promise<void> => {
    if (!conversaId || !user) return;

    try {
      setDigitando(digitando);

      const { error } = await supabase
        .from('conversas')
        .update({ digitando: digitando ? conversaId : null })
        .eq('id', conversaId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao indicar status de digitação'));
    }
  }, [user]);

  const carregarMensagens = useCallback(async (conversaId: string): Promise<Mensagem[]> => {
    if (!conversaId || !user) return Promise.reject(new Error('Usuário ou conversa não definida'));

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('criado_at', { ascending: true });

      if (error) throw error;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar mensagens'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const carregarParticipante = useCallback(async (
    participanteId: string,
    tipo: 'LEAD' | 'ALUNO'
  ): Promise<Lead | Aluno> => {
    if (!participanteId || !user) return Promise.reject(new Error('Usuário ou participante não definida'));

    try {
      setLoading(true);
      const tabela = tipo === 'LEAD' ? 'leads' : 'alunos';
      const { data, error } = await supabase
        .from(tabela)
        .select('*')
        .eq('id', participanteId)
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar participante'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const carregarHistoricoInteracoes = useCallback(async (
    participanteId: string,
    tipo: 'LEAD' | 'ALUNO'
  ): Promise<Interacao[]> => {
    if (!participanteId || !user) return Promise.reject(new Error('Usuário ou participante não definido'));

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interacoes')
        .select('*')
        .eq('participante_id', participanteId)
        .eq('participante_tipo', tipo)
        .order('data', { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar histórico de interações'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    mensagens,
    loading,
    error,
    enviarMensagem,
    marcarComoLida,
    indicarDigitando,
    carregarMensagens,
    carregarParticipante,
    carregarHistoricoInteracoes,
  };
} 