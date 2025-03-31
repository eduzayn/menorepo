import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User, AuthContextValue, AuthProviderProps } from '../types';
import { TEST_USERS, TEST_USER_PASSWORD, ENABLE_TEST_BYPASS } from '../../site-edunexia/src/config/test-users';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão ao carregar
    const checkSession = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const userData = await fetchUserWithPermissions(session.user.id);
        setUser(userData);
      }
      
      setIsLoading(false);
    };
    
    checkSession();
    
    // Configurar listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userData = await fetchUserWithPermissions(session.user.id);
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Verificar se é um usuário de teste com bypass ativo
      if (ENABLE_TEST_BYPASS && email === 'ana.diretoria@eduzayn.com.br' && password === TEST_USER_PASSWORD) {
        const testUser = TEST_USERS[email];
        if (testUser) {
          setUser(testUser);
          return;
        }
      }

      // Caso contrário, fazer login normal
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const userData = await fetchUserWithPermissions(data.user.id);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      signIn, 
      signOut 
    }}>
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