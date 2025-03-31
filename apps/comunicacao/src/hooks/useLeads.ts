import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { Lead, LeadStatus } from '../types/comunicacao';
import { toast } from 'sonner';

// Dados mockados para desenvolvimento
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@exemplo.com',
    telefone: '(11) 98765-4321',
    empresa: 'Empresa ABC',
    cargo: 'Gerente',
    origem: 'SITE',
    status: 'NOVO',
    data_ultimo_contato: new Date().toISOString(),
    criado_at: new Date().toISOString(),
    atualizado_at: new Date().toISOString(),
    responsavel_id: '1',
    ultima_interacao: new Date().toISOString(),
    pontuacao: 80,
    tags: ['institucional', 'alta-prioridade'],
    notas: 'Cliente interessado em todas as soluções',
    online: false,
    ultimo_acesso: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    telefone: '(21) 99876-5432',
    empresa: 'Startup XYZ',
    cargo: 'CEO',
    origem: 'INDICACAO',
    status: 'EM_CONTATO',
    data_ultimo_contato: new Date().toISOString(),
    criado_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    atualizado_at: new Date().toISOString(),
    responsavel_id: '2',
    ultima_interacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pontuacao: 95,
    tags: ['premium', 'expansão'],
    notas: 'Reunião agendada para próxima semana',
    online: true,
    ultimo_acesso: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    nome: 'Pedro Santos',
    email: 'pedro.santos@exemplo.com',
    telefone: '(31) 97654-3210',
    empresa: 'Comércio Santos',
    cargo: 'Proprietário',
    origem: 'CAMPANHA',
    status: 'QUALIFICADO',
    data_ultimo_contato: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    criado_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    atualizado_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    responsavel_id: '1',
    ultima_interacao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    pontuacao: 70,
    tags: ['loja-online', 'pequeno-negócio'],
    notas: 'Interessado na solução de e-commerce',
    online: false,
    ultimo_acesso: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    nome: 'Ana Sousa',
    email: 'ana.sousa@exemplo.com',
    telefone: '(41) 98765-1234',
    empresa: 'Educação Contínua',
    cargo: 'Diretora Pedagógica',
    origem: 'SITE',
    status: 'CONVERTIDO',
    data_ultimo_contato: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    criado_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    atualizado_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    responsavel_id: '3',
    ultima_interacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    pontuacao: 100,
    tags: ['educação', 'cliente-fiel'],
    notas: 'Cliente há mais de 2 anos, ampliando contrato',
    online: false,
    ultimo_acesso: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    nome: 'Lucas Mendes',
    email: 'lucas.mendes@exemplo.com',
    telefone: '(51) 99876-5432',
    empresa: 'TechSolutions',
    cargo: 'CTO',
    origem: 'INDICACAO',
    status: 'PERDIDO',
    data_ultimo_contato: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    criado_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    atualizado_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    responsavel_id: '2',
    ultima_interacao: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    pontuacao: 30,
    tags: ['tecnologia', 'desenvolvimento'],
    notas: 'Optou por solução concorrente devido ao preço',
    online: false,
    ultimo_acesso: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Em vez de chamar a API, usamos os dados mockados
      let filteredLeads = [...MOCK_LEADS];
      
      // Aplicar filtro de busca
      if (busca) {
        const searchTerm = busca.toLowerCase();
        filteredLeads = filteredLeads.filter(lead => 
          lead.nome.toLowerCase().includes(searchTerm) || 
          lead.email.toLowerCase().includes(searchTerm) ||
          lead.empresa?.toLowerCase().includes(searchTerm) ||
          lead.telefone?.includes(searchTerm)
        );
      }
      
      // Aplicar filtro de status
      if (status) {
        filteredLeads = filteredLeads.filter(lead => lead.status === status);
      }
      
      // Aplicar ordenação
      filteredLeads.sort((a, b) => {
        const valueA = new Date(a[ordenarPor]).getTime();
        const valueB = new Date(b[ordenarPor]).getTime();
        
        return ordem === 'asc' ? valueA - valueB : valueB - valueA;
      });

      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLeads(filteredLeads);
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
      setError(err instanceof Error ? err : new Error('Erro ao buscar leads'));
    } finally {
      setIsLoading(false);
    }
  }, [busca, status, ordenarPor, ordem]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Função para criar um novo lead
  const createLead = useCallback(async (newLead: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>) => {
    try {
      // Criar um novo lead com dados simulados
      const lead: Lead = {
        id: `mock-${Date.now()}`,
        ...newLead,
        criado_at: new Date().toISOString(),
        atualizado_at: new Date().toISOString(),
        online: false,
        ultimo_acesso: new Date().toISOString(),
      };

      // Adicionar ao estado local
      setLeads(prevLeads => [lead, ...prevLeads]);
      
      toast.success('Lead criado com sucesso!');
      return lead;
    } catch (err) {
      toast.error('Erro ao criar lead');
      throw err;
    }
  }, []);

  // Função para atualizar um lead existente
  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    try {
      // Atualizar lead localmente
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === id 
            ? { ...lead, ...updates, atualizado_at: new Date().toISOString() } 
            : lead
        )
      );
      
      toast.success('Lead atualizado com sucesso!');
      return { id, ...updates };
    } catch (err) {
      toast.error('Erro ao atualizar lead');
      throw err;
    }
  }, []);

  // Função para atualizar apenas o status de um lead (usado no kanban)
  const updateLeadStatus = useCallback(async (id: string, newStatus: LeadStatus) => {
    return updateLead(id, { 
      status: newStatus, 
      atualizado_at: new Date().toISOString(),
      ultima_interacao: new Date().toISOString()
    });
  }, [updateLead]);

  // Função para deletar um lead
  const deleteLead = useCallback(async (id: string) => {
    try {
      // Remover lead localmente
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
      toast.success('Lead removido com sucesso');
      return { success: true };
    } catch (err) {
      toast.error('Erro ao remover lead');
      throw err;
    }
  }, []);

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