import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, UserRole } from '../hooks/useAuth'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export function PrivateRoute({ children, requiredRoles = [] }: PrivateRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verifica se o usuário tem as roles necessárias
  const hasRequiredRoles = 
    requiredRoles.length === 0 || 
    requiredRoles.some(role => user.roles.includes(role))

  if (!hasRequiredRoles) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 