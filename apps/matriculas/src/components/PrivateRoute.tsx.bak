/**
 * @deprecated Este componente foi substituído pelo RouteGuard do pacote @edunexia/auth
 * Importe diretamente: import { RouteGuard } from '@edunexia/auth'
 * 
 * Este arquivo será removido em versões futuras.
 */

import { Navigate, useLocation } from 'react-router-dom'
import { RouteGuard } from '@edunexia/auth'
import { UserRole } from '../hooks/useAuth'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export function PrivateRoute({ children, requiredRoles = [] }: PrivateRouteProps) {
  return (
    <RouteGuard requiredRoles={requiredRoles}>
      {children}
    </RouteGuard>
  )
} 