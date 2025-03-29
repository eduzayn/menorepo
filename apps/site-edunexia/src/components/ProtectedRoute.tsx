/**
 * @deprecated Este componente foi substituído pelo RouteGuard do pacote @edunexia/auth
 * Importe diretamente: import { RouteGuard } from '@edunexia/auth'
 * 
 * Este arquivo será removido em versões futuras.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

/**
 * @deprecated Use RouteGuard do pacote @edunexia/auth
 */
export const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Enquanto verifica autenticação, mostra uma tela de carregamento
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // Verifica se o usuário tem os papéis necessários
  if (requiredRoles.length > 0 && !requiredRoles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/admin/unauthorized" replace />;
  }
  
  // Se está autenticado e tem as permissões, mostra o conteúdo protegido
  return <>{children}</>;
}; 