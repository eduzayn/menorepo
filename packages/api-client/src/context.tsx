import React, { createContext, useContext, ReactNode } from 'react';
import { ApiClient } from './client';
import { ApiContext } from './types';

// Criação do contexto com valor inicial undefined
const Context = createContext<ApiContext | undefined>(undefined);

interface ApiProviderProps {
  /**
   * Cliente de API inicializado
   */
  client: ApiClient;
  
  /**
   * Componentes filhos
   */
  children: ReactNode;
}

/**
 * Provedor de contexto para a API
 * Disponibiliza o cliente de API para os componentes filhos
 */
export function ApiProvider({ client, children }: ApiProviderProps) {
  return (
    <Context.Provider value={{ client }}>
      {children}
    </Context.Provider>
  );
}

/**
 * Hook para acessar o cliente de API
 * @returns O cliente de API do contexto
 * @throws Error se usado fora de um ApiProvider
 */
export function useApi(): ApiContext {
  const context = useContext(Context);
  
  if (context === undefined) {
    throw new Error('useApi deve ser usado dentro de um ApiProvider');
  }
  
  return context;
} 