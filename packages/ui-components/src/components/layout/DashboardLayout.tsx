import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * Props do componente de layout do dashboard
 */
export interface DashboardLayoutProps {
  /** Conteúdo interno do layout */
  children: ReactNode;
  
  /** Componente da barra lateral (opcional) */
  sidebar?: ReactNode;
  
  /** Componente do cabeçalho (opcional) */
  header?: ReactNode;
  
  /** Componente do rodapé (opcional) */
  footer?: ReactNode;
  
  /** Função de verificação de autenticação (opcional, se não fornecida, não verificará autenticação) */
  isAuthenticated?: boolean;
  
  /** Função de verificação de permissão (opcional, se não fornecida, não verificará permissão) */
  hasPermission?: (role: string) => boolean;
  
  /** URL para redirecionamento caso não esteja autenticado */
  loginUrl?: string;
  
  /** URL para redirecionamento caso não tenha permissão */
  fallbackUrl?: string;
  
  /** Permissão mínima necessária para acessar este layout */
  requiredRole?: string;
  
  /** Título da página (opcional) */
  title?: string;
  
  /** Estado de carregamento */
  loading?: boolean;
  
  /** Componente a ser exibido durante o carregamento */
  loadingComponent?: ReactNode;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Estilo opcional para o container */
  containerClassName?: string;
  
  /** Estilo opcional para o conteúdo principal */
  contentClassName?: string;
  
  /** Texto adicional para o rodapé */
  footerText?: string;
}

/**
 * Layout padrão para páginas de dashboard
 * Fornece estrutura básica para dashboards com suporte a autenticação, verificação de permissão e componentes personalizáveis
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
  isAuthenticated = true,
  hasPermission,
  loginUrl = '/login',
  fallbackUrl = '/dashboard',
  requiredRole,
  title,
  loading = false,
  loadingComponent,
  className,
  containerClassName,
  contentClassName,
  footerText
}) => {
  // Verificações de segurança
  
  // Enquanto verifica autenticação, mostra loading
  if (loading) {
    return loadingComponent || <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to={loginUrl} replace />;
  }
  
  // Se não tiver permissão necessária, redireciona para dashboard
  if (requiredRole && hasPermission && !hasPermission(requiredRole)) {
    return <Navigate to={fallbackUrl} replace />;
  }
  
  // Componente do cabeçalho padrão
  const defaultHeader = (
    <header className="border-b bg-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Edunéxia</div>
    </header>
  );
  
  // Componente da barra lateral padrão
  const defaultSidebar = (
    <aside className="w-64 border-r bg-gray-50 h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          <li><a href="/dashboard" className="block p-2 hover:bg-gray-200 rounded">Home</a></li>
          <li><a href="/disciplinas" className="block p-2 hover:bg-gray-200 rounded">Disciplinas</a></li>
          <li><a href="/comunicacao" className="block p-2 hover:bg-gray-200 rounded">Comunicação</a></li>
          <li><a href="/documentos" className="block p-2 hover:bg-gray-200 rounded">Documentos</a></li>
          <li><a href="/matriculas" className="block p-2 hover:bg-gray-200 rounded">Matrículas</a></li>
        </ul>
      </nav>
    </aside>
  );
  
  // Componente do rodapé padrão
  const defaultFooter = (
    <footer className="border-t p-4 text-center text-gray-500 text-sm">
      <p>{footerText || `© ${new Date().getFullYear()} Edunéxia - Plataforma de Educação a Distância`}</p>
    </footer>
  );
  
  return (
    <div className={cn("flex flex-col min-h-screen", className)}>
      {/* Header */}
      {header || defaultHeader}
      
      <div className={cn("flex flex-1", containerClassName)}>
        {/* Sidebar */}
        {sidebar || defaultSidebar}
        
        {/* Main content */}
        <main className={cn("flex-1 p-6", contentClassName)}>
          {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </main>
      </div>
      
      {/* Footer */}
      {footer || defaultFooter}
    </div>
  );
};

export default DashboardLayout; 