import React, { useContext, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ApiProviderProps, TypedSupabaseClient } from './types'
import { ApiContext } from './context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Hook para acessar o cliente da API
 */
export const useApiClient = () => {
  const context = useContext(ApiContext)
  
  if (!context) {
    throw new Error('useApiClient deve ser usado dentro de um ApiProvider')
  }
  
  return context
}

/**
 * Provedor de contexto da API
 */
export const ApiProvider: React.FC<ApiProviderProps> = ({
  children,
  supabaseUrl,
  supabaseKey,
  queryClient
}) => {
  // Criar um cliente Supabase com tipagem
  const supabase = useMemo<TypedSupabaseClient | null>(() => {
    if (!supabaseUrl || !supabaseKey) return null
    return createClient(supabaseUrl, supabaseKey) as TypedSupabaseClient
  }, [supabaseUrl, supabaseKey])
  
  // Criar um cliente de query se não for fornecido
  const client = useMemo(() => {
    return queryClient || new QueryClient()
  }, [queryClient])
  
  // Criar o valor do contexto
  const value = useMemo(() => ({
    supabase,
    supabaseUrl,
    supabaseKey
  }), [supabase, supabaseUrl, supabaseKey])
  
  return (
    <QueryClientProvider client={client}>
      <ApiContext.Provider value={value}>
        {children}
      </ApiContext.Provider>
    </QueryClientProvider>
  )
} 