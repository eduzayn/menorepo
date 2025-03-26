import { useDatabase } from './supabase';
import supabaseService from './supabase';
import { Database } from '@/types/supabase';
import { useEffect, useState } from 'react';

export type Course = Database['public']['Tables']['cursos']['Row'];
export type CourseInsert = Database['public']['Tables']['cursos']['Insert'];
export type CourseUpdate = Database['public']['Tables']['cursos']['Update'];

export type CourseComplete = Database['public']['Views']['cursos_completos']['Row'];

/**
 * Hook para obter a lista de cursos do usuário atual
 * @returns Lista de cursos e flags de status
 */
export const useCourses = () => {
  const supabase = useDatabase();
  const [courses, setCourses] = useState<CourseComplete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Usa a função RPC para obter cursos do usuário
        const { data, error } = await supabase
          .rpc('get_user_courses');
        
        if (error) throw error;
        
        // Busca detalhes completos para cada curso
        const { data: detailedData, error: detailedError } = await supabase
          .from('cursos_completos')
          .select('*')
          .in('id', data.map((c: { id: string }) => c.id));
          
        if (detailedError) throw detailedError;
        
        setCourses(detailedData || []);
      } catch (err) {
        console.error('Erro ao buscar cursos:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar cursos'));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [supabase]);

  return { courses, loading, error };
};

/**
 * Serviço para gerenciar operações com cursos
 */
class CourseService {
  /**
   * Cria um novo curso
   * @param course Dados do curso a ser criado
   * @returns Novo curso criado
   */
  public async createCourse(course: CourseInsert): Promise<Course | null> {
    try {
      const client = supabaseService.getClient();
      const user = await supabaseService.getCurrentUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('create', 'cursos');
      if (!hasPermission) {
        throw new Error('Sem permissão para criar cursos');
      }
      
      const { data, error } = await client
        .from('cursos')
        .insert({
          ...course,
          coordenador_id: course.coordenador_id || user.id,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
          status: course.status || 'rascunho'
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      return null;
    }
  }

  /**
   * Obtém um curso pelo ID
   * @param id ID do curso
   * @returns Dados do curso
   */
  public async getCourseById(id: string): Promise<CourseComplete | null> {
    try {
      const client = supabaseService.getClient();
      
      // Busca curso na view que tem dados completos
      const { data, error } = await client
        .from('cursos_completos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar curso ${id}:`, error);
      return null;
    }
  }

  /**
   * Atualiza um curso existente
   * @param id ID do curso
   * @param updates Dados a serem atualizados
   * @returns Curso atualizado
   */
  public async updateCourse(id: string, updates: CourseUpdate): Promise<Course | null> {
    try {
      const client = supabaseService.getClient();
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('update', 'cursos');
      if (!hasPermission) {
        throw new Error('Sem permissão para atualizar cursos');
      }
      
      const { data, error } = await client
        .from('cursos')
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
      console.error(`Erro ao atualizar curso ${id}:`, error);
      return null;
    }
  }

  /**
   * Altera o status de um curso
   * @param id ID do curso
   * @param status Novo status
   * @returns Sucesso ou falha
   */
  public async changeCourseStatus(
    id: string, 
    status: 'rascunho' | 'ativo' | 'inativo' | 'arquivado'
  ): Promise<boolean> {
    try {
      const client = supabaseService.getClient();
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('update', 'cursos');
      if (!hasPermission) {
        throw new Error('Sem permissão para alterar status de cursos');
      }
      
      const { error } = await client
        .from('cursos')
        .update({
          status,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Erro ao alterar status do curso ${id}:`, error);
      return false;
    }
  }

  /**
   * Exclui um curso
   * @param id ID do curso
   * @returns Sucesso ou falha
   */
  public async deleteCourse(id: string): Promise<boolean> {
    try {
      const client = supabaseService.getClient();
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('delete', 'cursos');
      if (!hasPermission) {
        throw new Error('Sem permissão para excluir cursos');
      }
      
      // Em vez de excluir, apenas marca como arquivado
      const { error } = await client
        .from('cursos')
        .update({
          status: 'arquivado',
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir curso ${id}:`, error);
      return false;
    }
  }
}

export default new CourseService(); 