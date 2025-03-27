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
exports.CursoSelect = CursoSelect;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var Button_1 = require("@repo/ui-components/components/Button");
var Command_1 = require("@repo/ui-components/components/Command");
var Popover_1 = require("@repo/ui-components/components/Popover");
var react_query_1 = require("@tanstack/react-query");
var cursoService_1 = require("@/services/cursoService");
function CursoSelect(_a) {
    var _this = this;
    var value = _a.value, onChange = _a.onChange, onCursoChange = _a.onCursoChange, onPlanoPagamentoChange = _a.onPlanoPagamentoChange;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['cursos'],
        queryFn: function () { return cursoService_1.cursoService.listarCursos(); }
    }), _d = _c.data, cursos = _d === void 0 ? [] : _d, isLoading = _c.isLoading;
    var selectedCurso = cursos.find(function (curso) { return curso.id === value; });
    var handleSelect = function (currentValue) { return __awaiter(_this, void 0, void 0, function () {
        var curso, planos, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentValue === value)) return [3 /*break*/, 1];
                    onChange("");
                    onCursoChange === null || onCursoChange === void 0 ? void 0 : onCursoChange(null);
                    onPlanoPagamentoChange === null || onPlanoPagamentoChange === void 0 ? void 0 : onPlanoPagamentoChange([]);
                    return [3 /*break*/, 5];
                case 1:
                    onChange(currentValue);
                    curso = cursos.find(function (c) { return c.id === currentValue; }) || null;
                    onCursoChange === null || onCursoChange === void 0 ? void 0 : onCursoChange(curso);
                    if (!onPlanoPagamentoChange) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, cursoService_1.cursoService.buscarPlanosPagamento(currentValue)];
                case 3:
                    planos = _a.sent();
                    onPlanoPagamentoChange(planos);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Erro ao buscar planos de pagamento:', error_1);
                    onPlanoPagamentoChange([]);
                    return [3 /*break*/, 5];
                case 5:
                    setOpen(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)(Popover_1.Popover, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(Popover_1.PopoverTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "outline", role: "combobox", "aria-expanded": open, className: "w-full justify-between", children: [value
                            ? selectedCurso === null || selectedCurso === void 0 ? void 0 : selectedCurso.nome
                            : "Selecione um curso...", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })] }) }), (0, jsx_runtime_1.jsx)(Popover_1.PopoverContent, { className: "w-full p-0", children: (0, jsx_runtime_1.jsxs)(Command_1.Command, { children: [(0, jsx_runtime_1.jsx)(Command_1.CommandInput, { placeholder: "Buscar curso..." }), (0, jsx_runtime_1.jsx)(Command_1.CommandEmpty, { children: "Nenhum curso encontrado." }), (0, jsx_runtime_1.jsx)(Command_1.CommandGroup, { children: cursos.map(function (curso) { return ((0, jsx_runtime_1.jsxs)(Command_1.CommandItem, { value: curso.id, onSelect: handleSelect, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: (0, utils_1.cn)("mr-2 h-4 w-4", value === curso.id ? "opacity-100" : "opacity-0") }), curso.nome] }, curso.id)); }) })] }) })] }));
}
