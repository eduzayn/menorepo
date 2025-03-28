import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Interface para o perfil do aluno
interface AlunoPerfil {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  curso: string;
  semestre: number;
  fotoPerfil?: string;
}

// Interface para o estado do contexto
interface AlunoContextData {
  perfil: AlunoPerfil | null;
  setPerfil: (perfil: AlunoPerfil | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

// Valor padrão do contexto
const defaultContext: AlunoContextData = {
  perfil: null,
  setPerfil: () => {},
  isLoading: true,
  isAuthenticated: false,
  logout: () => {}
};

// Criação do contexto
const AlunoContext = createContext<AlunoContextData>(defaultContext);

// Interface para as props do provider
interface AlunoProviderProps {
  children: ReactNode;
}

/**
 * Provider do contexto do aluno
 * Gerencia o estado global do aluno logado no portal
 */
export function AlunoProvider({ children }: AlunoProviderProps) {
  const [perfil, setPerfil] = useState<AlunoPerfil | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar os dados do aluno
  useEffect(() => {
    // Simulação de carregamento de dados
    // Em produção, seria uma chamada à API real
    const carregarPerfil = async () => {
      try {
        // Exemplo: Carregar dados do localStorage ou API
        const savedProfile = localStorage.getItem('aluno_perfil');
        
        if (savedProfile) {
          setPerfil(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerfil();
  }, []);

  // Função para realizar logout
  const logout = () => {
    setPerfil(null);
    localStorage.removeItem('aluno_perfil');
    // Aqui seriam adicionadas outras ações de logout, como invalidar tokens
  };

  return (
    <AlunoContext.Provider
      value={{
        perfil,
        setPerfil,
        isLoading,
        isAuthenticated: !!perfil,
        logout
      }}
    >
      {children}
    </AlunoContext.Provider>
  );
}

/**
 * Hook para acessar o contexto do aluno
 * @returns Contexto do aluno
 */
export function useAlunoContext() {
  const context = useContext(AlunoContext);

  if (!context) {
    throw new Error('useAlunoContext deve ser usado dentro de um AlunoProvider');
  }

  return context;
}

export default AlunoContext; 