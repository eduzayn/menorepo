import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  nome?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Verificar se há uma sessão ativa
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          // Se há sessão, buscar os dados do usuário
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('id, email, nome')
            .eq('id', data.session.user.id)
            .single();

          if (userError) throw userError;

          setState({
            user: userData || null,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setState({
          user: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Erro desconhecido'),
        });
      }
    };

    checkSession();

    // Listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && event === 'SIGNED_IN') {
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('id, email, nome')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Erro ao buscar dados do usuário:', userError);
            return;
          }

          setState({
            user: userData || null,
            isLoading: false,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, senha: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Erro ao fazer login'),
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState({ ...state, isLoading: true, error: null });
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Erro ao fazer logout'),
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 