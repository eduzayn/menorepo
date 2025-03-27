"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlunoSelect = AlunoSelect;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var Button_1 = require("@repo/ui-components/components/Button");
var Command_1 = require("@repo/ui-components/components/Command");
var Popover_1 = require("@repo/ui-components/components/Popover");
var react_query_1 = require("@tanstack/react-query");
var alunoService_1 = require("@/services/alunoService");
function AlunoSelect(_a) {
    var value = _a.value, onChange = _a.onChange, onAlunoChange = _a.onAlunoChange;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['alunos'],
        queryFn: function () { return alunoService_1.alunoService.listarAlunos(); }
    }), _d = _c.data, alunos = _d === void 0 ? [] : _d, isLoading = _c.isLoading;
    var selectedAluno = alunos.find(function (aluno) { return aluno.id === value; });
    return ((0, jsx_runtime_1.jsxs)(Popover_1.Popover, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(Popover_1.PopoverTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "outline", role: "combobox", "aria-expanded": open, className: "w-full justify-between", children: [value
                            ? selectedAluno === null || selectedAluno === void 0 ? void 0 : selectedAluno.nome
                            : "Selecione um aluno...", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })] }) }), (0, jsx_runtime_1.jsx)(Popover_1.PopoverContent, { className: "w-full p-0", children: (0, jsx_runtime_1.jsxs)(Command_1.Command, { children: [(0, jsx_runtime_1.jsx)(Command_1.CommandInput, { placeholder: "Buscar aluno..." }), (0, jsx_runtime_1.jsx)(Command_1.CommandEmpty, { children: "Nenhum aluno encontrado." }), (0, jsx_runtime_1.jsx)(Command_1.CommandGroup, { children: alunos.map(function (aluno) { return ((0, jsx_runtime_1.jsxs)(Command_1.CommandItem, { value: aluno.id, onSelect: function (currentValue) {
                                    onChange(currentValue === value ? "" : currentValue);
                                    onAlunoChange === null || onAlunoChange === void 0 ? void 0 : onAlunoChange(aluno);
                                    setOpen(false);
                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: (0, utils_1.cn)("mr-2 h-4 w-4", value === aluno.id ? "opacity-100" : "opacity-0") }), aluno.nome] }, aluno.id)); }) })] }) })] }));
}
