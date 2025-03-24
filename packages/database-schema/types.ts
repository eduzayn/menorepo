export type UserRole = 'super_admin' | 'admin_instituicao' | 'consultor_comercial' | 'tutor' | 'aluno';
export type AuthProvider = 'email' | 'google' | 'facebook' | 'github';

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

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
            };
            institutions: {
                Row: Institution;
                Insert: Omit<Institution, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Institution, 'id' | 'created_at' | 'updated_at'>>;
            };
            user_sessions: {
                Row: UserSession;
                Insert: Omit<UserSession, 'id' | 'created_at'>;
                Update: Partial<Omit<UserSession, 'id' | 'created_at'>>;
            };
            password_resets: {
                Row: PasswordReset;
                Insert: Omit<PasswordReset, 'id' | 'created_at'>;
                Update: Partial<Omit<PasswordReset, 'id' | 'created_at'>>;
            };
            email_verifications: {
                Row: EmailVerification;
                Insert: Omit<EmailVerification, 'id' | 'created_at'>;
                Update: Partial<Omit<EmailVerification, 'id' | 'created_at'>>;
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            user_role: UserRole;
            auth_provider: AuthProvider;
        };
    };
} 