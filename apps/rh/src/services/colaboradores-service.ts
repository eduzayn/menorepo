import { ApiResponse } from '@edunexia/shared-types';
import { Colaborador, NovoColaborador, TipoContrato } from '@edunexia/shared-types/rh';
import { SupabaseClient } from '@supabase/supabase-js';

export class ColaboradoresService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Lista todos os colaboradores com paginação
   */
  async listarColaboradores(
    pagina = 1, 
    itensPorPagina = 10, 
    termoBusca = '', 
    departamento?: string,
    cargo?: string,
    tipoContrato?: TipoContrato,
    ativo = true
  ): Promise<ApiResponse<Colaborador[]>> {
    try {
      // Calculando o offset com base na página
      const offset = (pagina - 1) * itensPorPagina;
      
      // Iniciando a query
      let query = this.supabase
        .from('colaboradores')
        .select('*', { count: 'exact' })
        .eq('ativo', ativo);
      
      // Adicionando filtros se fornecidos
      if (termoBusca) {
        query = query.or(`nome.ilike.%${termoBusca}%,email.ilike.%${termoBusca}%,cargo.ilike.%${termoBusca}%`);
      }
      
      if (departamento) {
        query = query.eq('departamento', departamento);
      }
      
      if (cargo) {
        query = query.eq('cargo', cargo);
      }
      
      if (tipoContrato) {
        query = query.eq('tipo_contrato', tipoContrato);
      }
      
      // Executando a consulta principal
      const { data, error, count } = await query
        .order('nome')
        .range(offset, offset + itensPorPagina - 1);
      
      if (error) throw error;
      
      return {
        items: data as Colaborador[],
        total: count || 0,
        pagina,
        itensPorPagina
      };
    } catch (error) {
      console.error('[ColaboradoresService] Erro ao listar colaboradores:', error);
      throw error;
    }
  }

  /**
   * Lista todos os colaboradores ativos
   */
  async listarColaboradoresAtivos(): Promise<Colaborador[]> {
    try {
      const { data, error } = await this.supabase
        .from('colaboradores')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) throw error;
      
      return data as Colaborador[];
    } catch (error) {
      console.error('[ColaboradoresService] Erro ao listar colaboradores ativos:', error);
      throw error;
    }
  }

  /**
   * Obtém os dados de um colaborador específico
   */
  async obterColaborador(id: string): Promise<Colaborador> {
    try {
      const { data, error } = await this.supabase
        .from('colaboradores')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Colaborador;
    } catch (error) {
      console.error(`[ColaboradoresService] Erro ao obter colaborador ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cadastra um novo colaborador
   */
  async cadastrarColaborador(colaborador: NovoColaborador): Promise<Colaborador> {
    try {
      const { data, error } = await this.supabase
        .from('colaboradores')
        .insert([{
          ...colaborador,
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Colaborador;
    } catch (error) {
      console.error('[ColaboradoresService] Erro ao cadastrar colaborador:', error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de um colaborador
   */
  async atualizarColaborador(id: string, colaborador: Partial<Colaborador>): Promise<Colaborador> {
    try {
      const { data, error } = await this.supabase
        .from('colaboradores')
        .update({
          ...colaborador,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Colaborador;
    } catch (error) {
      console.error(`[ColaboradoresService] Erro ao atualizar colaborador ${id}:`, error);
      throw error;
    }
  }

  /**
   * Desativa um colaborador (demissão/saída)
   */
  async desativarColaborador(id: string, dataDemissao: string): Promise<Colaborador> {
    try {
      const { data, error } = await this.supabase
        .from('colaboradores')
        .update({
          ativo: false,
          data_demissao: dataDemissao,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Colaborador;
    } catch (error) {
      console.error(`[ColaboradoresService] Erro ao desativar colaborador ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reativa um colaborador (readmissão)
   */
  async reativarColaborador(id: string, dataReadmissao: string): Promise<Colaborador> {
    try {
      const { data, error } = await this.supabase
        .from('colaboradores')
        .update({
          ativo: true,
          data_demissao: null,
          data_readmissao: dataReadmissao,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Colaborador;
    } catch (error) {
      console.error(`[ColaboradoresService] Erro ao reativar colaborador ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém os departamentos cadastrados
   */
  async obterDepartamentos(): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('colaboradores')
        .select('departamento')
        .order('departamento');
      
      if (error) throw error;
      
      // Removendo duplicatas
      const departamentos = [...new Set(data.map(item => item.departamento))];
      return departamentos;
    } catch (error) {
      console.error('[ColaboradoresService] Erro ao obter departamentos:', error);
      throw error;
    }
  }

  /**
   * Obtém os cargos cadastrados
   */
  async obterCargos(): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('colaboradores')
        .select('cargo')
        .order('cargo');
      
      if (error) throw error;
      
      // Removendo duplicatas
      const cargos = [...new Set(data.map(item => item.cargo))];
      return cargos;
    } catch (error) {
      console.error('[ColaboradoresService] Erro ao obter cargos:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas sobre os colaboradores
   */
  async obterEstatisticas(): Promise<{ 
    total: number; 
    ativos: number; 
    inativos: number; 
    porDepartamento: { nome: string; total: number }[];
    porTipoContrato: { tipo: TipoContrato; total: number }[];
  }> {
    try {
      // Obtém o total de colaboradores
      const { count: total, error: totalError } = await this.supabase
        .from('colaboradores')
        .select('*', { count: 'exact', head: true });
        
      if (totalError) throw totalError;
      
      // Obtém o total de colaboradores ativos
      const { count: ativos, error: ativosError } = await this.supabase
        .from('colaboradores')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);
        
      if (ativosError) throw ativosError;
      
      // Obtém o total de colaboradores inativos
      const { count: inativos, error: inativosError } = await this.supabase
        .from('colaboradores')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', false);
        
      if (inativosError) throw inativosError;
      
      // Obtém estatísticas por departamento
      const { data: todosDepartamentos, error: deptoError } = await this.supabase
        .from('colaboradores')
        .select('departamento')
        .eq('ativo', true)
        .order('departamento');
        
      if (deptoError) throw deptoError;
      
      // Agrupando por departamento
      const departamentoCounts: Record<string, number> = {};
      todosDepartamentos.forEach(colaborador => {
        const depto = colaborador.departamento;
        departamentoCounts[depto] = (departamentoCounts[depto] || 0) + 1;
      });
      
      const porDepartamento = Object.entries(departamentoCounts).map(([nome, total]) => ({
        nome,
        total
      }));
      
      // Obtém estatísticas por tipo de contrato
      const { data: todosTiposContrato, error: tipoContratoError } = await this.supabase
        .from('colaboradores')
        .select('tipo_contrato')
        .eq('ativo', true);
        
      if (tipoContratoError) throw tipoContratoError;
      
      // Agrupando por tipo de contrato
      const tipoContratoCounts: Record<string, number> = {};
      todosTiposContrato.forEach(colaborador => {
        const tipo = colaborador.tipo_contrato;
        tipoContratoCounts[tipo] = (tipoContratoCounts[tipo] || 0) + 1;
      });
      
      const porTipoContrato = Object.entries(tipoContratoCounts).map(([tipo, total]) => ({
        tipo: tipo as TipoContrato,
        total
      }));
      
      return {
        total: total || 0,
        ativos: ativos || 0,
        inativos: inativos || 0,
        porDepartamento,
        porTipoContrato
      };
    } catch (error) {
      console.error('[ColaboradoresService] Erro ao obter estatísticas:', error);
      throw error;
    }
  }
} 