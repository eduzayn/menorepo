/**
 * @edunexia/api-client
 * 
 * Cliente API centralizado para comunicação com o Supabase
 * Fortemente tipado com o schema do banco de dados
 */

// Re-exporta a função de criação do cliente
export { createSupabaseClient, type Database } from './client-factory'

// Re-exporta tipos úteis
export * from './types'
export * from './hooks'

// Exporta componentes do provider separadamente para evitar importação circular
export * from './providers/types'
export { ApiProvider } from './providers/ApiProvider'
