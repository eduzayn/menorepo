/**
 * @edunexia/auth
 * 
 * Módulo de autenticação unificado para a plataforma Edunéxia
 */

// Exportar tipos
export * from './types';

// Exportar componentes e hooks de autenticação
export { 
  AuthProvider,
  useAuth,
  type AuthContextType,
  type AuthProviderProps
} from './components/AuthProvider';

// Exportar funções de autenticação
export * from './supabase-client'; 