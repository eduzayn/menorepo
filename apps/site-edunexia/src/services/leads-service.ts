import { ApiClient } from '@edunexia/api-client/src/client';
import { ApiError } from '@edunexia/api-client/src/types';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  created_at: string;
  updated_at?: string | null;
  assigned_to?: string | null;
  notes?: string | null;
}

export interface LeadInput {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  source: string;
}

// Flag para habilitar modo de teste com dados mockados
const USE_MOCK_DATA = true;

// Dados mockados para desenvolvimento
const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Carlos Roberto',
    email: 'carlos@example.com',
    phone: '(11) 98765-4321',
    subject: 'information',
    message: 'Gostaria de saber mais sobre o curso de desenvolvimento web.',
    source: 'website_contact_form',
    status: 'new',
    created_at: '2023-05-15T14:30:00Z'
  },
  {
    id: 'lead-2',
    name: 'Ana Paula Silva',
    email: 'ana.silva@example.com',
    phone: '(21) 99876-5432',
    subject: 'partnership',
    message: 'Tenho interesse em estabelecer uma parceria com a Edunéxia.',
    source: 'website_contact_form',
    status: 'contacted',
    created_at: '2023-05-14T10:15:00Z',
    updated_at: '2023-05-16T09:30:00Z',
    assigned_to: 'user-123',
    notes: 'Primeira conversa realizada, aguardando retorno da proposta.'
  },
  {
    id: 'lead-3',
    name: 'Marcos Oliveira',
    email: 'marcos@example.com',
    phone: '(31) 97654-3210',
    subject: 'support',
    message: 'Estou tendo problemas para acessar a plataforma.',
    source: 'website_contact_form',
    status: 'qualified',
    created_at: '2023-05-13T16:45:00Z',
    updated_at: '2023-05-13T17:20:00Z'
  }
];

/**
 * Salva um novo lead
 * @param client Cliente da API
 * @param data Dados do lead
 * @returns Lead criado ou erro
 */
export async function saveLead(
  client: ApiClient,
  data: LeadInput
): Promise<{ lead: Lead | null; error: ApiError | null }> {
  // Emular criação com dados mockados
  if (USE_MOCK_DATA) {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...data,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    // Armazenar no sessionStorage para demonstração
    try {
      const existingLeads = JSON.parse(sessionStorage.getItem('site_leads') || '[]');
      sessionStorage.setItem('site_leads', JSON.stringify([
        ...existingLeads,
        newLead
      ]));
      
      return { lead: newLead, error: null };
    } catch (error) {
      console.error('Error storing lead in sessionStorage:', error);
      return {
        lead: null,
        error: {
          message: 'Erro ao armazenar lead',
          code: 'STORAGE_ERROR',
          details: error
        }
      };
    }
  }

  try {
    const { data: createdLead, error } = await client.from('site_leads')
      .insert([{
        ...data,
        status: 'new'
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return { lead: createdLead as Lead, error: null };
  } catch (error) {
    return {
      lead: null,
      error: client.handleError(error, 'leads-service.saveLead')
    };
  }
}

/**
 * Busca todos os leads (admin)
 * @param client Cliente da API
 * @param status Filtro opcional por status
 * @returns Lista de leads ou erro
 */
export async function getAllLeads(
  client: ApiClient,
  status?: Lead['status']
): Promise<{ leads: Lead[]; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    let filteredLeads = [...mockLeads];
    
    // Adicionar leads do sessionStorage, se existirem
    try {
      const storageLeads = JSON.parse(sessionStorage.getItem('site_leads') || '[]');
      filteredLeads = [...filteredLeads, ...storageLeads];
    } catch (e) {
      console.error('Error reading from sessionStorage:', e);
    }
    
    // Aplicar filtro de status, se fornecido
    if (status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === status);
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    filteredLeads.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return { 
      leads: filteredLeads, 
      error: null 
    };
  }

  try {
    let query = client.from('site_leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { leads: data as Lead[], error: null };
  } catch (error) {
    return {
      leads: [],
      error: client.handleError(error, 'leads-service.getAllLeads')
    };
  }
}

/**
 * Atualiza um lead existente
 * @param client Cliente da API
 * @param id ID do lead
 * @param updates Atualizações a serem aplicadas
 * @returns Sucesso ou erro
 */
export async function updateLead(
  client: ApiClient,
  id: string,
  updates: Partial<Lead>
): Promise<{ success: boolean; error: ApiError | null }> {
  // Emular atualização com dados mockados
  if (USE_MOCK_DATA) {
    try {
      // Tentar atualizar no sessionStorage
      const storageLeads = JSON.parse(sessionStorage.getItem('site_leads') || '[]');
      const updatedLeads = storageLeads.map((lead: Lead) => 
        lead.id === id 
          ? { ...lead, ...updates, updated_at: new Date().toISOString() } 
          : lead
      );
      
      sessionStorage.setItem('site_leads', JSON.stringify(updatedLeads));
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating lead in sessionStorage:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao atualizar lead',
          code: 'STORAGE_ERROR',
          details: error
        }
      };
    }
  }

  try {
    const { error } = await client.from('site_leads')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'leads-service.updateLead')
    };
  }
}

/**
 * Exclui um lead
 * @param client Cliente da API
 * @param id ID do lead
 * @returns Sucesso ou erro
 */
export async function deleteLead(
  client: ApiClient,
  id: string
): Promise<{ success: boolean; error: ApiError | null }> {
  // Emular exclusão com dados mockados
  if (USE_MOCK_DATA) {
    try {
      // Tentar excluir do sessionStorage
      const storageLeads = JSON.parse(sessionStorage.getItem('site_leads') || '[]');
      const filteredLeads = storageLeads.filter((lead: Lead) => lead.id !== id);
      
      sessionStorage.setItem('site_leads', JSON.stringify(filteredLeads));
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting lead from sessionStorage:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao excluir lead',
          code: 'STORAGE_ERROR',
          details: error
        }
      };
    }
  }

  try {
    const { error } = await client.from('site_leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'leads-service.deleteLead')
    };
  }
} 