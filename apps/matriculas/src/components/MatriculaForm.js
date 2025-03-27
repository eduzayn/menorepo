'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatriculaForm = MatriculaForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var ui_components_1 = require("@edunexia/ui-components");
var useMatriculas_1 = require("../hooks/useMatriculas");
var matricula_1 = require("../schemas/matricula");
function MatriculaForm(_a) {
    var onSuccess = _a.onSuccess;
    var form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(matricula_1.matriculaSchema),
        defaultValues: {
            status: 'PENDENTE'
        }
    });
    var _b = (0, useMatriculas_1.useCriarMatricula)(), criarMatricula = _b.mutate, isPending = _b.isPending;
    function onSubmit(data) {
        criarMatricula(data, {
            onSuccess: function () {
                form.reset();
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            }
        });
    }
    return ((0, jsx_runtime_1.jsx)(ui_components_1.Form, __assign({}, form, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormField, { control: form.control, name: "alunoId", render: function (_a) {
                        var field = _a.field;
                        return ((0, jsx_runtime_1.jsxs)(ui_components_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormLabel, { children: "Aluno" }), (0, jsx_runtime_1.jsx)(ui_components_1.FormControl, { children: (0, jsx_runtime_1.jsx)(ui_components_1.Input, __assign({}, field, { placeholder: "ID do aluno" })) }), (0, jsx_runtime_1.jsx)(ui_components_1.FormMessage, {})] }));
                    } }), (0, jsx_runtime_1.jsx)(ui_components_1.FormField, { control: form.control, name: "cursoId", render: function (_a) {
                        var field = _a.field;
                        return ((0, jsx_runtime_1.jsxs)(ui_components_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormLabel, { children: "Curso" }), (0, jsx_runtime_1.jsx)(ui_components_1.FormControl, { children: (0, jsx_runtime_1.jsx)(ui_components_1.Input, __assign({}, field, { placeholder: "ID do curso" })) }), (0, jsx_runtime_1.jsx)(ui_components_1.FormMessage, {})] }));
                    } }), (0, jsx_runtime_1.jsx)(ui_components_1.FormField, { control: form.control, name: "planoPagamentoId", render: function (_a) {
                        var field = _a.field;
                        return ((0, jsx_runtime_1.jsxs)(ui_components_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormLabel, { children: "Plano de Pagamento" }), (0, jsx_runtime_1.jsx)(ui_components_1.FormControl, { children: (0, jsx_runtime_1.jsx)(ui_components_1.Input, __assign({}, field, { placeholder: "ID do plano de pagamento" })) }), (0, jsx_runtime_1.jsx)(ui_components_1.FormMessage, {})] }));
                    } }), (0, jsx_runtime_1.jsx)(ui_components_1.FormField, { control: form.control, name: "status", render: function (_a) {
                        var field = _a.field;
                        return ((0, jsx_runtime_1.jsxs)(ui_components_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormLabel, { children: "Status" }), (0, jsx_runtime_1.jsxs)(ui_components_1.Select, { onValueChange: field.onChange, defaultValue: field.value, children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormControl, { children: (0, jsx_runtime_1.jsx)(ui_components_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(ui_components_1.SelectValue, { placeholder: "Selecione o status" }) }) }), (0, jsx_runtime_1.jsxs)(ui_components_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(ui_components_1.SelectItem, { value: "PENDENTE", children: "Pendente" }), (0, jsx_runtime_1.jsx)(ui_components_1.SelectItem, { value: "ATIVA", children: "Ativa" }), (0, jsx_runtime_1.jsx)(ui_components_1.SelectItem, { value: "CANCELADA", children: "Cancelada" }), (0, jsx_runtime_1.jsx)(ui_components_1.SelectItem, { value: "CONCLUIDA", children: "Conclu\u00EDda" })] })] }), (0, jsx_runtime_1.jsx)(ui_components_1.FormMessage, {})] }));
                    } }), (0, jsx_runtime_1.jsx)(ui_components_1.FormField, { control: form.control, name: "dataInicio", render: function (_a) {
                        var field = _a.field;
                        return ((0, jsx_runtime_1.jsxs)(ui_components_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormLabel, { children: "Data de In\u00EDcio" }), (0, jsx_runtime_1.jsx)(ui_components_1.FormControl, { children: (0, jsx_runtime_1.jsx)(ui_components_1.Input, __assign({ type: "date" }, field, { value: field.value ? new Date(field.value).toISOString().split('T')[0] : '' })) }), (0, jsx_runtime_1.jsx)(ui_components_1.FormMessage, {})] }));
                    } }), (0, jsx_runtime_1.jsx)(ui_components_1.FormField, { control: form.control, name: "dataFim", render: function (_a) {
                        var field = _a.field;
                        return ((0, jsx_runtime_1.jsxs)(ui_components_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormLabel, { children: "Data de Fim" }), (0, jsx_runtime_1.jsx)(ui_components_1.FormControl, { children: (0, jsx_runtime_1.jsx)(ui_components_1.Input, __assign({ type: "date" }, field, { value: field.value ? new Date(field.value).toISOString().split('T')[0] : '' })) }), (0, jsx_runtime_1.jsx)(ui_components_1.FormMessage, {})] }));
                    } }), (0, jsx_runtime_1.jsx)(ui_components_1.FormField, { control: form.control, name: "observacoes", render: function (_a) {
                        var field = _a.field;
                        return ((0, jsx_runtime_1.jsxs)(ui_components_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(ui_components_1.FormLabel, { children: "Observa\u00E7\u00F5es" }), (0, jsx_runtime_1.jsx)(ui_components_1.FormControl, { children: (0, jsx_runtime_1.jsx)(ui_components_1.Textarea, __assign({}, field, { placeholder: "Observa\u00E7\u00F5es sobre a matr\u00EDcula" })) }), (0, jsx_runtime_1.jsx)(ui_components_1.FormMessage, {})] }));
                    } }), (0, jsx_runtime_1.jsx)(ui_components_1.Button, { type: "submit", disabled: isPending, children: isPending ? 'Criando...' : 'Criar Matrícula' })] }) })));
}
