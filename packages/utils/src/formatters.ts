/**
 * Funções de formatação centralizadas
 * 
 * Este arquivo contém todas as funções de formatação usadas na plataforma Edunéxia
 */

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda brasileira
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
 * @returns String formatada como data brasileira
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
}

/**
 * Formata uma data e hora para o formato brasileiro (DD/MM/YYYY HH:MM)
 * @param date Data a ser formatada
 * @returns String formatada como data e hora brasileira
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Formata um número para o formato brasileiro
 * @param value Valor a ser formatado
 * @returns String formatada como número brasileiro
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata um CPF para o formato brasileiro (XXX.XXX.XXX-XX)
 * @param cpf CPF a ser formatado (apenas dígitos)
 * @returns String formatada como CPF
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return cpf;
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CNPJ para o formato brasileiro (XX.XXX.XXX/XXXX-XX)
 * @param cnpj CNPJ a ser formatado (apenas dígitos)
 * @returns String formatada como CNPJ
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return cnpj;
  
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata um número de telefone para o formato brasileiro ((XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
 * @param phone Telefone a ser formatado (apenas dígitos)
 * @returns String formatada como telefone
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // Celular: (99) 99999-9999
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    // Fixo: (99) 9999-9999
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return cleaned;
}

/**
 * Formata um CEP para o formato brasileiro (XXXXX-XXX)
 * @param cep CEP a ser formatado (apenas dígitos)
 * @returns String formatada como CEP
 */
export function formatCEP(cep: string): string {
  if (!cep) return '';
  
  // Remove caracteres não numéricos
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length !== 8) return cep;
  
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata uma porcentagem para o formato brasileiro
 * @param value Valor a ser formatado (ex: 0.1 para 10%)
 * @param decimals Número de casas decimais
 * @returns String formatada como porcentagem
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Trunca um texto longo e adiciona reticências se necessário
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo antes de truncar
 * @returns Texto truncado com reticências se necessário
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  
  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Formata o nome completo para exibição (primeiro nome + último sobrenome)
 * @param fullName Nome completo
 * @returns Nome formatado para exibição
 */
export function formatName(fullName: string): string {
  if (!fullName) return '';
  
  const parts = fullName.trim().split(' ');
  
  if (parts.length === 1) return parts[0];
  
  // Retorna o primeiro nome + último sobrenome
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

/**
 * Formata o tamanho de um arquivo para exibição
 * @param bytes Tamanho em bytes
 * @param decimals Número de casas decimais
 * @returns Tamanho formatado (ex: 1.5 KB, 2.3 MB)
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Formata uma duração em minutos para horas e minutos
 * @param minutes Total de minutos
 * @returns String formatada (ex: 1h 30min)
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  
  return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
}

/**
 * Formata uma data relativa (quanto tempo se passou)
 * @param date Data a ser comparada
 * @returns String formatada (ex: há 2 dias, há 1 mês)
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return `há ${diffYears} ${diffYears === 1 ? 'ano' : 'anos'}`;
  }
  
  if (diffMonths > 0) {
    return `há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
  }
  
  if (diffDays > 0) {
    return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  }
  
  if (diffHours > 0) {
    return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  }
  
  if (diffMin > 0) {
    return `há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  }
  
  return 'agora mesmo';
} 