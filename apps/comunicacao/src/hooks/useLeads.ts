import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Lead, LeadStatus } from '../types/comunicacao';
import { toast } from 'sonner';

interface UseLeadsOptions {
  busca?: string;
  status?: LeadStatus | null;
  ordenarPor?: 'criado_at' | 'atualizado_at' | 'ultima_interacao';
  ordem?: 'asc' | 'desc';
  atualizacaoAutomatica?: boolean;
}

export function useLeads(options: UseLeadsOptions = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    busca = '', 
    status = null, 
    ordenarPor = 'ultima_interacao', 
    ordem = 'desc',
    atualizacaoAutomatica = true
  } = options;

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase.from('leads').select('*');
      
      // Aplicar filtros
      if (busca) {
        query = query.or(`nome.ilike.%${busca}%,email.ilike.%${busca}%,telefone.ilike.%${busca}%`);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      // Ordenação
      query = query.order(ordenarPor, { ascending: ordem === 'asc' });
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      
      setLeads(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar leads'));
      console.error('Erro ao buscar leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar leads quando as opções mudarem
  useEffect(() => {
    fetchLeads();
    
    // Configurar subscription para atualizações em tempo real se habilitado
    if (atualizacaoAutomatica) {
      const subscription = supabase
        .channel('leads-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'leads' 
        }, (payload) => {
          fetchLeads(); // Atualizar lista quando houver mudanças
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [busca, status, ordenarPor, ordem]);

  // Função para criar um novo lead
  const createLead = async (leadData: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      if (!atualizacaoAutomatica) {
        setLeads((prevLeads) => [...prevLeads, data]);
      }
      
      toast.success('Lead criado com sucesso!');
      return data;
    } catch (err) {
      toast.error('Erro ao criar lead');
      throw err;
    }
  };

  // Função para atualizar um lead existente
  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      if (!atualizacaoAutomatica) {
        setLeads((prevLeads) => 
          prevLeads.map((lead) => lead.id === id ? { ...lead, ...data } : lead)
        );
      }
      
      toast.success('Lead atualizado com sucesso!');
      return data;
    } catch (err) {
      toast.error('Erro ao atualizar lead');
      throw err;
    }
  };

  // Função para atualizar apenas o status de um lead (usado no kanban)
  const updateLeadStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      
      if (!atualizacaoAutomatica) {
        setLeads((prevLeads) => 
          prevLeads.map((lead) => lead.id === id ? { ...lead, status: newStatus } : lead)
        );
      }
      
      toast.success('Status do lead atualizado');
    } catch (err) {
      toast.error('Erro ao atualizar status do lead');
      throw err;
    }
  };

  // Função para deletar um lead
  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      
      if (!atualizacaoAutomatica) {
        setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
      }
      
      toast.success('Lead removido com sucesso');
    } catch (err) {
      toast.error('Erro ao remover lead');
      throw err;
    }
  };

  return {
    leads,
    isLoading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    updateLeadStatus,
    deleteLead
  };
} 