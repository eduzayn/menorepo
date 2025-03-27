/**
 * Hooks para o cliente API
 */

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { TypedSupabaseClient } from '../types'
import { createSupabaseClient } from '..'

/**
 * Hook para criar e usar o cliente Supabase
 * 
 * @param supabaseUrl URL da instância do Supabase
 * @param supabaseKey Chave de API do Supabase
 * @returns Cliente Supabase tipado
 */
export function useSupabase(supabaseUrl: string, supabaseKey: string) {
  const [client, setClient] = useState<TypedSupabaseClient | null>(null)
  
  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL e API Key são necessários')
      return
    }
    
    const supabase = createSupabaseClient(supabaseUrl, supabaseKey)
    setClient(supabase)
    
    return () => {
      // Cleanup quando o componente for desmontado
    }
  }, [supabaseUrl, supabaseKey])
  
  return client
}

/**
 * Hook para buscar dados de uma tabela do Supabase
 * 
 * @param client Cliente Supabase
 * @param table Nome da tabela
 * @param options Opções da query (filtros, ordenação, etc)
 * @returns Resultado da query (dados, erro, status, etc)
 */
export function useSupabaseQuery<T = any>(
  client: TypedSupabaseClient | null,
  table: string,
  options: {
    enabled?: boolean
    filters?: Record<string, any>
    order?: { column: string; ascending?: boolean }
    limit?: number
    queryKey?: any[]
  } = {}
) {
  const { 
    enabled = true, 
    filters = {}, 
    order,
    limit,
    queryKey = [table, filters, order, limit]
  } = options
  
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!client) {
        throw new Error('Cliente Supabase não inicializado')
      }
      
      let query = client.from(table).select('*')
      
      // Aplicar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
      
      // Aplicar ordenação
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true })
      }
      
      // Aplicar limite
      if (limit) {
        query = query.limit(limit)
      }
      
      const { data, error } = await query
      
      if (error) {
        throw error
      }
      
      return data as T[]
    },
    enabled: !!client && enabled
  })
}

/**
 * Hook para inserir dados em uma tabela do Supabase
 * 
 * @param client Cliente Supabase
 * @param table Nome da tabela
 * @returns Função de mutação e estado
 */
export function useSupabaseInsert<T = any>(
  client: TypedSupabaseClient | null,
  table: string
) {
  return useMutation({
    mutationFn: async (data: any) => {
      if (!client) {
        throw new Error('Cliente Supabase não inicializado')
      }
      
      const { data: result, error } = await client
        .from(table)
        .insert(data)
        .select()
      
      if (error) {
        throw error
      }
      
      return result as T[]
    }
  })
}

/**
 * Hook para atualizar dados em uma tabela do Supabase
 * 
 * @param client Cliente Supabase
 * @param table Nome da tabela
 * @returns Função de mutação e estado
 */
export function useSupabaseUpdate<T = any>(
  client: TypedSupabaseClient | null,
  table: string
) {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: any }) => {
      if (!client) {
        throw new Error('Cliente Supabase não inicializado')
      }
      
      const { data: result, error } = await client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
      
      if (error) {
        throw error
      }
      
      return result as T[]
    }
  })
}

/**
 * Hook para deletar dados em uma tabela do Supabase
 * 
 * @param client Cliente Supabase
 * @param table Nome da tabela
 * @returns Função de mutação e estado
 */
export function useSupabaseDelete(
  client: TypedSupabaseClient | null,
  table: string
) {
  return useMutation({
    mutationFn: async (id: string | number) => {
      if (!client) {
        throw new Error('Cliente Supabase não inicializado')
      }
      
      const { error } = await client
        .from(table)
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      return true
    }
  })
} 