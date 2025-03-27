import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
// Criar contexto com valor inicial undefined
const ThemeContext = createContext(undefined);
/**
 * Provedor de contexto de tema
 */
export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'edunexia-theme' }) {
    // Estado do tema configurado pelo usuário
    const [theme, setTheme] = useState(() => {
        // Tenta recuperar do localStorage
        const savedTheme = localStorage.getItem(storageKey);
        return savedTheme || defaultTheme;
    });
    // Estado do tema real aplicado (light ou dark)
    const [actualTheme, setActualTheme] = useState('light');
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
        }
        else {
            setActualTheme(theme);
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
    const contextValue = {
        theme,
        actualTheme,
        setTheme,
        isDarkTheme: actualTheme === 'dark'
    };
    return (_jsx(ThemeContext.Provider, { value: contextValue, children: children }));
}
/**
 * Hook para acessar o contexto de tema
 * @returns Contexto de tema
 * @throws Error se usado fora do ThemeProvider
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
}
