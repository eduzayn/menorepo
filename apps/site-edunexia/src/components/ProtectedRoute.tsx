import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
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

  // Verificar roles se necessário
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      user?.perfil === role || (user?.permissoes && user.permissoes.includes(role))
    );

    if (!hasRequiredRole) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-md">
            <span className="material-icons text-red-500 text-4xl mb-4">
              block
            </span>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Acesso Negado
            </h1>
            <p className="text-gray-600 mb-6">
              Você não tem permissão para acessar esta área. Entre em contato com o administrador do sistema.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Voltar
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Ir para Home
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // Se está autenticado (e tem as permissões necessárias se especificadas), permite acesso
  return <>{children}</>;
}; 