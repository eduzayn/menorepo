import { SupabaseClient, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { createSupabaseClient } from '../supabase-client';

// Usar tipos internos enquanto não resolvemos a dependência circular
type ModuleName = 'MATRICULAS' | 'PORTAL_ALUNO' | 'COMUNICACAO' | 'FINANCEIRO' | 'PORTAL_PARCEIRO';

// Constantes para rotas
const ROUTE_PREFIXES = {
  MATRICULAS: '/matriculas',
  PORTAL_ALUNO: '/aluno',
  COMUNICACAO: '/comunicacao',
  FINANCEIRO: '/financeiro',
  PORTAL_PARCEIRO: '/parceiro',
  AUTH: '/auth'
};

export interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  loginWithOAuth: (provider: string) => Promise<any>;
  logout: () => Promise<any>;
  getCurrentUser: () => Promise<User | null>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (password: string) => Promise<any>;
  loginPath: string;
  moduleName: ModuleName;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
  supabaseClient?: SupabaseClient;
  moduleName?: ModuleName;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  supabaseClient,
  moduleName = 'MATRICULAS'
}) => {
  const client = supabaseClient || createSupabaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Gerar path de login baseado no módulo atual
  const loginPath = `${ROUTE_PREFIXES[moduleName]}${ROUTE_PREFIXES.AUTH}/login`;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await client.auth.getSession();
        if (error) {
          console.error('Erro ao obter sessão:', error);
          return;
        }

        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = client.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [client]);

  // Função para verificar funções do usuário
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    // Implementação simulada - na prática, isso verificaria as funções do usuário no JWT
    const userRoles = user.app_metadata?.roles || [];
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(role);
  };

  // Função para verificar permissões do usuário
  const hasPermission = (permission: string | string[]): boolean => {
    if (!user) return false;
    
    // Implementação simulada - na prática, isso verificaria as permissões do usuário no JWT
    const userPermissions = user.app_metadata?.permissions || [];
    
    if (Array.isArray(permission)) {
      return permission.some(p => userPermissions.includes(p));
    }
    
    return userPermissions.includes(permission);
  };

  // Login com e-mail e senha
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    return client.auth.signInWithPassword({ email, password });
  };

  // Login com OAuth
  const loginWithOAuth = async (provider: string) => {
    return client.auth.signInWithOAuth({ provider: provider as any });
  };

  // Logout
  const logout = async () => {
    return client.auth.signOut();
  };

  // Recuperação de senha
  const forgotPassword = async (email: string) => {
    return client.auth.resetPasswordForEmail(email);
  };

  // Redefinição de senha
  const resetPassword = async (password: string) => {
    return client.auth.updateUser({ password });
  };

  // Obter usuário atual
  const getCurrentUser = async () => {
    const { data } = await client.auth.getUser();
    return data?.user || null;
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
    loginWithEmailAndPassword,
    loginWithOAuth,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    loginPath,
    moduleName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 