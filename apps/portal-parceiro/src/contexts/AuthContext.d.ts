import React, { ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    institution_id?: string;
};
export type Session = {
    user: User | null;
    access_token: string;
    refresh_token: string;
};
type SignUpData = {
    email: string;
    password: string;
    nome: string;
    telefone?: string;
    cargo?: string;
    inviteToken?: string;
};
type PasswordResetData = {
    token: string;
    newPassword: string;
};
interface AuthContextProps {
    user: User | null;
    profile: any | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{
        error: any | null;
        data: any | null;
    }>;
    signUp: (data: SignUpData) => Promise<{
        error: any | null;
        data: any | null;
    }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{
        error: any | null;
    }>;
    updatePassword: (password: string) => Promise<{
        error: any | null;
    }>;
    completePasswordReset: (data: PasswordResetData) => Promise<{
        error: any | null;
    }>;
    updateProfile: (profileData: any) => Promise<{
        error: any | null;
    }>;
}
export declare const AuthContext: React.Context<AuthContextProps>;
interface AuthProviderProps {
    children: ReactNode;
}
/**
 * Provider de autenticação
 * Em produção, este componente seria substituído pelo equivalente de @edunexia/auth
 */
export declare const AuthProvider: ({ children }: AuthProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextProps;
export {};
//# sourceMappingURL=AuthContext.d.ts.map