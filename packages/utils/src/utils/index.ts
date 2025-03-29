import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Funções utilitárias gerais
 * 
 * Este arquivo contém funções utilitárias gerais usadas na plataforma Edunéxia
 */

/**
 * Combina classes CSS, otimizando classes do Tailwind
 * @param inputs Classes CSS a serem combinadas
 * @returns Classes CSS combinadas e otimizadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gera um ID único
 * @returns ID único baseado em timestamp e valores aleatórios
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Atrasa a execução por um determinado tempo
 * @param ms Tempo em milissegundos
 * @returns Promise que será resolvida após o tempo especificado
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cria um slug a partir de um texto
 * @param text Texto para criar o slug
 * @returns Slug normalizado (sem acentos, espaços ou caracteres especiais)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Obtem apenas as chaves do objeto que tenham valores não nulos
 * @param obj Objeto a ser filtrado
 * @returns Novo objeto apenas com valores não nulos
 */
export function removeNullValues<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Agrupa um array de objetos por uma propriedade
 * @param array Array a ser agrupado
 * @param key Propriedade a ser usada para agrupamento
 * @returns Objeto com arrays agrupados por propriedade
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Ordena um array de objetos por uma propriedade
 * @param array Array a ser ordenado
 * @param key Propriedade para ordenação
 * @param direction Direção da ordenação (asc ou desc)
 * @returns Array ordenado
 */
export function sortBy<T>(
  array: T[], 
  key: keyof T, 
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA === valueB) return 0;
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    return direction === 'asc' ? 1 : -1;
  });
}

/**
 * Faz o deep merge de dois objetos
 * @param target Objeto alvo
 * @param source Objeto fonte
 * @returns Novo objeto com o merge dos dois
 */
export function deepMerge<T extends Record<string, any>>(
  target: T, 
  source: Partial<T>
): T {
  const result = { ...target };
  
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    
    const value = source[key];
    
    if (value === null || value === undefined) continue;
    
    if (
      typeof value === 'object' && 
      !Array.isArray(value) && 
      typeof result[key] === 'object' && 
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key] as any, value as any) as any;
    } else {
      result[key] = value as any;
    }
  }
  
  return result;
}

/**
 * Limita a execução de uma função dentro de um período de tempo
 * @param func Função a ser executada
 * @param limit Limite de tempo em ms
 * @returns Função com debounce
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function(this: any, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), limit);
  };
}

/**
 * Limita a taxa de execução de uma função
 * @param func Função a ser executada
 * @param limit Limite de tempo em ms
 * @returns Função com throttle
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function(this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Aleatoriza a ordem dos elementos de um array
 * @param array Array a ser embaralhado
 * @returns Novo array com elementos em ordem aleatória
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

/**
 * Retorna apenas valores únicos de um array
 * @param array Array com possíveis valores duplicados
 * @returns Novo array com valores únicos
 */
export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Retira acentos de um texto
 * @param text Texto com acentos
 * @returns Texto sem acentos
 */
export function removeAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Formatação de datas
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Formatação de números
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// Formatação de porcentagem
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

// Formatação de duração
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} min`
  }

  return `${hours}h ${remainingMinutes}min`
}

// Formatação de tamanho de arquivo
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// Truncamento de texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// Validação de URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validação de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de senha
export function isValidPassword(password: string): boolean {
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return passwordRegex.test(password)
}

// Validação de CPF
export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '')

  if (cpf.length !== 11) return false

  // Verifica CPFs inválidos conhecidos
  if (/^(\d)\1+$/.test(cpf)) return false

  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false

  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cpf.charAt(10))) return false

  return true
}

// Formatação de CPF
export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '')
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Formatação de telefone
export function formatPhone(phone: string): string {
  phone = phone.replace(/[^\d]/g, '')
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

// Formatação de CEP
export function formatCEP(cep: string): string {
  cep = cep.replace(/[^\d]/g, '')
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// Formatação de valor monetário
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Formatação de data relativa
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} ano${years > 1 ? 's' : ''} atrás`
  if (months > 0) return `${months} mês${months > 1 ? 'es' : ''} atrás`
  if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`
  return 'agora mesmo'
} 