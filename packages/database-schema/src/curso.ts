export interface Curso {
  id: string
  nome: string
  descricao?: string
  carga_horaria: number
  duracao_meses: number
  modalidade: 'presencial' | 'ead' | 'hibrido'
  coordenador_id: string
  institution_id: string
  created_at: string
  updated_at: string
} 