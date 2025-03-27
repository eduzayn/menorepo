"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = Layout;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var ui_components_1 = require("@edunexia/ui-components");
var auth_1 = require("@edunexia/auth");
function Layout() {
    var _this = this;
    var _a = (0, auth_1.useAuth)(), user = _a.user, signOut = _a.signOut;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signOut()];
                case 1:
                    _a.sent();
                    navigate('/login');
                    return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gray-100", children: [(0, jsx_runtime_1.jsx)("nav", { className: "bg-white shadow-md", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between h-16", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 flex items-center", children: (0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-bold text-gray-800", children: "Sistema de Matr\u00EDculas" }) }), (0, jsx_runtime_1.jsx)("div", { className: "hidden sm:ml-6 sm:flex sm:space-x-8", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/matriculas", className: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Matr\u00EDculas" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-700 mr-4", children: user === null || user === void 0 ? void 0 : user.email }), (0, jsx_runtime_1.jsx)(ui_components_1.Button, { onClick: handleLogout, variant: "secondary", children: "Sair" })] })] }) }) }), (0, jsx_runtime_1.jsx)("main", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-6 sm:px-0", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) }) })] }));
}
