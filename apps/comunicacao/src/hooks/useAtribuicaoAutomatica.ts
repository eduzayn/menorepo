import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Regra {
  id: string;
  nome: string;
  descricao: string;
  palavras_chave: string[];
  departamento: string;
  prioridade: number;
  ativo: boolean;
  criado_at?: string;
  atualizado_at?: string;
}

export interface RegrasState {
  regras: Regra[];
  isLoading: boolean;
  error: Error | null;
  criarRegra: (regra: Omit<Regra, 'id' | 'criado_at' | 'atualizado_at'>) => Promise<Regra>;
  atualizarRegra: (id: string, regra: Partial<Regra>) => Promise<Regra>;
  excluirRegra: (id: string) => Promise<void>;
  reordenarRegras: (regras: Regra[]) => Promise<void>;
  testarAtribuicao: (mensagem: string) => Promise<{
    regra: Regra | null;
    palavras_encontradas: string[];
  }>;
}

export function useAtribuicaoAutomatica(): RegrasState {
  const [regras, setRegras] = useState<Regra[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    carregarRegras();
  }, []);

  async function carregarRegras() {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('automacao_regras')
        .select('*')
        .order('prioridade', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setRegras(data || []);
    } catch (err) {
      console.error('Erro ao carregar regras:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar regras'));
    } finally {
      setIsLoading(false);
    }
  }

  async function criarRegra(regra: Omit<Regra, 'id' | 'criado_at' | 'atualizado_at'>): Promise<Regra> {
    try {
      const { data, error } = await supabase
        .from('automacao_regras')
        .insert([regra])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setRegras(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erro ao criar regra:', err);
      throw err instanceof Error ? err : new Error('Erro desconhecido ao criar regra');
    }
  }

  async function atualizarRegra(id: string, regra: Partial<Regra>): Promise<Regra> {
    try {
      const { data, error } = await supabase
        .from('automacao_regras')
        .update(regra)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setRegras(prev => prev.map(r => r.id === id ? data : r));
      return data;
    } catch (err) {
      console.error('Erro ao atualizar regra:', err);
      throw err instanceof Error ? err : new Error('Erro desconhecido ao atualizar regra');
    }
  }

  async function excluirRegra(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('automacao_regras')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setRegras(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Erro ao excluir regra:', err);
      throw err instanceof Error ? err : new Error('Erro desconhecido ao excluir regra');
    }
  }

  async function reordenarRegras(regrasAtualizadas: Regra[]): Promise<void> {
    try {
      // Cria um lote de atualizações
      const atualizacoes = regrasAtualizadas.map(regra => ({
        id: regra.id,
        prioridade: regra.prioridade
      }));

      // Atualiza todas as regras em uma transação
      const { error } = await supabase.rpc('atualizar_prioridades_regras', {
        regras_json: JSON.stringify(atualizacoes)
      });

      if (error) {
        throw new Error(error.message);
      }

      setRegras(regrasAtualizadas);
    } catch (err) {
      console.error('Erro ao reordenar regras:', err);
      throw err instanceof Error ? err : new Error('Erro desconhecido ao reordenar regras');
    }
  }

  async function testarAtribuicao(mensagem: string): Promise<{
    regra: Regra | null;
    palavras_encontradas: string[];
  }> {
    try {
      // Lógica para testar a atribuição com base nas regras atuais
      const mensagemLowerCase = mensagem.toLowerCase();
      const regrasFiltradas = regras.filter(regra => regra.ativo);
      
      // Ordenar regras por prioridade (maior primeiro)
      const regrasOrdenadas = [...regrasFiltradas].sort((a, b) => b.prioridade - a.prioridade);
      
      for (const regra of regrasOrdenadas) {
        const palavrasEncontradas = regra.palavras_chave.filter(palavra => 
          mensagemLowerCase.includes(palavra.toLowerCase())
        );
        
        if (palavrasEncontradas.length > 0) {
          return {
            regra,
            palavras_encontradas: palavrasEncontradas
          };
        }
      }
      
      // Se nenhuma regra corresponder
      return {
        regra: null,
        palavras_encontradas: []
      };
    } catch (err) {
      console.error('Erro ao testar atribuição:', err);
      throw err instanceof Error ? err : new Error('Erro desconhecido ao testar atribuição');
    }
  }

  return {
    regras,
    isLoading,
    error,
    criarRegra,
    atualizarRegra,
    excluirRegra,
    reordenarRegras,
    testarAtribuicao
  };
} 