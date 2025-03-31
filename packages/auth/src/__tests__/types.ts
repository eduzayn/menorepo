import { Session, User } from '@supabase/supabase-js';

export type AuthError = {
  message: string;
  code?: string;
};

export type MockUser = User & {
  id: string;
  email: string;
  role: string;
  permissions: Record<string, Record<string, boolean>>;
};

export type MockSupabaseClient = {
  auth: {
    signInWithPassword: jest.Mock<() => Promise<{ data: { user: User; session: Session } | null; error: AuthError | null }>>;
    signOut: jest.Mock<() => Promise<{ error: AuthError | null }>>;
    onAuthStateChange: jest.Mock<() => { data: { subscription: { unsubscribe: () => void } } }>;
    getSession: jest.Mock<() => Promise<{ data: { session: Session | null }; error: AuthError | null }>>;
  };
}; 