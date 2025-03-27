"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = __importDefault(require("./Sidebar"));
var Header_1 = __importDefault(require("./Header"));
var Layout = function () {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-screen bg-gray-100", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsx)("main", { className: "flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) })] })] }));
};
exports.default = Layout;
