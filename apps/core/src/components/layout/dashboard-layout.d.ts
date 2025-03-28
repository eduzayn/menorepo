import { ReactNode } from 'react';
/**
 * Props do componente de layout do dashboard
 */
interface DashboardLayoutProps {
    /** Conteúdo interno do layout */
    children: ReactNode;
    /** Permissão mínima necessária para acessar este layout */
    requiredRole?: 'guest' | 'aluno' | 'professor' | 'admin';
    /** Título da página (opcional) */
    title?: string;
}
/**
 * Layout padrão para páginas de dashboard
 * Inclui menu lateral, header e footer
 */
export declare function DashboardLayout({ children, requiredRole, title }: DashboardLayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=dashboard-layout.d.ts.map