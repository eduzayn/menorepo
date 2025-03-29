/**
 * @deprecated Este componente foi substituído pelo RouteGuard do pacote @edunexia/auth
 * Importe diretamente: import { RouteGuard } from '@edunexia/auth'
 * 
 * Este arquivo será removido em versões futuras.
 */

import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, UserRole } from '../hooks/useAuth'

interface ProtectedProps {
  children: ReactNode
  requiredRoles?: UserRole[]
}

/**
 * Componente para proteger rotas que requerem autenticação
 * @deprecated Será substituído pelo RouteGuard de @edunexia/auth
 */
export default function ProtectedRoute({ children, requiredRoles }: ProtectedProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/matriculas/login" replace />
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      user?.roles?.includes(role)
    )
    
    if (!hasRequiredRole) {
      return <Navigate to="/matriculas/unauthorized" replace />
    }
  }

  return <>{children}</>
} 