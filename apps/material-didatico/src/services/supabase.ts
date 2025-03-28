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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Criar cliente do Supabase
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

// Constantes de tabelas para uso consistente
export const TABLES = {
  MATERIAIS: 'materiais',
  AULAS: 'aulas',
  MODULOS: 'modulos',
  DISCIPLINAS: 'disciplinas',
  CURSOS: 'cursos',
  AVALIACOES: 'avaliacoes'
} as const
