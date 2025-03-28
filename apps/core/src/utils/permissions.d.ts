/**
 * Tipos de papéis de usuário disponíveis no sistema
 */
export type UserRole = 'admin' | 'professor' | 'aluno' | 'guest';
/**
 * Mapeamento de níveis de acesso por papel
 */
export declare const ROLE_LEVELS: {
    admin: number;
    professor: number;
    aluno: number;
    guest: number;
};
/**
 * Verifica se o papel do usuário tem permissão para o papel requerido
 * @param userRole Papel do usuário
 * @param requiredRole Papel requerido para acesso
 * @returns Boolean indicando se tem permissão
 */
export declare function hasRolePermission(userRole: UserRole | string | undefined | null, requiredRole: UserRole | string): boolean;
/**
 * Lista de recursos do sistema e os papéis que têm acesso
 */
export declare const RESOURCE_PERMISSIONS: {
    'admin.users.manage': string[];
    'admin.system.configure': string[];
    'professor.disciplinas.create': string[];
    'professor.disciplinas.edit': string[];
    'professor.avaliacoes.manage': string[];
    'aluno.disciplinas.view': string[];
    'aluno.matriculas.view': string[];
    'aluno.avaliacoes.submit': string[];
    'public.content.view': string[];
};
/**
 * Verifica se o usuário tem permissão para um recurso específico
 * @param userRole Papel do usuário
 * @param resource Recurso a ser acessado
 * @returns Boolean indicando se tem permissão
 */
export declare function hasResourcePermission(userRole: UserRole | string | undefined | null, resource: string): boolean;
/**
 * Obtém a lista de recursos que o usuário tem permissão
 * @param userRole Papel do usuário
 * @returns Array de recursos permitidos
 */
export declare function getUserPermissions(userRole: UserRole | string | null): string[];
//# sourceMappingURL=permissions.d.ts.map