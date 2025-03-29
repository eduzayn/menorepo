import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import type { UserRole } from '@edunexia/core';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  requiredPermissions?: string | string[];
}

/**
 * Componente para proteger rotas que requerem autenticação
 * 
 * @example
 * ```tsx
 * // Rota que requer autenticação
 * <Route
 *   path="/dashboard"
 *   element={
 *     <RouteGuard>
 *       <DashboardPage />
 *     </RouteGuard>
 *   }
 * />
 * 
 * // Rota que requer papel específico
 * <Route
 *   path="/admin"
 *   element={
 *     <RouteGuard requiredRoles="admin">
 *       <AdminPage />
 *     </RouteGuard>
 *   }
 * />
 * 
 * // Rota que requer permissão específica
 * <Route
 *   path="/relatorios"
 *   element={
 *     <RouteGuard requiredPermissions="ver_relatorios">
 *       <RelatoriosPage />
 *     </RouteGuard>
 *   }
 * />
 * ```
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredRoles,
  requiredPermissions
}) => {
  const auth = useAuth();
  const location = useLocation();
  
  // Verificar se está carregando
  if (auth.loading) {
    // Placeholder para componente de loading
    return <div>Carregando...</div>;
  }
  
  // Verificar se está autenticado
  if (!auth.isAuthenticated) {
    // Redirecionar para a página de login com o retorno para a página atual
    return (
      <Navigate
        to={auth.loginPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  
  // Verificar papéis, se necessário
  if (requiredRoles && !auth.hasRole(requiredRoles)) {
    // Redirecionar para uma página de acesso negado
    return (
      <Navigate
        to={`${auth.loginPath.split('/auth')[0]}/acesso-negado`}
        state={{ reason: 'role' }}
        replace
      />
    );
  }
  
  // Verificar permissões, se necessário
  if (requiredPermissions && !auth.hasPermission(requiredPermissions)) {
    // Redirecionar para uma página de acesso negado
    return (
      <Navigate
        to={`${auth.loginPath.split('/auth')[0]}/acesso-negado`}
        state={{ reason: 'permission' }}
        replace
      />
    );
  }
  
  // Se passou por todas as verificações, renderizar o conteúdo
  return <>{children}</>;
}; 