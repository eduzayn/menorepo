import { ApiResponse, Paginacao } from '@edunexia/shared-types';
import { Candidato, NovoCandidato, StatusCandidato } from '@edunexia/shared-types/rh';
import { SupabaseClient } from '@supabase/supabase-js';

export class CandidatosService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Lista todos os candidatos com paginação
   */
  async listarCandidatos(
    pagina = 1, 
    itensPorPagina = 10, 
    termoBusca = '', 
    status?: StatusCandidato, 
    vagaId?: string
  ): Promise<ApiResponse<Candidato[]>> {
    try {
      // Calculando o offset com base na página
      const offset = (pagina - 1) * itensPorPagina;
      
      // Iniciando a query
      let query = this.supabase
        .from('candidatos')
        .select('*', { count: 'exact' });
      
      // Adicionando filtros se fornecidos
      if (termoBusca) {
        query = query.or(`nome.ilike.%${termoBusca}%,email.ilike.%${termoBusca}%`);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (vagaId) {
        query = query.eq('vaga_id', vagaId);
      }
      
      // Executando a consulta principal
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + itensPorPagina - 1);
      
      if (error) throw error;
      
      return {
        items: data as Candidato[],
        total: count || 0,
        pagina,
        itensPorPagina
      };
    } catch (error) {
      console.error('[CandidatosService] Erro ao listar candidatos:', error);
      throw error;
    }
  }

  /**
   * Lista candidatos para uma vaga específica
   */
  async listarCandidatosPorVaga(vagaId: string): Promise<Candidato[]> {
    try {
      const { data, error } = await this.supabase
        .from('candidatos')
        .select('*')
        .eq('vaga_id', vagaId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Candidato[];
    } catch (error) {
      console.error('[CandidatosService] Erro ao listar candidatos por vaga:', error);
      throw error;
    }
  }

  /**
   * Obtém os dados de um candidato específico
   */
  async obterCandidato(id: string): Promise<Candidato> {
    try {
      const { data, error } = await this.supabase
        .from('candidatos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Candidato;
    } catch (error) {
      console.error(`[CandidatosService] Erro ao obter candidato ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cadastra um novo candidato
   */
  async cadastrarCandidato(candidato: NovoCandidato): Promise<Candidato> {
    try {
      const { data, error } = await this.supabase
        .from('candidatos')
        .insert([{
          ...candidato,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Candidato;
    } catch (error) {
      console.error('[CandidatosService] Erro ao cadastrar candidato:', error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de um candidato
   */
  async atualizarCandidato(id: string, candidato: Partial<Candidato>): Promise<Candidato> {
    try {
      const { data, error } = await this.supabase
        .from('candidatos')
        .update({
          ...candidato,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Candidato;
    } catch (error) {
      console.error(`[CandidatosService] Erro ao atualizar candidato ${id}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um candidato
   */
  async atualizarStatusCandidato(id: string, status: StatusCandidato): Promise<Candidato> {
    try {
      const { data, error } = await this.supabase
        .from('candidatos')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Candidato;
    } catch (error) {
      console.error(`[CandidatosService] Erro ao atualizar status do candidato ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui um candidato
   */
  async excluirCandidato(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('candidatos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`[CandidatosService] Erro ao excluir candidato ${id}:`, error);
      throw error;
    }
  }
} 