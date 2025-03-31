/**
 * Declaração de tipos temporária para @edunexia/auth
 * Isso permite que o TypeScript reconheça o módulo enquanto resolvemos os problemas de build
 */

declare module '@edunexia/auth' {
  import { ReactNode } from 'react';

  /**
   * Tipos para autenticação
   */

  export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'super_admin';

  export type ModuleId = 
    | 'matriculas'
    | 'portal-aluno'
    | 'material-didatico'
    | 'comunicacao'
    | 'financeiro'
    | 'relatorios'
    | 'configuracoes';

  export type ModuleAction = 
    | 'view'
    | 'manage'
    | 'create'
    | 'edit'
    | 'delete'
    | 'generate';

  export type ModulePermissionKey = `${ModuleId}.${ModuleAction}`;

  export interface ModulePermission {
    read: boolean;
    write: boolean;
    delete: boolean;
  }

  export interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    permissions: Record<ModulePermissionKey, ModulePermission>;
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

  export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
    error: string | null;
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
    permissions?: Record<ModulePermissionKey, ModulePermission>;
  }

  export interface ModuleConfig {
    id: ModuleId;
    name: string;
    description?: string;
    icon?: string;
    route: string;
    permissions: ModulePermissionKey[];
    requiredPermission: ModulePermissionKey;
  }
} 