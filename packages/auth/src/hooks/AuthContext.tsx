import { createContext, useContext } from 'react';
import { User, UserSession, AuthCredentials, SignUpCredentials, UserProfile } from '../types';

/**
 * Contexto de autenticação
 */
export interface AuthContextType {
  user: User | null;
  session: UserSession | null;
  loading: boolean;
  error: Error | null;
  signIn: (credentials: AuthCredentials) => Promise<{
    user: User;
    session: UserSession;
    error: Error | null;
  }>;
  signUp: (credentials: SignUpCredentials) => Promise<{
    user: User;
    session: UserSession;
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<User>;
  updatePreferences: (preferences: User['preferences']) => Promise<User>;
}

/**
 * Contexto de autenticação
 */
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
} 