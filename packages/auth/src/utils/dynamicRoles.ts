import { ModulePermissions, RoleLevel } from '../types';

interface DynamicRole {
  id: string;
  name: string;
  description: string;
  permissions: ModulePermissions;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class DynamicRoleManager {
  private roles: Map<string, DynamicRole> = new Map();

  /**
   * Adiciona um novo role dinâmico
   */
  addRole(role: Omit<DynamicRole, 'id' | 'createdAt' | 'updatedAt'>): DynamicRole {
    const newRole: DynamicRole = {
      ...role,
      id: `role_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.roles.set(newRole.id, newRole);
    return newRole;
  }

  /**
   * Atualiza um role existente
   */
  updateRole(id: string, updates: Partial<Omit<DynamicRole, 'id' | 'createdAt' | 'updatedAt'>>): DynamicRole | null {
    const role = this.roles.get(id);
    if (!role) return null;

    const updatedRole: DynamicRole = {
      ...role,
      ...updates,
      updatedAt: new Date(),
    };

    this.roles.set(id, updatedRole);
    return updatedRole;
  }

  /**
   * Remove um role
   */
  removeRole(id: string): boolean {
    return this.roles.delete(id);
  }

  /**
   * Obtém um role por ID
   */
  getRole(id: string): DynamicRole | null {
    return this.roles.get(id) || null;
  }

  /**
   * Lista todos os roles ativos
   */
  listActiveRoles(): DynamicRole[] {
    return Array.from(this.roles.values()).filter(role => role.isActive);
  }

  /**
   * Combina permissões de roles dinâmicos com permissões base
   */
  combinePermissions(baseRole: RoleLevel, dynamicRoleIds: string[]): ModulePermissions {
    const basePermissions = this.getBasePermissions(baseRole);
    const dynamicPermissions = this.getDynamicPermissions(dynamicRoleIds);

    return this.mergePermissions(basePermissions, dynamicPermissions);
  }

  /**
   * Obtém permissões base para um role
   */
  private getBasePermissions(role: RoleLevel): ModulePermissions {
    // Implementar lógica para obter permissões base
    // Por enquanto, retornamos um objeto vazio
    return {};
  }

  /**
   * Obtém permissões de roles dinâmicos
   */
  private getDynamicPermissions(roleIds: string[]): ModulePermissions {
    return roleIds.reduce((acc, id) => {
      const role = this.roles.get(id);
      if (role?.isActive) {
        return this.mergePermissions(acc, role.permissions);
      }
      return acc;
    }, {});
  }

  /**
   * Mescla duas estruturas de permissões
   */
  private mergePermissions(base: ModulePermissions, dynamic: ModulePermissions): ModulePermissions {
    const result = { ...base };

    for (const [module, permissions] of Object.entries(dynamic)) {
      if (!result[module]) {
        result[module] = permissions;
      } else {
        result[module] = {
          ...result[module],
          ...permissions,
          actions: {
            ...result[module].actions,
            ...permissions.actions,
          },
        };
      }
    }

    return result;
  }

  /**
   * Valida se um role é válido
   */
  validateRole(role: Partial<DynamicRole>): string[] {
    const errors: string[] = [];

    if (!role.name?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!role.permissions) {
      errors.push('Permissões são obrigatórias');
    }

    return errors;
  }

  /**
   * Verifica se um role tem uma permissão específica
   */
  hasPermission(roleId: string, module: string, action: string): boolean {
    const role = this.roles.get(roleId);
    if (!role?.isActive) return false;

    return Boolean(
      role.permissions[module]?.actions[action] ||
      role.permissions[module]?.isAdmin
    );
  }
}

export const dynamicRoleManager = new DynamicRoleManager(); 