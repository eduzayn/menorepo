import { UserRole, AuthProvider } from './enums';
import type { Database } from './generated-types';

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

export interface Conversa {
    id: string;
    titulo: string;
    status: 'ativo' | 'inativo' | 'pendente' | 'arquivado';
    canal: 'whatsapp' | 'email' | 'chat' | 'sms';
    remetente_id: string;
    destinatario_id?: string;
    lead_id?: string;
    ultima_mensagem_at?: string;
    criado_at: string;
    atualizado_at: string;
}

export interface Mensagem {
    id: string;
    conversa_id: string;
    remetente_id: string;
    tipo: 'texto' | 'imagem' | 'arquivo' | 'video' | 'audio' | 'localizacao';
    conteudo: string;
    metadata?: Record<string, any>;
    lida_at?: string;
    criado_at: string;
}

export interface Campanha {
    id: string;
    nome: string;
    descricao?: string;
    tipo: 'marketing' | 'notificacao' | 'lembrete' | 'pesquisa';
    conteudo: string;
    metadata?: Record<string, any>;
    status: string;
    data_inicio?: string;
    data_fim?: string;
    criado_por: string;
    criado_at: string;
    atualizado_at: string;
}

export interface CampanhaDestinatario {
    id: string;
    campanha_id: string;
    destinatario_id: string;
    status: string;
    enviado_at?: string;
    lido_at?: string;
    respondido_at?: string;
    criado_at: string;
}

export interface RespostaRapida {
    id: string;
    titulo: string;
    conteudo: string;
    categoria?: string;
    criado_por: string;
    criado_at: string;
    atualizado_at: string;
}

// Tipos base
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Tipos de autenticação e perfil
export type DbUser = Tables<'users'>;
export type DbProfile = Tables<'profiles'>;
export type DbInstitution = Tables<'institutions'>;

// Tipos de comunicação
export type DbConversa = Tables<'conversas'>;
export type DbMensagem = Tables<'mensagens'>;
export type DbCampanha = Tables<'campanhas'>;
export type DbCampanhaDestinatario = Tables<'campanha_destinatarios'>;
export type DbRespostaRapida = Tables<'respostas_rapidas'>;

// Tipos de grupos e notificações
export type DbGrupo = Tables<'grupos'>;
export type DbGrupoParticipante = Tables<'grupo_participantes'>;
export type DbNotificacaoConfig = Tables<'notificacoes_config'>;

// Enums
export type ComunicacaoStatus = Enums<'comunicacao_status'>;
export type ComunicacaoCanal = Enums<'comunicacao_canal'>;
export type ComunicacaoTipoMensagem = Enums<'comunicacao_tipo_mensagem'>;
export type ComunicacaoTipoCampanha = Enums<'comunicacao_tipo_campanha'>;
export type GrupoRole = Enums<'grupo_role'>;
export type TipoNotificacao = Enums<'tipo_notificacao'>;

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
            conversas: {
                Row: Conversa;
                Insert: Omit<Conversa, 'id' | 'criado_at' | 'atualizado_at'>;
                Update: Partial<Omit<Conversa, 'id' | 'criado_at' | 'atualizado_at'>>;
            };
            mensagens: {
                Row: Mensagem;
                Insert: Omit<Mensagem, 'id' | 'criado_at'>;
                Update: Partial<Omit<Mensagem, 'id' | 'criado_at'>>;
            };
            campanhas: {
                Row: Campanha;
                Insert: Omit<Campanha, 'id' | 'criado_at' | 'atualizado_at'>;
                Update: Partial<Omit<Campanha, 'id' | 'criado_at' | 'atualizado_at'>>;
            };
            campanha_destinatarios: {
                Row: CampanhaDestinatario;
                Insert: Omit<CampanhaDestinatario, 'id' | 'criado_at'>;
                Update: Partial<Omit<CampanhaDestinatario, 'id' | 'criado_at'>>;
            };
            respostas_rapidas: {
                Row: RespostaRapida;
                Insert: Omit<RespostaRapida, 'id' | 'criado_at' | 'atualizado_at'>;
                Update: Partial<Omit<RespostaRapida, 'id' | 'criado_at' | 'atualizado_at'>>;
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