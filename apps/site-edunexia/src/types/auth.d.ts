/**
 * Declaração de tipos temporária para @edunexia/auth
 * Isso permite que o TypeScript reconheça o módulo enquanto resolvemos os problemas de build
 */

declare module '@edunexia/auth' {
  import { ReactNode } from 'react';

  export interface User {
    id: string;
    email: string;
    role?: string;
    nome?: string;
    avatar_url?: string;
  }

  export interface UserSession {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
    user: User;
  }

  export interface AuthResponse {
    session?: UserSession;
    user?: User;
    error?: Error;
  }

  export interface AuthContextValue {
    user: User | null;
    session: UserSession | null;
    error: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
  }

  export function useAuth(): AuthContextValue;

  export interface AuthProviderProps {
    children: ReactNode;
  }

  export function AuthProvider(props: AuthProviderProps): JSX.Element;

  export function useAuthContext(): AuthContextValue;

  export const AuthContext: React.Context<AuthContextValue>;
} 