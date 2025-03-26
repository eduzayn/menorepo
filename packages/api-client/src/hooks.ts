import {
  useQuery as useReactQuery,
  useMutation as useReactMutation,
  useQueryClient as useReactQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryClient
} from '@tanstack/react-query';
import { useApi } from './context';
import { ApiError } from './types';

/**
 * Hook para busca de dados com cache e revalidação
 * Wrapper sobre o useQuery do react-query com integração ao nosso cliente de API
 */
export function useQuery<TData = unknown, TError = ApiError>(
  queryKey: unknown[],
  queryFn: (api: ReturnType<typeof useApi>['client']) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, unknown[]>, 'queryKey' | 'queryFn'>
) {
  const { client } = useApi();

  return useReactQuery<TData, TError, TData, unknown[]>({
    queryKey,
    queryFn: () => client.executeOperation(`query:${String(queryKey[0])}`, () => queryFn(client)),
    retry: (failureCount: number, error: unknown) => {
      // Por padrão, não tentamos novamente para erros específicos
      if ((error as ApiError)?.code === 'unauthorized') {
        return false;
      }
      
      // Limitamos a 2 tentativas para outros erros
      return failureCount < 2;
    },
    ...options
  });
}

/**
 * Hook para operações de mutação (create, update, delete)
 * Wrapper sobre o useMutation do react-query com integração ao nosso cliente de API
 */
export function useMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  mutationKey: string,
  mutationFn: (
    variables: TVariables,
    api: ReturnType<typeof useApi>['client']
  ) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  const { client } = useApi();

  return useReactMutation<TData, TError, TVariables>({
    mutationFn: (variables: TVariables) =>
      client.executeOperation(`mutation:${mutationKey}`, () => mutationFn(variables, client)),
    ...options
  });
}

/**
 * Hook para acessar o cliente de query
 * Permite invalidar caches, prefetch e outras operações avançadas
 */
export function useQueryClient(): QueryClient {
  return useReactQueryClient();
} 