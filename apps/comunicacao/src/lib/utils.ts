import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina múltiplas classes CSS, incluindo classes condicionais,
 * e normaliza-as com tailwind-merge para evitar conflitos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Formatador de data para exibição em formato brasileiro
export function formatDate(date: string | Date) {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

// Limita texto a um número específico de caracteres
export function truncateText(text: string, limit: number = 100) {
  if (!text || text.length <= limit) return text;
  return text.slice(0, limit) + '...';
} 