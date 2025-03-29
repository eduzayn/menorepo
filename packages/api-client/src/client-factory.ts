/**
 * Factory para criar o cliente Supabase
 */
import { createClient } from '@supabase/supabase-js'
import { Database } from '@edunexia/database-schema'

/**
 * Cria uma instância do cliente Supabase tipado com o schema do banco de dados
 * 
 * @param supabaseUrl URL da instância do Supabase
 * @param supabaseKey Chave de API do Supabase (anon ou service_role)
 * @returns Cliente Supabase tipado
 */
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseKey: string
) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e API Key são necessários')
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Re-exporta tipos úteis
export type { Database } from '@edunexia/database-schema' 