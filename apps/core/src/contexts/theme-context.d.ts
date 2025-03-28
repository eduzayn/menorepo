import { ReactNode } from 'react';
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
export declare function ThemeProvider({ children, defaultTheme, storageKey }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook para acessar o contexto de tema
 * @returns Contexto de tema
 * @throws Error se usado fora do ThemeProvider
 */
export declare function useTheme(): ThemeContextType;
export {};
//# sourceMappingURL=theme-context.d.ts.map