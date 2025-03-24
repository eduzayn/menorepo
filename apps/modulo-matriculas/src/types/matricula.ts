export interface Matricula {
  id: string
  nome: string
  cpf: string
  dataNascimento: string
  email: string
  telefone: string
  endereco: string
  curso: string
  periodo: string
  status: 'ativa' | 'cancelada' | 'concluida'
  dataMatricula: string
  observacoes?: string
}

export interface MatriculaFormData {
  nome: string
  cpf: string
  dataNascimento: string
  email: string
  telefone: string
  endereco: string
  curso: string
  periodo: string
  observacoes?: string
}

export interface MatriculaDetailsProps {
  matriculaId: string
  onClose: () => void
} 