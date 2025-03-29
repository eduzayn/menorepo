import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const NotFound = () => {
    return (_jsx("div", { className: "min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-9xl font-bold text-indigo-600", children: "404" }), _jsx("h1", { className: "mt-4 text-3xl font-bold text-gray-900", children: "P\u00E1gina n\u00E3o encontrada" }), _jsx("p", { className: "mt-2 text-base text-gray-500", children: "Desculpe, n\u00E3o conseguimos encontrar a p\u00E1gina que voc\u00EA est\u00E1 procurando." }), _jsx("div", { className: "mt-6", children: _jsx(Link, { to: "/dashboard", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Voltar ao Dashboard" }) })] }) }) }));
};
export default NotFound;
