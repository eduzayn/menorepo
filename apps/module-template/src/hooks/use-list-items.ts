import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient, useApiClient } from '@edunexia/api-client';

/**
 * Interface para o item
 */
export interface Item {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Opções para filtrar a listagem
 */
export interface ListItemsOptions {
  /** Status do item (opcional) */
  status?: 'active' | 'inactive' | 'all';
  
  /** Termo de busca (opcional) */
  search?: string;
  
  /** Campo para ordenação */
  sortBy?: 'title' | 'createdAt';
  
  /** Direção da ordenação */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Busca a lista de itens
 * @param client Cliente da API
 * @param options Opções de filtragem
 * @returns Resultado da busca
 */
async function fetchItems(
  client: ApiClient,
  options: ListItemsOptions = {}
): Promise<Item[]> {
  const {
    status = 'active',
    search = '',
    sortBy = 'createdAt',
    sortDirection = 'desc'
  } = options;
  
  try {
    let query = client.from('items').select('*');
    
    // Aplica filtro por status
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    // Aplica busca por termo
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    
    // Aplica ordenação
    query = query.order(sortBy, { ascending: sortDirection === 'asc' });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as Item[];
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    throw error;
  }
}

/**
 * Hook para listar itens com filtragem e ordenação
 * @param options Opções de filtragem
 * @returns Dados, estado de carregamento e erro
 */
export function useListItems(options: ListItemsOptions = {}) {
  // Usa o hook de consulta do Core para aproveitar cache e tratamento de erros
  const {
    data: items,
    isLoading: loading,
    error,
    refetch
  } = useQuery<Item[]>(
    ['items', options], // chave da consulta para cache
    (client) => fetchItems(client, options)
  );
  
  return {
    items: items || [],
    loading,
    error: error ? String(error) : null,
    refetch
  };
} 