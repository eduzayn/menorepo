/**
 * Definições de tipos relacionados a usuários
 */
import { BaseEntity } from './common';

/**
 * Roles de usuários no sistema
 */
export type UserRole = 
  | 'super_admin'
  | 'admin_instituicao'
  | 'admin_polo'
  | 'atendente_polo'
  | 'aluno'
  | 'professor'
  | 'coordenador'
  | 'parceiro'
  | 'financeiro';

/**
 * Provedores de autenticação
 */
export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple' | 'github';

/**
 * Status do usuário
 */
export type UserStatus = 'active' | 'inactive' | 'pending' | 'blocked';

/**
 * Interface base para usuários
 */
export interface UserBase extends BaseEntity {
  email: string;
  name: string;
  avatar_url?: string;
  status: UserStatus;
  role: UserRole;
  auth_provider: AuthProvider;
  last_login?: string;
}

/**
 * Perfil de usuário com detalhes adicionais
 */
export interface UserProfile extends UserBase {
  cpf?: string;
  phone?: string;
  birth_date?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications_enabled?: boolean;
  };
} 