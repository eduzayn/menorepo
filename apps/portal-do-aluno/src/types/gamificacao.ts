export type TipoAtividade = 
  | 'AULA'
  | 'EXERCICIO'
  | 'FORUM'
  | 'DESAFIO'
  | 'EVENTO'
  | 'AJUDA'

export interface Conquista {
  id: string
  nome: string
  descricao: string
  pontos: number
  icone: string
  requisitos: {
    tipo: TipoAtividade
    quantidade: number
  }[]
}

export interface ProgressoAluno {
  alunoId: string
  pontos: number
  nivel: number
  conquistas: string[] // IDs das conquistas
  atividadesCompletas: number
  tempoEstudo: number // em minutos
}

export interface AtividadeGamificada {
  id: string
  tipo: TipoAtividade
  nome: string
  descricao: string
  pontos: number
  dataLimite?: Date
  requisitos?: {
    tipo: TipoAtividade
    quantidade: number
  }[]
} 