var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useMutation as useReactMutation } from '@tanstack/react-query';
import { useApi } from './use-api';
import { useAlerts } from '../../contexts/alert-context';
/**
 * Hook personalizado para mutações usando React Query
 * @param mutationFn Função que realiza a mutação
 * @param options Opções adicionais para useMutation
 * @returns Resultado da mutação
 */
export function useMutation(mutationFn, options) {
    const { client } = useApi();
    return useReactMutation((variables) => mutationFn(client, variables), options);
}
/**
 * Hook para mutações com feedback automático
 * @param mutationFn Função que realiza a mutação
 * @param options Opções adicionais
 * @returns Resultado da mutação
 */
export function useMutationWithFeedback(mutationFn, options = {}) {
    const { client } = useApi();
    const { addAlert } = useAlerts();
    const { successMessage = 'Operação realizada com sucesso!', errorMessage = 'Ocorreu um erro ao realizar a operação.', successTitle = 'Sucesso', errorTitle = 'Erro', showSuccessFeedback = true, showErrorFeedback = true, onSuccess, onError } = options, restOptions = __rest(options, ["successMessage", "errorMessage", "successTitle", "errorTitle", "showSuccessFeedback", "showErrorFeedback", "onSuccess", "onError"]);
    return useReactMutation((variables) => mutationFn(client, variables), Object.assign({ onSuccess: (data, variables, context) => {
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
        }, onError: (error, variables, context) => {
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
        } }, restOptions));
}
