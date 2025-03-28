/**
 * Tipos para o módulo de autenticação unificada da Edunéxia
 */

/**
 * Perfil de usuário
 */
export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  avatar_url?: string;
  telefone?: string;
  cpf?: string;
  cnpj?: string;
}

/**
 * Usuário do sistema com perfil e metadados
 */
export interface User extends UserProfile {
  instituicao_id?: string;
  perfil: UserRole;
  perfil_detalhes?: Record<string, any>;
  permissoes?: string[];
  ultimo_acesso?: string;
  status: UserStatus;
  metadata?: Record<string, any>;
  preferencias?: UserPreferences;
}

/**
 * Status do usuário
 */
export type UserStatus = 'ativo' | 'inativo' | 'bloqueado' | 'pendente';

/**
 * Papéis do usuário
 */
export type UserRole = 
  | 'admin' // Administradores do sistema 
  | 'gestor' // Gestores de instituição
  | 'coordenador' // Coordenador de curso
  | 'professor' // Professor
  | 'tutor' // Tutor
  | 'aluno' // Aluno
  | 'secretaria' // Secretaria
  | 'financeiro' // Financeiro
  | 'parceiro' // Parceiro comercial
  | 'visitante'; // Acesso limitado

/**
 * Credenciais para login
 */
export interface AuthCredentials {
  email: string;
  password: string;
  instituicao_id?: string;
}

/**
 * Token de autenticação
 */
export interface AuthToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  token_type: string;
}

/**
 * Sessão do usuário
 */
export interface UserSession {
  user: User;
  token: AuthToken;
  expires_at: number;
}

/**
 * Resposta de autenticação
 */
export interface AuthResponse {
  user: User | null;
  session: UserSession | null;
  error: Error | null;
}

/**
 * Opções para provedores de autenticação
 */
export interface AuthProviderOptions {
  /**
   * URL base da API de autenticação
   */
  apiUrl?: string;
  
  /**
   * Definir se deve persistir a sessão no localStorage
   */
  persistSession?: boolean;
  
  /**
   * Função a ser chamada quando o usuário é autenticado
   */
  onAuthenticated?: (session: UserSession) => void;
  
  /**
   * Função a ser chamada quando o usuário é desconectado
   */
  onSignOut?: () => void;
  
  /**
   * Função a ser chamada quando ocorre um erro de autenticação
   */
  onError?: (error: Error) => void;
}

/**
 * Preferências do usuário
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  display?: {
    compact?: boolean;
    fontSize?: number;
  };
} 