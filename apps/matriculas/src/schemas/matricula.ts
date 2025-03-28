import { z } from 'zod'

const matriculaStatus = ['ATIVA', 'CANCELADA', 'CONCLUIDA', 'PENDENTE'] as const

export const matriculaSchema = z.object({
  alunoId: z.string().uuid({
    message: 'ID do aluno inválido'
  }),
  cursoId: z.string().uuid({
    message: 'ID do curso inválido'
  }),
  planoPagamentoId: z.string().uuid({
    message: 'ID do plano de pagamento inválido'
  }),
  status: z.enum(matriculaStatus, {
    errorMap: () => ({ message: 'Status inválido' })
  }),
  dataInicio: z.coerce.date({
    errorMap: () => ({ message: 'Data de início inválida' })
  }),
  dataFim: z.coerce.date({
    errorMap: () => ({ message: 'Data de fim inválida' })
  }).optional(),
  observacoes: z.string().max(1000, {
    message: 'Observações não podem ter mais de 1000 caracteres'
  }).optional()
})

export type MatriculaInput = z.input<typeof matriculaSchema>
export type MatriculaOutput = z.output<typeof matriculaSchema>

export const matriculaFiltersSchema = z.object({
  status: z.enum(matriculaStatus).optional(),
  alunoId: z.string().uuid().optional(),
  cursoId: z.string().uuid().optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional()
})

export type MatriculaFiltersInput = z.input<typeof matriculaFiltersSchema>
export type MatriculaFiltersOutput = z.output<typeof matriculaFiltersSchema> 