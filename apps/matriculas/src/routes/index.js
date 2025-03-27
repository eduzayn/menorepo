"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var cursos_1 = require("./cursos");
var Login_1 = require("../pages/Login");
var Layout_1 = require("../components/Layout");
exports.router = (0, react_router_dom_1.createBrowserRouter)([
    {
        path: '/login',
        element: (0, jsx_runtime_1.jsx)(Login_1.Login, {})
    },
    {
        path: '/',
        element: (0, jsx_runtime_1.jsx)(Layout_1.Layout, {}),
        children: __spreadArray([], cursos_1.cursosRoutes, true)
    }
]);
