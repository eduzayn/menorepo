import { useQuery as useReactQuery } from '@tanstack/react-query';
import { useApi } from './use-api';
/**
 * Hook personalizado para consultas usando React Query
 * @param queryKey Chave para cache e invalidação
 * @param queryFn Função que realiza a consulta
 * @param options Opções adicionais para useQuery
 * @returns Resultado da consulta
 */
export function useQuery(queryKey, queryFn, options) {
    const { client, isLoading: isApiLoading } = useApi();
    return useReactQuery(queryKey, () => queryFn(client), {
        // Não executa a consulta se a API ainda estiver carregando
        enabled: options?.enabled !== false && !isApiLoading,
        // Opções padrão que podem ser sobrescritas
        refetchOnWindowFocus: false,
        retry: 1,
        ...options
    });
}
/**
 * Hook para carregar dados paginados
 * @param queryKey Chave para cache e invalidação
 * @param queryFn Função que realiza a consulta
 * @param page Página atual
 * @param limit Limite de itens por página
 * @param options Opções adicionais
 * @returns Resultado da consulta
 */
export function usePaginatedQuery(queryKey, queryFn, page, limit, options) {
    const { client, isLoading: isApiLoading } = useApi();
    return useReactQuery([...queryKey, page, limit], () => queryFn(client, page, limit), {
        // Atualiza a consulta quando a página ou limite mudar
        keepPreviousData: true,
        // Não executa a consulta se a API ainda estiver carregando
        enabled: options?.enabled !== false && !isApiLoading,
        // Opções padrão que podem ser sobrescritas
        refetchOnWindowFocus: false,
        retry: 1,
        ...options
    });
}
/**
 * Hook para buscar um item por ID
 * @param resource Nome do recurso
 * @param id ID do item (se undefined, não busca)
 * @param queryFn Função que realiza a consulta
 * @param options Opções adicionais
 * @returns Resultado da consulta
 */
export function useQueryById(resource, id, queryFn, options) {
    const { client, isLoading: isApiLoading } = useApi();
    return useReactQuery([resource, id], () => {
        if (!id) {
            throw new Error(`ID é obrigatório para buscar ${resource}`);
        }
        return queryFn(client, id);
    }, {
        // Não executa a consulta se não houver ID ou a API estiver carregando
        enabled: options?.enabled !== false && !!id && !isApiLoading,
        // Opções padrão que podem ser sobrescritas
        refetchOnWindowFocus: false,
        retry: 1,
        ...options
    });
}
