import { DbMatricula } from '@edunexia/database-schema'

export type MatriculaStatus = 'pendente' | 'ativa' | 'cancelada' | 'trancada' | 'concluida'

export interface Aluno {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  data_nascimento: string
  endereco?: string
  created_at: string
  updated_at: string
}

export interface Curso {
  id: string
  nome: string
  descricao?: string
  carga_horaria: number
  duracao_meses: number
  modalidade: string
  coordenador_id?: string
  institution_id: string
  created_at: string
  updated_at: string
}

export interface PlanoPagamento {
  id: string
  curso_id: string
  nome: string
  valor_total: number
  numero_parcelas: number
  valor_parcela: number
  taxa_matricula: number
  desconto_pontualidade: number
  dia_vencimento: number
  created_at: string
  updated_at: string
}

export interface Matricula {
  id: string
  aluno_id: string
  curso_id: string
  plano_id: string
  status: MatriculaStatus
  data_inicio: string
  data_conclusao_prevista: string
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface MatriculaDetalhada extends Matricula {
  aluno: Aluno
  curso: Curso
  plano: PlanoPagamento
}

export type { DbMatricula as Matricula }

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