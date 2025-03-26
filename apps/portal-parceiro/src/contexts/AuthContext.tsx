import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';

// Importação simulada do pacote de autenticação do monorepo
// Em produção, utilizaria: import { User, Session } from '@edunexia/auth';

// Definindo os tipos
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  institution_id?: string;
};

export type Session = {
  user: User | null;
  access_token: string;
  refresh_token: string;
};

type SignUpData = {
  email: string;
  password: string;
  nome: string;
  telefone?: string;
  cargo?: string;
  inviteToken?: string;
};

type PasswordResetData = {
  token: string;
  newPassword: string;
};

interface AuthContextProps {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  signUp: (data: SignUpData) => Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (password: string) => Promise<{ error: any | null }>;
  completePasswordReset: (data: PasswordResetData) => Promise<{ error: any | null }>;
  updateProfile: (profileData: any) => Promise<{ error: any | null }>;
}

const defaultContext: AuthContextProps = {
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  completePasswordReset: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
};

export const AuthContext = createContext<AuthContextProps>(defaultContext);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de autenticação
 * Em produção, este componente seria substituído pelo equivalente de @edunexia/auth
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação atual e obter sessão
    const getSession = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await getProfile(session.user.id);
        }
      } catch (error) {
        console.error('Erro ao obter sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await getProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Buscar perfil do usuário
  const getProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  // Login com email/senha
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { data: null, error };
    }
  };

  // Registro de novo usuário
  const signUp = async ({ email, password, nome, telefone, cargo, inviteToken }: SignUpData) => {
    try {
      // Registrar usuário com Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            telefone,
            cargo
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        // Criar perfil do usuário no banco
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              nome,
              telefone: telefone || '',
              cargo: cargo || '',
              invite_token: inviteToken || null
            }
          ]);

        if (profileError) throw profileError;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return { data: null, error };
    }
  };

  // Logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Recuperação de senha
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return { error };
    }
  };

  // Completar o processo de redefinição de senha
  const completePasswordReset = async ({ token, newPassword }: PasswordResetData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { error };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return { error };
    }
  };

  // Atualizar senha
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      return { error };
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return { error };
    }
  };

  // Atualizar perfil do usuário
  const updateProfile = async (profileData: any) => {
    if (!user) return { error: new Error('Usuário não autenticado') };
    
    try {
      // Atualizar perfil no banco
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Atualizar estado local
      setProfile({ ...profile, ...profileData });
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    completePasswordReset,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para acessar o contexto
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}; 