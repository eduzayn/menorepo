/**
 * Declaração de tipos temporária para @edunexia/auth
 * Isso permite que o TypeScript reconheça o módulo enquanto resolvemos os problemas de build
 */

import { ModulePermission, UserRole, User, AuthContextValue, AuthProviderProps } from '@edunexia/auth';
import { AppModule } from '@edunexia/navigation';

export type { ModulePermission, UserRole, User, AuthContextValue, AuthProviderProps };

declare module '@edunexia/auth' {
  import { ReactNode } from 'react';

  /**
   * Tipos para autenticação
   */

  export type ModuleAction =
    | 'view'
    | 'manage'
    | 'delete'
    | 'create'
    | 'edit'
    | 'generate';

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

  export interface UserSession {
    user: User;
    token: string;
  }

  export interface AuthResponse {
    user: User | null;
    session: any;
    error: Error | null;
  }

  export interface AuthError extends Error {
    message: string;
    status?: number;
  }

  export interface AuthContextType extends AuthContextValue {
    children: React.ReactNode;
  }

  export function useAuth(): AuthContextValue;

  export function AuthProvider({ children }: AuthContextType): JSX.Element;

  export function useAuthContext(): AuthContextValue;

  export const AuthContext: React.Context<AuthContextValue>;

  export interface PortalConfig {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    route: string;
    permissions?: Record<ModulePermission, boolean>;
  }

  export interface ModuleConfig {
    id: AppModule;
    name: string;
    description?: string;
    icon?: string;
    route: string;
    permissions: ModulePermission[];
    requiredPermission: ModulePermission;
  }

  export interface AuthProviderProps {
    children: React.ReactNode;
  }
}

export interface ModuleAccess {
  id: AppModule;
  enabled: boolean;
  visible: boolean;
  permissions: ModulePermission[];
} 