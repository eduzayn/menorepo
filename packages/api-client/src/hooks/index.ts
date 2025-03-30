/**
 * Hooks para o cliente API
 */

import { useState, useEffect, useContext } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ApiContext } from '../providers/context'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@edunexia/database-schema'

// Tipagem para o cliente Supabase
type TypedSupabaseClient = SupabaseClient<Database>

/**
 * Hook para acessar o cliente Supabase
 * @returns Cliente Supabase tipado
 */
export function useSupabaseClient(): TypedSupabaseClient {
  const context = useContext(ApiContext)
  
  if (!context) {
    throw new Error('useSupabaseClient deve ser usado dentro de um ApiProvider')
  }
  
  if (!context.supabase) {
    throw new Error('Cliente Supabase não inicializado')
  }
  
  return context.supabase
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