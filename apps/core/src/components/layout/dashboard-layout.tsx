import React, { ReactNode } from 'react';
import { useUser } from '../../contexts/user-context';
import { Navigate } from 'react-router-dom';

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
export function DashboardLayout({
  children,
  requiredRole = 'aluno',
  title
}: DashboardLayoutProps) {
  const { user, loading, isAuthenticated, hasPermission } = useUser();
  
  // Enquanto verifica autenticação, mostra loading
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Se não tiver permissão necessária, redireciona para dashboard
  if (!hasPermission(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">Edunéxia</div>
        <div className="user-info">
          {user?.name || user?.email}
        </div>
      </header>
      
      <div className="dashboard-container">
        {/* Menu lateral */}
        <aside className="dashboard-sidebar">
          <nav>
            <ul>
              <li><a href="/dashboard">Home</a></li>
              <li><a href="/disciplinas">Disciplinas</a></li>
              <li><a href="/comunicacao">Comunicação</a></li>
              <li><a href="/documentos">Documentos</a></li>
              <li><a href="/matriculas">Matrículas</a></li>
            </ul>
          </nav>
        </aside>
        
        {/* Conteúdo principal */}
        <main className="dashboard-content">
          {title && <h1 className="page-title">{title}</h1>}
          {children}
        </main>
      </div>
      
      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Edunéxia - Plataforma de Educação a Distância</p>
      </footer>
    </div>
  );
} 