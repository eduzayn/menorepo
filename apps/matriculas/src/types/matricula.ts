import { DbMatricula } from '@edunexia/database-schema'

export type MatriculaStatus = 'ATIVA' | 'CANCELADA' | 'CONCLUIDA' | 'PENDENTE'

export interface Aluno {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  dataNascimento: Date
  endereco: string
}

export interface Curso {
  id: string
  nome: string
  descricao: string
  cargaHoraria: number
  duracaoMeses: number
  modalidade: 'PRESENCIAL' | 'ONLINE' | 'HIBRIDO'
}

export interface PlanoPagamento {
  id: string
  nome: string
  valorTotal: number
  numeroParcelas: number
  valorParcela: number
  taxaMatricula: number
  descontoPontualidade: number
  diaVencimento: number
}

export interface Matricula {
  id: string
  alunoId: string
  cursoId: string
  planoPagamentoId: string
  status: MatriculaStatus
  dataInicio: Date
  dataFim?: Date
  observacoes?: string
  createdAt: Date
  updatedAt: Date
}

export interface MatriculaDetalhada extends Matricula {
  aluno: Aluno
  curso: Curso
  plano: PlanoPagamento
}

export interface MatriculaFormData {
  aluno_id: string
  curso_id: string
  plano_id: string
  data_inicio: string
  data_conclusao_prevista: string
  observacoes: string | null
  status: MatriculaStatus
}

export interface MatriculaDetailsProps {
  matriculaId: string
  onClose: () => void
} 