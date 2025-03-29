import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import * as SitePageService from '../services/site-pages';
/**
 * Hook para buscar uma página pelo slug
 */
export function usePageBySlug(slug) {
    const { client } = useApi();
    return useQuery({
        queryKey: ['site-page', slug],
        queryFn: async () => {
            const { page, error } = await SitePageService.getPageBySlug(client, slug);
            if (error)
                throw error;
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
            if (error)
                throw error;
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
            if (error)
                throw error;
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
        mutationFn: async (data) => {
            const { page, error } = await SitePageService.createPage(client, data);
            if (error)
                throw error;
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
        mutationFn: async ({ id, data }) => {
            const { success, error } = await SitePageService.updatePage(client, id, data);
            if (error)
                throw error;
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
        mutationFn: async (id) => {
            const { success, error } = await SitePageService.deletePage(client, id);
            if (error)
                throw error;
            return success;
        },
        onSuccess: () => {
            // Invalidar queries relevantes
            queryClient.invalidateQueries({ queryKey: ['site-pages'] });
        },
    });
}
