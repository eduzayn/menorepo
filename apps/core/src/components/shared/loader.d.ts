/**
 * Props do componente de carregamento
 */
interface LoaderProps {
    /** Texto a ser exibido (opcional) */
    text?: string;
    /** Tamanho do loader (pequeno, médio, grande) */
    size?: 'sm' | 'md' | 'lg';
    /** Classes adicionais */
    className?: string;
    /** Indica se o loader ocupa toda a página */
    fullPage?: boolean;
}
/**
 * Componente de carregamento padronizado
 */
export declare function Loader({ text, size, className, fullPage }: LoaderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=loader.d.ts.map