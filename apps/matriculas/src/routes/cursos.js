"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursosRoutes = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var CursosList_1 = require("../components/cursos/CursosList");
var CursoForm_1 = require("../components/cursos/CursoForm");
var CursoDetails_1 = require("../components/cursos/CursoDetails");
var PrivateRoute_1 = require("../components/PrivateRoute");
exports.cursosRoutes = [
    {
        path: '/cursos',
        element: ((0, jsx_runtime_1.jsx)(PrivateRoute_1.PrivateRoute, { requiredRoles: ['admin', 'coordenador'], children: (0, jsx_runtime_1.jsx)(CursosList_1.CursosList, {}) }))
    },
    {
        path: '/cursos/novo',
        element: ((0, jsx_runtime_1.jsx)(PrivateRoute_1.PrivateRoute, { requiredRoles: ['admin'], children: (0, jsx_runtime_1.jsx)(CursoForm_1.CursoForm, {}) }))
    },
    {
        path: '/cursos/:id',
        element: ((0, jsx_runtime_1.jsx)(PrivateRoute_1.PrivateRoute, { requiredRoles: ['admin', 'coordenador'], children: (0, jsx_runtime_1.jsx)(CursoDetails_1.CursoDetails, {}) }))
    },
    {
        path: '/cursos/:id/edit',
        element: ((0, jsx_runtime_1.jsx)(PrivateRoute_1.PrivateRoute, { requiredRoles: ['admin'], children: (0, jsx_runtime_1.jsx)(CursoForm_1.CursoForm, {}) }))
    }
];
