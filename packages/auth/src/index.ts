/**
 * @edunexia/auth
 * 
 * Módulo de autenticação unificado para a plataforma Edunéxia
 */

// Exportar tipos
export * from './types';

// Exportar hooks de autenticação base
export * from './hooks/useAuth';

// Exportar o provedor e hook de contexto
export {
  AuthProvider,
  useAuthContext,
  // Este é o useAuth principal que os módulos devem usar
  useAuth
} from './components/AuthProvider'; 