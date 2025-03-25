import { DbMatricula } from '@edunexia/database-schema'

export interface MatriculaDetalhada extends DbMatricula {
  nomeAluno: string
  nomeCurso: string
  dataMatricula: string
}

export type { DbMatricula as Matricula }

export interface MatriculaFormData {
  aluno_id: string
  curso_id: string
  plano_id: string
  data_inicio: string
  data_conclusao_prevista: string
  observacoes: string | null
  status: 'pendente' | 'ativa' | 'cancelada' | 'trancada' | 'concluida'
}

export interface MatriculaDetailsProps {
  matriculaId: string
  onClose: () => void
} 