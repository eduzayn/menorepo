"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var MatriculaForm_1 = require("@/components/MatriculaForm");
function Home() {
    return ((0, jsx_runtime_1.jsxs)("main", { className: "container mx-auto py-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold mb-8", children: "M\u00F3dulo de Matr\u00EDculas" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold mb-4", children: "Nova Matr\u00EDcula" }), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { children: "Carregando..." }), children: (0, jsx_runtime_1.jsx)(MatriculaForm_1.MatriculaForm, {}) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold mb-4", children: "Matr\u00EDculas Recentes" }), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { children: "Carregando..." }), children: (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Em breve..." }) })] })] })] }));
}
