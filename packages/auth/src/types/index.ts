import { Session, User, SupabaseClient } from '@supabase/supabase-js';
import { ReactNode } from 'react';

export type AuthError = {
  message: string;
  code?: string;
};

export type UserSession = {
  user: User | null;
  session: Session | null;
  error: Error | null;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
  signIn: (credentials: AuthCredentials) => Promise<UserSession>;
  signOut: () => Promise<void>;
  loading: boolean;
};

export type AuthProviderProps = {
  children: ReactNode;
  supabaseClient: SupabaseClient;
};

export enum RoleLevel {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export type Permission = 'read' | 'write' | 'delete' | 'admin';

export type ModulePermissions = {
  [module: string]: {
    [action in Permission]: boolean;
  };
};

export type ExtendedUser = User & {
  permissions: ModulePermissions;
};

// Test types
export type MockUser = User & {
  id: string;
  email: string;
  role: string;
  permissions: Record<string, Record<string, boolean>>;
};

export type MockSupabaseClient = {
  auth: {
    signInWithPassword: jest.Mock<Promise<{ data: { user: User; session: Session } | null; error: AuthError | null }>>;
    signOut: jest.Mock<Promise<{ error: AuthError | null }>>;
    onAuthStateChange: jest.Mock<{ data: { subscription: { unsubscribe: () => void } } }>;
    getSession: jest.Mock<Promise<{ data: { session: Session | null }; error: AuthError | null }>>;
  };
}; 