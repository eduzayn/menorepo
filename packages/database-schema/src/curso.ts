export interface Curso {
  id: string
  nome: string
  descricao?: string
  carga_horaria: number
  duracao_meses: number
  modalidade: 'presencial' | 'ead' | 'hibrido'
  coordenador_id: string
  institution_id: string
  status: 'ativo' | 'inativo'
  created_at: string
  updated_at: string
}

export type CursoFormData = Omit<Curso, 'id' | 'created_at' | 'updated_at'> 