import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../types/auth'

interface ProtectedProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

/**
 * Componente para proteger rotas baseado em autenticação e papéis de usuário
 */
export function Protected({ children, requiredRoles = [] }: ProtectedProps) {
  const { user, isLoading } = useAuth()

  // Se está carregando, mostra um indicador
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Se houver papéis requeridos, verifica se o usuário tem permissão
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role as UserRole)) {
    return <Navigate to="/acesso-negado" replace />
  }

  // Se passar por todas as validações, renderiza o conteúdo
  return <>{children}</>
} 