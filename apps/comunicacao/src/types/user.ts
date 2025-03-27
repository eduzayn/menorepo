/**
 * Tipos relacionados a usuários do sistema
 */

/**
 * Perfis de usuário disponíveis no sistema
 */
export type UserRole = 
  | 'admin'
  | 'gestor'
  | 'coordenador'
  | 'professor'
  | 'tutor'
  | 'secretaria'
  | 'financeiro'
  | 'aluno'
  | 'parceiro'
  | 'visitante';

/**
 * Interface para usuário do sistema
 */
export interface User {
  id: string;
  email: string;
  nome: string;
  avatar_url?: string;
  telefone?: string;
  roles: UserRole[];
  permissoes: string[];
  configuracoes?: UserConfiguracoes;
  ultimo_acesso?: string;
  online: boolean;
  criado_at: string;
  atualizado_at: string;
}

/**
 * Configurações específicas do usuário
 */
export interface UserConfiguracoes {
  notificacoes_email: boolean;
  notificacoes_push: boolean;
  notificacoes_som: boolean;
  tema: 'claro' | 'escuro' | 'sistema';
  idioma: string;
  dashboard_widgets: string[];
}

/**
 * Dados de autenticação
 */
export interface AuthData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
} 