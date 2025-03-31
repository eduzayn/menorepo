import React, { createContext, useContext, useState, useEffect } from 'react';

// Definição do tipo User
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: Record<string, { read: boolean; write: boolean; delete: boolean }>;
}

// Interface do contexto de autenticação
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Mock de usuário para desenvolvimento
const MOCK_USER: User = {
  id: '1',
  name: 'Usuário de Teste',
  email: 'usuario@edunexia.com.br',
  role: 'admin',
  permissions: {
    'matriculas.view': { read: true, write: true, delete: true },
    'portal-aluno.view': { read: true, write: true, delete: true },
    'material-didatico.view': { read: true, write: true, delete: true },
    'comunicacao.view': { read: true, write: true, delete: true },
    'financeiro.view': { read: true, write: true, delete: true },
    'relatorios.view': { read: true, write: true, delete: true },
    'configuracoes.view': { read: true, write: true, delete: true },
    'dashboard.view': { read: true, write: true, delete: true }
  }
};

// Dados de usuários para teste
const TEST_USERS = [
  {
    email: 'admin@edunexia.com.br',
    password: 'admin123',
    user: {
      ...MOCK_USER,
      name: 'Administrador',
      role: 'admin'
    }
  },
  {
    email: 'professor@edunexia.com.br',
    password: 'prof123',
    user: {
      ...MOCK_USER,
      id: '2',
      name: 'Professor Teste',
      role: 'teacher',
      permissions: {
        'matriculas.view': { read: true, write: false, delete: false },
        'portal-aluno.view': { read: true, write: true, delete: false },
        'material-didatico.view': { read: true, write: true, delete: true },
        'comunicacao.view': { read: true, write: true, delete: false },
      }
    }
  },
  {
    email: 'aluno@edunexia.com.br',
    password: 'aluno123',
    user: {
      ...MOCK_USER,
      id: '3',
      name: 'Aluno Teste',
      role: 'student',
      permissions: {
        'portal-aluno.view': { read: true, write: false, delete: false },
        'material-didatico.view': { read: true, write: false, delete: false },
      }
    }
  }
];

// Funções auxiliares padrão para uso quando o contexto não está disponível
const noopSignIn = async (_email: string, _password: string): Promise<void> => {
  console.warn('AuthProvider não encontrado! Usando função signIn padrão.');
};

const noopSignOut = async (): Promise<void> => {
  console.warn('AuthProvider não encontrado! Usando função signOut padrão.');
};

// Valor padrão para o contexto
const defaultContextValue: AuthContextProps = {
  user: null,
  isLoading: false,
  error: null,
  signIn: noopSignIn,
  signOut: noopSignOut
};

// Criando o contexto de autenticação
const AuthContext = createContext<AuthContextProps>(defaultContextValue);

/**
 * Provedor de autenticação temporário
 * Esta implementação serve como uma ponte até que o pacote @edunexia/auth 
 * esteja completamente disponível e configurado
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para carregar o usuário do localStorage na inicialização
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // Verificar se há usuário no localStorage
        const savedUser = localStorage.getItem('edunexia-user');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError('Falha ao carregar dados do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Função de login
   * @param email - Email do usuário
   * @param password - Senha do usuário
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    console.log('Início do processo de login:', { email });

    try {
      // Simular uma requisição de API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Tratar caso específico de admin@edunexia.com.br (sem o .br)
      let foundUser = TEST_USERS.find(
        u => u.email === email && u.password === password
      );
      
      // Tratar caso onde os usuários tentem usar admin@edunexia.com sem o .br
      if (!foundUser && email === "admin@edunexia.com" && password === "admin123") {
        foundUser = TEST_USERS[0]; // Usar o primeiro usuário admin da lista
        console.log('Ajuste para compatibilidade: admin@edunexia.com -> admin@edunexia.com.br');
      }

      console.log('Tentativa de login - usuário encontrado:', !!foundUser);

      if (foundUser) {
        console.log('Login bem-sucedido para:', foundUser.user.name);
        setUser(foundUser.user);
        localStorage.setItem('edunexia-user', JSON.stringify(foundUser.user));
        // Não precisamos mais redirecionar aqui, já que estamos fazendo isso no componente de login
      } else {
        console.log('Credenciais inválidas');
        throw new Error('Credenciais inválidas');
      }
    } catch (err) {
      console.error('Erro no processo de login:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro durante o login');
      }
      throw err;
    } finally {
      setIsLoading(false);
      console.log('Processo de login finalizado');
    }
  };

  /**
   * Função de logout
   */
  const signOut = async (): Promise<void> => {
    try {
      // Simular uma requisição de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      localStorage.removeItem('edunexia-user');
      setUser(null);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setError('Falha ao encerrar a sessão');
    }
  };

  // Valor do contexto
  const contextValue: AuthContextProps = {
    user,
    isLoading,
    error,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (!context || context === defaultContextValue) {
    console.error('useAuth deve ser usado dentro de um AuthProvider');
    return defaultContextValue;
  }
  
  return context;
};

// Adicionando uma exportação nomeada para garantir compatibilidade
export { AuthProvider };

// Mantendo a exportação padrão para compatibilidade com código existente
export default AuthProvider; 