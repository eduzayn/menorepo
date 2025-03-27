"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var outline_1 = require("@heroicons/react/24/outline");
var navigation = [
    { name: 'Dashboard', href: '/', icon: outline_1.HomeIcon },
    { name: 'Cursos', href: '/cursos', icon: outline_1.BookOpenIcon },
    { name: 'Matrículas', href: '/matriculas', icon: outline_1.UserGroupIcon },
    { name: 'Documentos', href: '/documentos', icon: outline_1.DocumentTextIcon },
    { name: 'Contratos', href: '/contratos', icon: outline_1.ClipboardDocumentListIcon },
    { name: 'Configurações', href: '/configuracoes', icon: outline_1.Cog6ToothIcon },
];
function Sidebar() {
    var location = (0, react_router_dom_1.useLocation)();
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col w-64 bg-white border-r border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col flex-grow pt-5 pb-4 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center flex-shrink-0 px-4", children: (0, jsx_runtime_1.jsx)("img", { className: "h-8 w-auto", src: "/logo.png", alt: "Edun\u00E9xia" }) }), (0, jsx_runtime_1.jsx)("nav", { className: "mt-5 flex-1 px-2 space-y-1", children: navigation.map(function (item) {
                        var isActive = location.pathname === item.href;
                        return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: item.href, className: "group flex items-center px-2 py-2 text-sm font-medium rounded-md ".concat(isActive
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'), children: [(0, jsx_runtime_1.jsx)(item.icon, { className: "mr-3 flex-shrink-0 h-6 w-6 ".concat(isActive
                                        ? 'text-gray-500'
                                        : 'text-gray-400 group-hover:text-gray-500'), "aria-hidden": "true" }), item.name] }, item.name));
                    }) })] }) }));
}
