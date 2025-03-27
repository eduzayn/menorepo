"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var routes_1 = __importDefault(require("./routes"));
function App() {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Routes, { children: routes_1.default.map(function (route) {
            var _a;
            return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: route.path, element: route.element, children: (_a = route.children) === null || _a === void 0 ? void 0 : _a.map(function (childRoute) { return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: childRoute.path, element: childRoute.element }, childRoute.path)); }) }, route.path));
        }) }));
}
exports.default = App;
