import React, { createContext, useContext, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiContextValue, ApiProviderProps, TypedSupabaseClient } from './types'
import { createSupabaseClient } from '../client-factory'

const ApiContext = createContext<ApiContextValue | null>(null)

/**
 * Provider para o cliente API
 * Disponibiliza o cliente Supabase e o React Query para toda a aplicação
 */
export function ApiProvider({
  children,
  supabaseUrl,
  supabaseKey,
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 1
      }
    }
  })
}: ApiProviderProps) {
  // Cria o cliente Supabase apenas uma vez
  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseKey) {
      return null
    }
    return createSupabaseClient(supabaseUrl, supabaseKey)
  }, [supabaseUrl, supabaseKey])
  
  // Valor do contexto
  const value = useMemo(
    () => ({ supabase, supabaseUrl, supabaseKey }),
    [supabase, supabaseUrl, supabaseKey]
  )
  
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={value}>
        {children}
      </ApiContext.Provider>
    </QueryClientProvider>
  )
}

/**
 * Hook para acessar o contexto do cliente API
 */
export function useApiContext() {
  const context = useContext(ApiContext)
  
  if (!context) {
    throw new Error('useApiContext deve ser usado dentro de um ApiProvider')
  }
  
  return context
}

/**
 * Hook para acessar o cliente Supabase do contexto
 */
export function useSupabaseClient() {
  const { supabase } = useApiContext()
  
  if (!supabase) {
    throw new Error('Cliente Supabase não inicializado')
  }
  
  return supabase
} 