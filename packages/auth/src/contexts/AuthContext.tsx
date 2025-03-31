import { Session, User, SupabaseClient, AuthChangeEvent } from '@supabase/supabase-js';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { AuthContextType, AuthProviderProps, AuthError, AuthCredentials, UserSession } from '../types';
import { getUserPermissions } from '../utils/permissions';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, supabaseClient }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          const userData = await getUserPermissions(session.user.id);
          setUser(userData);
          setSession(session);
        }
      } catch (err) {
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const userData = await getUserPermissions(session.user.id);
        setUser(userData);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabaseClient]);

  const signIn = async (credentials: AuthCredentials): Promise<UserSession> => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword(credentials);
      if (error) throw error;

      const userData = await getUserPermissions(data.user.id);
      return { user: userData, session: data.session, error: null };
    } catch (err) {
      return { user: null, session: null, error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
    } catch (err) {
      setError(err as AuthError);
    }
  };

  const value = {
    user,
    session,
    error,
    signIn,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 