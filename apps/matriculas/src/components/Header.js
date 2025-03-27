"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = Header;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
function Header() {
    return ((0, jsx_runtime_1.jsx)("header", { className: "bg-white shadow", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsx)("div", { className: "flex justify-between h-16", children: (0, jsx_runtime_1.jsx)("div", { className: "flex", children: (0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 flex items-center", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "text-xl font-bold text-gray-900", children: "EduNexia" }) }) }) }) }) }));
}
