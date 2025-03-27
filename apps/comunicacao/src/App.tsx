import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { ConfigProvider } from './contexts/ConfigContext';

// Carregamento lazy de componentes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Mensagens = lazy(() => import('./pages/Mensagens'));
const Campanhas = lazy(() => import('./pages/Campanhas'));
const Notificacoes = lazy(() => import('./pages/Notificacoes'));
const Layout = lazy(() => import('./components/Layout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const BaseConhecimento = lazy(() => import('./pages/BaseConhecimentoPage'));

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
    <ConfigProvider>
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
            <Route path="mensagens" element={<Mensagens />} />
            <Route path="campanhas" element={<Campanhas />} />
            <Route path="notificacoes" element={<Notificacoes />} />
            <Route path="base-conhecimento" element={<BaseConhecimento />} />
          </Route>
          
          {/* Página não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
};

export default App; 