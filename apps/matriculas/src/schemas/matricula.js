"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matriculaFiltersSchema = exports.matriculaSchema = void 0;
var zod_1 = require("zod");
var matriculaStatus = ['ATIVA', 'CANCELADA', 'CONCLUIDA', 'PENDENTE'];
exports.matriculaSchema = zod_1.z.object({
    alunoId: zod_1.z.string().uuid({
        message: 'ID do aluno inválido'
    }),
    cursoId: zod_1.z.string().uuid({
        message: 'ID do curso inválido'
    }),
    planoPagamentoId: zod_1.z.string().uuid({
        message: 'ID do plano de pagamento inválido'
    }),
    status: zod_1.z.enum(matriculaStatus, {
        errorMap: function () { return ({ message: 'Status inválido' }); }
    }),
    dataInicio: zod_1.z.coerce.date({
        errorMap: function () { return ({ message: 'Data de início inválida' }); }
    }),
    dataFim: zod_1.z.coerce.date({
        errorMap: function () { return ({ message: 'Data de fim inválida' }); }
    }).optional(),
    observacoes: zod_1.z.string().max(1000, {
        message: 'Observações não podem ter mais de 1000 caracteres'
    }).optional()
});
exports.matriculaFiltersSchema = zod_1.z.object({
    status: zod_1.z.enum(matriculaStatus).optional(),
    alunoId: zod_1.z.string().uuid().optional(),
    cursoId: zod_1.z.string().uuid().optional(),
    dataInicio: zod_1.z.coerce.date().optional(),
    dataFim: zod_1.z.coerce.date().optional(),
    page: zod_1.z.number().int().positive().optional(),
    perPage: zod_1.z.number().int().positive().optional()
});
