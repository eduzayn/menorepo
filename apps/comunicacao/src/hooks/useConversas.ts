import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { buscarConversas, buscarConversa } from '../services/conversas';
import type { Conversa, ComunicacaoStatus } from '../types/comunicacao';

interface UseConversasOptions {
  busca?: string;
  status?: ComunicacaoStatus;
  porPagina?: number;
  ordenarPor?: 'criado_at' | 'atualizado_at' | 'ultima_mensagem_at';
  ordem?: 'asc' | 'desc';
}

interface UseConversasResult {
  conversas: Conversa[];
  conversaSelecionada: Conversa | null;
  loading: boolean;
  error?: Error;
  pagina: number;
  totalPaginas: number;
  total: number;
  buscarConversas: (opcoes?: Partial<UseConversasOptions>) => Promise<void>;
  selecionarConversa: (id: string) => Promise<void>;
  mudarPagina: (pagina: number) => Promise<void>;
}

export function useConversas(opcoesIniciais: UseConversasOptions = {}): UseConversasResult {
  const { user } = useAuth();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [opcoes, setOpcoes] = useState(opcoesIniciais);

  // Carregar conversas
  const carregarConversas = async (novaPagina = 1) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(undefined);

      const resultado = await buscarConversas({
        ...opcoes,
        pagina: novaPagina
      });

      setConversas(resultado.conversas);
      setPagina(resultado.pagina);
      setTotalPaginas(resultado.totalPaginas);
      setTotal(resultado.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar conversas'));
    } finally {
      setLoading(false);
    }
  };

  // Carregar conversas quando as opções mudarem
  useEffect(() => {
    carregarConversas(1);
  }, [opcoes]);

  // Selecionar conversa
  const selecionarConversa = async (id: string) => {
    try {
      setLoading(true);
      setError(undefined);

      const conversa = await buscarConversa(id);
      if (conversa) {
        setConversaSelecionada(conversa);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar conversa'));
    } finally {
      setLoading(false);
    }
  };

  // Mudar página
  const mudarPagina = async (novaPagina: number) => {
    await carregarConversas(novaPagina);
  };

  // Atualizar opções de busca
  const atualizarOpcoes = async (novasOpcoes: Partial<UseConversasOptions>) => {
    setOpcoes(prev => ({ ...prev, ...novasOpcoes }));
  };

  return {
    conversas,
    conversaSelecionada,
    loading,
    error,
    pagina,
    totalPaginas,
    total,
    buscarConversas: atualizarOpcoes,
    selecionarConversa,
    mudarPagina
  };
} 