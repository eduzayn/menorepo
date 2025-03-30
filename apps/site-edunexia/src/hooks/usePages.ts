import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { ApiError } from '@edunexia/api-client/src/types';
import * as SitePageService from '../services/site-pages';
import { PageInput } from '../services/site-pages';
import { SitePage } from '@edunexia/database-schema/src/site-edunexia';

/**
 * Hook para buscar uma página pelo slug
 */
export function usePageBySlug(slug: string) {
  const { client } = useApi();
  
  return useQuery({
    queryKey: ['site-page', slug],
    queryFn: async () => {
      const { page, error } = await SitePageService.getPageBySlug(client, slug);
      if (error) throw error;
      return page;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar todas as páginas publicadas
 */
export function usePublishedPages() {
  const { client } = useApi();
  
  return useQuery({
    queryKey: ['site-pages', 'published'],
    queryFn: async () => {
      const { pages, error } = await SitePageService.getPublishedPages(client);
      if (error) throw error;
      return pages;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar todas as páginas (admin)
 */
export function useAllPages() {
  const { client } = useApi();
  
  return useQuery({
    queryKey: ['site-pages', 'all'],
    queryFn: async () => {
      const { pages, error } = await SitePageService.getAllPages(client);
      if (error) throw error;
      return pages;
    }
  });
}

/**
 * Hook para criar uma nova página
 */
export function useCreatePage() {
  const queryClient = useQueryClient();
  const { client } = useApi();
  
  return useMutation({
    mutationFn: async (data: PageInput) => {
      const { page, error } = await SitePageService.createPage(client, data);
      if (error) throw error;
      return page;
    },
    onSuccess: () => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['site-pages'] });
    },
  });
}

/**
 * Hook para atualizar uma página existente
 */
export function useUpdatePage() {
  const queryClient = useQueryClient();
  const { client } = useApi();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PageInput> }) => {
      const { success, error } = await SitePageService.updatePage(client, id, data);
      if (error) throw error;
      return success;
    },
    onSuccess: (_data, variables) => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['site-pages'] });
      queryClient.invalidateQueries({ queryKey: ['site-page', variables.id] });
    },
  });
}

/**
 * Hook para excluir uma página
 */
export function useDeletePage() {
  const queryClient = useQueryClient();
  const { client } = useApi();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { success, error } = await SitePageService.deletePage(client, id);
      if (error) throw error;
      return success;
    },
    onSuccess: () => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['site-pages'] });
    },
  });
}

/**
 * Hook para buscar uma página pelo ID
 */
export function usePageById(id: string) {
  const { client } = useApi();
  
  return useQuery({
    queryKey: ['site-page', id],
    queryFn: async () => {
      // Como não temos um método específico, vamos buscar todas as páginas e filtrar
      const { pages, error } = await SitePageService.getAllPages(client);
      if (error) throw error;
      
      const page = pages.find(p => p.id === id);
      return page || null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Tipos...

// Declaração de módulo sem 'export' na interface
declare module '..' {
  interface Database {
    public: {
      Tables: {
        // Tabelas existentes...
        site_pages: { /* ... */ },
        // ...
      }
    }
  }
}

// Exportando apenas os tipos específicos, não Database
export type { SitePage }; 