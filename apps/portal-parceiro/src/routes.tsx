import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ROUTE_PREFIXES } from '@edunexia/core';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Páginas de autenticação
import Login from './pages/auth/Login';

// Páginas do dashboard
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';

// Prefixo para todas as rotas deste módulo
const PREFIX = ROUTE_PREFIXES.PORTAL_PARCEIRO;

// Componente para rotas protegidas
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`${PREFIX}/auth/login`} replace />;
  }

  return <>{children}</>;
};

// Componente principal de rotas
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas de autenticação */}
      <Route element={<AuthLayout />}>
        <Route path={`${PREFIX}/auth/login`} element={<Login />} />
      </Route>

      {/* Rotas protegidas */}
      <Route
        path={PREFIX}
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={`${PREFIX}/dashboard`} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Placeholder para rotas futuras */}
        <Route path="instituicoes-parceiras" element={<div>Instituições Parceiras</div>} />
        <Route path="cursos" element={<div>Cursos</div>} />
        <Route path="certificacoes" element={<div>Certificações</div>} />
        <Route path="financeiro" element={<div>Financeiro</div>} />
        <Route path="relatorios" element={<div>Relatórios</div>} />
        <Route path="configuracoes" element={<div>Configurações</div>} />
      </Route>

      {/* Manter temporariamente as rotas antigas com redirecionamento para compatibilidade */}
      <Route path="/login" element={<Navigate to={`${PREFIX}/auth/login`} replace />} />
      <Route path="/dashboard" element={<Navigate to={`${PREFIX}/dashboard`} replace />} />
      <Route path="/" element={<Navigate to={PREFIX} replace />} />

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
