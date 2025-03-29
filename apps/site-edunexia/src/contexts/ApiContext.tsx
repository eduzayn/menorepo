import { ReactNode, createContext, useContext } from 'react';
import { ApiClient } from '@edunexia/api-client/src/client';

// Importação do cliente - sem referência circular
import { createApiClient } from '@edunexia/api-client/src/client';

// Configurações locais para o cliente API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://npiyusbnaaibibcucspv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waXl1c2JuYWFpYmliY3Vjc3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzM1MjgsImV4cCI6MjA1ODQwOTUyOH0.VXME6a0EldkPAXHiF3S2PcEaHA_EoXHQJ1YzKV9_fsU';

// Criar instância do cliente API localmente
export const apiClient = createApiClient({
  supabaseUrl,
  supabaseAnonKey,
  enableLogging: import.meta.env.DEV,
  onError: (error) => {
    console.error('[API Error]:', error);
  }
});

// Contexto para acesso ao cliente API
interface ApiContextValue {
  client: ApiClient;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
  client?: ApiClient;
}

/**
 * Provedor de API específico para o módulo site-edunexia
 * Este componente fornece acesso ao cliente API para toda a árvore de componentes
 */
export function ApiProvider({ children, client = apiClient }: ApiProviderProps) {
  return (
    <ApiContext.Provider value={{ client }}>
      {children}
    </ApiContext.Provider>
  );
}

/**
 * Hook para consumir o contexto API
 */
export function useApiContext(): ApiContextValue {
  const context = useContext(ApiContext);
  
  if (!context) {
    throw new Error('useApiContext deve ser usado dentro de um ApiProvider');
  }
  
  return context;
} 