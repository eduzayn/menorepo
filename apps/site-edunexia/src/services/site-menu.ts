import { ApiClient } from '@edunexia/api-client';
import { SiteMenuItem } from '@edunexia/database-schema/src/site-edunexia';
import { v4 as uuidv4 } from 'uuid';

export type MenuItemInput = Omit<SiteMenuItem, 'id' | 'created_at' | 'updated_at'>;
export type MenuItemUpdate = Partial<Omit<SiteMenuItem, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Obtém todos os itens de menu
 */
export async function getAllMenuItems(client: ApiClient) {
  try {
    const response = await client.from('site_menu_items')
      .select('*')
      .order('order_index', { ascending: true });
    
    return { items: response.data as SiteMenuItem[], error: null };
  } catch (error) {
    console.error('Erro ao obter itens de menu:', error);
    return { items: [], error };
  }
}

/**
 * Obtém um item de menu específico
 */
export async function getMenuItem(client: ApiClient, id: string) {
  try {
    const response = await client.from('site_menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    return { item: response.data as SiteMenuItem, error: null };
  } catch (error) {
    console.error('Erro ao obter item de menu:', error);
    return { item: null, error };
  }
}

/**
 * Cria um novo item de menu
 */
export async function createMenuItem(client: ApiClient, data: MenuItemInput) {
  try {
    const response = await client.from('site_menu_items')
      .insert(data)
      .select()
      .single();
    
    return { item: response.data as SiteMenuItem, error: null };
  } catch (error) {
    console.error('Erro ao criar item de menu:', error);
    return { item: null, error };
  }
}

/**
 * Atualiza um item de menu existente
 */
export async function updateMenuItem(client: ApiClient, id: string, data: MenuItemUpdate) {
  try {
    const response = await client.from('site_menu_items')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    return { item: response.data as SiteMenuItem, error: null };
  } catch (error) {
    console.error('Erro ao atualizar item de menu:', error);
    return { item: null, error };
  }
}

/**
 * Remove um item de menu
 */
export async function deleteMenuItem(client: ApiClient, id: string) {
  try {
    await client.from('site_menu_items')
      .delete()
      .eq('id', id);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao remover item de menu:', error);
    return { success: false, error };
  }
}

/**
 * Reordena itens de menu
 */
export async function reorderMenuItems(client: ApiClient, itemIds: string[]) {
  try {
    // Criar array de atualizações em lote
    const updates = itemIds.map((id, index) => ({
      id,
      order_index: index
    }));
    
    await client.from('site_menu_items')
      .upsert(updates);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao reordenar itens de menu:', error);
    return { success: false, error };
  }
}

// Dados mockados para desenvolvimento
export const MOCK_MENU_ITEMS: SiteMenuItem[] = [
  {
    id: '1',
    parent_id: null,
    title: 'Início',
    link: '/',
    order_index: 0,
    is_active: true,
    open_in_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    parent_id: null,
    title: 'Sobre',
    link: '/sobre',
    order_index: 1,
    is_active: true,
    open_in_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    parent_id: null,
    title: 'Blog',
    link: '/blog',
    order_index: 2,
    is_active: true,
    open_in_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    parent_id: null,
    title: 'Soluções',
    link: '#',
    order_index: 3,
    is_active: true,
    open_in_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    parent_id: '4',
    title: 'Sistema de Matrículas',
    link: '/pagina/sistema-matriculas',
    order_index: 0,
    is_active: true,
    open_in_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    parent_id: '4',
    title: 'Portal do Aluno',
    link: '/pagina/portal-aluno',
    order_index: 1,
    is_active: true,
    open_in_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    parent_id: '4',
    title: 'Gestão Financeira',
    link: '/pagina/gestao-financeira',
    order_index: 2,
    is_active: true,
    open_in_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    parent_id: null,
    title: 'Contato',
    link: '/contato',
    order_index: 4,
    is_active: true,
    open_in_new_tab: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * Funções para trabalhar com dados mockados durante desenvolvimento
 */
export function getMockMenuItems() {
  return [...MOCK_MENU_ITEMS];
}

export function getMockMenuItem(id: string) {
  return MOCK_MENU_ITEMS.find(item => item.id === id) || null;
}

export function createMockMenuItem(data: MenuItemInput) {
  const newItem: SiteMenuItem = {
    id: uuidv4(),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  MOCK_MENU_ITEMS.push(newItem);
  return newItem;
}

export function updateMockMenuItem(id: string, data: MenuItemUpdate) {
  const index = MOCK_MENU_ITEMS.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  MOCK_MENU_ITEMS[index] = {
    ...MOCK_MENU_ITEMS[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  
  return MOCK_MENU_ITEMS[index];
}

export function deleteMockMenuItem(id: string) {
  const index = MOCK_MENU_ITEMS.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  MOCK_MENU_ITEMS.splice(index, 1);
  return true;
}

export function reorderMockMenuItems(itemIds: string[]) {
  itemIds.forEach((id, index) => {
    const item = MOCK_MENU_ITEMS.find(item => item.id === id);
    if (item) {
      item.order_index = index;
      item.updated_at = new Date().toISOString();
    }
  });
  
  // Re-ordenar a lista baseado no novo order_index
  MOCK_MENU_ITEMS.sort((a, b) => a.order_index - b.order_index);
  return true;
} 