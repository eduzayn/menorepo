import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@edunexia/api-client';
import { 
  User, 
  UserSession, 
  AuthCredentials, 
  AuthResponse 
} from '../types';

/**
 * Hook para gerenciar autenticação do usuário na plataforma Edunéxia
 * 
 * Fornece métodos para login, logout, sessão e verificação de permissões
 */
export function useAuth() {
  const supabase = useSupabaseClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Verifica se há sessão ativa ao carregar o componente
   */
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      
      try {
        // Verificar sessão atual
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          // Buscar dados do usuário se há sessão
          const { data: userData } = await supabase
            .from('usuarios')
            .select('*, perfil_detalhes:perfis(*)')
            .eq('id', currentSession.user.id)
            .single();

          // Se há dados do usuário, atualiza o estado
          if (userData) {
            setUser(userData as User);
            
            // Armazenar sessão
            const userSession: UserSession = {
              user: userData as User,
              token: {
                access_token: currentSession.access_token,
                refresh_token: currentSession.refresh_token || '',
                expires_at: new Date(currentSession.expires_at || 0).getTime(),
                token_type: currentSession.token_type
              },
              expires_at: new Date(currentSession.expires_at || 0).getTime()
            };
            
            setSession(userSession);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao verificar sessão'));
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    
    // Configurar listener para alterações de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (event === 'SIGNED_IN' && currentSession) {
          // Atualizar usuário e sessão quando há login
          const { data: userData } = await supabase
            .from('usuarios')
            .select('*, perfil_detalhes:perfis(*)')
            .eq('id', currentSession.user.id)
            .single();
            
          if (userData) {
            setUser(userData as User);
            
            const userSession: UserSession = {
              user: userData as User,
              token: {
                access_token: currentSession.access_token,
                refresh_token: currentSession.refresh_token || '',
                expires_at: new Date(currentSession.expires_at || 0).getTime(),
                token_type: currentSession.token_type
              },
              expires_at: new Date(currentSession.expires_at || 0).getTime()
            };
            
            setSession(userSession);
          }
        } else if (event === 'SIGNED_OUT') {
          // Limpar usuário e sessão quando há logout
          setUser(null);
          setSession(null);
        }
      }
    );

    // Cleanup do listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * Realiza login com email e senha
   */
  const signIn = useCallback(async (credentials: AuthCredentials): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Autenticar com email e senha
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.session) {
        throw new Error('Sessão inválida após login');
      }
      
      // Buscar dados completos do usuário
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*, perfil_detalhes:perfis(*)')
        .eq('id', authData.user.id)
        .single();
        
      if (userError) {
        throw userError;
      }
      
      if (!userData) {
        throw new Error('Dados do usuário não encontrados');
      }
      
      // Criar sessão e atualizar estado
      const user = userData as User;
      const userSession: UserSession = {
        user,
        token: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: new Date(authData.session.expires_at || 0).getTime(),
          token_type: authData.session.token_type
        },
        expires_at: new Date(authData.session.expires_at || 0).getTime()
      };
      
      setUser(user);
      setSession(userSession);
      
      return {
        user,
        session: userSession,
        error: null
      };
    } catch (err) {
      console.error('Erro ao realizar login:', err);
      const errorObj = err instanceof Error ? err : new Error('Erro desconhecido ao realizar login');
      setError(errorObj);
      
      return {
        user: null,
        session: null,
        error: errorObj
      };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Realiza logout do usuário
   */
  const signOut = useCallback(async (): Promise<{ success: boolean, error: Error | null }> => {
    setLoading(true);
    
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        throw signOutError;
      }
      
      // Limpar estados
      setUser(null);
      setSession(null);
      
      return {
        success: true,
        error: null
      };
    } catch (err) {
      console.error('Erro ao realizar logout:', err);
      const errorObj = err instanceof Error ? err : new Error('Erro desconhecido ao realizar logout');
      setError(errorObj);
      
      return {
        success: false,
        error: errorObj
      };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !user.permissoes) {
      return false;
    }
    
    return user.permissoes.includes(permission);
  }, [user]);

  /**
   * Verifica se o usuário tem um perfil específico
   */
  const hasRole = useCallback((role: string): boolean => {
    if (!user) {
      return false;
    }
    
    // Mapeamento de hierarquia de papéis
    const roles = {
      admin: ['admin'],
      gestor: ['admin', 'gestor'],
      coordenador: ['admin', 'gestor', 'coordenador'],
      professor: ['admin', 'gestor', 'coordenador', 'professor'],
      tutor: ['admin', 'gestor', 'coordenador', 'professor', 'tutor'],
      secretaria: ['admin', 'gestor', 'secretaria'],
      financeiro: ['admin', 'gestor', 'financeiro'],
      aluno: ['aluno'],
      parceiro: ['parceiro'],
      visitante: ['admin', 'gestor', 'coordenador', 'professor', 'tutor', 'secretaria', 'financeiro', 'aluno', 'parceiro', 'visitante']
    };
    
    // Verificar se o perfil do usuário está na lista de perfis permitidos
    return roles[role as keyof typeof roles]?.includes(user.perfil) || false;
  }, [user]);

  /**
   * Atualiza dados do perfil do usuário
   */
  const updateProfile = useCallback(async (
    profileData: Partial<Omit<User, 'id' | 'email' | 'perfil'>>
  ): Promise<{ success: boolean, error: Error | null }> => {
    if (!user) {
      return {
        success: false,
        error: new Error('Usuário não autenticado')
      };
    }
    
    try {
      const { error: updateError } = await supabase
        .from('usuarios')
        .update(profileData)
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Atualizar estado do usuário com novos dados
      setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, ...profileData };
      });
      
      return {
        success: true,
        error: null
      };
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      const errorObj = err instanceof Error ? err : new Error('Erro desconhecido ao atualizar perfil');
      
      return {
        success: false,
        error: errorObj
      };
    }
  }, [supabase, user]);

  /**
   * Valores e funções exportadas pelo hook
   */
  return {
    // Estado
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    
    // Ações de autenticação
    signIn,
    signOut,
    
    // Verificação de permissões
    hasPermission,
    hasRole,
    
    // Gerenciamento de perfil
    updateProfile
  };
} 