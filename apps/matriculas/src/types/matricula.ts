import { DbMatricula } from '@edunexia/database-schema'

export type MatriculaStatus = 'pendente' | 'ativa' | 'cancelada' | 'trancada' | 'concluida' | 'em_processo' | 'inadimplente' | 'reativada'

// Adicionando tipos para solicitações de cancelamento
export type StatusSolicitacaoCancelamento = 'pendente' | 'aprovada' | 'negada' | 'expirada'
export type MotivoCancelamento = 
  | 'financeiro' 
  | 'insatisfacao_curso' 
  | 'insatisfacao_atendimento'
  | 'transferencia_instituicao'
  | 'problemas_pessoais'
  | 'mudanca_cidade'
  | 'outros'

// Interface para filtros de matrícula
export interface MatriculaFilters {
  status?: MatriculaStatus
  alunoId?: string
  cursoId?: string
  dataInicio?: Date
  dataFim?: Date
  page?: number
  perPage?: number
}

// Interface para respostas paginadas
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    pageCount: number
  }
}

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
  modalidade: 'presencial' | 'online' | 'hibrido'
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

// Interface para solicitação de cancelamento
export interface SolicitacaoCancelamento {
  id: string
  matricula_id: string
  aluno_id: string
  motivo: MotivoCancelamento
  descricao: string
  status: StatusSolicitacaoCancelamento
  data_solicitacao: string
  data_analise?: string
  analisado_por?: string
  observacoes_analise?: string
  created_at: string
  updated_at: string
}

// Interface para o formulário de solicitação de cancelamento
export interface SolicitacaoCancelamentoForm {
  motivo: MotivoCancelamento
  descricao: string
}

// Interface para análise de solicitação de cancelamento
export interface AnaliseCancelamentoForm {
  status: 'aprovada' | 'negada'
  observacoes: string
} 