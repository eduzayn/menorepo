/**
 * @deprecated Este componente foi substituído pelo RouteGuard do pacote @edunexia/auth
 * Importe diretamente: import { RouteGuard } from '@edunexia/auth'
 * 
 * Este arquivo será removido em versões futuras.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@edunexia/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * @deprecated Use RouteGuard from @edunexia/auth
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading, loginPath } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={loginPath || '/login'} replace />;
  }
  
  if (requiredRole && !user?.app_metadata?.roles?.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
} 