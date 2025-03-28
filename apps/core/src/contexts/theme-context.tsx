import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Temas disponíveis na aplicação
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Interface do contexto de tema
 */
interface ThemeContextType {
  /** Tema atual */
  theme: Theme;
  
  /** Tema real aplicado (light/dark) */
  actualTheme: 'light' | 'dark';
  
  /** Altera o tema */
  setTheme: (theme: Theme) => void;
  
  /** Verifica se o tema atual é escuro */
  isDarkTheme: boolean;
}

// Criar contexto com valor inicial undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Props do provedor de tema
 */
interface ThemeProviderProps {
  /** Componentes filhos */
  children: ReactNode;
  
  /** Tema inicial */
  defaultTheme?: Theme;
  
  /** Chave para salvar o tema no localStorage */
  storageKey?: string;
}

/**
 * Provedor de contexto de tema
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'edunexia-theme'
}: ThemeProviderProps) {
  // Estado do tema configurado pelo usuário
  const [theme, setTheme] = useState<Theme>(() => {
    // Tenta recuperar do localStorage
    const savedTheme = localStorage.getItem(storageKey);
    return (savedTheme as Theme) || defaultTheme;
  });
  
  // Estado do tema real aplicado (light ou dark)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  
  // Efeito para atualizar o tema quando muda
  useEffect(() => {
    // Salva no localStorage
    localStorage.setItem(storageKey, theme);
    
    // Se for 'system', usa a preferência do sistema
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      setActualTheme(systemTheme);
      document.documentElement.setAttribute('data-theme', systemTheme);
    } else {
      setActualTheme(theme as 'light' | 'dark');
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, storageKey]);
  
  // Efeito para atualizar quando a preferência do sistema muda
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setActualTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);
  
  // Contexto a ser compartilhado
  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    isDarkTheme: actualTheme === 'dark'
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de tema
 * @returns Contexto de tema
 * @throws Error se usado fora do ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
}