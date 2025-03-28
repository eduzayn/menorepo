import { ReactNode } from 'react';
/**
 * Props do componente de cabeçalho da página
 */
interface PageHeaderProps {
    /** Título principal da página */
    title: string;
    /** Subtítulo opcional */
    subtitle?: string;
    /** URL para voltar (opcional) */
    backUrl?: string;
    /** Conteúdo adicional a ser renderizado na direita (opcional) */
    actions?: ReactNode;
    /** Classes adicionais */
    className?: string;
}
/**
 * Componente de cabeçalho padronizado para páginas
 */
export declare function PageHeader({ title, subtitle, backUrl, actions, className }: PageHeaderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=page-header.d.ts.map