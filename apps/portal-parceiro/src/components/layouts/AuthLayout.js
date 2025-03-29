import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
const AuthLayout = () => {
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("img", { className: "mx-auto h-16 w-auto", src: "/logo-white.svg", alt: "Edun\u00E9xia Portal do Parceiro" }), _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: "Portal do Parceiro" })] }), _jsxs("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10", children: _jsx(Outlet, {}) }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-sm text-indigo-200", children: ["\u00A9 ", new Date().getFullYear(), " Edun\u00E9xia. Todos os direitos reservados."] }) })] })] }));
};
export default AuthLayout;
