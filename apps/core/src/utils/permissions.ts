/**
 * Tipos de papéis de usuário disponíveis no sistema
 */
export type UserRole = 'admin' | 'professor' | 'aluno' | 'guest';

/**
 * Mapeamento de níveis de acesso por papel
 */
export const ROLE_LEVELS = {
  admin: 3,
  professor: 2, 
  aluno: 1,
  guest: 0
};

/**
 * Verifica se o papel do usuário tem permissão para o papel requerido
 * @param userRole Papel do usuário
 * @param requiredRole Papel requerido para acesso
 * @returns Boolean indicando se tem permissão
 */
export function hasRolePermission(
  userRole: UserRole | string | undefined | null,
  requiredRole: UserRole | string
): boolean {
  if (!userRole) return false;
  
  const userLevel = ROLE_LEVELS[userRole as keyof typeof ROLE_LEVELS] || 0;
  const requiredLevel = ROLE_LEVELS[requiredRole as keyof typeof ROLE_LEVELS] || 0;
  
  return userLevel >= requiredLevel;
}

/**
 * Lista de recursos do sistema e os papéis que têm acesso
 */
export const RESOURCE_PERMISSIONS = {
  // Funções de administração
  'admin.users.manage': ['admin'],
  'admin.system.configure': ['admin'],
  
  // Funções de professor
  'professor.disciplinas.create': ['admin', 'professor'],
  'professor.disciplinas.edit': ['admin', 'professor'],
  'professor.avaliacoes.manage': ['admin', 'professor'],
  
  // Funções de aluno
  'aluno.disciplinas.view': ['admin', 'professor', 'aluno'],
  'aluno.matriculas.view': ['admin', 'professor', 'aluno'],
  'aluno.avaliacoes.submit': ['admin', 'professor', 'aluno'],
  
  // Funções públicas
  'public.content.view': ['admin', 'professor', 'aluno', 'guest']
};

/**
 * Verifica se o usuário tem permissão para um recurso específico
 * @param userRole Papel do usuário
 * @param resource Recurso a ser acessado
 * @returns Boolean indicando se tem permissão
 */
export function hasResourcePermission(
  userRole: UserRole | string | undefined | null,
  resource: string
): boolean {
  if (!userRole || !resource) return false;
  
  const allowedRoles = RESOURCE_PERMISSIONS[resource as keyof typeof RESOURCE_PERMISSIONS];
  
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole as string);
}

/**
 * Obtém a lista de recursos que o usuário tem permissão
 * @param userRole Papel do usuário
 * @returns Array de recursos permitidos
 */
export function getUserPermissions(userRole: UserRole | string | null): string[] {
  if (!userRole) return [];
  
  return Object.entries(RESOURCE_PERMISSIONS)
    .filter(([_, roles]) => roles.includes(userRole as string))
    .map(([resource]) => resource);
} 