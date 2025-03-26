import { useEffect, useState } from 'react';

// Tipos
interface User {
  id: string;
  instituicao_id: string;
  email: string;
  nome: string;
  perfil: string;
}

// Simulação de autenticação durante o desenvolvimento
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de usuário autenticado
    const carregarUsuario = () => {
      setIsLoading(true);
      
      // Simular tempo de carregamento
      setTimeout(() => {
        // Usuário simulado para desenvolvimento
        const usuarioSimulado: User = {
          id: 'user-001',
          instituicao_id: 'inst-001',
          email: 'admin@edunexia.com.br',
          nome: 'Administrador',
          perfil: 'admin'
        };
        
        setUser(usuarioSimulado);
        setIsLoading(false);
      }, 500);
    };
    
    carregarUsuario();
  }, []);

  return {
    user,
    isLoading,
    // Funções mock para autenticação
    login: async (email: string, senha: string) => {
      console.log('Login com', email, senha);
      return { success: true };
    },
    logout: async () => {
      console.log('Logout');
      setUser(null);
    },
    // Hook preparado para integração futura com o pacote @edunexia/auth
    // Quando o pacote estiver pronto, substituir a implementação acima
  };
} 