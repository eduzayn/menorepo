import React, { createContext, useContext } from 'react';
import { User, UserSession } from '../types';

// Definição do contexto de autenticação
export interface AuthContextType {
  user: User | null;
  session: UserSession | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<any>;
  signOut: () => Promise<any>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  updateProfile: (data: Partial<User>) => Promise<any>;
}

// Criação do contexto com valores padrão
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  signIn: async () => ({}),
  signOut: async () => ({}),
  hasPermission: () => false,
  hasRole: () => false,
  updateProfile: async () => ({})
});

// Hook para acessar o contexto de autenticação
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}; 