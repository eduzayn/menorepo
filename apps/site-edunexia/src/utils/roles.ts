import { ModulePermission, User, UserRole } from '@edunexia/auth';

/**
 * Constantes de permissões tipadas
 */
const PERMISSIONS = {
  MATRICULAS: {
    VIEW: 'matriculas.view' as const,
    MANAGE: 'matriculas.manage' as const,
    DELETE: 'matriculas.delete' as const,
  },
  PORTAL_ALUNO: {
    VIEW: 'portal-aluno.view' as const,
    MANAGE: 'portal-aluno.manage' as const,
  },
  MATERIAL_DIDATICO: {
    VIEW: 'material-didatico.view' as const,
    CREATE: 'material-didatico.create' as const,
    EDIT: 'material-didatico.edit' as const,
    DELETE: 'material-didatico.delete' as const,
  },
  COMUNICACAO: {
    VIEW: 'comunicacao.view' as const,
    MANAGE: 'comunicacao.manage' as const,
    DELETE: 'comunicacao.delete' as const,
  },
  FINANCEIRO: {
    VIEW: 'financeiro.view' as const,
    MANAGE: 'financeiro.manage' as const,
    DELETE: 'financeiro.delete' as const,
  },
  RELATORIOS: {
    VIEW: 'relatorios.view' as const,
    GENERATE: 'relatorios.generate' as const,
  },
  CONFIGURACOES: {
    VIEW: 'configuracoes.view' as const,
    MANAGE: 'configuracoes.manage' as const,
  },
} as const;

/**
 * Helper para converter strings em ModulePermission de forma segura
 */
function asModulePermission(permission: string): ModulePermission {
  return permission as unknown as ModulePermission;
}

type RolePermissions = {
  [K in UserRole]: readonly ModulePermission[];
};

/**
 * Define os templates de permissões para cada papel funcional
 */
const ROLE_PERMISSIONS: RolePermissions = {
  super_admin: [
    PERMISSIONS.MATRICULAS.VIEW,
    PERMISSIONS.MATRICULAS.MANAGE,
    PERMISSIONS.MATRICULAS.DELETE,
    PERMISSIONS.PORTAL_ALUNO.VIEW,
    PERMISSIONS.PORTAL_ALUNO.MANAGE,
    PERMISSIONS.MATERIAL_DIDATICO.VIEW,
    PERMISSIONS.MATERIAL_DIDATICO.CREATE,
    PERMISSIONS.MATERIAL_DIDATICO.EDIT,
    PERMISSIONS.MATERIAL_DIDATICO.DELETE,
    PERMISSIONS.COMUNICACAO.VIEW,
    PERMISSIONS.COMUNICACAO.MANAGE,
    PERMISSIONS.COMUNICACAO.DELETE,
    PERMISSIONS.FINANCEIRO.VIEW,
    PERMISSIONS.FINANCEIRO.MANAGE,
    PERMISSIONS.FINANCEIRO.DELETE,
    PERMISSIONS.RELATORIOS.VIEW,
    PERMISSIONS.RELATORIOS.GENERATE,
    PERMISSIONS.CONFIGURACOES.VIEW,
    PERMISSIONS.CONFIGURACOES.MANAGE,
  ],
  institution_admin: [
    PERMISSIONS.MATRICULAS.VIEW,
    PERMISSIONS.MATRICULAS.MANAGE,
    PERMISSIONS.PORTAL_ALUNO.VIEW,
    PERMISSIONS.PORTAL_ALUNO.MANAGE,
    PERMISSIONS.MATERIAL_DIDATICO.VIEW,
    PERMISSIONS.MATERIAL_DIDATICO.CREATE,
    PERMISSIONS.MATERIAL_DIDATICO.EDIT,
    PERMISSIONS.COMUNICACAO.VIEW,
    PERMISSIONS.COMUNICACAO.MANAGE,
    PERMISSIONS.FINANCEIRO.VIEW,
    PERMISSIONS.FINANCEIRO.MANAGE,
    PERMISSIONS.RELATORIOS.VIEW,
    PERMISSIONS.RELATORIOS.GENERATE,
    PERMISSIONS.CONFIGURACOES.VIEW,
    PERMISSIONS.CONFIGURACOES.MANAGE,
  ],
  coordinator: [
    PERMISSIONS.MATRICULAS.VIEW,
    PERMISSIONS.MATRICULAS.MANAGE,
    PERMISSIONS.PORTAL_ALUNO.VIEW,
    PERMISSIONS.MATERIAL_DIDATICO.VIEW,
    PERMISSIONS.MATERIAL_DIDATICO.CREATE,
    PERMISSIONS.MATERIAL_DIDATICO.EDIT,
    PERMISSIONS.COMUNICACAO.VIEW,
    PERMISSIONS.COMUNICACAO.MANAGE,
    PERMISSIONS.RELATORIOS.VIEW,
  ],
  teacher: [
    PERMISSIONS.MATRICULAS.VIEW,
    PERMISSIONS.PORTAL_ALUNO.VIEW,
    PERMISSIONS.MATERIAL_DIDATICO.VIEW,
    PERMISSIONS.MATERIAL_DIDATICO.CREATE,
    PERMISSIONS.MATERIAL_DIDATICO.EDIT,
    PERMISSIONS.COMUNICACAO.VIEW,
    PERMISSIONS.COMUNICACAO.MANAGE,
  ],
  secretary: [
    PERMISSIONS.MATRICULAS.VIEW,
    PERMISSIONS.MATRICULAS.MANAGE,
    PERMISSIONS.PORTAL_ALUNO.VIEW,
    PERMISSIONS.COMUNICACAO.VIEW,
    PERMISSIONS.COMUNICACAO.MANAGE,
  ],
  financial: [
    PERMISSIONS.FINANCEIRO.VIEW,
    PERMISSIONS.FINANCEIRO.MANAGE,
    PERMISSIONS.RELATORIOS.VIEW,
  ],
  student: [
    PERMISSIONS.PORTAL_ALUNO.VIEW,
    PERMISSIONS.MATERIAL_DIDATICO.VIEW,
  ],
  parent: [
    PERMISSIONS.PORTAL_ALUNO.VIEW,
    PERMISSIONS.MATERIAL_DIDATICO.VIEW,
  ],
};

/**
 * Obtém as permissões padrão do papel do usuário
 */
export const getDefaultRolePermissions = (role: UserRole): ModulePermission[] => {
  return [...ROLE_PERMISSIONS[role]];
};

/**
 * Obtém todas as permissões do usuário (papel + permissões adicionais)
 */
export const getUserPermissions = (user: User): ModulePermission[] => {
  if (!user?.role) {
    return [];
  }
  
  // Combina as permissões padrão do papel com as permissões específicas do usuário
  const rolePermissions = getDefaultRolePermissions(user.role);
  const userPermissions = user.permissions || [];
  
  // Remove duplicatas e converte para array
  return Array.from(new Set([...rolePermissions, ...userPermissions]));
};

/**
 * Verifica se o usuário tem uma permissão específica
 */
export const hasPermission = (user: User, permission: ModulePermission): boolean => {
  const userPermissions = getUserPermissions(user);
  return userPermissions.includes(permission);
};

/**
 * Verifica se o usuário tem pelo menos uma das permissões especificadas
 */
export const hasAnyPermission = (user: User, permissions: ModulePermission[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Verifica se o usuário tem todas as permissões especificadas
 */
export const hasAllPermissions = (user: User, permissions: ModulePermission[]): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
}; 