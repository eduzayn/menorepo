/**
 * Utilitários de formatação para o módulo financeiro-empresarial
 * ATENÇÃO: Este arquivo está sendo mantido para compatibilidade.
 * Para novas implementações, utilize as funções de @edunexia/utils diretamente.
 */

import {
  formatCurrency as formatCurrencyUtil,
  formatDate as formatDateUtil,
  formatCPF,
  formatCNPJ
} from '@edunexia/utils';

/**
 * Formata um valor para o formato monetário brasileiro (R$)
 * @param value Valor a ser formatado
 * @returns Valor formatado como moeda
 * @deprecated Use formatCurrency de '@edunexia/utils'
 */
export function formatCurrency(value: number): string {
  return formatCurrencyUtil(value);
}

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param date Data a ser formatada
 * @returns Data formatada
 * @deprecated Use formatDate de '@edunexia/utils'
 */
export function formatDate(date: Date | string): string {
  return formatDateUtil(date);
}

/**
 * Formata um número de documento (CPF/CNPJ)
 * @param document Número do documento
 * @returns Documento formatado
 * @deprecated Use formatCPF ou formatCNPJ de '@edunexia/utils'
 */
export function formatDocument(document: string): string {
  // Remove caracteres não numéricos
  const cleanDoc = document.replace(/\D/g, '');
  
  // CPF: 000.000.000-00
  if (cleanDoc.length === 11) {
    return formatCPF(cleanDoc);
  }
  
  // CNPJ: 00.000.000/0000-00
  if (cleanDoc.length === 14) {
    return formatCNPJ(cleanDoc);
  }
  
  // Retorna o valor original se não for CPF nem CNPJ
  return document;
} 