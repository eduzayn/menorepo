"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Cursos', href: '/cursos' },
    { name: 'Planos', href: '/planos' },
    { name: 'Inscrições', href: '/inscricoes' },
    { name: 'Documentos', href: '/documentos' },
    { name: 'Contratos', href: '/contratos' },
    { name: 'Configurações', href: '/configuracoes' },
];
var Sidebar = function () {
    var location = (0, react_router_dom_1.useLocation)();
    return ((0, jsx_runtime_1.jsx)("div", { className: "hidden md:flex md:w-64 md:flex-col", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col flex-grow pt-5 bg-white overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center flex-shrink-0 px-4", children: (0, jsx_runtime_1.jsx)("img", { className: "h-8 w-auto", src: "/logo.png", alt: "EduNexia" }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-5 flex-grow flex flex-col", children: (0, jsx_runtime_1.jsx)("nav", { className: "flex-1 px-2 pb-4 space-y-1", children: navigation.map(function (item) {
                            var isActive = location.pathname === item.href;
                            return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: item.href, className: "".concat(isActive
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900', " group flex items-center px-2 py-2 text-sm font-medium rounded-md"), children: item.name }, item.name));
                        }) }) })] }) }));
};
exports.default = Sidebar;
