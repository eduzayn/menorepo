import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Definição de tipos para o cliente Supabase
export type Database = {
  conteudo: {
    Tables: {
      cursos: {
        Row: {
          id: string;
          titulo: string;
          descricao: string;
          carga_horaria: number;
          codigo: string;
          criado_em: string;
          atualizado_em: string;
          status: string;
          instituicao_id: string;
          coordenador_id: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          descricao: string;
          carga_horaria: number;
          codigo: string;
          criado_em?: string;
          atualizado_em?: string;
          status?: string;
          instituicao_id: string;
          coordenador_id: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          descricao?: string;
          carga_horaria?: number;
          codigo?: string;
          criado_em?: string;
          atualizado_em?: string;
          status?: string;
          instituicao_id?: string;
          coordenador_id?: string;
        };
      };
      disciplinas: {
        Row: {
          id: string;
          titulo: string;
          descricao: string;
          codigo: string;
          curso_id: string;
          ordem: number;
          criado_em: string;
          atualizado_em: string;
          status: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          descricao: string;
          codigo: string;
          curso_id: string;
          ordem?: number;
          criado_em?: string;
          atualizado_em?: string;
          status?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          descricao?: string;
          codigo?: string;
          curso_id?: string;
          ordem?: number;
          criado_em?: string;
          atualizado_em?: string;
          status?: string;
        };
      };
      aulas: {
        Row: {
          id: string;
          titulo: string;
          descricao: string;
          disciplina_id: string;
          ordem: number;
          conteudo: any[];
          objetivos: string[];
          criado_em: string;
          atualizado_em: string;
          status: string;
          autor_id: string;
          duracao_estimada: number;
        };
        Insert: {
          id?: string;
          titulo: string;
          descricao: string;
          disciplina_id: string;
          ordem?: number;
          conteudo?: any[];
          objetivos?: string[];
          criado_em?: string;
          atualizado_em?: string;
          status?: string;
          autor_id: string;
          duracao_estimada?: number;
        };
        Update: {
          id?: string;
          titulo?: string;
          descricao?: string;
          disciplina_id?: string;
          ordem?: number;
          conteudo?: any[];
          objetivos?: string[];
          criado_em?: string;
          atualizado_em?: string;
          status?: string;
          autor_id?: string;
          duracao_estimada?: number;
        };
      };
      versoes: {
        Row: {
          id: string;
          aula_id: string;
          numero: number;
          conteudo: any;
          criado_em: string;
          autor_id: string;
          comentario: string | null;
        };
        Insert: {
          id?: string;
          aula_id: string;
          numero: number;
          conteudo: any;
          criado_em?: string;
          autor_id: string;
          comentario?: string | null;
        };
        Update: {
          id?: string;
          aula_id?: string;
          numero?: number;
          conteudo?: any;
          criado_em?: string;
          autor_id?: string;
          comentario?: string | null;
        };
      };
      autores: {
        Row: {
          id: string;
          usuario_id: string;
          recurso_id: string;
          tipo_recurso: 'curso' | 'disciplina' | 'aula';
          permissao: 'leitura' | 'edicao' | 'revisao' | 'publicacao';
          criado_em: string;
          atualizado_em: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          recurso_id: string;
          tipo_recurso: 'curso' | 'disciplina' | 'aula';
          permissao: 'leitura' | 'edicao' | 'revisao' | 'publicacao';
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          recurso_id?: string;
          tipo_recurso?: 'curso' | 'disciplina' | 'aula';
          permissao?: 'leitura' | 'edicao' | 'revisao' | 'publicacao';
          criado_em?: string;
          atualizado_em?: string;
        };
      };
      midias: {
        Row: {
          id: string;
          nome: string;
          url: string;
          tipo: string;
          tamanho: number;
          aula_id: string;
          criado_em: string;
          atualizado_em: string;
          autor_id: string;
        };
        Insert: {
          id?: string;
          nome: string;
          url: string;
          tipo: string;
          tamanho: number;
          aula_id: string;
          criado_em?: string;
          atualizado_em?: string;
          autor_id: string;
        };
        Update: {
          id?: string;
          nome?: string;
          url?: string;
          tipo?: string;
          tamanho?: number;
          aula_id?: string;
          criado_em?: string;
          atualizado_em?: string;
          autor_id?: string;
        };
      };
      publicacoes: {
        Row: {
          id: string;
          aula_id: string;
          versao_id: string;
          status: 'pendente' | 'aprovado' | 'rejeitado';
          comentario: string | null;
          revisor_id: string | null;
          criado_em: string;
          atualizado_em: string;
        };
        Insert: {
          id?: string;
          aula_id: string;
          versao_id: string;
          status?: 'pendente' | 'aprovado' | 'rejeitado';
          comentario?: string | null;
          revisor_id?: string | null;
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: {
          id?: string;
          aula_id?: string;
          versao_id?: string;
          status?: 'pendente' | 'aprovado' | 'rejeitado';
          comentario?: string | null;
          revisor_id?: string | null;
          criado_em?: string;
          atualizado_em?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          titulo: string;
          descricao: string;
          tipo: 'curso' | 'disciplina' | 'aula';
          estrutura: any;
          instituicao_id: string;
          criado_em: string;
          atualizado_em: string;
          criado_por: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          descricao: string;
          tipo: 'curso' | 'disciplina' | 'aula';
          estrutura: any;
          instituicao_id: string;
          criado_em?: string;
          atualizado_em?: string;
          criado_por: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          descricao?: string;
          tipo?: 'curso' | 'disciplina' | 'aula';
          estrutura?: any;
          instituicao_id?: string;
          criado_em?: string;
          atualizado_em?: string;
          criado_por?: string;
        };
      };
    };
    Views: {
      cursos_completos: {
        Row: {
          id: string;
          titulo: string;
          descricao: string;
          carga_horaria: number;
          codigo: string;
          status: string;
          coordenador_id: string;
          coordenador_email: string;
          coordenador_nome: string;
          instituicao_id: string;
          instituicao_nome: string;
          total_disciplinas: number;
          total_aulas: number;
        };
      };
      disciplinas_detalhadas: {
        Row: {
          id: string;
          titulo: string;
          descricao: string;
          codigo: string;
          curso_id: string;
          curso_titulo: string;
          ordem: number;
          status: string;
          total_aulas: number;
          aulas_publicadas: number;
        };
      };
    };
    Functions: {
      check_permission: {
        Args: {
          p_action: string;
          p_resource: string;
        };
        Returns: boolean;
      };
      get_user_courses: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          titulo: string;
          descricao: string;
          status: string;
        }[];
      };
      get_user_disciplines: {
        Args: {
          p_curso_id: string;
        };
        Returns: {
          id: string;
          titulo: string;
          descricao: string;
          ordem: number;
          status: string;
        }[];
      };
      get_versoes_aula: {
        Args: {
          p_aula_id: string;
        };
        Returns: {
          id: string;
          numero: number;
          autor_nome: string;
          criado_em: string;
          comentario: string | null;
        }[];
      };
    };
  };
};

