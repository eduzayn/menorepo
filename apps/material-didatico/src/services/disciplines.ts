import { useDatabase } from './supabase';
import supabaseService from './supabase';
import { Database } from '@/types/supabase';
import { useEffect, useState } from 'react';

export type Discipline = Database['public']['Tables']['disciplinas']['Row'];
export type DisciplineInsert = Database['public']['Tables']['disciplinas']['Insert'];
export type DisciplineUpdate = Database['public']['Tables']['disciplinas']['Update'];

export type DisciplineDetailed = Database['public']['Views']['disciplinas_detalhadas']['Row'];

/**
 * Hook para obter as disciplinas de um curso
 * @param courseId ID do curso
 * @returns Lista de disciplinas e flags de status
 */
export const useDisciplines = (courseId: string) => {
  const supabase = useDatabase();
  const [disciplines, setDisciplines] = useState<DisciplineDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchDisciplines = async () => {
      try {
        setLoading(true);
        
        // Usa a função RPC para obter disciplinas do usuário para o curso
        const { data, error } = await supabase
          .rpc('get_user_disciplines', { p_curso_id: courseId });
        
        if (error) throw error;
        
        // Busca detalhes completos para cada disciplina
        const { data: detailedData, error: detailedError } = await supabase
          .from('disciplinas_detalhadas')
          .select('*')
          .eq('curso_id', courseId)
          .order('ordem', { ascending: true });
          
        if (detailedError) throw detailedError;
        
        setDisciplines(detailedData || []);
      } catch (err) {
        console.error('Erro ao buscar disciplinas:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar disciplinas'));
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplines();
  }, [supabase, courseId]);

  return { disciplines, loading, error };
};

/**
 * Serviço para gerenciar disciplinas
 */
class DisciplineService {
  /**
   * Cria uma nova disciplina
   * @param discipline Dados da disciplina a ser criada
   * @returns Nova disciplina criada
   */
  public async createDiscipline(discipline: DisciplineInsert): Promise<Discipline | null> {
    try {
      const client = supabaseService.getClient();
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('create', 'disciplinas');
      if (!hasPermission) {
        throw new Error('Sem permissão para criar disciplinas');
      }
      
      // Busca a ordem mais alta para adicionar após ela
      const { data: maxOrdem, error: maxError } = await client
        .from('disciplinas')
        .select('ordem')
        .eq('curso_id', discipline.curso_id)
        .order('ordem', { ascending: false })
        .limit(1)
        .single();
        
      const ordem = maxOrdem ? maxOrdem.ordem + 1 : 1;
      
      const { data, error } = await client
        .from('disciplinas')
        .insert({
          ...discipline,
          ordem,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
          status: discipline.status || 'rascunho'
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao criar disciplina:', error);
      return null;
    }
  }

  /**
   * Obtém uma disciplina pelo ID
   * @param id ID da disciplina
   * @returns Dados da disciplina
   */
  public async getDisciplineById(id: string): Promise<DisciplineDetailed | null> {
    try {
      const client = supabaseService.getClient();
      
      // Busca disciplina na view que tem dados completos
      const { data, error } = await client
        .from('disciplinas_detalhadas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar disciplina ${id}:`, error);
      return null;
    }
  }

  /**
   * Atualiza uma disciplina existente
   * @param id ID da disciplina
   * @param updates Dados a serem atualizados
   * @returns Disciplina atualizada
   */
  public async updateDiscipline(id: string, updates: DisciplineUpdate): Promise<Discipline | null> {
    try {
      const client = supabaseService.getClient();
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('update', 'disciplinas');
      if (!hasPermission) {
        throw new Error('Sem permissão para atualizar disciplinas');
      }
      
      const { data, error } = await client
        .from('disciplinas')
        .update({
          ...updates,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar disciplina ${id}:`, error);
      return null;
    }
  }

  /**
   * Reordena as disciplinas de um curso
   * @param courseId ID do curso
   * @param disciplineIds IDs das disciplinas na nova ordem
   * @returns Sucesso ou falha
   */
  public async reorderDisciplines(courseId: string, disciplineIds: string[]): Promise<boolean> {
    try {
      const client = supabaseService.getClient();
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('update', 'disciplinas');
      if (!hasPermission) {
        throw new Error('Sem permissão para reordenar disciplinas');
      }
      
      // Atualiza ordem de cada disciplina
      for (let i = 0; i < disciplineIds.length; i++) {
        const { error } = await client
          .from('disciplinas')
          .update({ 
            ordem: i + 1,
            atualizado_em: new Date().toISOString()
          })
          .eq('id', disciplineIds[i])
          .eq('curso_id', courseId);
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao reordenar disciplinas do curso ${courseId}:`, error);
      return false;
    }
  }

  /**
   * Altera o status de uma disciplina
   * @param id ID da disciplina
   * @param status Novo status
   * @returns Sucesso ou falha
   */
  public async changeDisciplineStatus(
    id: string, 
    status: 'rascunho' | 'ativo' | 'inativo' | 'arquivado'
  ): Promise<boolean> {
    try {
      const client = supabaseService.getClient();
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('update', 'disciplinas');
      if (!hasPermission) {
        throw new Error('Sem permissão para alterar status de disciplinas');
      }
      
      const { error } = await client
        .from('disciplinas')
        .update({
          status,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Erro ao alterar status da disciplina ${id}:`, error);
      return false;
    }
  }

  /**
   * Exclui uma disciplina
   * @param id ID da disciplina
   * @returns Sucesso ou falha
   */
  public async deleteDiscipline(id: string): Promise<boolean> {
    try {
      const client = supabaseService.getClient();
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('delete', 'disciplinas');
      if (!hasPermission) {
        throw new Error('Sem permissão para excluir disciplinas');
      }
      
      // Em vez de excluir, apenas marca como arquivado
      const { error } = await client
        .from('disciplinas')
        .update({
          status: 'arquivado',
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir disciplina ${id}:`, error);
      return false;
    }
  }
}

export default new DisciplineService(); 