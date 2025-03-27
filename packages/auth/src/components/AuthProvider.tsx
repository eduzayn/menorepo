import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, UserSession, AuthCredentials, AuthResponse } from '../types';

/**
 * Tipo do contexto de autenticação
 */
interface AuthContextType {
  // Estado
  user: User | null;
  session: UserSession | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  
  // Ações de autenticação
  signIn: (credentials: AuthCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<{ success: boolean; error: Error | null }>;
  
  // Verificação de permissões e papéis
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  
  // Gerenciamento de perfil
  updateProfile: (
    profileData: Partial<Omit<User, 'id' | 'email' | 'perfil'>>
  ) => Promise<{ success: boolean; error: Error | null }>;
}

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props do provedor de autenticação
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provedor de contexto de autenticação
 * Disponibiliza o estado e funções de autenticação para componentes filhos
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Usar o hook de autenticação
  const auth = useAuth();
  
  // Preparar valor do contexto
  const contextValue: AuthContextType = {
    // Estado
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    
    // Ações de autenticação
    signIn: auth.signIn,
    signOut: auth.signOut,
    
    // Verificação de permissões e papéis
    hasPermission: auth.hasPermission,
    hasRole: auth.hasRole,
    
    // Gerenciamento de perfil
    updateProfile: auth.updateProfile
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação
 * Deve ser usado dentro de um componente descendente de AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

/**
 * Hook principal de autenticação exportado
 * Substitui o hook useAuth individual de cada módulo
 */
export const useAuth = useAuthContext; 