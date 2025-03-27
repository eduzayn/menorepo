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

/**
 * Funções auxiliares para formatação de dados no Portal do Aluno
 */

/**
 * Formata um número como moeda (BRL)
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
 * Formata um nome completo (nome + sobrenome)
 * @param fullName Nome completo
 * @returns Nome formatado para exibição
 */
export const formatName = (fullName: string): string => {
  if (!fullName) return '';
  
  const parts = fullName.trim().split(' ');
  
  if (parts.length === 1) return parts[0];
  
  // Retorna o primeiro nome + último sobrenome
  return `${parts[0]} ${parts[parts.length - 1]}`;
};

/**
 * Formata uma porcentagem
 * @param value Valor a ser formatado (por exemplo: 0.75 para 75%)
 * @param decimals Número de casas decimais
 * @returns String formatada como porcentagem
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formata um número de telefone brasileiro
 * @param phone Número de telefone (apenas dígitos)
 * @returns String formatada como telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // Celular: (99) 99999-9999
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    // Fixo: (99) 9999-9999
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return cleaned;
};

/**
 * Formata um número de CPF
 * @param cpf Número de CPF (apenas dígitos)
 * @returns String formatada como CPF
 */
export const formatCPF = (cpf: string): string => {
  if (!cpf) return '';
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return cleaned;
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Trunca um texto longo e adiciona reticências se necessário
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo antes de truncar
 * @returns Texto truncado com reticências se necessário
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text || '';
  
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param valor O valor a ser formatado
 * @returns String formatada (ex: R$ 1.234,56)
 */
export function formatCurrency(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param data Data a ser formatada
 * @returns String formatada (ex: 31/12/2023)
 */
export function formatDate(data: Date | string): string {
  if (typeof data === 'string') {
    data = new Date(data);
  }
  
  return new Intl.DateTimeFormat('pt-BR').format(data);
}

/**
 * Formata uma data com hora para o formato brasileiro (DD/MM/YYYY HH:MM)
 * @param data Data a ser formatada
 * @returns String formatada (ex: 31/12/2023 23:59)
 */
export function formatDateTime(data: Date | string): string {
  if (typeof data === 'string') {
    data = new Date(data);
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data);
}

/**
 * Formata o nome do aluno para exibição
 * @param nome Nome completo do aluno
 * @returns Nome formatado (primeiro nome + último sobrenome)
 */
export function formatNomeAluno(nome: string): string {
  if (!nome) return '';
  
  const partesNome = nome.trim().split(' ');
  
  if (partesNome.length === 1) return partesNome[0];
  
  const primeiroNome = partesNome[0];
  const ultimoSobrenome = partesNome[partesNome.length - 1];
  
  return `${primeiroNome} ${ultimoSobrenome}`;
}

/**
 * Formata um CPF para exibição (###.###.###-##)
 * @param cpf CPF sem formatação
 * @returns CPF formatado
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  // Remove qualquer formatação existente
  cpf = cpf.replace(/\D/g, '');
  
  // Adiciona a formatação
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Trunca um texto longo adicionando reticências
 * @param texto Texto a ser truncado
 * @param tamanhoMaximo Tamanho máximo do texto
 * @returns Texto truncado
 */
export function truncarTexto(texto: string, tamanhoMaximo: number): string {
  if (!texto || texto.length <= tamanhoMaximo) return texto;
  
  return texto.substring(0, tamanhoMaximo) + '...';
} 