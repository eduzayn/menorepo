import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@edunexia/database-schema'
import { QueryClient } from '@tanstack/react-query'

/**
 * Cliente Supabase tipado com o schema do banco de dados
 */
export type TypedSupabaseClient = SupabaseClient<Database>

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