import { ReactNode } from 'react';
import { User } from '../hooks/use-auth';
/**
 * Interface do contexto de usuário
 */
interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<boolean>;
    logout: () => Promise<boolean>;
    hasPermission: (role: string) => boolean;
}
/**
 * Props do provedor de usuário
 */
interface UserProviderProps {
    children: ReactNode;
}
/**
 * Provedor de contexto de usuário
 * @param children Componentes filhos
 */
export declare function UserProvider({ children }: UserProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook para acessar o contexto de usuário
 * @returns Contexto de usuário
 * @throws Error se usado fora do UserProvider
 */
export declare function useUser(): UserContextType;
export {};
//# sourceMappingURL=user-context.d.ts.map