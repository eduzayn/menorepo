import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../AuthProvider';

// Definindo UserRole localmente
type UserRole = 'admin' | 'aluno' | 'professor' | 'polo' | 'parceiro' | 'guest';

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
 *     <RouteGuard requiredRoles={['admin', 'professor']}>
 *       <Dashboard />
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
  const { isAuthenticated, hasRole, hasPermission, loginPath } = useAuth();
  const location = useLocation();
  
  // Verificar se está carregando
  if (isAuthenticated === undefined) {
    // Placeholder para componente de loading
    return <div>Carregando...</div>;
  }
  
  // Verificar se está autenticado
  if (!isAuthenticated) {
    // Redirecionar para a página de login com o retorno para a página atual
    return (
      <Navigate
        to={loginPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  
  // Verificar papéis, se necessário
  if (requiredRoles && !hasRole(requiredRoles)) {
    // Redirecionar para uma página de acesso negado
    return (
      <Navigate
        to="/acesso-negado"
        state={{ reason: 'role' }}
        replace
      />
    );
  }
  
  // Verificar permissões, se necessário
  if (requiredPermissions && !hasPermission(requiredPermissions)) {
    // Redirecionar para uma página de acesso negado
    return (
      <Navigate
        to="/acesso-negado"
        state={{ reason: 'permission' }}
        replace
      />
    );
  }
  
  // Se passou por todas as verificações, renderizar o conteúdo
  return <>{children}</>;
}; 