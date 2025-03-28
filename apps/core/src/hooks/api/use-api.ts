import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { ApiClient, createApiClient, ApiClientOptions } from '@edunexia/api-client';

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

// Criar contexto com valor inicial undefined
const ApiContext = createContext<ApiContextType | undefined>(undefined);

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
export function ApiProvider({ children, options }: ApiProviderProps) {
  const [client, setClient] = useState<ApiClient>(() => createApiClient(options));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
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
  const contextValue: ApiContextType = {
    client,
    refreshClient,
    isLoading
  };
  
  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
}

/**
 * Hook para acessar o ApiClient
 * @returns Contexto da API
 * @throws Error se usado fora do ApiProvider
 */
export function useApi(): ApiContextType {
  const context = useContext(ApiContext);
  
  if (context === undefined) {
    throw new Error('useApi deve ser usado dentro de um ApiProvider');
  }
  
  return context;
} 