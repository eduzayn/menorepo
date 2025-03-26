import { useState, useEffect, useCallback } from 'react';
import { useApi, signIn, signOut, getCurrentUser, AuthCredentials } from '@edunexia/api-client';
import { useNavigate } from 'react-router-dom';

/**
 * Interface do usuário autenticado
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

/**
 * Hook para gerenciar autenticação
 * @returns Funções e estados relacionados à autenticação
 */
export function useAuth() {
  const { client } = useApi();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Verifica se o usuário está autenticado ao carregar
  useEffect(() => {
    checkAuth();
  }, []);
  
  /**
   * Verifica se o usuário está autenticado
   */
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { user: authUser, error } = await getCurrentUser(client);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setUser(authUser);
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err);
      setUser(null);
      setError('Erro ao verificar autenticação');
    } finally {
      setLoading(false);
    }
  }, [client]);
  
  /**
   * Realiza login com email e senha
   */
  const login = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, session, error } = await signIn(client, credentials);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!user || !session) {
        throw new Error('Erro ao realizar login');
      }
      
      setUser({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      // Redireciona para dashboard após login
      navigate('/dashboard');
      
      return true;
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar login';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [client, navigate]);
  
  /**
   * Realiza logout da sessão atual
   */
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      const { success, error } = await signOut(client);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!success) {
        throw new Error('Erro ao realizar logout');
      }
      
      setUser(null);
      
      // Redireciona para login após logout
      navigate('/login');
      
      return true;
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar logout';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [client, navigate]);
  
  /**
   * Verifica se o usuário tem a permissão necessária
   */
  const hasPermission = useCallback((requiredRole: string) => {
    if (!user) return false;
    
    const roles = {
      admin: 3,
      professor: 2,
      aluno: 1,
      guest: 0
    };
    
    const userRoleLevel = roles[user.role as keyof typeof roles] || 0;
    const requiredRoleLevel = roles[requiredRole as keyof typeof roles] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  }, [user]);
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
    hasPermission
  };
} 