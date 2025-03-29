import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HomeIcon, BuildingOfficeIcon, AcademicCapIcon, DocumentCheckIcon, BanknotesIcon, ChartBarIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
        { name: 'Instituições Parceiras', path: '/instituicoes-parceiras', icon: BuildingOfficeIcon },
        { name: 'Cursos', path: '/cursos', icon: AcademicCapIcon },
        { name: 'Certificações', path: '/certificacoes', icon: DocumentCheckIcon },
        { name: 'Financeiro', path: '/financeiro', icon: BanknotesIcon },
        { name: 'Relatórios', path: '/relatorios', icon: ChartBarIcon },
        { name: 'Configurações', path: '/configuracoes', icon: Cog6ToothIcon },
    ];
    return (_jsxs("div", { className: "flex h-screen bg-gray-100", children: [_jsx("div", { className: "hidden md:flex md:flex-shrink-0", children: _jsx("div", { className: "flex flex-col w-64", children: _jsxs("div", { className: "flex flex-col flex-grow pt-5 overflow-y-auto bg-indigo-700 border-r", children: [_jsxs("div", { className: "flex flex-col items-center flex-shrink-0 px-4", children: [_jsx("img", { className: "w-auto h-12", src: "/logo.svg", alt: "Edun\u00E9xia Portal do Parceiro" }), _jsx("h2", { className: "mt-2 text-xl font-semibold text-white", children: "Portal do Parceiro" })] }), _jsx("div", { className: "flex flex-col flex-grow px-4 mt-5", children: _jsx("nav", { className: "flex-1 space-y-1 bg-indigo-700", children: menuItems.map((item) => (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => `${isActive
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-indigo-100 hover:bg-indigo-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`, children: [_jsx(item.icon, { className: "flex-shrink-0 w-6 h-6 mr-3 text-indigo-300", "aria-hidden": "true" }), item.name] }, item.path))) }) }), _jsxs("div", { className: "flex flex-shrink-0 p-4 border-t border-indigo-800", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700", children: user?.name.charAt(0) || 'U' }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-white", children: user?.name || 'Usuário' }), _jsx("p", { className: "text-xs font-medium text-indigo-200", children: user?.email || 'usuario@exemplo.com' })] })] }), _jsx("button", { className: "ml-auto text-indigo-200 hover:text-white", onClick: handleLogout, children: _jsx(ArrowRightOnRectangleIcon, { className: "w-6 h-6" }) })] })] }) }) }), _jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("div", { className: "px-4 py-6 sm:px-6 lg:px-8", children: _jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Portal do Parceiro" }) }) }), _jsx("main", { className: "flex-1 relative overflow-y-auto focus:outline-none p-6", children: _jsx(Outlet, {}) })] })] }));
};
export default DashboardLayout;
