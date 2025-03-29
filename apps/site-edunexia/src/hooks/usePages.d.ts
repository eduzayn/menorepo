import * as SitePageService from '../services/site-pages';
import { PageInput } from '../services/site-pages';
import { SitePage } from '@edunexia/database-schema/src/site-edunexia';
/**
 * Hook para buscar uma página pelo slug
 */
export declare function usePageBySlug(slug: string): import("@tanstack/react-query").UseQueryResult<SitePage | null, Error>;
/**
 * Hook para buscar todas as páginas publicadas
 */
export declare function usePublishedPages(): import("@tanstack/react-query").UseQueryResult<SitePage[], Error>;
/**
 * Hook para buscar todas as páginas (admin)
 */
export declare function useAllPages(): import("@tanstack/react-query").UseQueryResult<SitePage[], Error>;
/**
 * Hook para criar uma nova página
 */
export declare function useCreatePage(): import("@tanstack/react-query").UseMutationResult<SitePage | null, Error, SitePageService.PageInput, unknown>;
/**
 * Hook para atualizar uma página existente
 */
export declare function useUpdatePage(): import("@tanstack/react-query").UseMutationResult<boolean, Error, {
    id: string;
    data: Partial<PageInput>;
}, unknown>;
/**
 * Hook para excluir uma página
 */
export declare function useDeletePage(): import("@tanstack/react-query").UseMutationResult<boolean, Error, string, unknown>;
declare module '..' {
    interface Database {
        public: {
            Tables: {
                site_pages: {};
            };
        };
    }
}
export type { SitePage };
//# sourceMappingURL=usePages.d.ts.map