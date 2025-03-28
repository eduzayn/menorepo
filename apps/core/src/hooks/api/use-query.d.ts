import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { ApiClient } from '@edunexia/api-client';
/**
 * Hook personalizado para consultas usando React Query
 * @param queryKey Chave para cache e invalidação
 * @param queryFn Função que realiza a consulta
 * @param options Opções adicionais para useQuery
 * @returns Resultado da consulta
 */
export declare function useQuery<TData, TError = unknown>(queryKey: unknown[], queryFn: (client: ApiClient) => Promise<TData>, options?: Omit<UseQueryOptions<TData, TError, TData, unknown[]>, 'queryKey' | 'queryFn'>): UseQueryResult<TData, TError>;
/**
 * Hook para carregar dados paginados
 * @param queryKey Chave para cache e invalidação
 * @param queryFn Função que realiza a consulta
 * @param page Página atual
 * @param limit Limite de itens por página
 * @param options Opções adicionais
 * @returns Resultado da consulta
 */
export declare function usePaginatedQuery<TData, TError = unknown>(queryKey: unknown[], queryFn: (client: ApiClient, page: number, limit: number) => Promise<TData>, page: number, limit: number, options?: Omit<UseQueryOptions<TData, TError, TData, unknown[]>, 'queryKey' | 'queryFn'>): UseQueryResult<TData, TError>;
/**
 * Hook para buscar um item por ID
 * @param resource Nome do recurso
 * @param id ID do item (se undefined, não busca)
 * @param queryFn Função que realiza a consulta
 * @param options Opções adicionais
 * @returns Resultado da consulta
 */
export declare function useQueryById<TData, TError = unknown>(resource: string, id: string | undefined, queryFn: (client: ApiClient, id: string) => Promise<TData>, options?: Omit<UseQueryOptions<TData, TError, TData, unknown[]>, 'queryKey' | 'queryFn'>): UseQueryResult<TData, TError>;
//# sourceMappingURL=use-query.d.ts.map