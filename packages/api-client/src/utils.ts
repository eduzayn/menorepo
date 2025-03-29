import { ApiError } from './types';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '@edunexia/utils';

/**
 * Trata erros da API de forma padronizada
 * @param error Erro original
 * @param defaultMessage Mensagem padrão se o erro não tiver uma mensagem
 * @returns Mensagem de erro formatada para exibição
 */
export function handleApiError(error: unknown, defaultMessage = 'Ocorreu um erro inesperado'): string {
  if (error) {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    if ((error as ApiError)?.message) {
      return (error as ApiError).message;
    }
    
    if ((error as any)?.error?.message) {
      return (error as any).error.message;
    }
    
    if ((error as any)?.data?.error) {
      return (error as any).data.error;
    }
  }
  
  return defaultMessage;
}

/**
 * Formata datas para exibição no formato BR
 * @param date Data a ser formatada
 * @returns String formatada
 * @deprecated Use formatDate de '@edunexia/utils'
 */
export function formatDate(date: Date | string): string {
  return formatDateUtil(date);
}

/**
 * Formata valores monetários no padrão R$
 * @param value Valor a ser formatado
 * @returns String formatada
 * @deprecated Use formatCurrency de '@edunexia/utils'
 */
export function formatCurrency(value: number): string {
  return formatCurrencyUtil(value);
}

/**
 * Gera um ID único para uso temporário (não use como chave permanente)
 * @returns String com ID único
 * @deprecated Use generateId de '@edunexia/utils'
 */
export function generateTempId(): string {
  return Math.random().toString(36).substr(2, 9);
} 