/**
 * Utilitários de formatação para o módulo portal-do-aluno
 * ATENÇÃO: Este arquivo está sendo mantido para compatibilidade.
 * Para novas implementações, utilize as funções de @edunexia/utils diretamente.
 */

import {
  formatCurrency as formatCurrencyUtil,
  formatDate as formatDateUtil,
  formatDateTime as formatDateTimeUtil,
  formatCPF as formatCPFUtil,
  formatName as formatNameUtil,
  formatPhone as formatPhoneUtil,
  formatPercentage as formatPercentageUtil,
  truncateText as truncateTextUtil
} from '@edunexia/utils';

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
 * Formata uma data incluindo hora (DD/MM/YYYY HH:MM)
 * @param date Data a ser formatada
 * @returns Data e hora formatadas
 * @deprecated Use formatDateTime de '@edunexia/utils'
 */
export function formatDateTime(date: Date | string): string {
  return formatDateTimeUtil(date);
}

/**
 * Formata o nome do aluno para exibição (ex: Nome Sobrenome)
 * @param nome Nome completo
 * @returns Nome formatado para exibição
 * @deprecated Use formatName de '@edunexia/utils'
 */
export function formatNomeAluno(nome: string): string {
  return formatNameUtil(nome);
}

/**
 * Formata uma nota para exibição (ex: 8.5 -> 8,5)
 * @param nota Nota a ser formatada
 * @returns Nota formatada
 */
export function formatNota(nota: number): string {
  return nota.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/**
 * Formata um número como moeda (BRL)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda brasileira
 * @deprecated Use formatCurrency de '@edunexia/utils'
 */
export const formatCurrency = (value: number): string => {
  return formatCurrencyUtil(value);
};

/**
 * Formata um nome completo (nome + sobrenome)
 * @param fullName Nome completo
 * @returns Nome formatado para exibição
 * @deprecated Use formatName de '@edunexia/utils'
 */
export const formatName = (fullName: string): string => {
  return formatNameUtil(fullName);
};

/**
 * Formata uma porcentagem
 * @param value Valor a ser formatado (por exemplo: 0.75 para 75%)
 * @param decimals Número de casas decimais
 * @returns String formatada como porcentagem
 * @deprecated Use formatPercentage de '@edunexia/utils'
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return formatPercentageUtil(value, decimals);
};

/**
 * Formata um número de telefone brasileiro
 * @param phone Número de telefone (apenas dígitos)
 * @returns String formatada como telefone brasileiro
 * @deprecated Use formatPhone de '@edunexia/utils'
 */
export const formatPhone = (phone: string): string => {
  return formatPhoneUtil(phone);
};

/**
 * Formata um número de CPF
 * @param cpf Número de CPF (apenas dígitos)
 * @returns String formatada como CPF
 * @deprecated Use formatCPF de '@edunexia/utils'
 */
export const formatCPF = (cpf: string): string => {
  return formatCPFUtil(cpf);
};

/**
 * Trunca um texto longo e adiciona reticências se necessário
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo antes de truncar
 * @returns Texto truncado com reticências se necessário
 * @deprecated Use truncateText de '@edunexia/utils'
 */
export const truncateText = (text: string, maxLength: number): string => {
  return truncateTextUtil(text, maxLength);
};

/**
 * Trunca um texto longo adicionando reticências
 * @param texto Texto a ser truncado
 * @param tamanhoMaximo Tamanho máximo do texto
 * @returns Texto truncado
 * @deprecated Use truncateText de '@edunexia/utils'
 */
export function truncarTexto(texto: string, tamanhoMaximo: number): string {
  return truncateTextUtil(texto, tamanhoMaximo);
} 