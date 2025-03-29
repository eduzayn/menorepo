import { ReactNode } from 'react';
import { ApiClient } from '@edunexia/api-client/src/client';
export declare const apiClient: ApiClient;
interface ApiContextValue {
    client: ApiClient;
}
interface ApiProviderProps {
    children: ReactNode;
    client?: ApiClient;
}
/**
 * Provedor de API específico para o módulo site-edunexia
 * Este componente fornece acesso ao cliente API para toda a árvore de componentes
 */
export declare function ApiProvider({ children, client }: ApiProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook para consumir o contexto API
 */
export declare function useApiContext(): ApiContextValue;
export {};
//# sourceMappingURL=ApiContext.d.ts.map