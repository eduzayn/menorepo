import { SupabaseClient, Session } from '@supabase/supabase-js';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserSession, AuthResponse, SignUpCredentials, UserProfile, ModulePermissions, RoleLevel } from './types';
import { permissionCache } from './utils/permissionCache';
import { getBasePermissions } from './utils/permissions';
import { dynamicRoleManager } from './utils/dynamicRoles';

interface AuthContextType {
  user: User | null;
  session: UserSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (preferences: Record<string, any>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  supabase: SupabaseClient;
  children: React.ReactNode;
}

const createUserSession = (session: Session): UserSession => ({
  user: null,
  token: {
    access_token: session.access_token,
    refresh_token: session.refresh_token || '',
    expires_at: new Date(session.expires_at || 0).getTime(),
    token_type: session.token_type
  },
  expires_at: new Date(session.expires_at || 0).getTime()
});

const createUserFromProfile = (profile: any, permissions: ModulePermissions): User => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  role: profile.role as RoleLevel,
  status: profile.status,
  created_at: profile.created_at,
  updated_at: profile.updated_at,
  permissions,
  preferences: profile.preferences || {},
  dynamicRoles: profile.dynamic_roles || []
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ supabase, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(createUserSession(session));
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSession(createUserSession(session));
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setSession(null);
        if (user?.id) {
          permissionCache.remove(user.id);
        }
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const loadUserProfile = async (userId: string) => {
    try {
      // Verificar cache primeiro
      const cachedPermissions = permissionCache.get(userId);
      if (cachedPermissions) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (profile) {
          setUser(createUserFromProfile(profile, cachedPermissions));
          return;
        }
      }

      // Se não estiver em cache, buscar do banco
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        // Combinar permissões base com roles dinâmicos
        const basePermissions = profile.permissions || getBasePermissions(profile.role as RoleLevel);
        const dynamicRoleIds = profile.dynamic_roles || [];
        const permissions = dynamicRoleManager.combinePermissions(profile.role as RoleLevel, dynamicRoleIds);

        // Armazenar no cache
        permissionCache.set(userId, permissions);
        setUser(createUserFromProfile(profile, permissions));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
      }

      return { 
        user: data.user ? user : null, 
        session: data.session ? createUserSession(data.session) : null, 
        error: null 
      };
    } catch (error) {
      return { 
        user: null, 
        session: null, 
        error: error instanceof Error ? error : new Error('Erro desconhecido') 
      };
    }
  };

  const signUp = async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: credentials.role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Criar perfil inicial
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: credentials.name,
              email: credentials.email,
              role: credentials.role,
              status: 'active',
              permissions: getBasePermissions(credentials.role),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;

        await loadUserProfile(data.user.id);
      }

      return { 
        user: data.user ? user : null, 
        session: data.session ? createUserSession(data.session) : null, 
        error: null 
      };
    } catch (error) {
      return { 
        user: null, 
        session: null, 
        error: error instanceof Error ? error : new Error('Erro desconhecido') 
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      if (user?.id) {
        permissionCache.remove(user.id);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>): Promise<void> => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Atualizar estado local
      setUser(prev => prev ? { ...prev, ...profile } : null);
      
      // Atualizar cache se necessário
      if ('permissions' in profile) {
        permissionCache.set(user.id, profile.permissions as ModulePermissions);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const updatePreferences = async (preferences: Record<string, any>): Promise<void> => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update({ 
          preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Atualizar estado local
      setUser(prev => prev ? { ...prev, preferences } : null);
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 