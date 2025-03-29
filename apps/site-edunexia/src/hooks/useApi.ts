/**
 * Hook para acessar o cliente API do Supabase
 * Simplifica a integração com o monorepo usando o contexto API
 */

import { useApiContext } from '../contexts/ApiContext';

/**
 * Hook para acessar o cliente API
 * Usa o contexto API internamente
 */
export function useApi() {
  return useApiContext();
} 