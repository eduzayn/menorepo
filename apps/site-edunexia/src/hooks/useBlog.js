import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import * as BlogService from '../services/blog-service';
// ===== POSTS =====
/**
 * Hook para buscar um post pelo slug
 */
export function useBlogPostBySlug(slug) {
    const { client } = useApi();
    return useQuery({
        queryKey: ['blog-post', slug],
        queryFn: async () => {
            const { post, error } = await BlogService.getBlogPostBySlug(client, slug);
            if (error)
                throw error;
            return post;
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}
/**
 * Hook para listar posts publicados (paginados e com filtro opcional de categoria)
 */
export function usePublishedBlogPosts(options = {}) {
    const { limit = 10, page = 1, categoryId } = options;
    const offset = (page - 1) * limit;
    const { client } = useApi();
    return useQuery({
        queryKey: ['blog-posts', 'published', { limit, page, categoryId }],
        queryFn: async () => {
            const { posts, total, error } = await BlogService.getPublishedBlogPosts(client, limit, offset, categoryId);
            if (error)
                throw error;
            return {
                posts,
                pagination: {
                    total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    limit
                }
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}
/**
 * Hook para listar todos os posts (admin)
 */
export function useAllBlogPosts() {
    const { client } = useApi();
    return useQuery({
        queryKey: ['blog-posts', 'all'],
        queryFn: async () => {
            const { posts, error } = await BlogService.getAllBlogPosts(client);
            if (error)
                throw error;
            return posts;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}
/**
 * Hook para criar um novo post
 */
export function useCreateBlogPost() {
    const { client } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { post, error } = await BlogService.createBlogPost(client, data);
            if (error)
                throw error;
            return post;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
        }
    });
}
/**
 * Hook para atualizar um post
 */
export function useUpdateBlogPost() {
    const { client } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const { success, error } = await BlogService.updateBlogPost(client, id, data);
            if (error)
                throw error;
            return success;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
            queryClient.invalidateQueries({ queryKey: ['blog-post', variables.id] });
        }
    });
}
/**
 * Hook para deletar um post
 */
export function useDeleteBlogPost() {
    const { client } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { success, error } = await BlogService.deleteBlogPost(client, id);
            if (error)
                throw error;
            return success;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
        }
    });
}
// ===== CATEGORIAS =====
/**
 * Hook para listar todas as categorias
 */
export function useBlogCategories() {
    const { client } = useApi();
    return useQuery({
        queryKey: ['blog-categories'],
        queryFn: async () => {
            const { categories, error } = await BlogService.getAllBlogCategories(client);
            if (error)
                throw error;
            return categories;
        },
        staleTime: 10 * 60 * 1000, // 10 minutos (categorias mudam pouco)
    });
}
/**
 * Hook para buscar uma categoria pelo slug
 */
export function useBlogCategoryBySlug(slug) {
    const { client } = useApi();
    return useQuery({
        queryKey: ['blog-category', slug],
        queryFn: async () => {
            const { category, error } = await BlogService.getBlogCategoryBySlug(client, slug);
            if (error)
                throw error;
            return category;
        },
        enabled: !!slug,
        staleTime: 10 * 60 * 1000, // 10 minutos
    });
}
/**
 * Hook para criar uma categoria
 */
export function useCreateBlogCategory() {
    const { client } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { category, error } = await BlogService.createBlogCategory(client, data);
            if (error)
                throw error;
            return category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
        }
    });
}
// ===== AUTORES =====
/**
 * Hook para listar todos os autores
 */
export function useBlogAuthors() {
    const { client } = useApi();
    return useQuery({
        queryKey: ['blog-authors'],
        queryFn: async () => {
            const { authors, error } = await BlogService.getAllBlogAuthors(client);
            if (error)
                throw error;
            return authors;
        },
        staleTime: 10 * 60 * 1000, // 10 minutos (autores mudam pouco)
    });
}
/**
 * Hook para buscar um autor pelo ID
 */
export function useBlogAuthorById(id) {
    const { client } = useApi();
    return useQuery({
        queryKey: ['blog-author', id],
        queryFn: async () => {
            const { author, error } = await BlogService.getBlogAuthorById(client, id);
            if (error)
                throw error;
            return author;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}
/**
 * Hook para criar um autor
 */
export function useCreateBlogAuthor() {
    const { client } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const { author, error } = await BlogService.createBlogAuthor(client, data);
            if (error)
                throw error;
            return author;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-authors'] });
        }
    });
}
