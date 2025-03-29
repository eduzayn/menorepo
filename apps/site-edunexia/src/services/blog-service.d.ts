import { ApiClient } from '@edunexia/api-client/src/client';
import { SiteBlogPost, SiteBlogCategory, SiteBlogAuthor } from '@edunexia/database-schema/src/site-edunexia';
import { ApiError } from '@edunexia/api-client/src/types';
/**
 * Dados para criar ou atualizar um post
 */
export interface BlogPostInput {
    title: string;
    slug: string;
    excerpt?: string | null;
    content: Record<string, any>;
    featured_image_url?: string | null;
    author_id: string;
    category_ids: string[];
    status?: 'published' | 'draft' | 'archived';
    meta_description?: string | null;
    meta_keywords?: string | null;
    published_at?: string | null;
}
/**
 * Dados para criar ou atualizar uma categoria
 */
export interface BlogCategoryInput {
    name: string;
    slug: string;
    description?: string | null;
}
/**
 * Dados para criar ou atualizar um autor
 */
export interface BlogAuthorInput {
    name: string;
    bio?: string | null;
    avatar_url?: string | null;
    email?: string | null;
    social_links?: Record<string, string> | null;
}
/**
 * Busca um post pelo slug
 * @param client Cliente da API
 * @param slug Slug do post
 * @returns Post encontrado ou erro
 */
export declare function getBlogPostBySlug(client: ApiClient, slug: string): Promise<{
    post: SiteBlogPost | null;
    error: ApiError | null;
}>;
/**
 * Busca os posts publicados (com paginação)
 * @param client Cliente da API
 * @param limit Número máximo de posts por página
 * @param offset Posição inicial para paginação
 * @param categoryId Opcional - Filtrar por categoria
 * @returns Lista de posts ou erro
 */
export declare function getPublishedBlogPosts(client: ApiClient, limit?: number, offset?: number, categoryId?: string): Promise<{
    posts: SiteBlogPost[];
    total: number;
    error: ApiError | null;
}>;
/**
 * Busca todos os posts (admin)
 * @param client Cliente da API
 * @returns Lista de posts ou erro
 */
export declare function getAllBlogPosts(client: ApiClient): Promise<{
    posts: SiteBlogPost[];
    error: ApiError | null;
}>;
/**
 * Cria um novo post
 * @param client Cliente da API
 * @param data Dados do post
 * @returns Post criado ou erro
 */
export declare function createBlogPost(client: ApiClient, data: BlogPostInput): Promise<{
    post: SiteBlogPost | null;
    error: ApiError | null;
}>;
/**
 * Atualiza um post existente
 * @param client Cliente da API
 * @param id ID do post
 * @param data Dados a serem atualizados
 * @returns Sucesso ou erro
 */
export declare function updateBlogPost(client: ApiClient, id: string, data: Partial<BlogPostInput>): Promise<{
    success: boolean;
    error: ApiError | null;
}>;
/**
 * Remove um post
 * @param client Cliente da API
 * @param id ID do post
 * @returns Sucesso ou erro
 */
export declare function deleteBlogPost(client: ApiClient, id: string): Promise<{
    success: boolean;
    error: ApiError | null;
}>;
/**
 * Busca uma categoria pelo slug
 * @param client Cliente da API
 * @param slug Slug da categoria
 * @returns Categoria encontrada ou erro
 */
export declare function getBlogCategoryBySlug(client: ApiClient, slug: string): Promise<{
    category: SiteBlogCategory | null;
    error: ApiError | null;
}>;
/**
 * Busca todas as categorias
 * @param client Cliente da API
 * @returns Lista de categorias ou erro
 */
export declare function getAllBlogCategories(client: ApiClient): Promise<{
    categories: SiteBlogCategory[];
    error: ApiError | null;
}>;
/**
 * Cria uma nova categoria
 * @param client Cliente da API
 * @param data Dados da categoria
 * @returns Categoria criada ou erro
 */
export declare function createBlogCategory(client: ApiClient, data: BlogCategoryInput): Promise<{
    category: SiteBlogCategory | null;
    error: ApiError | null;
}>;
/**
 * Busca um autor pelo ID
 * @param client Cliente da API
 * @param id ID do autor
 * @returns Autor encontrado ou erro
 */
export declare function getBlogAuthorById(client: ApiClient, id: string): Promise<{
    author: SiteBlogAuthor | null;
    error: ApiError | null;
}>;
/**
 * Busca todos os autores
 * @param client Cliente da API
 * @returns Lista de autores ou erro
 */
export declare function getAllBlogAuthors(client: ApiClient): Promise<{
    authors: SiteBlogAuthor[];
    error: ApiError | null;
}>;
/**
 * Cria um novo autor
 * @param client Cliente da API
 * @param data Dados do autor
 * @returns Autor criado ou erro
 */
export declare function createBlogAuthor(client: ApiClient, data: BlogAuthorInput): Promise<{
    author: SiteBlogAuthor | null;
    error: ApiError | null;
}>;
//# sourceMappingURL=blog-service.d.ts.map