import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(Suspense, { fallback: _jsx(LoadingScreen, {}), children: _jsxs(Routes, { children: [_jsxs(Route, { path: "/", element: _jsx(AuthLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "login", element: _jsx(Login, {}) }), _jsx(Route, { path: "registro", element: _jsx(Register, {}) }), _jsx(Route, { path: "esqueci-senha", element: _jsx(ForgotPassword, {}) }), _jsx(Route, { path: "redefinir-senha", element: _jsx(ResetPassword, {}) })] }), _jsxs(Route, { path: "/painel", element: user ? _jsx(MainLayout, {}) : _jsx(Navigate, { to: "/login", replace: true }), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "perfil", element: _jsx(Profile, {}) }), _jsx(Route, { path: "alunos", element: _jsx(Alunos, {}) }), _jsx(Route, { path: "cursos", element: _jsx(Cursos, {}) }), _jsx(Route, { path: "financeiro", element: _jsx(Financeiro, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }));
}
export default App;
