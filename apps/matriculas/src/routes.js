"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var Layout_1 = require("./components/Layout");
var Login_1 = require("./pages/Login");
var MatriculasList_1 = require("./components/MatriculasList");
var MatriculaForm_1 = require("./components/MatriculaForm");
var MatriculaDetails_1 = require("./components/MatriculaDetails");
var PrivateRoute_1 = require("./components/PrivateRoute");
var CursosList_1 = require("./components/cursos/CursosList");
var CursoForm_1 = require("./components/cursos/CursoForm");
var CursoDetails_1 = require("./components/cursos/CursoDetails");
var routes = [
    {
        path: '/login',
        element: (0, jsx_runtime_1.jsx)(Login_1.Login, {}),
    },
    {
        path: '/cursos',
        element: ((0, jsx_runtime_1.jsx)(PrivateRoute_1.PrivateRoute, { requiredRoles: ['admin', 'secretaria'], children: (0, jsx_runtime_1.jsx)(Layout_1.Layout, {}) })),
        children: [
            {
                path: '',
                element: (0, jsx_runtime_1.jsx)(CursosList_1.CursosList, {}),
            },
            {
                path: 'novo',
                element: (0, jsx_runtime_1.jsx)(CursoForm_1.CursoForm, {}),
            },
            {
                path: ':id',
                element: (0, jsx_runtime_1.jsx)(CursoDetails_1.CursoDetails, {}),
            },
            {
                path: ':id/editar',
                element: (0, jsx_runtime_1.jsx)(CursoForm_1.CursoForm, {}),
            },
        ],
    },
    {
        path: '/matriculas',
        element: ((0, jsx_runtime_1.jsx)(PrivateRoute_1.PrivateRoute, { requiredRoles: ['admin', 'secretaria'], children: (0, jsx_runtime_1.jsx)(Layout_1.Layout, {}) })),
        children: [
            {
                path: '',
                element: (0, jsx_runtime_1.jsx)(MatriculasList_1.MatriculasList, {}),
            },
            {
                path: 'nova',
                element: (0, jsx_runtime_1.jsx)(MatriculaForm_1.MatriculaForm, {}),
            },
            {
                path: ':id',
                element: (0, jsx_runtime_1.jsx)(MatriculaDetails_1.MatriculaDetails, {}),
            },
        ],
    },
    {
        path: '*',
        element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/matriculas" }),
    },
];
exports.default = routes;
