import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUser } from '../../contexts/user-context';
import { Navigate } from 'react-router-dom';
/**
 * Layout padrão para páginas de dashboard
 * Inclui menu lateral, header e footer
 */
export function DashboardLayout({ children, requiredRole = 'aluno', title }) {
    const { user, loading, isAuthenticated, hasPermission } = useUser();
    // Enquanto verifica autenticação, mostra loading
    if (loading) {
        return _jsx("div", { children: "Carregando..." });
    }
    // Se não estiver autenticado, redireciona para login
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Se não tiver permissão necessária, redireciona para dashboard
    if (!hasPermission(requiredRole)) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return (_jsxs("div", { className: "dashboard-layout", children: [_jsxs("header", { className: "dashboard-header", children: [_jsx("div", { className: "logo", children: "Edun\u00E9xia" }), _jsx("div", { className: "user-info", children: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.email) })] }), _jsxs("div", { className: "dashboard-container", children: [_jsx("aside", { className: "dashboard-sidebar", children: _jsx("nav", { children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/dashboard", children: "Home" }) }), _jsx("li", { children: _jsx("a", { href: "/disciplinas", children: "Disciplinas" }) }), _jsx("li", { children: _jsx("a", { href: "/comunicacao", children: "Comunica\u00E7\u00E3o" }) }), _jsx("li", { children: _jsx("a", { href: "/documentos", children: "Documentos" }) }), _jsx("li", { children: _jsx("a", { href: "/matriculas", children: "Matr\u00EDculas" }) })] }) }) }), _jsxs("main", { className: "dashboard-content", children: [title && _jsx("h1", { className: "page-title", children: title }), children] })] }), _jsx("footer", { className: "dashboard-footer", children: _jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " Edun\u00E9xia - Plataforma de Educa\u00E7\u00E3o a Dist\u00E2ncia"] }) })] }));
}
