import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

// Tipo para o usuário autenticado
interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

// Interface do contexto de autenticação
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasAccess: (portalId: string) => boolean;
}

// Opções para o cookie
interface CookieOptions {
  domain: string;
  expires: number; // dias
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}

// Mapeamento de papéis do sistema
export const ROLE_MAPPING = {
  ADMIN: 'admin',
  STUDENT: 'student',
  TEACHER: 'teacher',
  STAFF: 'staff',
  PARENT: 'parent',
};

/**
 * Normaliza o papel do usuário para um formato padrão
 */
export const normalizeRole = (role: string): string => {
  const normalizedRole = role.toUpperCase();
  return ROLE_MAPPING[normalizedRole as keyof typeof ROLE_MAPPING] || 'guest';
};

/**
 * Verifica se um usuário pode acessar um portal específico
 */
export const canAccessPortal = (portalId: string, userRole: string): boolean => {
  // Implementação básica - cada portal implementará sua própria lógica de acesso
  // Esta é apenas uma implementação simplificada
  const roleAccess: Record<string, string[]> = {
    'portal-aluno': [ROLE_MAPPING.STUDENT, ROLE_MAPPING.ADMIN],
    'portal-professor': [ROLE_MAPPING.TEACHER, ROLE_MAPPING.ADMIN],
    'portal-admin': [ROLE_MAPPING.ADMIN],
    'portal-secretaria': [ROLE_MAPPING.STAFF, ROLE_MAPPING.ADMIN],
    'portal-pais': [ROLE_MAPPING.PARENT, ROLE_MAPPING.ADMIN],
  };

  const allowedRoles = roleAccess[portalId] || [];
  return allowedRoles.includes(userRole);
};

// Configuração dos cookies
const COOKIE_OPTIONS: CookieOptions = {
  domain: process.env.NODE_ENV === 'production' ? '.edunexia.com.br' : 'localhost',
  expires: 7, // 7 dias
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

// Nome do cookie
const AUTH_COOKIE_NAME = 'edunexia_auth_token';

// Função para manipular cookies (sem dependências externas)
const Cookies = {
  get: (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  },
  set: (name: string, value: string, options: Partial<CookieOptions>): void => {
    const { domain, expires, secure, sameSite } = options;
    
    const date = new Date();
    date.setTime(date.getTime() + (expires ? expires * 24 * 60 * 60 * 1000 : 0));
    
    document.cookie = `${name}=${value}; ` +
      `expires=${date.toUTCString()}; ` +
      `path=/; ` +
      (domain ? `domain=${domain}; ` : '') +
      (secure ? 'secure; ' : '') +
      (sameSite ? `sameSite=${sameSite}` : '');
  },
  remove: (name: string, options?: Partial<CookieOptions>): void => {
    const opts = { ...options, expires: -1 };
    Cookies.set(name, '', opts);
  }
};

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticação que gerencia o estado de login, cookie compartilhado entre subdomínios
 * e verificação de permissões
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Efeito para verificar autenticação atual
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Verificar se existe token nos cookies
        const token = Cookies.get(AUTH_COOKIE_NAME);
        
        if (token) {
          // Verificar token no Supabase
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            throw error;
          }
          
          if (data?.user) {
            // Buscar dados adicionais do usuário (nome, papel, etc)
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, email, full_name, role')
              .eq('id', data.user.id)
              .single();
            
            if (userError) {
              throw userError;
            }
            
            if (userData) {
              // Armazenar usuário no estado
              setCurrentUser({
                id: userData.id,
                email: userData.email,
                fullName: userData.full_name,
                role: normalizeRole(userData.role),
              });
            }
          }
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setError('Falha ao verificar sua autenticação');
        // Limpar cookie em caso de erro
        Cookies.remove(AUTH_COOKIE_NAME);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  /**
   * Login do usuário com email e senha
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Autenticar com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        // Buscar dados adicionais do usuário
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, full_name, role')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        // Definir cookie compartilhado entre subdomínios
        Cookies.set(AUTH_COOKIE_NAME, data.session.access_token, {
          domain: COOKIE_OPTIONS.domain,
          expires: COOKIE_OPTIONS.expires,
          secure: COOKIE_OPTIONS.secure,
          sameSite: COOKIE_OPTIONS.sameSite,
        });
        
        // Armazenar usuário no estado
        setCurrentUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          role: normalizeRole(userData.role),
        });
        
        return { success: true };
      }
      
      return { success: false, message: 'Credenciais inválidas' };
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setError(err.message || 'Falha ao fazer login');
      return { success: false, message: err.message || 'Credenciais inválidas' };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Logout do usuário
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Deslogar do Supabase
      await supabase.auth.signOut();
      
      // Remover cookie
      Cookies.remove(AUTH_COOKIE_NAME, {
        domain: COOKIE_OPTIONS.domain,
      });
      
      // Limpar usuário do estado
      setCurrentUser(null);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Verifica se o usuário tem acesso a um determinado portal
   */
  const hasAccess = (portalId: string) => {
    if (!currentUser) return false;
    return canAccessPortal(portalId, currentUser.role);
  };
  
  const value = {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser,
    hasAccess,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acessar o contexto de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export default AuthProvider; 