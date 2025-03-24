export type MatriculaStatus = 'pendente' | 'ativa' | 'cancelada' | 'trancada' | 'concluida'
export type PaymentStatus = 'pendente' | 'aprovado' | 'recusado' | 'reembolsado'

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

export interface Documento {
  id: string
  matricula_id: string
  tipo: string
  nome: string
  url: string
  status: string
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface Contrato {
  id: string
  matricula_id: string
  numero_contrato: string
  data_assinatura?: string
  url_documento?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Pagamento {
  id: string
  matricula_id: string
  valor: number
  data_vencimento: string
  data_pagamento?: string
  status: PaymentStatus
  forma_pagamento?: string
  comprovante_url?: string
  created_at: string
  updated_at: string
} 