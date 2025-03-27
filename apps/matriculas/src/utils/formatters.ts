/**
 * Funções utilitárias para formatação de valores
 */

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy)
 * @param date Data a ser formatada
 * @returns String formatada como data brasileira
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
};

/**
 * Formata um CPF (###.###.###-##)
 * @param cpf CPF a ser formatado
 * @returns String formatada como CPF
 */
export const formatCPF = (cpf: string): string => {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length !== 11) {
    return cpf;
  }
  
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata um telefone ((##) #####-####)
 * @param phone Telefone a ser formatado
 * @returns String formatada como telefone
 */
export const formatPhone = (phone: string): string => {
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}; 