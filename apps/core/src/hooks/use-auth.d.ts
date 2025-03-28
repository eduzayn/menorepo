import { AuthCredentials } from '@edunexia/api-client';
/**
 * Interface do usuário autenticado
 */
export interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
}
/**
 * Hook para gerenciar autenticação
 * @returns Funções e estados relacionados à autenticação
 */
export declare function useAuth(): {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (credentials: AuthCredentials) => Promise<boolean>;
    logout: () => Promise<boolean>;
    checkAuth: () => Promise<void>;
    hasPermission: (requiredRole: string) => boolean;
};
//# sourceMappingURL=use-auth.d.ts.map