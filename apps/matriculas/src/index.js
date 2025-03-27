"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var Layout_1 = require("./components/Layout");
var MatriculasList_1 = require("./components/MatriculasList");
var MatriculaForm_1 = require("./components/MatriculaForm");
var MatriculaDetails_1 = require("./components/MatriculaDetails");
exports.router = (0, react_router_dom_1.createBrowserRouter)([
    {
        path: '/matriculas',
        element: (0, jsx_runtime_1.jsx)(Layout_1.Layout, {}),
        children: [
            {
                index: true,
                element: (0, jsx_runtime_1.jsx)(MatriculasList_1.MatriculasList, {})
            },
            {
                path: 'nova',
                element: (0, jsx_runtime_1.jsx)(MatriculaForm_1.MatriculaForm, {})
            },
            {
                path: ':id',
                element: (0, jsx_runtime_1.jsx)(MatriculaDetails_1.MatriculaDetails, {})
            }
        ]
    }
]);
exports.default = exports.router;
