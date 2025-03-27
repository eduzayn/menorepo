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
exports.CursoDetails = CursoDetails;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var cursoService_1 = require("../../services/cursoService");
var ui_components_1 = require("@edunexia/ui-components");
var outline_1 = require("@heroicons/react/24/outline");
function CursoDetails() {
    var _this = this;
    var id = (0, react_router_dom_1.useParams)().id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(null), curso = _a[0], setCurso = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    (0, react_1.useEffect)(function () {
        loadCurso();
    }, [id]);
    var loadCurso = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, cursoService_1.cursoService.buscarCurso(id)];
                case 1:
                    data = _a.sent();
                    setCurso(data);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError('Erro ao carregar curso');
                    console.error(err_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { children: "Carregando..." });
    }
    if (error) {
        return (0, jsx_runtime_1.jsx)("div", { className: "text-red-500", children: error });
    }
    if (!curso) {
        return (0, jsx_runtime_1.jsx)("div", { children: "Curso n\u00E3o encontrado" });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)(ui_components_1.Button, { variant: "ghost", onClick: function () { return navigate('/cursos'); }, className: "p-2", children: (0, jsx_runtime_1.jsx)(outline_1.ArrowLeftIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: curso.nome })] }), (0, jsx_runtime_1.jsxs)(ui_components_1.Button, { onClick: function () { return navigate("/cursos/".concat(curso.id, "/editar")); }, className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(outline_1.PencilIcon, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Editar" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-500", children: "Descri\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: curso.descricao || '-' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-500", children: "Modalidade" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900 capitalize", children: curso.modalidade })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-500", children: "Carga Hor\u00E1ria" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900", children: [curso.carga_horaria, " horas"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-500", children: "Dura\u00E7\u00E3o" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-gray-900", children: [curso.duracao_meses, " meses"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-500", children: "Status" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ".concat(curso.status === 'ativo'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'), children: curso.status }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-500", children: "Data de Cria\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: curso.created_at ? new Date(curso.created_at).toLocaleDateString() : '-' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-500", children: "\u00DAltima Atualiza\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-900", children: curso.updated_at ? new Date(curso.updated_at).toLocaleDateString() : '-' })] })] }) })] }));
}
