/**
 * Utilitários de formatação para o módulo portal-do-aluno
 */

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
 * Formata uma data incluindo hora (DD/MM/YYYY HH:MM)
 * @param date Data a ser formatada
 * @returns Data e hora formatadas
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Formata o nome do aluno para exibição (ex: Nome Sobrenome)
 * @param nome Nome completo
 * @returns Nome formatado para exibição
 */
export function formatNomeAluno(nome: string): string {
  if (!nome) return '';
  
  // Divide o nome em partes
  const partesNome = nome.trim().split(' ');
  
  // Se tiver apenas uma parte, retorna ela
  if (partesNome.length === 1) return partesNome[0];
  
  // Se tiver duas partes, retorna as duas
  if (partesNome.length === 2) return nome;
  
  // Se tiver mais de duas partes, pega a primeira e a última
  return `${partesNome[0]} ${partesNome[partesNome.length - 1]}`;
}

/**
 * Formata uma nota para exibição (ex: 8.5 -> 8,5)
 * @param nota Nota a ser formatada
 * @returns Nota formatada
 */
export function formatNota(nota: number): string {
  return nota.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
} 