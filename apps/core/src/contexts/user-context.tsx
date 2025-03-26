import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, User } from '../hooks/use-auth';

/**
 * Interface do contexto de usuário
 */
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<boolean>;
  hasPermission: (role: string) => boolean;
}

// Contexto com valor padrão undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

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
export function UserProvider({ children }: UserProviderProps) {
  const auth = useAuth();
  
  const contextValue: UserContextType = {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    logout: auth.logout,
    hasPermission: auth.hasPermission
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de usuário
 * @returns Contexto de usuário
 * @throws Error se usado fora do UserProvider
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  
  return context;
} 