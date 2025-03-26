import { ApiClient } from '@edunexia/api-client';
import { ApiError } from '@edunexia/api-client/types';

/**
 * Interface para o item
 */
export interface Item {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

/**
 * Dados para criar ou atualizar um item
 */
export interface ItemInput {
  title: string;
  description: string;
  status?: 'active' | 'inactive';
}

/**
 * Busca um item por ID
 * @param client Cliente da API
 * @param id ID do item
 * @returns Item encontrado ou erro
 */
export async function getItemById(
  client: ApiClient,
  id: string
): Promise<{ item: Item | null; error: ApiError | null }> {
  try {
    const { data, error } = await client.from('items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { item: data as Item, error: null };
  } catch (error) {
    return {
      item: null,
      error: client.handleError(error, 'items.getItemById')
    };
  }
}

/**
 * Cria um novo item
 * @param client Cliente da API
 * @param data Dados do item
 * @returns Item criado ou erro
 */
export async function createItem(
  client: ApiClient,
  data: ItemInput
): Promise<{ item: Item | null; error: ApiError | null }> {
  try {
    const now = new Date().toISOString();
    
    const { data: item, error } = await client.from('items')
      .insert({
        ...data,
        status: data.status || 'active',
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { item: item as Item, error: null };
  } catch (error) {
    return {
      item: null,
      error: client.handleError(error, 'items.createItem')
    };
  }
}

/**
 * Atualiza um item existente
 * @param client Cliente da API
 * @param id ID do item
 * @param data Dados a serem atualizados
 * @returns Sucesso ou erro
 */
export async function updateItem(
  client: ApiClient,
  id: string,
  data: Partial<ItemInput>
): Promise<{ success: boolean; error: ApiError | null }> {
  try {
    const { error } = await client.from('items')
      .update({
        ...data,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'items.updateItem')
    };
  }
}

/**
 * Remove um item
 * @param client Cliente da API
 * @param id ID do item
 * @returns Sucesso ou erro
 */
export async function deleteItem(
  client: ApiClient,
  id: string
): Promise<{ success: boolean; error: ApiError | null }> {
  try {
    const { error } = await client.from('items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'items.deleteItem')
    };
  }
} 