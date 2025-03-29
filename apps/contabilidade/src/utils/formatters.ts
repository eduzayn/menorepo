/**
 * Utilitários para formatação de valores no módulo contábil
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param valor - Valor a ser formatado
 * @param showSymbol - Se deve mostrar o símbolo da moeda (R$)
 * @returns String formatada
 */
export function formatCurrency(valor: number | string, showSymbol = true): string {
  const numericValue = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (isNaN(numericValue)) {
    return '-';
  }
  
  const options: Intl.NumberFormatOptions = {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  
  return numericValue.toLocaleString('pt-BR', options);
}

/**
 * Formata uma data no padrão brasileiro
 * @param data - Data a ser formatada (string ISO, Date ou timestamp)
 * @param incluirHora - Se deve incluir a hora na formatação
 * @returns String formatada (dd/mm/yyyy ou dd/mm/yyyy hh:mm)
 */
export function formatDate(data: Date | string | number, incluirHora = false): string {
  if (!data) return '-';
  
  try {
    const dataObj = data instanceof Date ? data : new Date(data);
    
    if (isNaN(dataObj.getTime())) {
      return '-';
    }
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(incluirHora ? { hour: '2-digit', minute: '2-digit' } : {})
    };
    
    return dataObj.toLocaleString('pt-BR', options);
  } catch (error) {
    return '-';
  }
}

/**
 * Formata um número com separador de milhares e decimais no padrão brasileiro
 * @param valor - Valor a ser formatado
 * @param decimais - Quantidade de casas decimais
 * @returns String formatada
 */
export function formatNumber(valor: number | string, decimais = 2): string {
  const numericValue = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (isNaN(numericValue)) {
    return '-';
  }
  
  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais
  });
}

/**
 * Formata um CNPJ (00.000.000/0000-00)
 * @param cnpj - CNPJ a ser formatado
 * @returns String formatada
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '-';
  
  // Remove caracteres não numéricos
  const numericOnly = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (numericOnly.length !== 14) {
    return cnpj;
  }
  
  // Formato: 00.000.000/0000-00
  return numericOnly.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Formata um CPF (000.000.000-00)
 * @param cpf - CPF a ser formatado
 * @returns String formatada
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '-';
  
  // Remove caracteres não numéricos
  const numericOnly = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numericOnly.length !== 11) {
    return cpf;
  }
  
  // Formato: 000.000.000-00
  return numericOnly.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
}

/**
 * Formata um número de processo contábil
 * @param numero - Número do processo
 * @returns String formatada
 */
export function formatProcessoContabil(numero: string | number): string {
  if (!numero) return '-';
  
  const str = numero.toString().padStart(10, '0');
  
  // Formato: 0000000-00.0000
  return `${str.slice(0, 7)}-${str.slice(7, 9)}.${str.slice(9)}`;
}

/**
 * Formata percentual no padrão brasileiro
 * @param valor - Valor a ser formatado
 * @returns String formatada com símbolo de percentual
 */
export function formatPercentual(valor: number | string): string {
  const numericValue = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (isNaN(numericValue)) {
    return '-';
  }
  
  return numericValue.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
} 