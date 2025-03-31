import type { User, ModulePermission } from '@edunexia/auth';

// Lista de todas as permissões válidas
const VALID_PERMISSIONS: ModulePermission[] = [
  // Matrículas
  'matriculas.view',
  'matriculas.manage',
  'matriculas.delete',
  
  // Portal do Aluno
  'portal-aluno.view',
  'portal-aluno.manage',
  
  // Material Didático
  'material-didatico.view',
  'material-didatico.create',
  'material-didatico.edit',
  'material-didatico.delete',
  
  // Comunicação
  'comunicacao.view',
  'comunicacao.manage',
  'comunicacao.delete',
  
  // Financeiro
  'financeiro.view',
  'financeiro.manage',
  'financeiro.delete',
  
  // Relatórios
  'relatorios.view',
  'relatorios.generate',
  
  // Configurações
  'configuracoes.view',
  'configuracoes.manage'
];

interface DynamicRole {
  name: string;
  permissions: ModulePermission[];
  isDynamic: boolean;
}

/**
 * Cria um role dinâmico com permissões específicas
 * @param name Nome do role
 * @param permissions Lista de permissões
 * @returns Role dinâmico criado
 */
export function createDynamicRole(name: string, permissions: ModulePermission[]): DynamicRole {
  // Validar permissões
  const invalidPermissions = permissions.filter(
    permission => !VALID_PERMISSIONS.includes(permission)
  );

  if (invalidPermissions.length > 0) {
    throw new Error(`Permissões inválidas: ${invalidPermissions.join(', ')}`);
  }

  return {
    name,
    permissions,
    isDynamic: true
  };
}

/**
 * Atribui um role dinâmico a um usuário
 * @param user Usuário alvo
 * @param roleName Nome do role
 * @param permissions Lista de permissões
 * @returns Usuário atualizado com o novo role
 */
export function assignRoleToUser(
  user: User,
  roleName: string,
  permissions: ModulePermission[]
): User {
  return {
    ...user,
    role: roleName,
    permissions: [...permissions]
  };
}

/**
 * Combina permissões de múltiplos roles
 * @param permissionsList Lista de arrays de permissões
 * @returns Array único com todas as permissões (sem duplicatas)
 */
export function combinePermissions(permissionsList: ModulePermission[][]): ModulePermission[] {
  const uniquePermissions = new Set<ModulePermission>();
  
  permissionsList.forEach(permissions => {
    permissions.forEach(permission => {
      uniquePermissions.add(permission);
    });
  });

  return Array.from(uniquePermissions);
}

/**
 * Verifica se um usuário tem uma permissão específica
 * @param user Usuário alvo
 * @param permission Permissão a ser verificada
 * @returns true se o usuário tem a permissão
 */
export function hasPermission(user: User, permission: ModulePermission): boolean {
  // Super admin tem todas as permissões
  if (user.role === 'super_admin') {
    return true;
  }

  return user.permissions.includes(permission);
}

/**
 * Verifica se um usuário tem todas as permissões especificadas
 * @param user Usuário alvo
 * @param permissions Lista de permissões a serem verificadas
 * @returns true se o usuário tem todas as permissões
 */
export function hasAllPermissions(user: User, permissions: ModulePermission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Verifica se um usuário tem pelo menos uma das permissões especificadas
 * @param user Usuário alvo
 * @param permissions Lista de permissões a serem verificadas
 * @returns true se o usuário tem pelo menos uma das permissões
 */
export function hasAnyPermission(user: User, permissions: ModulePermission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
} 