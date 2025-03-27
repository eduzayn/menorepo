"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateRoute = PrivateRoute;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("../contexts/AuthContext");
function PrivateRoute(_a) {
    var _b;
    var children = _a.children, _c = _a.requiredRoles, requiredRoles = _c === void 0 ? [] : _c;
    var _d = (0, AuthContext_1.useAuth)(), user = _d.user, loading = _d.loading;
    var location = (0, react_router_dom_1.useLocation)();
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" }) }));
    }
    if (!user) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    // Verifica se o usuário tem as roles necessárias
    var userRoles = ((_b = user.app_metadata) === null || _b === void 0 ? void 0 : _b.roles) || [];
    var hasRequiredRoles = requiredRoles.length === 0 || requiredRoles.some(function (role) { return userRoles.includes(role); });
    if (!hasRequiredRoles) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acesso Negado" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Voc\u00EA n\u00E3o tem permiss\u00E3o para acessar esta p\u00E1gina." })] }) }));
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
