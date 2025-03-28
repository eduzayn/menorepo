import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/use-auth';
// Contexto com valor padrão undefined
const UserContext = createContext(undefined);
/**
 * Provedor de contexto de usuário
 * @param children Componentes filhos
 */
export function UserProvider({ children }) {
    const auth = useAuth();
    const contextValue = {
        user: auth.user,
        loading: auth.loading,
        error: auth.error,
        isAuthenticated: auth.isAuthenticated,
        login: auth.login,
        logout: auth.logout,
        hasPermission: auth.hasPermission
    };
    return (_jsx(UserContext.Provider, { value: contextValue, children: children }));
}
/**
 * Hook para acessar o contexto de usuário
 * @returns Contexto de usuário
 * @throws Error se usado fora do UserProvider
 */
export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser deve ser usado dentro de um UserProvider');
    }
    return context;
}
