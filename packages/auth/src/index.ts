/**
 * Pacote de autenticação para Edunéxia
 */

// Exportar componentes principais
export { AuthProvider } from './AuthProvider';
export { useAuth } from './hooks/useAuth';
export { AuthContext, useAuthContext } from './hooks/AuthContext';

// Exportar tipos
export type { 
  User,
  UserSession,
  AuthCredentials,
  AuthResponse
} from './types';

// Exporta o cliente Supabase
export * from './supabase-client';

// Re-exports de tipos com alias para evitar conflitos
export { AuthError } from '@supabase/supabase-js'; 