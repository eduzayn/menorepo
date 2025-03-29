/**
 * Funções utilitárias para formatação de valores
 * ATENÇÃO: Este arquivo está sendo mantido para compatibilidade.
 * Para novas implementações, utilize as funções de @edunexia/utils diretamente.
 */

import {
  formatCurrency as formatCurrencyUtil,
  formatDate as formatDateUtil,
  formatCPF as formatCPFUtil,
  formatPhone as formatPhoneUtil
} from '@edunexia/utils';

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda brasileira
 * @deprecated Use formatCurrency de '@edunexia/utils'
 */
export const formatCurrency = (value: number): string => {
  return formatCurrencyUtil(value);
};

/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy)
 * @param date Data a ser formatada
 * @returns String formatada como data brasileira
 * @deprecated Use formatDate de '@edunexia/utils'
 */
export const formatDate = (date: string | Date): string => {
  return formatDateUtil(date);
};

/**
 * Formata um CPF (###.###.###-##)
 * @param cpf CPF a ser formatado
 * @returns String formatada como CPF
 * @deprecated Use formatCPF de '@edunexia/utils'
 */
export const formatCPF = (cpf: string): string => {
  return formatCPFUtil(cpf);
};

/**
 * Formata um telefone ((##) #####-####)
 * @param phone Telefone a ser formatado
 * @returns String formatada como telefone
 * @deprecated Use formatPhone de '@edunexia/utils'
 */
export const formatPhone = (phone: string): string => {
  return formatPhoneUtil(phone);
}; 