import { UserRole, AuthProvider } from './enums';
import type { Database } from './generated-types';

export type { Database } from './generated-types';

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    institution_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Institution {
    id: string;
    name: string;
    domain: string | null;
    logo_url: string | null;
    settings: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface UserSession {
    id: string;
    user_id: string;
    provider: AuthProvider;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    expires_at: string;
}

export interface PasswordReset {
    id: string;
    user_id: string;
    token: string;
    created_at: string;
    expires_at: string;
    used: boolean;
}

export interface EmailVerification {
    id: string;
    user_id: string;
    token: string;
    created_at: string;
    expires_at: string;
    verified_at: string | null;
}

// Tipos base
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Tipos de autenticação e perfil
export type DbProfile = Tables<'profiles'>;
export type DbInstitution = Tables<'institutions'>;

// Tipos de matrícula
export type DbMatricula = Tables<'matriculas'>;
export type DbCurso = Tables<'cursos'>;
export type DbPlanoPagamento = Tables<'planos_pagamento'>;
export type DbPagamento = Tables<'pagamentos'>;
export type DbDocumento = Tables<'documentos'>;
export type DbContrato = Tables<'contratos'>;

// Enums
export type MatriculaStatus = Enums<'matricula_status'>;
export type PaymentStatus = Enums<'payment_status'>;
export type UserRoleEnum = Enums<'user_role'>;
export type AuthProviderEnum = Enums<'auth_provider'>;