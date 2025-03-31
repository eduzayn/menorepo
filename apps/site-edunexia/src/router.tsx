import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '@edunexia/auth';

// Páginas da aplicação
import LoginPage from './pages/login';
import RedirectPage from './pages/redirect';
import PortalSelectorPage from './pages/portal-selector';

// Layout que envolve a aplicação com o AuthProvider
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

// Rotas protegidas que requerem autenticação
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Aqui deve ser implementada a lógica para verificar se o usuário está autenticado
  // e redirecionar para o login caso não esteja
  return <>{children}</>;
};

// Configuração das rotas
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Navigate to="/login" replace />
      </AppLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <AppLayout>
        <LoginPage />
      </AppLayout>
    ),
  },
  {
    path: '/redirect',
    element: (
      <AppLayout>
        <ProtectedRoute>
          <RedirectPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: '/portal-selector',
    element: (
      <AppLayout>
        <ProtectedRoute>
          <PortalSelectorPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  // Rota de fallback
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router; 