"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMatriculas = useMatriculas;
exports.useMatricula = useMatricula;
exports.useCriarMatricula = useCriarMatricula;
exports.useAtualizarMatricula = useAtualizarMatricula;
exports.useCancelarMatricula = useCancelarMatricula;
var react_query_1 = require("@tanstack/react-query");
var matriculaService_1 = require("../services/matriculaService");
var sonner_1 = require("sonner");
var errors_1 = require("../lib/errors");
function useMatriculas(filters) {
    return (0, react_query_1.useQuery)({
        queryKey: matriculaService_1.matriculaKeys.list(filters || {}),
        queryFn: function () { return matriculaService_1.matriculaService.listarMatriculas(filters); },
    });
}
function useMatricula(id) {
    return (0, react_query_1.useQuery)({
        queryKey: matriculaService_1.matriculaKeys.detail(id),
        queryFn: function () { return matriculaService_1.matriculaService.buscarMatricula(id); },
        enabled: !!id
    });
}
function useCriarMatricula() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: matriculaService_1.matriculaService.criarMatricula,
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: matriculaService_1.matriculaKeys.lists() });
            sonner_1.toast.success('Matrícula criada com sucesso');
        },
        onError: function (error) {
            if (error instanceof errors_1.AppError) {
                sonner_1.toast.error(error.message);
            }
            else {
                sonner_1.toast.error('Erro ao criar matrícula');
            }
        }
    });
}
function useAtualizarMatricula() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            return matriculaService_1.matriculaService.atualizarMatricula(id, data);
        },
        onSuccess: function (_, _a) {
            var id = _a.id;
            queryClient.invalidateQueries({ queryKey: matriculaService_1.matriculaKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: matriculaService_1.matriculaKeys.lists() });
            sonner_1.toast.success('Matrícula atualizada com sucesso');
        },
        onError: function (error) {
            if (error instanceof errors_1.AppError) {
                sonner_1.toast.error(error.message);
            }
            else {
                sonner_1.toast.error('Erro ao atualizar matrícula');
            }
        }
    });
}
function useCancelarMatricula() {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, observacoes = _a.observacoes;
            return matriculaService_1.matriculaService.cancelarMatricula(id, observacoes);
        },
        onSuccess: function (_, _a) {
            var id = _a.id;
            queryClient.invalidateQueries({ queryKey: matriculaService_1.matriculaKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: matriculaService_1.matriculaKeys.lists() });
            sonner_1.toast.success('Matrícula cancelada com sucesso');
        },
        onError: function (error) {
            if (error instanceof errors_1.AppError) {
                sonner_1.toast.error(error.message);
            }
            else {
                sonner_1.toast.error('Erro ao cancelar matrícula');
            }
        }
    });
}
