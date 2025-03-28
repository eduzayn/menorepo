import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Lead, LeadScore, LeadScoreCategoria } from '../types/comunicacao';
import { toast } from 'sonner';

interface UseLeadScoringOptions {
  autoCalculate?: boolean;
}

export function useLeadScoring(leadId?: string, options: UseLeadScoringOptions = {}) {
  const [scores, setScores] = useState<LeadScore[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { autoCalculate = true } = options;

  useEffect(() => {
    if (leadId) {
      fetchScores(leadId);
    }
  }, [leadId]);

  const fetchScores = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lead_scores')
        .select('*')
        .eq('lead_id', id);

      if (error) throw new Error(error.message);

      setScores(data || []);
      calculateTotalScore(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar pontuações do lead'));
      console.error('Erro ao buscar pontuações do lead:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalScore = (scoreData: LeadScore[]) => {
    const total = scoreData.reduce((sum, score) => sum + score.valor, 0);
    setTotalScore(total);

    // Se autoCalculate estiver ativado e houver um leadId, atualiza o score no lead
    if (autoCalculate && leadId) {
      updateLeadScore(leadId, total);
    }

    return total;
  };

  const updateLeadScore = async (id: string, score: number) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ score })
        .eq('id', id);

      if (error) throw new Error(error.message);
    } catch (err) {
      console.error('Erro ao atualizar pontuação do lead:', err);
    }
  };

  const addScore = async (scoreData: Omit<LeadScore, 'id' | 'criado_at' | 'atualizado_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lead_scores')
        .insert(scoreData)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setScores(prev => [...prev, data]);
      calculateTotalScore([...scores, data]);
      toast.success('Pontuação adicionada com sucesso');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao adicionar pontuação'));
      toast.error('Erro ao adicionar pontuação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateScore = async (id: string, scoreData: Partial<LeadScore>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lead_scores')
        .update(scoreData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setScores(prev => prev.map(score => score.id === id ? data : score));
      calculateTotalScore(scores.map(score => score.id === id ? { ...score, ...data } : score));
      toast.success('Pontuação atualizada com sucesso');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar pontuação'));
      toast.error('Erro ao atualizar pontuação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScore = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('lead_scores')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      const updatedScores = scores.filter(score => score.id !== id);
      setScores(updatedScores);
      calculateTotalScore(updatedScores);
      toast.success('Pontuação removida com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao remover pontuação'));
      toast.error('Erro ao remover pontuação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const recalculateScore = (id: string) => {
    if (!id) return;
    fetchScores(id);
  };

  // Pontua automaticamente com base em critérios
  const scoreLeadByCriteria = async (lead: Lead) => {
    try {
      if (!lead.id) return 0;
      
      const newScores: Omit<LeadScore, 'id' | 'criado_at' | 'atualizado_at'>[] = [];
      let totalNewScore = 0;
      
      // Score demográfico
      if (lead.email?.includes('.edu') || lead.email?.includes('.gov')) {
        newScores.push({
          lead_id: lead.id,
          categoria: 'DEMOGRAFICO',
          nome: 'Email institucional',
          valor: 10,
          descricao: 'Lead com email institucional (.edu ou .gov)'
        });
        totalNewScore += 10;
      }
      
      // Score de engajamento
      if (lead.engajamento > 50) {
        const engajamentoScore = Math.floor(lead.engajamento / 10);
        newScores.push({
          lead_id: lead.id,
          categoria: 'ENGAJAMENTO',
          nome: 'Alto engajamento',
          valor: engajamentoScore,
          descricao: `Lead com nível de engajamento ${lead.engajamento}`
        });
        totalNewScore += engajamentoScore;
      }
      
      // Score por origem
      if (lead.canal_origem === 'INDICACAO') {
        newScores.push({
          lead_id: lead.id,
          categoria: 'COMPORTAMENTAL',
          nome: 'Lead por indicação',
          valor: 15,
          descricao: 'Lead veio através de indicação'
        });
        totalNewScore += 15;
      }
      
      // Score por interação recente
      const ultimaInteracao = new Date(lead.ultima_interacao);
      const hoje = new Date();
      const diasDesdeUltimaInteracao = Math.floor((hoje.getTime() - ultimaInteracao.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasDesdeUltimaInteracao < 7) {
        newScores.push({
          lead_id: lead.id,
          categoria: 'INTERACAO',
          nome: 'Interação recente',
          valor: 10,
          descricao: 'Lead interagiu nos últimos 7 dias'
        });
        totalNewScore += 10;
      }
      
      // Aplica as pontuações
      if (newScores.length > 0) {
        // Limpa pontuações anteriores
        await supabase
          .from('lead_scores')
          .delete()
          .eq('lead_id', lead.id);
          
        // Insere novas pontuações
        const { data, error } = await supabase
          .from('lead_scores')
          .insert(newScores)
          .select();
          
        if (error) throw error;
        
        setScores(data || []);
        calculateTotalScore(data || []);
        
        return totalNewScore;
      }
      
      return 0;
    } catch (err) {
      console.error('Erro ao calcular pontuação automática:', err);
      return 0;
    }
  };
  
  // Busca faixas de pontuação para classificação
  const getLeadScoreRanges = () => {
    return {
      baixo: { min: 0, max: 30 },
      medio: { min: 31, max: 70 },
      alto: { min: 71, max: 100 },
      premium: { min: 101, max: Infinity }
    };
  };
  
  // Classifica o lead com base na pontuação
  const getLeadScoreClassification = (score: number) => {
    const ranges = getLeadScoreRanges();
    
    if (score <= ranges.baixo.max) return 'Baixo potencial';
    if (score <= ranges.medio.max) return 'Médio potencial';
    if (score <= ranges.alto.max) return 'Alto potencial';
    return 'Lead premium';
  };

  return {
    scores,
    totalScore,
    isLoading,
    error,
    fetchScores,
    addScore,
    updateScore,
    deleteScore,
    recalculateScore,
    scoreLeadByCriteria,
    getLeadScoreRanges,
    getLeadScoreClassification
  };
} 