// Tipo de erro customizado para o Supabase
export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Configuração do cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Criação do cliente Supabase tipado
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Hook para obter o cliente de banco de dados Supabase
export function useDatabase() {
  return supabase;
}

// Hook para checar permissões no Supabase
export function usePermission(action: string, resource: string) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<SupabaseError | null>(null);

  useEffect(() => {
    async function checkPermission() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .rpc('check_permission', {
            p_action: action,
            p_resource: resource,
          });

        if (error) {
          throw error;
        }

        setHasPermission(data || false);
      } catch (err: any) {
        setError({
          message: err.message || 'Erro ao verificar permissão',
          details: err.details,
          hint: err.hint,
          code: err.code,
        });
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkPermission();
  }, [action, resource]);

  return { hasPermission, isLoading, error };
}

// Serviço Supabase para funções comuns
class SupabaseService {
  // Verificar se o usuário está autenticado
  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  // Obter o ID do usuário atual
  async getCurrentUserId(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  }

  // Verificar se o usuário tem permissão para uma ação em um recurso
  async hasPermission(action: string, resource: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('check_permission', {
          p_action: action,
          p_resource: resource,
        });

      if (error) {
        console.error('Erro ao verificar permissão:', error);
        return false;
      }

      return data || false;
    } catch (err) {
      console.error('Exceção ao verificar permissão:', err);
      return false;
    }
  }

  // Obter o perfil do usuário atual
  async getCurrentUserProfile() {
    const userId = await this.getCurrentUserId();
    
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      return null;
    }
    
    return data;
  }

  // Obter a instituição do usuário atual
  async getUserInstitution() {
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) return null;
    
    const institutionId = data.user.user_metadata?.instituicao_id;
    
    if (!institutionId) return null;
    
    const { data: institution, error } = await supabase
      .from('instituicoes')
      .select('*')
      .eq('id', institutionId)
      .single();
      
    if (error) {
      console.error('Erro ao obter instituição do usuário:', error);
      return null;
    }
    
    return institution;
  }
  
  // Verificar se o usuário tem acesso ao módulo de material didático
  async hasMaterialAccess(): Promise<boolean> {
    return this.hasPermission('access', 'material_didatico');
  }
  
  // Obter o papel (role) do usuário atual
  async getUserRole(): Promise<string | null> {
    const { data } = await supabase.auth.getUser();
    return data.user?.user_metadata?.role || null;
  }
}

// Exportar instância do serviço
export const supabaseService = new SupabaseService();
