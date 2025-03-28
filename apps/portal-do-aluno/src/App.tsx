import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Carregamento lazy de componentes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Materiais = lazy(() => import('./pages/Materiais'));
const Financeiro = lazy(() => import('./pages/Financeiro'));
const Layout = lazy(() => import('./components/Layout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));

// Componente de carregamento
import { Spinner } from '@edunexia/ui-components';

// Hook para verificar autenticação
import { useAuth } from '@edunexia/auth';

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="materiais" element={<Materiais />} />
          <Route path="financeiro" element={<Financeiro />} />
        </Route>
        
        {/* Página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App; 