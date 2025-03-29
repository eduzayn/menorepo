import * as BlogService from '../services/blog-service';
import { SiteBlogPost, SiteBlogCategory, SiteBlogAuthor } from '@edunexia/database-schema/src/site-edunexia';
/**
 * Hook para buscar um post pelo slug
 */
export declare function useBlogPostBySlug(slug: string): import("@tanstack/react-query").UseQueryResult<SiteBlogPost | null, Error>;
/**
 * Hook para listar posts publicados (paginados e com filtro opcional de categoria)
 */
export declare function usePublishedBlogPosts(options?: {
    limit?: number;
    page?: number;
    categoryId?: string;
}): import("@tanstack/react-query").UseQueryResult<{
    posts: SiteBlogPost[];
    pagination: {
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}, Error>;
/**
 * Hook para listar todos os posts (admin)
 */
export declare function useAllBlogPosts(): import("@tanstack/react-query").UseQueryResult<SiteBlogPost[], Error>;
/**
 * Hook para criar um novo post
 */
export declare function useCreateBlogPost(): import("@tanstack/react-query").UseMutationResult<SiteBlogPost | null, Error, BlogService.BlogPostInput, unknown>;
/**
 * Hook para atualizar um post
 */
export declare function useUpdateBlogPost(): import("@tanstack/react-query").UseMutationResult<boolean, Error, {
    id: string;
    data: Partial<BlogService.BlogPostInput>;
}, unknown>;
/**
 * Hook para deletar um post
 */
export declare function useDeleteBlogPost(): import("@tanstack/react-query").UseMutationResult<boolean, Error, string, unknown>;
/**
 * Hook para listar todas as categorias
 */
export declare function useBlogCategories(): import("@tanstack/react-query").UseQueryResult<SiteBlogCategory[], Error>;
/**
 * Hook para buscar uma categoria pelo slug
 */
export declare function useBlogCategoryBySlug(slug: string): import("@tanstack/react-query").UseQueryResult<SiteBlogCategory | null, Error>;
/**
 * Hook para criar uma categoria
 */
export declare function useCreateBlogCategory(): import("@tanstack/react-query").UseMutationResult<SiteBlogCategory | null, Error, BlogService.BlogCategoryInput, unknown>;
/**
 * Hook para listar todos os autores
 */
export declare function useBlogAuthors(): import("@tanstack/react-query").UseQueryResult<SiteBlogAuthor[], Error>;
/**
 * Hook para buscar um autor pelo ID
 */
export declare function useBlogAuthorById(id: string): import("@tanstack/react-query").UseQueryResult<SiteBlogAuthor | null, Error>;
/**
 * Hook para criar um autor
 */
export declare function useCreateBlogAuthor(): import("@tanstack/react-query").UseMutationResult<SiteBlogAuthor | null, Error, BlogService.BlogAuthorInput, unknown>;
//# sourceMappingURL=useBlog.d.ts.map