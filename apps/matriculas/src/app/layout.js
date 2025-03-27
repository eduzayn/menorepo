"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
var jsx_runtime_1 = require("react/jsx-runtime");
var google_1 = require("next/font/google");
require("./globals.css");
var providers_1 = require("./providers");
var inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'Módulo de Matrículas',
    description: 'Sistema de gerenciamento de matrículas',
};
function RootLayout(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)("html", { lang: "pt-BR", children: (0, jsx_runtime_1.jsx)("body", { className: inter.className, children: (0, jsx_runtime_1.jsx)(providers_1.Providers, { children: children }) }) }));
}
