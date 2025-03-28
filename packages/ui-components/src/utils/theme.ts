/**
 * Tipos e funções para manipulação de temas
 */

export type Theme = 'light' | 'dark' | 'system';

/**
 * Função para alternar entre temas
 */
export function toggleTheme(currentTheme: Theme): Theme {
  switch (currentTheme) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'light';
    default:
      return 'light';
  }
}

/**
 * Função para aplicar um tema ao documento
 */
export function applyTheme(theme: Theme): void {
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  document.documentElement.classList.toggle('dark', isDark);
} 