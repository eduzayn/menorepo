import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { ApiClient } from '@edunexia/api-client';
/**
 * Hook personalizado para mutações usando React Query
 * @param mutationFn Função que realiza a mutação
 * @param options Opções adicionais para useMutation
 * @returns Resultado da mutação
 */
export declare function useMutation<TData, TVariables, TError = unknown>(mutationFn: (client: ApiClient, variables: TVariables) => Promise<TData>, options?: Omit<UseMutationOptions<TData, TError, TVariables, unknown>, 'mutationFn'>): UseMutationResult<TData, TError, TVariables, unknown>;
/**
 * Opções para o hook useMutationWithFeedback
 */
interface MutationWithFeedbackOptions<TData, TVariables, TError> extends Omit<UseMutationOptions<TData, TError, TVariables, unknown>, 'mutationFn'> {
    /** Mensagem de sucesso */
    successMessage?: string;
    /** Mensagem de erro */
    errorMessage?: string;
    /** Título da mensagem de sucesso */
    successTitle?: string;
    /** Título da mensagem de erro */
    errorTitle?: string;
    /** Se deve mostrar feedback em caso de sucesso */
    showSuccessFeedback?: boolean;
    /** Se deve mostrar feedback em caso de erro */
    showErrorFeedback?: boolean;
}
/**
 * Hook para mutações com feedback automático
 * @param mutationFn Função que realiza a mutação
 * @param options Opções adicionais
 * @returns Resultado da mutação
 */
export declare function useMutationWithFeedback<TData, TVariables, TError = unknown>(mutationFn: (client: ApiClient, variables: TVariables) => Promise<TData>, options?: MutationWithFeedbackOptions<TData, TVariables, TError>): UseMutationResult<TData, TError, TVariables, unknown>;
export {};
//# sourceMappingURL=use-mutation.d.ts.map