import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Temas disponíveis na aplicação
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Interface do contexto de tema
 */
export interface ThemeContextType {
  /** Tema atual configurado (pode ser 'system') */
  theme: Theme;
  
  /** Tema real aplicado (light/dark) */
  actualTheme: 'light' | 'dark';
  
  /** Altera o tema */
  setTheme: (theme: Theme) => void;
  
  /** Verifica se o tema atual é escuro */
  isDarkTheme: boolean;
  
  /** Alterna entre os temas dark e light */
  toggleTheme: () => void;
}

// Criar contexto com valor inicial undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Props do provedor de tema
 */
export interface ThemeProviderProps {
  /** Componentes filhos */
  children: ReactNode;
  
  /** Tema inicial */
  defaultTheme?: Theme;
  
  /** Chave para salvar o tema no localStorage */
  storageKey?: string;
  
  /** Classe CSS para o tema escuro (para sistemas que não usam data-theme) */
  darkClassName?: string;
}

/**
 * Provedor de contexto de tema para aplicações Edunéxia
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'edunexia-theme',
  darkClassName = 'dark'
}) => {
  // Estado do tema configurado pelo usuário
  const [theme, setTheme] = useState<Theme>(() => {
    // Tenta recuperar do localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(storageKey);
      return (savedTheme as Theme) || defaultTheme;
    }
    return defaultTheme;
  });
  
  // Estado do tema real aplicado (light ou dark)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  
  // Função para alternar entre temas
  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'dark';
      // Se for system, inverte o tema atual
      return actualTheme === 'dark' ? 'light' : 'dark';
    });
  };
  
  // Aplica o tema no documento
  const applyTheme = (newTheme: 'light' | 'dark') => {
    setActualTheme(newTheme);
    
    // Para compatibilidade com diferentes métodos de temas
    if (typeof document !== 'undefined') {
      // 1. Aplica data-theme no root
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // 2. Aplica classe para compatibilidade com Tailwind
      if (newTheme === 'dark') {
        document.documentElement.classList.add(darkClassName);
      } else {
        document.documentElement.classList.remove(darkClassName);
      }
    }
  };
  
  // Efeito para atualizar o tema quando muda
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Salva no localStorage
    localStorage.setItem(storageKey, theme);
    
    // Se for 'system', usa a preferência do sistema
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemPrefersDark ? 'dark' : 'light');
    } else {
      applyTheme(theme as 'light' | 'dark');
    }
  }, [theme, storageKey, darkClassName]);
  
  // Efeito para atualizar quando a preferência do sistema muda
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    // Adiciona listener e executa uma vez inicialmente
    mediaQuery.addEventListener('change', handleChange);
    handleChange();
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);
  
  // Contexto a ser compartilhado
  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    isDarkTheme: actualTheme === 'dark',
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de tema
 * 
 * @example
 * ```tsx
 * const { theme, setTheme, isDarkTheme } = useTheme();
 * ```
 * 
 * @returns Contexto de tema
 * @throws Error se usado fora do ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};

export default ThemeProvider; 