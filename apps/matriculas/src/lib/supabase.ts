/**
 * @deprecated Este arquivo foi substituído pelo pacote compartilhado @edunexia/api-client
 * 
 * Importe o cliente e hooks do pacote compartilhado:
 * import { useSupabaseClient, useSupabaseQuery } from '@edunexia/api-client'
 * 
 * E use o provider na raiz da aplicação:
 * <ApiProvider supabaseUrl={...} supabaseKey={...}>
 */

// Reexporta do pacote compartilhado para compatibilidade temporária
import { createSupabaseClient } from '@edunexia/api-client'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e Anon Key são necessários')
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Constantes de tabelas
export const TABLES = {
  MATRICULAS: 'matriculas',
  ALUNOS: 'alunos',
  CURSOS: 'cursos',
  CONTRATOS: 'contratos',
  DOCUMENTOS: 'documentos'
} as const 