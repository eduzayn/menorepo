import { createClient } from '@supabase/supabase-js'
import { UserPermission, UserRole } from '@/types/editor'

class PermissionsService {
  private static instance: PermissionsService
  private supabase: any

  private constructor() {
    // Inicializa o cliente Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  public static getInstance(): PermissionsService {
    if (!PermissionsService.instance) {
      PermissionsService.instance = new PermissionsService()
    }
    return PermissionsService.instance
  }

  /**
   * Obtém as permissões de um usuário para um conteúdo específico
   * @param contentId ID do conteúdo
   * @param userId ID do usuário
   * @returns Permissões do usuário
   */
  public async getUserPermissions(contentId: string, userId: string): Promise<UserPermission | null> {
    try {
      // Tenta buscar do Supabase
      const { data, error } = await this.supabase
        .from('content_permissions')
        .select('*')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar permissões:', error)
        return null
      }

      if (!data) {
        return null
      }

      // Converte o formato do banco para o formato da aplicação
      return {
        userId: data.user_id,
        role: data.role as UserRole,
        canEdit: data.can_edit,
        canExport: data.can_export,
        canShare: data.can_share,
        canDelete: data.can_delete
      }
    } catch (error) {
      console.error('Erro ao buscar permissões:', error)
      return null
    }
  }

  /**
   * Obtém todos os coautores de um conteúdo
   * @param contentId ID do conteúdo
   * @returns Lista de permissões de usuários
   */
  public async getContentCoAuthors(contentId: string): Promise<UserPermission[]> {
    try {
      // Busca todos os coautores no Supabase
      const { data, error } = await this.supabase
        .from('content_permissions')
        .select(`
          user_id,
          role,
          can_edit,
          can_export,
          can_share,
          can_delete,
          users:user_id (
            name,
            email
          )
        `)
        .eq('content_id', contentId)
        .neq('role', 'owner') // Exclui o proprietário principal

      if (error) {
        console.error('Erro ao buscar coautores:', error)
        return []
      }

      // Converte o formato do banco para o formato da aplicação
      return data.map((item: any) => ({
        userId: item.user_id,
        role: item.role as UserRole,
        canEdit: item.can_edit,
        canExport: item.can_export,
        canShare: item.can_share,
        canDelete: item.can_delete,
        name: item.users?.name || 'Usuário desconhecido',
        email: item.users?.email || ''
      }))
    } catch (error) {
      console.error('Erro ao buscar coautores:', error)
      return []
    }
  }

  /**
   * Adiciona um coautor a um conteúdo
   * @param contentId ID do conteúdo
   * @param userId ID do usuário a ser adicionado
   * @param role Papel do usuário
   * @returns Sucesso da operação
   */
  public async addCoAuthor(contentId: string, userId: string, role: UserRole): Promise<boolean> {
    try {
      // Define as permissões padrão com base no papel
      const permissions = this.getDefaultPermissionsForRole(role)

      // Insere no Supabase
      const { error } = await this.supabase
        .from('content_permissions')
        .insert({
          content_id: contentId,
          user_id: userId,
          role,
          can_edit: permissions.canEdit,
          can_export: permissions.canExport,
          can_share: permissions.canShare,
          can_delete: permissions.canDelete
        })

      if (error) {
        console.error('Erro ao adicionar coautor:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao adicionar coautor:', error)
      return false
    }
  }

  /**
   * Atualiza as permissões de um coautor
   * @param contentId ID do conteúdo
   * @param userId ID do usuário
   * @param permissions Novas permissões
   * @returns Sucesso da operação
   */
  public async updateCoAuthorPermissions(
    contentId: string,
    userId: string,
    permissions: Partial<UserPermission>
  ): Promise<boolean> {
    try {
      // Prepara os dados para atualização
      const updateData: Record<string, any> = {}
      
      if (permissions.role) updateData.role = permissions.role
      if (permissions.canEdit !== undefined) updateData.can_edit = permissions.canEdit
      if (permissions.canExport !== undefined) updateData.can_export = permissions.canExport
      if (permissions.canShare !== undefined) updateData.can_share = permissions.canShare
      if (permissions.canDelete !== undefined) updateData.can_delete = permissions.canDelete

      // Atualiza no Supabase
      const { error } = await this.supabase
        .from('content_permissions')
        .update(updateData)
        .eq('content_id', contentId)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao atualizar permissões:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error)
      return false
    }
  }

  /**
   * Remove um coautor de um conteúdo
   * @param contentId ID do conteúdo
   * @param userId ID do usuário a ser removido
   * @returns Sucesso da operação
   */
  public async removeCoAuthor(contentId: string, userId: string): Promise<boolean> {
    try {
      // Remove do Supabase
      const { error } = await this.supabase
        .from('content_permissions')
        .delete()
        .eq('content_id', contentId)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao remover coautor:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao remover coautor:', error)
      return false
    }
  }

  /**
   * Verifica se um usuário tem uma permissão específica
   * @param contentId ID do conteúdo
   * @param userId ID do usuário
   * @param permission Permissão a ser verificada ('edit', 'export', 'share', 'delete')
   * @returns Se o usuário tem a permissão
   */
  public async checkPermission(
    contentId: string,
    userId: string,
    permission: 'edit' | 'export' | 'share' | 'delete'
  ): Promise<boolean> {
    const userPermission = await this.getUserPermissions(contentId, userId)
    
    if (!userPermission) return false
    
    switch (permission) {
      case 'edit':
        return userPermission.canEdit
      case 'export':
        return userPermission.canExport
      case 'share':
        return userPermission.canShare
      case 'delete':
        return userPermission.canDelete
      default:
        return false
    }
  }

  /**
   * Obtém permissões padrão com base no papel do usuário
   * @param role Papel do usuário
   * @returns Permissões padrão
   */
  private getDefaultPermissionsForRole(role: UserRole): Omit<UserPermission, 'userId'> {
    switch (role) {
      case 'owner':
        return {
          role,
          canEdit: true,
          canExport: true,
          canShare: true,
          canDelete: true
        }
      case 'editor':
        return {
          role,
          canEdit: true,
          canExport: true,
          canShare: true,
          canDelete: false
        }
      case 'reviewer':
        return {
          role,
          canEdit: false,
          canExport: true,
          canShare: false,
          canDelete: false
        }
      case 'viewer':
        return {
          role,
          canEdit: false,
          canExport: true,
          canShare: false,
          canDelete: false
        }
      default:
        return {
          role: 'viewer' as UserRole,
          canEdit: false,
          canExport: false,
          canShare: false,
          canDelete: false
        }
    }
  }
}

export const permissionsService = PermissionsService.getInstance() 