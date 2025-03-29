/**
 * @deprecated Utilizar o cliente centralizado do @edunexia/api-client
 * Este arquivo está mantido para compatibilidade com o código existente.
 * Para novos componentes, utilize o hook/cliente do pacote centralizado:
 * import { useSupabaseClient } from '@edunexia/api-client';
 */

import { createSupabaseClient } from '@edunexia/api-client'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase')
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey) 