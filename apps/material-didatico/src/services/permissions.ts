import { useDatabase } from './supabase';
import supabaseService from './supabase';
import { Database } from '@/types/supabase';
import { useEffect, useState } from 'react';

export type Autor = Database['public']['Tables']['autores']['Row'];
export type AutorInsert = Database['public']['Tables']['autores']['Insert'];
export type AutorUpdate = Database['public']['Tables']['autores']['Update'];

export type Permission = 'leitura' | 'edicao' | 'revisao' | 'publicacao';
export type ResourceType = 'curso' | 'disciplina' | 'aula';

/**
 * Hook para verificar se o usuário tem permissão para uma ação
 * @param action Nome da ação
 * @param resource Recurso
 * @returns Se tem permissão e status de carregamento
 */
export const usePermission = (action: string, resource: string) => {
  const supabase = useDatabase();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .rpc('check_permission', {
            p_action: action,
            p_resource: resource
          });
          
        if (error) throw error;
        setHasPermission(!!data);
      } catch (err) {
        console.error(`Erro ao verificar permissão ${action} em ${resource}:`, err);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [supabase, action, resource]);

  return { hasPermission, loading };
};

/**
 * Hook para obter autores de um recurso
 * @param resourceId ID do recurso
 * @param resourceType Tipo do recurso
 * @returns Lista de autores e status de carregamento
 */
export const useAuthors = (resourceId: string, resourceType: ResourceType) => {
  const supabase = useDatabase();
  const [authors, setAuthors] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!resourceId) return;

    const fetchAuthors = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('autores')
          .select('*')
          .eq('recurso_id', resourceId)
          .eq('tipo_recurso', resourceType);
          
        if (error) throw error;
        
        setAuthors(data || []);
      } catch (err) {
        console.error(`Erro ao buscar autores para ${resourceType} ${resourceId}:`, err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar autores'));
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [supabase, resourceId, resourceType]);

  return { authors, loading, error };
};

/**
 * Serviço para gerenciar permissões e autores
 */
class PermissionService {
  /**
   * Adiciona um autor a um recurso
   * @param userId ID do usuário
   * @param resourceId ID do recurso
   * @param resourceType Tipo do recurso
   * @param permission Nível de permissão
   * @returns Autor adicionado ou null
   */
  public async addAuthor(
    userId: string,
    resourceId: string,
    resourceType: ResourceType,
    permission: Permission
  ): Promise<Autor | null> {
    try {
      const client = supabaseService.getClient();
      const currentUser = await supabaseService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      // Verifica se o usuário atual tem permissão para adicionar autores
      const hasPermission = await supabaseService.hasPermission('add_author', resourceType);
      if (!hasPermission) {
        throw new Error(`Sem permissão para adicionar autores a ${resourceType}`);
      }
      
      // Verifica se o autor já existe
      const { data: existing, error: checkError } = await client
        .from('autores')
        .select('*')
        .eq('usuario_id', userId)
        .eq('recurso_id', resourceId)
        .eq('tipo_recurso', resourceType)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // Se já existe, atualiza a permissão
      if (existing) {
        const { data, error } = await client
          .from('autores')
          .update({
            permissao: permission,
            atualizado_em: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select('*')
          .single();
          
        if (error) throw error;
        
        return data;
      }
      
      // Se não existe, cria um novo
      const { data, error } = await client
        .from('autores')
        .insert({
          usuario_id: userId,
          recurso_id: resourceId,
          tipo_recurso: resourceType,
          permissao: permission,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString()
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao adicionar autor:', error);
      return null;
    }
  }

  /**
   * Remove um autor de um recurso
   * @param id ID do registro de autor
   * @returns Sucesso ou falha
   */
  public async removeAuthor(id: string): Promise<boolean> {
    try {
      const client = supabaseService.getClient();
      
      // Busca o autor para verificar o tipo de recurso
      const { data: autor, error: fetchError } = await client
        .from('autores')
        .select('tipo_recurso')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('remove_author', autor.tipo_recurso);
      if (!hasPermission) {
        throw new Error(`Sem permissão para remover autores de ${autor.tipo_recurso}`);
      }
      
      const { error } = await client
        .from('autores')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Erro ao remover autor ${id}:`, error);
      return false;
    }
  }

  /**
   * Atualiza a permissão de um autor
   * @param id ID do registro de autor
   * @param permission Nova permissão
   * @returns Autor atualizado ou null
   */
  public async updateAuthorPermission(id: string, permission: Permission): Promise<Autor | null> {
    try {
      const client = supabaseService.getClient();
      
      // Busca o autor para verificar o tipo de recurso
      const { data: autor, error: fetchError } = await client
        .from('autores')
        .select('tipo_recurso')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Verifica permissão
      const hasPermission = await supabaseService.hasPermission('update_author', autor.tipo_recurso);
      if (!hasPermission) {
        throw new Error(`Sem permissão para atualizar permissões de autores em ${autor.tipo_recurso}`);
      }
      
      const { data, error } = await client
        .from('autores')
        .update({
          permissao: permission,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar permissão do autor ${id}:`, error);
      return null;
    }
  }

  /**
   * Verifica se o usuário atual é autor de um recurso
   * @param resourceId ID do recurso
   * @param resourceType Tipo do recurso
   * @returns Informações do autor ou null
   */
  public async isAuthor(resourceId: string, resourceType: ResourceType): Promise<Autor | null> {
    try {
      const client = supabaseService.getClient();
      const currentUser = await supabaseService.getCurrentUser();
      
      if (!currentUser) {
        return null;
      }
      
      const { data, error } = await client
        .from('autores')
        .select('*')
        .eq('usuario_id', currentUser.id)
        .eq('recurso_id', resourceId)
        .eq('tipo_recurso', resourceType)
        .maybeSingle();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao verificar se é autor do ${resourceType} ${resourceId}:`, error);
      return null;
    }
  }

  /**
   * Verifica se o usuário atual tem uma permissão específica em um recurso
   * @param resourceId ID do recurso
   * @param resourceType Tipo do recurso
   * @param permission Permissão necessária
   * @returns Se tem a permissão
   */
  public async hasPermission(
    resourceId: string, 
    resourceType: ResourceType,
    permission: Permission
  ): Promise<boolean> {
    try {
      const autor = await this.isAuthor(resourceId, resourceType);
      
      if (!autor) {
        return false;
      }
      
      // Mapa de permissões (cada permissão inclui as anteriores)
      const permissionMap = {
        'leitura': ['leitura'],
        'edicao': ['leitura', 'edicao'],
        'revisao': ['leitura', 'edicao', 'revisao'],
        'publicacao': ['leitura', 'edicao', 'revisao', 'publicacao']
      };
      
      return permissionMap[autor.permissao].includes(permission);
    } catch (error) {
      console.error(`Erro ao verificar permissão ${permission} em ${resourceType} ${resourceId}:`, error);
      return false;
    }
  }
}

export default new PermissionService(); 