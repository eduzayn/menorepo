import { TypedSupabaseClient } from '../types'
import { QueryClient } from '@tanstack/react-query'

/**
 * Interface para o valor do contexto da API
 */
export interface ApiContextValue {
  supabase: TypedSupabaseClient | null
  supabaseUrl: string
  supabaseKey: string
}

/**
 * Props para o componente ApiProvider
 */
export interface ApiProviderProps {
  children: React.ReactNode
  supabaseUrl: string
  supabaseKey: string
  queryClient?: QueryClient
} 