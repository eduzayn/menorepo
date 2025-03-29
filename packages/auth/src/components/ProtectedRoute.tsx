import type { UserRole } from '@edunexia/core';
import React from 'react';

import { RouteGuard } from './RouteGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  requiredRole?: string; // Para compatibilidade com implementações antigas
}

/**
 * @deprecated Use RouteGuard instead
 * 
 * Componente para compatibilidade com códigos antigos que utilizam ProtectedRoute.
 * Internamente chama o RouteGuard padronizado.
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <MyComponent />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredRole,
}) => {
  // Converter requiredRole único para o formato de array esperado pelo RouteGuard
  const roles = requiredRole 
    ? [requiredRole] 
    : requiredRoles;

  return <RouteGuard requiredRoles={roles}>{children}</RouteGuard>;
}; 