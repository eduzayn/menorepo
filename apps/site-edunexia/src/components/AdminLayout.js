import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const AdminNavItem = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
    return (_jsx(Link, { to: to, className: `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isActive
            ? 'bg-blue-700 text-white'
            : 'text-gray-200 hover:bg-blue-800 hover:text-white'}`, children: children }));
};
const AdminLayout = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };
    // Loading placeholder para o conteúdo
    const LoadingFallback = () => (_jsx("div", { className: "flex items-center justify-center h-full w-full p-8", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
    return (_jsxs("div", { className: "flex h-screen bg-gray-100", children: [_jsxs("div", { className: "bg-blue-900 text-white w-64 flex flex-col", children: [_jsxs("div", { className: "p-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Edun\u00E9xia Admin" }), _jsx("p", { className: "text-sm text-blue-300 mt-1", children: "Painel de Gerenciamento" })] }), _jsx("div", { className: "flex-1 overflow-y-auto py-4", children: _jsxs("nav", { className: "space-y-1 px-2", children: [_jsxs(AdminNavItem, { to: "/admin", children: [_jsx("span", { className: "material-icons text-sm", children: "dashboard" }), _jsx("span", { children: "Dashboard" })] }), _jsx("h3", { className: "text-xs uppercase text-gray-400 font-bold px-4 pt-4 pb-2", children: "Conte\u00FAdo" }), _jsxs(AdminNavItem, { to: "/admin/paginas", children: [_jsx("span", { className: "material-icons text-sm", children: "article" }), _jsx("span", { children: "P\u00E1ginas" })] }), _jsxs(AdminNavItem, { to: "/admin/blog", children: [_jsx("span", { className: "material-icons text-sm", children: "description" }), _jsx("span", { children: "Blog" })] }), _jsxs(AdminNavItem, { to: "/admin/categorias", children: [_jsx("span", { className: "material-icons text-sm", children: "folder" }), _jsx("span", { children: "Categorias" })] }), _jsx("h3", { className: "text-xs uppercase text-gray-400 font-bold px-4 pt-4 pb-2", children: "Gest\u00E3o" }), _jsxs(AdminNavItem, { to: "/admin/leads", children: [_jsx("span", { className: "material-icons text-sm", children: "people" }), _jsx("span", { children: "Leads/Contatos" })] }), _jsxs(AdminNavItem, { to: "/admin/depoimentos", children: [_jsx("span", { className: "material-icons text-sm", children: "format_quote" }), _jsx("span", { children: "Depoimentos" })] }), _jsx("h3", { className: "text-xs uppercase text-gray-400 font-bold px-4 pt-4 pb-2", children: "Configura\u00E7\u00F5es" }), _jsxs(AdminNavItem, { to: "/admin/configuracoes", children: [_jsx("span", { className: "material-icons text-sm", children: "settings" }), _jsx("span", { children: "Configura\u00E7\u00F5es" })] }), _jsxs(AdminNavItem, { to: "/admin/menu", children: [_jsx("span", { className: "material-icons text-sm", children: "menu" }), _jsx("span", { children: "Menu" })] })] }) }), _jsx("div", { className: "border-t border-blue-800 p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center", children: _jsx("span", { className: "uppercase text-lg font-bold", children: user?.nome?.charAt(0) || 'U' }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium truncate", children: user?.nome || 'Usuário' }), _jsx("p", { className: "text-xs text-blue-300 truncate", children: user?.email || 'admin@edunexia.com' })] }), _jsx("button", { onClick: handleLogout, className: "p-1 rounded-full hover:bg-blue-800", title: "Sair", children: _jsx("span", { className: "material-icons text-gray-300", children: "logout" }) })] }) })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-white shadow-sm h-16 flex items-center px-6", children: [_jsx("div", { className: "flex-1" }), _jsx("div", { className: "flex items-center space-x-4", children: _jsx(Link, { to: "/", className: "text-gray-600 hover:text-blue-600", title: "Ver site", children: _jsx("span", { className: "material-icons", children: "open_in_new" }) }) })] }), _jsx("main", { className: "flex-1 overflow-y-auto p-6 bg-gray-50", children: _jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(Outlet, {}) }) })] })] }));
};
export default AdminLayout;
