import { useState, useEffect, useCallback } from 'react';
import { useAlunoContext } from '../contexts/AlunoContext';

// Interface para uma notificação
export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'aviso' | 'urgente';
  dataEnvio: string;
  lida: boolean;
}

/**
 * Hook para gerenciar notificações do aluno
 * @returns Dados das notificações e funções para manipulação
 */
export function useNotificacoes() {
  const { perfil, isAuthenticated } = useAlunoContext();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar notificações
  const fetchNotificacoes = useCallback(async () => {
    // Verifica se o usuário está autenticado
    if (!isAuthenticated || !perfil) {
      setError('Usuário não autenticado');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Em produção: Chamada à API
      // Simulação de dados para desenvolvimento
      const mockNotificacoes: Notificacao[] = [
        {
          id: '1',
          titulo: 'Boas-vindas ao Portal',
          mensagem: 'Seja bem-vindo ao Portal do Aluno da Edunéxia!',
          tipo: 'info',
          dataEnvio: new Date().toISOString(),
          lida: false
        },
        {
          id: '2',
          titulo: 'Nota publicada',
          mensagem: 'A nota da sua avaliação foi publicada.',
          tipo: 'aviso',
          dataEnvio: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          lida: false
        },
        {
          id: '3',
          titulo: 'Prazo de matrícula',
          mensagem: 'O prazo para renovação de matrícula está acabando!',
          tipo: 'urgente',
          dataEnvio: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          lida: true
        }
      ];
      
      // Simula um tempo de carregamento
      setTimeout(() => {
        setNotificacoes(mockNotificacoes);
        setIsLoading(false);
      }, 800);
      
    } catch (err) {
      setError('Erro ao carregar notificações');
      setIsLoading(false);
      console.error('Erro ao buscar notificações:', err);
    }
  }, [perfil, isAuthenticated]);

  // Função para marcar notificação como lida
  const marcarComoLida = (id: string) => {
    setNotificacoes(prevNotificacoes => 
      prevNotificacoes.map(notificacao => 
        notificacao.id === id ? { ...notificacao, lida: true } : notificacao
      )
    );
  };

  // Função para marcar todas como lidas
  const marcarTodasComoLidas = () => {
    setNotificacoes(prevNotificacoes => 
      prevNotificacoes.map(notificacao => ({ ...notificacao, lida: true }))
    );
  };

  // Atualiza o contador de não lidas
  useEffect(() => {
    const count = notificacoes.filter(notificacao => !notificacao.lida).length;
    setNaoLidas(count);
  }, [notificacoes]);

  // Carrega as notificações quando o perfil muda
  useEffect(() => {
    if (perfil) {
      fetchNotificacoes();
    }
  }, [perfil, fetchNotificacoes]);

  return {
    notificacoes,
    naoLidas,
    isLoading,
    error,
    marcarComoLida,
    marcarTodasComoLidas,
    fetchNotificacoes
  };
} 