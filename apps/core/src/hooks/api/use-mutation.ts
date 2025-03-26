import { useMutation as useReactMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useApi } from './use-api';
import { ApiClient } from '@edunexia/api-client';
import { useAlerts } from '../../contexts/alert-context';

/**
 * Hook personalizado para mutações usando React Query
 * @param mutationFn Função que realiza a mutação
 * @param options Opções adicionais para useMutation
 * @returns Resultado da mutação
 */
export function useMutation<TData, TVariables, TError = unknown>(
  mutationFn: (client: ApiClient, variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, unknown>, 'mutationFn'>
): UseMutationResult<TData, TError, TVariables, unknown> {
  const { client } = useApi();
  
  return useReactMutation<TData, TError, TVariables>(
    (variables) => mutationFn(client, variables),
    options
  );
}

/**
 * Opções para o hook useMutationWithFeedback
 */
interface MutationWithFeedbackOptions<TData, TVariables, TError> 
  extends Omit<UseMutationOptions<TData, TError, TVariables, unknown>, 'mutationFn'> {
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
export function useMutationWithFeedback<TData, TVariables, TError = unknown>(
  mutationFn: (client: ApiClient, variables: TVariables) => Promise<TData>,
  options: MutationWithFeedbackOptions<TData, TVariables, TError> = {}
): UseMutationResult<TData, TError, TVariables, unknown> {
  const { client } = useApi();
  const { addAlert } = useAlerts();
  
  const {
    successMessage = 'Operação realizada com sucesso!',
    errorMessage = 'Ocorreu um erro ao realizar a operação.',
    successTitle = 'Sucesso',
    errorTitle = 'Erro',
    showSuccessFeedback = true,
    showErrorFeedback = true,
    onSuccess,
    onError,
    ...restOptions
  } = options;
  
  return useReactMutation<TData, TError, TVariables>(
    (variables) => mutationFn(client, variables),
    {
      onSuccess: (data, variables, context) => {
        // Mostra alerta de sucesso se configurado
        if (showSuccessFeedback) {
          addAlert({
            type: 'success',
            title: successTitle,
            message: successMessage
          });
        }
        
        // Chama o onSuccess original se fornecido
        if (onSuccess) {
          onSuccess(data, variables, context);
        }
      },
      onError: (error, variables, context) => {
        // Mostra alerta de erro se configurado
        if (showErrorFeedback) {
          addAlert({
            type: 'error',
            title: errorTitle,
            message: errorMessage
          });
        }
        
        // Chama o onError original se fornecido
        if (onError) {
          onError(error, variables, context);
        }
      },
      ...restOptions
    }
  );
} 