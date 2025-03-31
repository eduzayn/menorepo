/**
 * @deprecated Este componente foi substituído pelo RouteGuard do pacote @edunexia/auth
 * Importe diretamente: import { RouteGuard } from '@edunexia/auth'
 * 
 * Este arquivo será removido em versões futuras.
 */

import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Verificar se o usuário está autenticado
  // Em um ambiente real, você usaria um sistema de autenticação adequado
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';

  // Se não estiver autenticado, redirecionar para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Se estiver autenticado, renderizar os filhos
  return <>{children}</>;
}; 