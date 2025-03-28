/**
 * Tipos compartilhados para o cliente API
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@edunexia/database-schema'

/**
 * Cliente Supabase tipado com o schema do banco de dados
 */
export type TypedSupabaseClient = SupabaseClient<Database>

/**
 * Opções do cliente API
 */
export interface ApiClientOptions {
  /**
   * URL da instância do Supabase
   */
  supabaseUrl: string
  
  /**
   * Chave de API do Supabase (anon ou service_role)
   */
  supabaseKey: string
}

/**
 * Resposta genérica da API
 */
export interface ApiResponse<T> {
  /**
   * Dados retornados pela API
   */
  data: T | null
  
  /**
   * Erro retornado pela API, se houver
   */
  error: Error | null
} 