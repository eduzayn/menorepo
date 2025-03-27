"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.CursoForm = CursoForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var cursoService_1 = require("../../services/cursoService");
var ui_components_1 = require("@edunexia/ui-components");
function CursoForm() {
    var _this = this;
    var id = (0, react_router_dom_1.useParams)().id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    var _c = (0, react_1.useState)({
        nome: '',
        descricao: '',
        modalidade: 'presencial',
        carga_horaria: 0,
        duracao_meses: 0,
        status: 'ativo',
        coordenador_id: '',
        institution_id: ''
    }), curso = _c[0], setCurso = _c[1];
    (0, react_1.useEffect)(function () {
        if (id) {
            loadCurso();
        }
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
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    setLoading(true);
                    if (!id) return [3 /*break*/, 3];
                    return [4 /*yield*/, cursoService_1.cursoService.atualizarCurso(id, curso)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, cursoService_1.cursoService.criarCurso(curso)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    navigate('/cursos');
                    return [3 /*break*/, 8];
                case 6:
                    err_2 = _a.sent();
                    setError('Erro ao salvar curso');
                    console.error(err_2);
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setCurso(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { children: "Carregando..." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: id ? 'Editar Curso' : 'Novo Curso' }), (0, jsx_runtime_1.jsx)(ui_components_1.Button, { variant: "outline", onClick: function () { return navigate('/cursos'); }, children: "Cancelar" })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 text-red-700 p-4 rounded-md", children: error })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "nome", className: "block text-sm font-medium text-gray-700", children: "Nome do Curso" }), (0, jsx_runtime_1.jsx)(ui_components_1.Input, { type: "text", name: "nome", id: "nome", value: curso.nome, onChange: handleChange, required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "descricao", className: "block text-sm font-medium text-gray-700", children: "Descri\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)(ui_components_1.Textarea, { name: "descricao", id: "descricao", value: curso.descricao, onChange: handleChange, rows: 4 })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "modalidade", className: "block text-sm font-medium text-gray-700", children: "Modalidade" }), (0, jsx_runtime_1.jsxs)(ui_components_1.Select, { name: "modalidade", id: "modalidade", value: curso.modalidade, onChange: handleChange, required: true, children: [(0, jsx_runtime_1.jsx)("option", { value: "presencial", children: "Presencial" }), (0, jsx_runtime_1.jsx)("option", { value: "ead", children: "EAD" }), (0, jsx_runtime_1.jsx)("option", { value: "hibrido", children: "H\u00EDbrido" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "carga_horaria", className: "block text-sm font-medium text-gray-700", children: "Carga Hor\u00E1ria (horas)" }), (0, jsx_runtime_1.jsx)(ui_components_1.Input, { type: "number", name: "carga_horaria", id: "carga_horaria", value: curso.carga_horaria, onChange: handleChange, required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "duracao_meses", className: "block text-sm font-medium text-gray-700", children: "Dura\u00E7\u00E3o (meses)" }), (0, jsx_runtime_1.jsx)(ui_components_1.Input, { type: "number", name: "duracao_meses", id: "duracao_meses", value: curso.duracao_meses, onChange: handleChange, required: true })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700", children: "Status" }), (0, jsx_runtime_1.jsxs)(ui_components_1.Select, { name: "status", id: "status", value: curso.status, onChange: handleChange, required: true, children: [(0, jsx_runtime_1.jsx)("option", { value: "ativo", children: "Ativo" }), (0, jsx_runtime_1.jsx)("option", { value: "inativo", children: "Inativo" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsx)(ui_components_1.Button, { type: "submit", disabled: loading, children: loading ? 'Salvando...' : 'Salvar' }) })] })] }));
}
