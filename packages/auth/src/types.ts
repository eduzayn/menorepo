import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Permissões disponíveis para cada módulo
 */
export type ModulePermission =
  // Matrículas
  | 'matriculas.view'
  | 'matriculas.manage'
  | 'matriculas.delete'
  
  // Portal do Aluno
  | 'portal-aluno.view'
  | 'portal-aluno.manage'
  
  // Material Didático
  | 'material-didatico.view'
  | 'material-didatico.create'
  | 'material-didatico.edit'
  | 'material-didatico.delete'
  
  // Comunicação
  | 'comunicacao.view'
  | 'comunicacao.manage'
  | 'comunicacao.delete'
  
  // Financeiro
  | 'financeiro.view'
  | 'financeiro.manage'
  | 'financeiro.delete'
  
  // Relatórios
  | 'relatorios.view'
  | 'relatorios.generate'
  
  // Configurações
  | 'configuracoes.view'
  | 'configuracoes.manage';

/**
 * Níveis de acesso disponíveis no sistema
 */
export type UserRole =
  | 'super_admin'
  | 'institution_admin'
  | 'coordinator'
  | 'teacher'
  | 'secretary'
  | 'financial'
  | 'student'
  | 'parent';

/**
 * Usuário completo com permissões
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: ModulePermission[];
  preferences?: Record<string, any>;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  created_at: string;
}

/**
 * Contexto de autenticação
 */
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Props do provedor de autenticação
 */
export interface AuthProviderProps {
  children: React.ReactNode;
} 