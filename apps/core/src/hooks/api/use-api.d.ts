import { ReactNode } from 'react';
import { ApiClient, ApiClientOptions } from '@edunexia/api-client';
/**
 * Contexto do API Client
 */
interface ApiContextType {
    /** Instância do ApiClient */
    client: ApiClient;
    /** Recarrega a instância do cliente */
    refreshClient: () => void;
    /** Estado de carregamento */
    isLoading: boolean;
}
/**
 * Props do provedor de API
 */
interface ApiProviderProps {
    /** Componentes filhos */
    children: ReactNode;
    /** Configurações do ApiClient */
    options: ApiClientOptions;
}
/**
 * Provedor do contexto de API
 */
export declare function ApiProvider({ children, options }: ApiProviderProps): boolean;
/**
 * Hook para acessar o ApiClient
 * @returns Contexto da API
 * @throws Error se usado fora do ApiProvider
 */
export declare function useApi(): ApiContextType;
export {};
//# sourceMappingURL=use-api.d.ts.map