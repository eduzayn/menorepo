/**
 * Hook para acessar o cliente API do Supabase
 * Simplifica a integração com o monorepo usando o contexto API
 */
import { useApiContext } from '../lib/ApiContext';

/**
 * Hook para acessar o cliente da API no React
 * Este hook simplifica o acesso ao cliente da API em componentes
 */
export function useApi() {
    return useApiContext();
}

export default useApi;
