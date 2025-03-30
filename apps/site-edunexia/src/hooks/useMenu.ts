import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import * as MenuService from '../services/site-menu';
import { SiteMenuItem } from '@edunexia/database-schema/src/site-edunexia';
import { useMemo } from 'react';

/**
 * Hook para obter todos os itens de menu
 */
export function useAllMenuItems() {
  const { client } = useApi();
  
  return useQuery({
    queryKey: ['site', 'menu'],
    queryFn: async () => {
      // Em desenvolvimento, forçamos dados mockados para agilizar
      if (import.meta.env.DEV) {
        return MenuService.getMockMenuItems();
      }
      const { items, error } = await MenuService.getAllMenuItems(client);
      if (error) throw error;
      return items;
    },
    staleTime: 0, // Antes estava em 5 minutos (300000)
    refetchInterval: 5000, // Recarrega a cada 5 segundos em desenvolvimento
  });
}

/**
 * Hook para obter um item de menu específico
 */
export function useMenuItem(id: string) {
  const { client } = useApi();
  
  return useQuery({
    queryKey: ['menu-item', id],
    queryFn: async () => {
      // Durante o desenvolvimento, usar dados mockados
      if (process.env.NODE_ENV === 'development') {
        return MenuService.getMockMenuItem(id);
      }
      
      const { item, error } = await MenuService.getMenuItem(client, id);
      if (error) throw error;
      return item;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para criar um novo item de menu
 */
export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  const { client } = useApi();
  
  return useMutation({
    mutationFn: async (data: MenuService.MenuItemInput) => {
      // Durante o desenvolvimento, simular criação
      if (process.env.NODE_ENV === 'development') {
        return MenuService.createMockMenuItem(data);
      }
      
      const { item, error } = await MenuService.createMenuItem(client, data);
      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

/**
 * Hook para atualizar um item de menu
 */
export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  const { client } = useApi();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MenuService.MenuItemUpdate }) => {
      // Durante o desenvolvimento, simular atualização
      if (process.env.NODE_ENV === 'development') {
        return MenuService.updateMockMenuItem(id, data);
      }
      
      const { item, error } = await MenuService.updateMenuItem(client, id, data);
      if (error) throw error;
      return item;
    },
    onSuccess: (_data, variables) => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-item', variables.id] });
    },
  });
}

/**
 * Hook para excluir um item de menu
 */
export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  const { client } = useApi();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Durante o desenvolvimento, simular exclusão
      if (process.env.NODE_ENV === 'development') {
        return MenuService.deleteMockMenuItem(id);
      }
      
      const { success, error } = await MenuService.deleteMenuItem(client, id);
      if (error) throw error;
      return success;
    },
    onSuccess: () => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

/**
 * Hook para reordenar itens de menu
 */
export function useReorderMenuItems() {
  const queryClient = useQueryClient();
  const { client } = useApi();
  
  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      // Durante o desenvolvimento, simular reordenação
      if (process.env.NODE_ENV === 'development') {
        return MenuService.reorderMockMenuItems(itemIds);
      }
      
      const { success, error } = await MenuService.reorderMenuItems(client, itemIds);
      if (error) throw error;
      return success;
    },
    onSuccess: () => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

/**
 * Transforma os itens de menu em uma estrutura hierárquica
 */
export function useMenuTree() {
  const menuQuery = useAllMenuItems();
  
  // Converter lista plana para estrutura de árvore
  const menuTree = useMemo(() => {
    if (!menuQuery.data) return [];
    
    const items = [...menuQuery.data];
    const tree: SiteMenuItem[] = [];
    const lookup: Record<string, SiteMenuItem & { children?: SiteMenuItem[] }> = {};
    
    // Primeiro passo: criar um lookup pela ID e adicionar lista de filhos
    items.forEach(item => {
      lookup[item.id] = { ...item, children: [] };
    });
    
    // Segundo passo: montar a árvore
    items.forEach(item => {
      if (item.parent_id === null) {
        // Item raiz, adicionar à árvore
        tree.push(lookup[item.id]);
      } else if (lookup[item.parent_id]) {
        // Item filho, adicionar ao pai
        lookup[item.parent_id].children?.push(lookup[item.id]);
      }
    });
    
    return tree;
  }, [menuQuery.data]);
  
  return {
    tree: menuTree,
    isLoading: menuQuery.isLoading,
    error: menuQuery.error
  };
}

/**
 * Obter apenas os itens de menu ativos para exibição no front-end
 */
export function useActiveMenuItems() {
  const menuQuery = useAllMenuItems();
  
  const activeMenuTree = useMemo(() => {
    if (!menuQuery.data) return [];
    
    // Filtrar apenas itens ativos
    const activeItems = menuQuery.data.filter(item => item.is_active);
    
    // Convertê-los para estrutura de árvore
    const tree: SiteMenuItem[] = [];
    const lookup: Record<string, SiteMenuItem & { children?: SiteMenuItem[] }> = {};
    
    // Criar lookup
    activeItems.forEach(item => {
      lookup[item.id] = { ...item, children: [] };
    });
    
    // Montar árvore
    activeItems.forEach(item => {
      if (item.parent_id === null) {
        // Item raiz
        tree.push(lookup[item.id]);
      } else if (lookup[item.parent_id]) {
        // Item filho
        lookup[item.parent_id].children?.push(lookup[item.id]);
      }
    });
    
    return tree;
  }, [menuQuery.data]);
  
  return {
    tree: activeMenuTree,
    isLoading: menuQuery.isLoading,
    error: menuQuery.error
  };
} 