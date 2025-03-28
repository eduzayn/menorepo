import { useContext, createContext, useState, useEffect } from 'react';
import { createApiClient } from '@edunexia/api-client';
// Criar contexto com valor inicial undefined
const ApiContext = createContext(undefined);
/**
 * Provedor do contexto de API
 */
export function ApiProvider({ children, options }) {
    const [client, setClient] = useState(() => createApiClient(options));
    const [isLoading, setIsLoading] = useState(false);
    // Função para recriar o cliente quando necessário
    const refreshClient = () => {
        setIsLoading(true);
        setClient(createApiClient(options));
        setIsLoading(false);
    };
    // Recria o cliente quando as opções mudarem
    useEffect(() => {
        refreshClient();
    }, [options.supabaseUrl, options.supabaseAnonKey]);
    // Contexto a ser compartilhado
    const contextValue = {
        client,
        refreshClient,
        isLoading
    };
    return value = { contextValue } >
        { children }
        < /ApiContext.Provider>;
    ;
}
/**
 * Hook para acessar o ApiClient
 * @returns Contexto da API
 * @throws Error se usado fora do ApiProvider
 */
export function useApi() {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('useApi deve ser usado dentro de um ApiProvider');
    }
    return context;
}
