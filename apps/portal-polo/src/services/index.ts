import { useApiClient } from '@edunexia/api-client';
import { Polo, Aluno, Comissao, Repasse } from '../types';

/**
 * Serviço para gerenciamento de polos
 */
export const poloService = {
  /**
   * Busca todos os polos
   */
  getAll: async (): Promise<Polo[]> => {
    const client = useApiClient();
    const { data, error } = await client.from('polos').select('*');
    
    if (error) throw error;
    return data as Polo[];
  },

  /**
   * Busca um polo pelo ID
   */
  getById: async (id: string): Promise<Polo> => {
    const client = useApiClient();
    const { data, error } = await client.from('polos').select('*').eq('id', id).single();
    
    if (error) throw error;
    return data as Polo;
  },

  /**
   * Busca alunos de um polo
   */
  getAlunos: async (poloId: string): Promise<Aluno[]> => {
    const client = useApiClient();
    const { data, error } = await client.from('alunos_polo').select('*').eq('polo_id', poloId);
    
    if (error) throw error;
    return data as Aluno[];
  },

  /**
   * Busca comissões de um polo
   */
  getComissoes: async (poloId: string): Promise<Comissao[]> => {
    const client = useApiClient();
    const { data, error } = await client.from('comissoes_polos').select('*').eq('polo_id', poloId);
    
    if (error) throw error;
    return data as Comissao[];
  },

  /**
   * Busca repasses de um polo
   */
  getRepasses: async (poloId: string): Promise<Repasse[]> => {
    const client = useApiClient();
    const { data, error } = await client.from('repasses').select('*').eq('polo_id', poloId);
    
    if (error) throw error;
    return data as Repasse[];
  }
}; 