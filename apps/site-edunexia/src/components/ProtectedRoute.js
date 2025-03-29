import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    // Enquanto verifica autenticação, mostra uma tela de carregamento
    if (isLoading) {
        return (_jsx("div", { className: "flex h-screen w-full items-center justify-center bg-gray-100", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }), _jsx("p", { className: "text-gray-600", children: "Verificando autentica\u00E7\u00E3o..." })] }) }));
    }
    // Se não estiver autenticado, redireciona para login
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/admin/login", state: { from: location }, replace: true });
    }
    // Verificar roles se necessário
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => user?.perfil === role || (user?.permissoes && user.permissoes.includes(role)));
        if (!hasRequiredRole) {
            return (_jsx("div", { className: "flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-4", children: _jsxs("div", { className: "max-w-md rounded-lg bg-white p-8 text-center shadow-md", children: [_jsx("span", { className: "material-icons text-red-500 text-4xl mb-4", children: "block" }), _jsx("h1", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Acesso Negado" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Voc\u00EA n\u00E3o tem permiss\u00E3o para acessar esta \u00E1rea. Entre em contato com o administrador do sistema." }), _jsxs("div", { className: "flex justify-center space-x-4", children: [_jsx("button", { onClick: () => window.history.back(), className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300", children: "Voltar" }), _jsx("a", { href: "/", className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Ir para Home" })] })] }) }));
        }
    }
    // Se está autenticado (e tem as permissões necessárias se especificadas), permite acesso
    return _jsx(_Fragment, { children: children });
};
