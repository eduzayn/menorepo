import { RoleLevel, ModulePermissions } from '../types';

/**
 * Retorna as permissões padrão para um papel específico
 */
export function getDefaultPermissionsForRole(role: RoleLevel): ModulePermissions {
  const defaultPermissions: Record<RoleLevel, ModulePermissions> = {
    super_admin: {
      matriculas: { read: true, write: true, delete: true },
      comunicacao: { read: true, write: true, delete: true },
      material_didatico: { read: true, write: true, delete: true },
      portal_aluno: { read: true, write: true, delete: true },
      financeiro: { read: true, write: true, delete: true },
      vendas: { read: true, write: true, delete: true },
      portal_parceiro: { read: true, write: true, delete: true },
      portal_polo: { read: true, write: true, delete: true },
      contabilidade: { read: true, write: true, delete: true },
      rh: { read: true, write: true, delete: true },
      configuracoes: { read: true, write: true, delete: true }
    },
    institution_admin: {
      matriculas: { read: true, write: true, delete: false },
      comunicacao: { read: true, write: true, delete: false },
      material_didatico: { read: true, write: true, delete: false },
      portal_aluno: { read: true, write: true, delete: false },
      financeiro: { read: true, write: true, delete: false },
      vendas: { read: true, write: true, delete: false },
      portal_parceiro: { read: true, write: true, delete: false },
      portal_polo: { read: true, write: true, delete: false },
      contabilidade: { read: true, write: true, delete: false },
      rh: { read: true, write: true, delete: false },
      configuracoes: { read: true, write: true, delete: false }
    },
    coordinator: {
      matriculas: { read: true, write: true, delete: false },
      comunicacao: { read: true, write: true, delete: false },
      material_didatico: { read: true, write: true, delete: false },
      portal_aluno: { read: true, write: true, delete: false },
      financeiro: { read: true, write: false, delete: false },
      vendas: { read: true, write: false, delete: false },
      portal_parceiro: { read: true, write: false, delete: false },
      portal_polo: { read: true, write: false, delete: false },
      contabilidade: { read: true, write: false, delete: false },
      rh: { read: true, write: false, delete: false },
      configuracoes: { read: true, write: false, delete: false }
    },
    teacher: {
      matriculas: { read: true, write: false, delete: false },
      comunicacao: { read: true, write: true, delete: false },
      material_didatico: { read: true, write: true, delete: false },
      portal_aluno: { read: true, write: true, delete: false },
      financeiro: { read: false, write: false, delete: false },
      vendas: { read: false, write: false, delete: false },
      portal_parceiro: { read: false, write: false, delete: false },
      portal_polo: { read: false, write: false, delete: false },
      contabilidade: { read: false, write: false, delete: false },
      rh: { read: false, write: false, delete: false },
      configuracoes: { read: false, write: false, delete: false }
    },
    secretary: {
      matriculas: { read: true, write: true, delete: false },
      comunicacao: { read: true, write: true, delete: false },
      material_didatico: { read: true, write: false, delete: false },
      portal_aluno: { read: true, write: true, delete: false },
      financeiro: { read: true, write: false, delete: false },
      vendas: { read: true, write: false, delete: false },
      portal_parceiro: { read: true, write: false, delete: false },
      portal_polo: { read: true, write: false, delete: false },
      contabilidade: { read: true, write: false, delete: false },
      rh: { read: true, write: false, delete: false },
      configuracoes: { read: true, write: false, delete: false }
    },
    financial: {
      matriculas: { read: true, write: false, delete: false },
      comunicacao: { read: true, write: false, delete: false },
      material_didatico: { read: true, write: false, delete: false },
      portal_aluno: { read: true, write: false, delete: false },
      financeiro: { read: true, write: true, delete: false },
      vendas: { read: true, write: true, delete: false },
      portal_parceiro: { read: true, write: false, delete: false },
      portal_polo: { read: true, write: false, delete: false },
      contabilidade: { read: true, write: true, delete: false },
      rh: { read: true, write: false, delete: false },
      configuracoes: { read: true, write: false, delete: false }
    },
    student: {
      matriculas: { read: true, write: false, delete: false },
      comunicacao: { read: true, write: false, delete: false },
      material_didatico: { read: true, write: false, delete: false },
      portal_aluno: { read: true, write: true, delete: false },
      financeiro: { read: false, write: false, delete: false },
      vendas: { read: false, write: false, delete: false },
      portal_parceiro: { read: false, write: false, delete: false },
      portal_polo: { read: false, write: false, delete: false },
      contabilidade: { read: false, write: false, delete: false },
      rh: { read: false, write: false, delete: false },
      configuracoes: { read: false, write: false, delete: false }
    },
    parent: {
      matriculas: { read: true, write: false, delete: false },
      comunicacao: { read: true, write: false, delete: false },
      material_didatico: { read: true, write: false, delete: false },
      portal_aluno: { read: true, write: false, delete: false },
      financeiro: { read: true, write: false, delete: false },
      vendas: { read: false, write: false, delete: false },
      portal_parceiro: { read: false, write: false, delete: false },
      portal_polo: { read: false, write: false, delete: false },
      contabilidade: { read: false, write: false, delete: false },
      rh: { read: false, write: false, delete: false },
      configuracoes: { read: false, write: false, delete: false }
    }
  };

  return defaultPermissions[role] || {};
}

/**
 * Verifica se o usuário tem permissão para uma ação específica em um módulo
 */
export function hasPermission(
  permissions: ModulePermissions,
  module: keyof ModulePermissions,
  action: 'read' | 'write' | 'delete'
): boolean {
  return permissions[module]?.[action] || false;
}

/**
 * Verifica se o usuário tem permissão de leitura em um módulo
 */
export function canRead(permissions: ModulePermissions, module: keyof ModulePermissions): boolean {
  return hasPermission(permissions, module, 'read');
}

/**
 * Verifica se o usuário tem permissão de escrita em um módulo
 */
export function canWrite(permissions: ModulePermissions, module: keyof ModulePermissions): boolean {
  return hasPermission(permissions, module, 'write');
}

/**
 * Verifica se o usuário tem permissão de exclusão em um módulo
 */
export function canDelete(permissions: ModulePermissions, module: keyof ModulePermissions): boolean {
  return hasPermission(permissions, module, 'delete');
}

/**
 * Combina múltiplas permissões, dando prioridade para permissões mais restritivas
 */
export function combinePermissions(...permissionsList: ModulePermissions[]): ModulePermissions {
  const result: ModulePermissions = {};

  permissionsList.forEach(permissions => {
    Object.entries(permissions).forEach(([module, actions]) => {
      if (!result[module]) {
        result[module] = { read: false, write: false, delete: false };
      }

      result[module] = {
        read: result[module].read || actions.read,
        write: result[module].write || actions.write,
        delete: result[module].delete || actions.delete
      };
    });
  });

  return result;
} 