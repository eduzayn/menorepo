import { useAuthContext } from './AuthContext';

/**
 * Hook para gerenciar autenticação do usuário na plataforma Edunéxia
 * 
 * Fornece métodos para login, logout, sessão e verificação de permissões
 */
export function useAuth() {
  // Usar o contexto existente
  return useAuthContext();
} 