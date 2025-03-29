import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link } from 'react-router-dom';
const AuthLayout = () => {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx(Link, { to: "/", children: _jsx("img", { className: "mx-auto h-12 w-auto", src: "/logo.svg", alt: "Edun\u00E9xia" }) }), _jsx("h2", { className: "mt-6 text-center text-3xl font-bold tracking-tight text-gray-900", children: "Portal do Parceiro" })] }), _jsxs("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: _jsx(Outlet, {}) }), _jsx("div", { className: "mt-6 text-center text-sm text-gray-600", children: _jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " Edun\u00E9xia. Todos os direitos reservados."] }) })] })] }));
};
export default AuthLayout;
