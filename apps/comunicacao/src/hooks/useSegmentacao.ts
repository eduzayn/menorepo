import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Lead, LeadSegmento } from '../types/comunicacao';
import { toast } from 'sonner';

interface UseSegmentacaoOptions {
  recarregarAutomatico?: boolean;
}

export function useSegmentacao(options: UseSegmentacaoOptions = {}) {
  const [segmentos, setSegmentos] = useState<LeadSegmento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { recarregarAutomatico = true } = options;

  useEffect(() => {
    fetchSegmentos();

    // Configurar subscription para atualizações em tempo real
    if (recarregarAutomatico) {
      const subscription = supabase
        .channel('segmentos-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'lead_segmentos' 
        }, () => {
          fetchSegmentos();
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [recarregarAutomatico]);

  const fetchSegmentos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lead_segmentos')
        .select('*')
        .order('criado_at', { ascending: false });

      if (error) throw new Error(error.message);

      setSegmentos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar segmentos'));
      console.error('Erro ao buscar segmentos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSegmento = async (segmentoData: Omit<LeadSegmento, 'id' | 'criado_at' | 'atualizado_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lead_segmentos')
        .insert(segmentoData)
        .select()
        .single();

      if (error) throw new Error(error.message);

      if (!recarregarAutomatico) {
        setSegmentos(prev => [data, ...prev]);
      }
      
      toast.success('Segmento criado com sucesso');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar segmento'));
      toast.error('Erro ao criar segmento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSegmento = async (id: string, segmentoData: Partial<LeadSegmento>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lead_segmentos')
        .update(segmentoData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      if (!recarregarAutomatico) {
        setSegmentos(prev => prev.map(segmento => segmento.id === id ? data : segmento));
      }
      
      toast.success('Segmento atualizado com sucesso');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar segmento'));
      toast.error('Erro ao atualizar segmento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSegmento = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('lead_segmentos')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      if (!recarregarAutomatico) {
        setSegmentos(prev => prev.filter(segmento => segmento.id !== id));
      }
      
      toast.success('Segmento removido com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao remover segmento'));
      toast.error('Erro ao remover segmento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar leads que pertencem a um segmento específico
  const fetchLeadsPorSegmento = async (segmentoId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Primeiro, obter os critérios do segmento
      const { data: segmento, error: segmentoError } = await supabase
        .from('lead_segmentos')
        .select('*')
        .eq('id', segmentoId)
        .single();

      if (segmentoError) throw new Error(segmentoError.message);
      if (!segmento) throw new Error('Segmento não encontrado');

      // Construir a consulta com base nos critérios do segmento
      let query = supabase.from('leads').select('*');
      
      const criterios = segmento.criterios;
      
      // Aplicar filtros básicos
      if (criterios.status) {
        query = query.eq('status', criterios.status);
      }
      
      if (criterios.origem) {
        query = query.eq('canal_origem', criterios.origem);
      }
      
      // Filtro por pontuação
      if (criterios.scoreMin !== undefined) {
        query = query.gte('score', criterios.scoreMin);
      }
      
      if (criterios.scoreMax !== undefined) {
        query = query.lte('score', criterios.scoreMax);
      }
      
      // Filtro por tags
      if (criterios.tags && criterios.tags.length > 0) {
        // Usando a função de array overlap do PostgreSQL
        query = query.contains('tags', criterios.tags);
      }
      
      // Filtro por data de criação
      if (criterios.dataCriacaoInicio) {
        query = query.gte('criado_at', criterios.dataCriacaoInicio);
      }
      
      if (criterios.dataCriacaoFim) {
        query = query.lte('criado_at', criterios.dataCriacaoFim);
      }
      
      // Filtro por engajamento
      if (criterios.engajamentoMin !== undefined) {
        query = query.gte('engajamento', criterios.engajamentoMin);
      }
      
      // Ordenação
      if (criterios.ordenarPor) {
        query = query.order(criterios.ordenarPor, { 
          ascending: criterios.ordem === 'asc'
        });
      } else {
        query = query.order('criado_at', { ascending: false });
      }
      
      const { data: leads, error: leadsError } = await query;
      
      if (leadsError) throw new Error(leadsError.message);
      
      return leads || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar leads por segmento'));
      console.error('Erro ao buscar leads por segmento:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar tag a leads de um segmento
  const adicionarTagsAoSegmento = async (segmentoId: string, tags: string[]) => {
    try {
      setIsLoading(true);
      
      // Buscar leads do segmento
      const leads = await fetchLeadsPorSegmento(segmentoId);
      
      // Para cada lead, adicionar tags
      let sucessos = 0;
      let falhas = 0;
      
      for (const lead of leads) {
        try {
          // Obter tags atuais
          const tagsAtuais = lead.tags || [];
          
          // Adicionar novas tags (sem duplicar)
          const novasTags = [...new Set([...tagsAtuais, ...tags])];
          
          // Atualizar lead
          const { error } = await supabase
            .from('leads')
            .update({ tags: novasTags })
            .eq('id', lead.id);
            
          if (error) throw error;
          sucessos++;
        } catch (err) {
          console.error(`Erro ao adicionar tags ao lead ${lead.id}:`, err);
          falhas++;
        }
      }
      
      if (falhas === 0) {
        toast.success(`Tags adicionadas a ${sucessos} leads`);
      } else {
        toast.warning(`Tags adicionadas a ${sucessos} leads, ${falhas} falhas`);
      }
      
      return { sucessos, falhas, total: leads.length };
    } catch (err) {
      toast.error('Erro ao adicionar tags aos leads');
      console.error('Erro ao adicionar tags ao segmento:', err);
      return { sucessos: 0, falhas: 0, total: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se um lead atende aos critérios de um segmento
  const verificarLeadNoSegmento = (lead: Lead, criterios: Record<string, any>): boolean => {
    // Verificar status
    if (criterios.status && lead.status !== criterios.status) {
      return false;
    }
    
    // Verificar origem
    if (criterios.origem && lead.canal_origem !== criterios.origem) {
      return false;
    }
    
    // Verificar score
    if (criterios.scoreMin !== undefined && (lead.score || 0) < criterios.scoreMin) {
      return false;
    }
    
    if (criterios.scoreMax !== undefined && (lead.score || 0) > criterios.scoreMax) {
      return false;
    }
    
    // Verificar tags
    if (criterios.tags && criterios.tags.length > 0) {
      if (!lead.tags || !criterios.tags.some((tag: string) => lead.tags?.includes(tag))) {
        return false;
      }
    }
    
    // Verificar data de criação
    if (criterios.dataCriacaoInicio) {
      if (new Date(lead.criado_at) < new Date(criterios.dataCriacaoInicio)) {
        return false;
      }
    }
    
    if (criterios.dataCriacaoFim) {
      if (new Date(lead.criado_at) > new Date(criterios.dataCriacaoFim)) {
        return false;
      }
    }
    
    // Verificar engajamento
    if (criterios.engajamentoMin !== undefined && lead.engajamento < criterios.engajamentoMin) {
      return false;
    }
    
    // Se passou por todas as verificações, está no segmento
    return true;
  };

  // Obter segmentos aos quais um lead pertence
  const getSegmentosDoLead = async (leadId: string) => {
    try {
      // Primeiro obter o lead
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
        
      if (leadError) throw leadError;
      if (!lead) throw new Error('Lead não encontrado');
      
      // Obter todos os segmentos
      const { data: todosSegmentos, error: segmentosError } = await supabase
        .from('lead_segmentos')
        .select('*');
        
      if (segmentosError) throw segmentosError;
      
      // Filtrar os segmentos aos quais o lead pertence
      const segmentosDoLead = todosSegmentos?.filter(segmento => 
        verificarLeadNoSegmento(lead, segmento.criterios)
      ) || [];
      
      return segmentosDoLead;
    } catch (err) {
      console.error('Erro ao obter segmentos do lead:', err);
      return [];
    }
  };

  return {
    segmentos,
    isLoading,
    error,
    fetchSegmentos,
    createSegmento,
    updateSegmento,
    deleteSegmento,
    fetchLeadsPorSegmento,
    adicionarTagsAoSegmento,
    verificarLeadNoSegmento,
    getSegmentosDoLead
  };
} 