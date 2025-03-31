import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para o contexto de autenticação
interface UserData {
  id: string;
  name: string;
  email: string;
  roles: string[];
  token?: string;
  user_metadata?: {
    role?: string;
  };
  permissions?: Array<{
    portal_id: string;
    can_access: boolean;
  }>;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserData>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  canAccessPortal: (portalId: string) => boolean;
}

// Valores padrão para o contexto
const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ id: '', name: '', email: '', roles: [] }),
  logout: () => {},
  refreshToken: async () => {},
  canAccessPortal: () => false,
};

// Criação do contexto
const AuthContext = createContext<AuthContextType>(defaultContext);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Verifica se um usuário tem permissão para acessar um portal específico
 */
export function canAccessPortal(user: UserData | null, portalId: string): boolean {
  if (!user) return false;
  
  // Verificar primeiro nos metadados do usuário
  const userRole = user.user_metadata?.role;
  
  // Se for admin global ou admin de instituição, permitir acesso
  if (userRole === 'admin' || userRole === 'institution_admin') {
    return true;
  }
  
  // Verificar na lista de roles do usuário
  if (user.roles && (user.roles.includes('admin') || user.roles.includes('institution_admin'))) {
    return true;
  }
  
  // Verificar nas permissões específicas
  const userPermissions = user.permissions || [];
  return userPermissions.some(p => p.portal_id === portalId && p.can_access);
}

/**
 * Provedor de autenticação para a aplicação
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para verificar a autenticação quando o componente é montado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se há um token no localStorage
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Simulação de verificação de token
          // Em produção, isto seria substituído por uma chamada real ao backend
          
          // Dados falsos de usuário para desenvolvimento
          const mockUser: UserData = {
            id: '1',
            name: 'Usuário Teste',
            email: 'usuario@teste.com',
            roles: ['aluno', 'admin'],
            token,
            user_metadata: {
              role: 'institution_admin'
            },
            permissions: [
              { portal_id: 'aluno', can_access: true },
              { portal_id: 'admin', can_access: true }
            ]
          };
          
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Limpar dados de autenticação em caso de erro
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  /**
   * Função para realizar login
   */
  const login = async (email: string, password: string): Promise<UserData> => {
    try {
      setIsLoading(true);
      
      // Simulação de requisição de login
      // Em produção, isto seria substituído por uma chamada real ao backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação básica para desenvolvimento
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      // Token falso para desenvolvimento
      const token = 'mock_jwt_token_' + Math.random().toString(36).substr(2);
      
      // Determinar roles com base no email para testes
      const roles = [];
      
      if (email.includes('aluno')) {
        roles.push('student');
      }
      
      if (email.includes('admin')) {
        roles.push('admin');
      }
      
      if (email.includes('professor')) {
        roles.push('teacher');
      }
      
      if (roles.length === 0) {
        roles.push('student'); // Role padrão para testes
      }
      
      // Criar objeto de usuário
      const userData: UserData = {
        id: '1',
        name: email.split('@')[0],
        email,
        roles,
        token,
        user_metadata: {
          role: email.includes('admin') ? 'institution_admin' : 'user'
        },
        permissions: [
          { portal_id: 'aluno', can_access: email.includes('aluno') || roles.includes('admin') },
          { portal_id: 'admin', can_access: roles.includes('admin') }
        ]
      };
      
      // Salvar token no localStorage
      localStorage.setItem('auth_token', token);
      
      // Atualizar estado
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função para realizar logout
   */
  const logout = () => {
    // Remover token do localStorage
    localStorage.removeItem('auth_token');
    
    // Atualizar estado
    setUser(null);
  };

  /**
   * Função para renovar o token de autenticação
   */
  const refreshToken = async (): Promise<void> => {
    try {
      // Verificar se o usuário está autenticado
      if (!user || !user.token) {
        throw new Error('Usuário não autenticado');
      }
      
      // Simulação de renovação de token
      // Em produção, isto seria substituído por uma chamada real ao backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Novo token falso
      const newToken = 'refreshed_token_' + Math.random().toString(36).substr(2);
      
      // Atualizar token no localStorage
      localStorage.setItem('auth_token', newToken);
      
      // Atualizar estado
      setUser(prev => prev ? { ...prev, token: newToken } : null);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      
      // Se houver erro na renovação, fazer logout
      logout();
      
      throw error;
    }
  };

  /**
   * Função para verificar se o usuário pode acessar um portal
   */
  const checkPortalAccess = (portalId: string): boolean => {
    return canAccessPortal(user, portalId);
  };

  // Valor do contexto
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
    canAccessPortal: checkPortalAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para verificar acesso a um portal específico
export const useCanAccessPortal = (portalId: string): boolean => {
  const { canAccessPortal } = useAuth();
  return canAccessPortal(portalId);
};

export default AuthProvider; 