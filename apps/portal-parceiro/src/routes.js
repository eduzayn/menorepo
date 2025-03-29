import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';
// Páginas de autenticação
import Login from './pages/auth/Login';
// Páginas do dashboard
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return _jsx("div", { children: "Carregando..." });
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
// Componente principal de rotas
const AppRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { element: _jsx(AuthLayout, {}), children: _jsx(Route, { path: "/login", element: _jsx(Login, {}) }) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "instituicoes-parceiras", element: _jsx("div", { children: "Institui\u00E7\u00F5es Parceiras" }) }), _jsx(Route, { path: "cursos", element: _jsx("div", { children: "Cursos" }) }), _jsx(Route, { path: "certificacoes", element: _jsx("div", { children: "Certifica\u00E7\u00F5es" }) }), _jsx(Route, { path: "financeiro", element: _jsx("div", { children: "Financeiro" }) }), _jsx(Route, { path: "relatorios", element: _jsx("div", { children: "Relat\u00F3rios" }) }), _jsx(Route, { path: "configuracoes", element: _jsx("div", { children: "Configura\u00E7\u00F5es" }) })] }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }));
};
export default AppRoutes;
