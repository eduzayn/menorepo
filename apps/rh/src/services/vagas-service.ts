import { ApiResponse, Paginacao } from '@edunexia/shared-types';
import { Vaga, NovaVaga, StatusVaga } from '@edunexia/shared-types/rh';
import { SupabaseClient } from '@supabase/supabase-js';

export class VagasService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Lista todas as vagas com paginação
   */
  async listarVagas(
    pagina = 1, 
    itensPorPagina = 10, 
    termoBusca = '', 
    status?: StatusVaga, 
    departamento?: string
  ): Promise<ApiResponse<Vaga[]>> {
    try {
      // Calculando o offset com base na página
      const offset = (pagina - 1) * itensPorPagina;
      
      // Iniciando a query
      let query = this.supabase
        .from('vagas')
        .select('*', { count: 'exact' });
      
      // Adicionando filtros se fornecidos
      if (termoBusca) {
        query = query.or(`titulo.ilike.%${termoBusca}%,cargo.ilike.%${termoBusca}%,descricao.ilike.%${termoBusca}%`);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (departamento) {
        query = query.eq('departamento', departamento);
      }
      
      // Executando a consulta principal
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + itensPorPagina - 1);
      
      if (error) throw error;
      
      return {
        items: data as Vaga[],
        total: count || 0,
        pagina,
        itensPorPagina
      };
    } catch (error) {
      console.error('[VagasService] Erro ao listar vagas:', error);
      throw error;
    }
  }

  /**
   * Lista todas as vagas abertas
   */
  async listarVagasAbertas(): Promise<Vaga[]> {
    try {
      const { data, error } = await this.supabase
        .from('vagas')
        .select('*')
        .eq('status', StatusVaga.ABERTA)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Vaga[];
    } catch (error) {
      console.error('[VagasService] Erro ao listar vagas abertas:', error);
      throw error;
    }
  }

  /**
   * Obtém os dados de uma vaga específica
   */
  async obterVaga(id: string): Promise<Vaga> {
    try {
      const { data, error } = await this.supabase
        .from('vagas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Vaga;
    } catch (error) {
      console.error(`[VagasService] Erro ao obter vaga ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cadastra uma nova vaga
   */
  async cadastrarVaga(vaga: NovaVaga): Promise<Vaga> {
    try {
      const { data, error } = await this.supabase
        .from('vagas')
        .insert([{
          ...vaga,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Vaga;
    } catch (error) {
      console.error('[VagasService] Erro ao cadastrar vaga:', error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de uma vaga
   */
  async atualizarVaga(id: string, vaga: Partial<Vaga>): Promise<Vaga> {
    try {
      const { data, error } = await this.supabase
        .from('vagas')
        .update({
          ...vaga,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Vaga;
    } catch (error) {
      console.error(`[VagasService] Erro ao atualizar vaga ${id}:`, error);
      throw error;
    }
  }

  /**
   * Altera o status de uma vaga
   */
  async alterarStatusVaga(id: string, status: StatusVaga): Promise<Vaga> {
    try {
      const { data, error } = await this.supabase
        .from('vagas')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Vaga;
    } catch (error) {
      console.error(`[VagasService] Erro ao alterar status da vaga ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui uma vaga
   */
  async excluirVaga(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('vagas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`[VagasService] Erro ao excluir vaga ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas sobre as vagas
   */
  async obterEstatisticas(): Promise<{ 
    total: number; 
    abertas: number; 
    encerradas: number; 
    departamentos: { nome: string; total: number }[] 
  }> {
    try {
      // Obtém o total de vagas
      const { count: total, error: totalError } = await this.supabase
        .from('vagas')
        .select('*', { count: 'exact', head: true });
        
      if (totalError) throw totalError;
      
      // Obtém o total de vagas abertas
      const { count: abertas, error: abertasError } = await this.supabase
        .from('vagas')
        .select('*', { count: 'exact', head: true })
        .eq('status', StatusVaga.ABERTA);
        
      if (abertasError) throw abertasError;
      
      // Obtém o total de vagas encerradas
      const { count: encerradas, error: encerradasError } = await this.supabase
        .from('vagas')
        .select('*', { count: 'exact', head: true })
        .eq('status', StatusVaga.ENCERRADA);
        
      if (encerradasError) throw encerradasError;
      
      // Obtém vagas por departamento
      const { data: vagasPorDepartamento, error: deptoError } = await this.supabase
        .from('vagas')
        .select('departamento')
        .order('departamento');
        
      if (deptoError) throw deptoError;
      
      // Agrupando por departamento
      const departamentoCounts: Record<string, number> = {};
      vagasPorDepartamento.forEach(vaga => {
        const depto = vaga.departamento;
        departamentoCounts[depto] = (departamentoCounts[depto] || 0) + 1;
      });
      
      const departamentos = Object.entries(departamentoCounts).map(([nome, total]) => ({
        nome,
        total
      }));
      
      return {
        total: total || 0,
        abertas: abertas || 0,
        encerradas: encerradas || 0,
        departamentos
      };
    } catch (error) {
      console.error('[VagasService] Erro ao obter estatísticas:', error);
      throw error;
    }
  }
} 