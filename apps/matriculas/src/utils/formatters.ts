/**
 * Funções utilitárias para formatação de valores
 * ATENÇÃO: Este arquivo está sendo mantido para compatibilidade.
 * Para novas implementações, utilize as funções de @edunexia/utils diretamente.
 */

// Importar as funções do pacote utils
// As funções abaixo serão disponibilizadas no escopo compartilhado
// quando o pacote @edunexia/utils estiver pronto

/**
 * Formata uma data para o formato DD/MM/YYYY
 * @param dateString String ou Date a ser formatada
 * @returns Data formatada no padrão brasileiro
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns Valor formatado como moeda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata um número de CPF (XXX.XXX.XXX-XX)
 * @param cpf String contendo o CPF
 * @returns CPF formatado
 */
export function formatCPF(cpf: string): string {
  const cpfClean = cpf.replace(/\D/g, '');
  
  if (cpfClean.length !== 11) {
    return cpf;
  }
  
  return cpfClean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um número de telefone (XX) XXXXX-XXXX
 * @param telefone String contendo o telefone
 * @returns Telefone formatado
 */
export function formatTelefone(telefone: string): string {
  const telClean = telefone.replace(/\D/g, '');
  
  if (telClean.length === 11) {
    return telClean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telClean.length === 10) {
    return telClean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
}

/**
 * Formata um valor percentual
 * @param valor Número a ser formatado como percentual
 * @param casasDecimais Número de casas decimais (padrão: 2)
 * @returns Valor formatado como percentual
 */
export function formatPercentual(valor: number, casasDecimais = 2): string {
  return `${valor.toFixed(casasDecimais)}%`;
}

/**
 * Trunca um texto se ele for maior que o comprimento máximo
 * @param texto Texto a ser truncado
 * @param tamanhoMaximo Comprimento máximo do texto
 * @returns Texto truncado com "..." ao final se necessário
 */
export function truncarTexto(texto: string, tamanhoMaximo: number): string {
  if (texto.length <= tamanhoMaximo) {
    return texto;
  }
  
  return texto.substring(0, tamanhoMaximo) + '...';
}

/**
 * Formata um telefone ((##) #####-####)
 * @param phone Telefone a ser formatado
 * @returns String formatada como telefone
 */
export function formatPhone(phone: string): string {
  const telClean = phone.replace(/\D/g, '');
  
  if (telClean.length === 11) {
    return telClean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telClean.length === 10) {
    return telClean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
} 