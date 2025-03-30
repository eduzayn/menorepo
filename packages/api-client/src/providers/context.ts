import { createContext } from 'react';
import { ApiContextValue } from './types';

/**
 * Contexto da API
 * Este contexto fornece acesso ao cliente Supabase e informações de conexão
 */
export const ApiContext = createContext<ApiContextValue>({
  supabase: null,
  supabaseUrl: '',
  supabaseKey: ''
}); 