import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, AcademicCapIcon, CurrencyDollarIcon, Cog6ToothIcon, UserCircleIcon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { profile, signOut } = useAuth();
    const navigation = [
        { name: 'Dashboard', href: '/painel', icon: HomeIcon },
        { name: 'Alunos', href: '/painel/alunos', icon: UsersIcon },
        { name: 'Cursos', href: '/painel/cursos', icon: AcademicCapIcon },
        { name: 'Financeiro', href: '/painel/financeiro', icon: CurrencyDollarIcon },
        { name: 'Configurações', href: '/painel/configuracoes', icon: Cog6ToothIcon },
    ];
    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };
    return (_jsxs("div", { className: "h-screen flex overflow-hidden bg-gray-100", children: [_jsxs("div", { className: `fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`, onClick: () => setSidebarOpen(false), children: [_jsx("div", { className: "fixed inset-0 bg-gray-600 bg-opacity-75", "aria-hidden": "true" }), _jsxs("div", { className: "relative flex-1 flex flex-col max-w-xs w-full bg-primary", children: [_jsx("div", { className: "absolute top-0 right-0 -mr-12 pt-2", children: _jsxs("button", { type: "button", className: "ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white", onClick: () => setSidebarOpen(false), children: [_jsx("span", { className: "sr-only", children: "Fechar menu" }), _jsx("svg", { className: "h-6 w-6 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) })] }) }), _jsxs("div", { className: "flex-1 h-0 pt-5 pb-4 overflow-y-auto", children: [_jsx("div", { className: "flex-shrink-0 flex items-center px-4", children: _jsx("img", { className: "h-8 w-auto", src: "/logo-white.svg", alt: "Edun\u00E9xia" }) }), _jsx("nav", { className: "mt-5 px-2 space-y-1", children: navigation.map((item) => (_jsxs(Link, { to: item.href, className: `${pathname === item.href
                                                ? 'bg-primary-dark text-white'
                                                : 'text-white hover:bg-primary-light'} group flex items-center px-2 py-2 text-base font-medium rounded-md`, children: [_jsx(item.icon, { className: "mr-4 flex-shrink-0 h-6 w-6 text-white", "aria-hidden": "true" }), item.name] }, item.name))) })] }), _jsx("div", { className: "flex-shrink-0 flex border-t border-primary-dark p-4", children: _jsxs("button", { onClick: handleLogout, className: "flex-shrink-0 group block w-full flex items-center", children: [_jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm font-medium text-white group-hover:text-gray-200", children: "Sair do Sistema" }) }), _jsx(ArrowRightOnRectangleIcon, { className: "ml-auto h-5 w-5 text-white" })] }) })] })] }), _jsx("div", { className: "hidden md:flex md:flex-shrink-0", children: _jsx("div", { className: "flex flex-col w-64", children: _jsxs("div", { className: "flex flex-col h-0 flex-1 bg-primary", children: [_jsxs("div", { className: "flex-1 flex flex-col pt-5 pb-4 overflow-y-auto", children: [_jsx("div", { className: "flex items-center flex-shrink-0 px-4", children: _jsx("img", { className: "h-8 w-auto", src: "/logo-white.svg", alt: "Edun\u00E9xia" }) }), _jsx("nav", { className: "mt-5 flex-1 px-2 space-y-1", children: navigation.map((item) => (_jsxs(Link, { to: item.href, className: `${pathname === item.href
                                                ? 'bg-primary-dark text-white'
                                                : 'text-white hover:bg-primary-light'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`, children: [_jsx(item.icon, { className: "mr-3 flex-shrink-0 h-6 w-6 text-white", "aria-hidden": "true" }), item.name] }, item.name))) })] }), _jsx("div", { className: "flex-shrink-0 flex border-t border-primary-dark p-4", children: _jsx("button", { onClick: handleLogout, className: "flex-shrink-0 w-full group block", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { children: _jsx(UserCircleIcon, { className: "h-10 w-10 text-white" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-white", children: profile?.nome || 'Usuário Parceiro' }), _jsx("p", { className: "text-xs font-medium text-gray-300 group-hover:text-gray-200", children: "Sair do Sistema" })] })] }) }) })] }) }) }), _jsxs("div", { className: "flex flex-col w-0 flex-1 overflow-hidden", children: [_jsxs("div", { className: "relative z-10 flex-shrink-0 flex h-16 bg-white shadow", children: [_jsxs("button", { type: "button", className: "px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden", onClick: () => setSidebarOpen(true), children: [_jsx("span", { className: "sr-only", children: "Abrir menu" }), _jsx("svg", { className: "h-6 w-6", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16M4 18h16" }) })] }), _jsx("div", { className: "flex-1 px-4 flex justify-end", children: _jsxs("div", { className: "ml-4 flex items-center md:ml-6", children: [_jsxs("button", { className: "p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none", children: [_jsx("span", { className: "sr-only", children: "Visualizar notifica\u00E7\u00F5es" }), _jsx(BellIcon, { className: "h-6 w-6", "aria-hidden": "true" })] }), _jsx("div", { className: "ml-3 relative", children: _jsx("div", { children: _jsx(Link, { to: "/painel/perfil", className: "max-w-xs flex items-center text-sm rounded-full focus:outline-none", children: _jsx("span", { className: "inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary", children: _jsx("span", { className: "text-sm font-medium leading-none text-white", children: profile?.nome?.charAt(0) || 'U' }) }) }) }) })] }) })] }), _jsx("main", { className: "flex-1 relative overflow-y-auto focus:outline-none", children: _jsx("div", { className: "py-6", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 md:px-8", children: _jsx(Outlet, {}) }) }) })] })] }));
};
export default MainLayout;
