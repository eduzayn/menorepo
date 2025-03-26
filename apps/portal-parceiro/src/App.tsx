import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LoadingScreen from './components/ui/LoadingScreen';

// Carregamento lazy dos componentes principais
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Alunos = lazy(() => import('./pages/alunos/Alunos'));
const Cursos = lazy(() => import('./pages/cursos/Cursos'));
const Financeiro = lazy(() => import('./pages/financeiro/Financeiro'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Register />} />
          <Route path="esqueci-senha" element={<ForgotPassword />} />
          <Route path="redefinir-senha" element={<ResetPassword />} />
        </Route>

        {/* Rotas protegidas */}
        <Route 
          path="/painel" 
          element={
            user ? <MainLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="alunos" element={<Alunos />} />
          <Route path="cursos" element={<Cursos />} />
          <Route path="financeiro" element={<Financeiro />} />
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App; 