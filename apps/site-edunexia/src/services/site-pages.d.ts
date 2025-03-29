import { ApiClient } from '@edunexia/api-client/src/client';
import { SitePage } from '@edunexia/database-schema/src/site-edunexia';
import { ApiError } from '@edunexia/api-client/src/types';
/**
 * Dados para criar ou atualizar uma página
 */
export interface PageInput {
    slug: string;
    title: string;
    content: Record<string, any>;
    meta_description?: string | null;
    meta_keywords?: string | null;
    status?: 'published' | 'draft' | 'archived';
    featured_image_url?: string | null;
    published_at?: string | null;
}
/**
 * Busca uma página pelo slug
 * @param client Cliente da API
 * @param slug Slug da página
 * @returns Página encontrada ou erro
 */
export declare function getPageBySlug(client: ApiClient, slug: string): Promise<{
    page: SitePage | null;
    error: ApiError | null;
}>;
/**
 * Busca todas as páginas publicadas
 * @param client Cliente da API
 * @returns Lista de páginas ou erro
 */
export declare function getPublishedPages(client: ApiClient): Promise<{
    pages: SitePage[];
    error: ApiError | null;
}>;
/**
 * Busca todas as páginas (admin)
 * @param client Cliente da API
 * @returns Lista de páginas ou erro
 */
export declare function getAllPages(client: ApiClient): Promise<{
    pages: SitePage[];
    error: ApiError | null;
}>;
/**
 * Cria uma nova página
 * @param client Cliente da API
 * @param data Dados da página
 * @returns Página criada ou erro
 */
export declare function createPage(client: ApiClient, data: PageInput): Promise<{
    page: SitePage | null;
    error: ApiError | null;
}>;
/**
 * Atualiza uma página existente
 * @param client Cliente da API
 * @param id ID da página
 * @param data Dados a serem atualizados
 * @returns Sucesso ou erro
 */
export declare function updatePage(client: ApiClient, id: string, data: Partial<PageInput>): Promise<{
    success: boolean;
    error: ApiError | null;
}>;
/**
 * Remove uma página
 * @param client Cliente da API
 * @param id ID da página
 * @returns Sucesso ou erro
 */
export declare function deletePage(client: ApiClient, id: string): Promise<{
    success: boolean;
    error: ApiError | null;
}>;
//# sourceMappingURL=site-pages.d.ts.map