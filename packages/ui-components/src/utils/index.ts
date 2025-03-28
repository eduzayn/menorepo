/**
 * Utilitários para componentes de UI
 */

export * from './cn';
export * from './theme';

/**
 * Utilitários compartilhados para componentes UI
 */

/**
 * Função para mesclar nomes de classes (inspirada pelo clsx e tailwind-merge)
 * @param classes Classes a serem mescladas
 * @returns String combinada de classes
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Outras funções de utilidade aqui
 */ 