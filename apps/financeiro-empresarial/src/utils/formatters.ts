/**
 * Utilitários de formatação para o módulo financeiro-empresarial
 */

/**
 * Formata um valor para o formato monetário brasileiro (R$)
 * @param value Valor a ser formatado
 * @returns Valor formatado como moeda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param date Data a ser formatada
 * @returns Data formatada
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}

/**
 * Formata um número de documento (CPF/CNPJ)
 * @param document Número do documento
 * @returns Documento formatado
 */
export function formatDocument(document: string): string {
  // Remove caracteres não numéricos
  const cleanDoc = document.replace(/\D/g, '');
  
  // CPF: 000.000.000-00
  if (cleanDoc.length === 11) {
    return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // CNPJ: 00.000.000/0000-00
  if (cleanDoc.length === 14) {
    return cleanDoc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Retorna o valor original se não for CPF nem CNPJ
  return document;
} 