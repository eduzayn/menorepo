/**
 * Pacote de autenticação unificada para Edunéxia
 */

// Exporta os componentes principais do Auth
export { default as AuthProvider, useAuth } from './providers/AuthProvider';
export { ROLE_MAPPING, normalizeRole, canAccessPortal } from './providers/AuthProvider';

// Exporta o cliente Supabase e tipos relacionados
export { supabase } from './supabase';
export type { UserData } from './supabase';

// Re-exports de tipos do Supabase
export { AuthError } from '@supabase/supabase-js';

// Exportar componentes principais
export { AuthContext } from './hooks/AuthContext';
export { RouteGuard } from './components/RouteGuard';

// Exportar tipos
export type { 
  User,
  ModulePermission,
  UserRole,
  AuthContextValue,
  AuthProviderProps
} from './types';

// Exporta o cliente Supabase
export * from './supabase-client'; 