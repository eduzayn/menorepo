import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Concatena classes CSS condicionalmente usando clsx e tailwind-merge
 * Útil para combinar classes estáticas, condicionais e variantes do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 