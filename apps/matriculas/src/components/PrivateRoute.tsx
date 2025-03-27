import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@edunexia/auth'

type UserRole = 'admin' | 'gestor' | 'coordenador' | 'professor' | 'tutor' | 'aluno' | 'secretaria' | 'financeiro' | 'parceiro' | 'visitante'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export function PrivateRoute({ children, requiredRoles = [] }: PrivateRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
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
    (user.perfil && requiredRoles.includes(user.perfil as UserRole))

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