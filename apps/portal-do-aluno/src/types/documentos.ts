export type TipoDocumento = 
  | 'RG'
  | 'CPF'
  | 'COMPROVANTE_RESIDENCIA'
  | 'HISTORICO_ESCOLAR'
  | 'DIPLOMA'
  | 'OUTROS'

export type StatusDocumento = 
  | 'PENDENTE'
  | 'APROVADO'
  | 'REJEITADO'

export interface ValidacaoDocumento {
  id: string
  documentoId: string
  status: StatusDocumento
  feedback: string
  dataValidacao: Date
  validadoPor: string
}

export interface Documento {
  id: string
  alunoId: string
  tipo: TipoDocumento
  nome: string
  url: string
  status: StatusDocumento
  dataUpload: Date
  validacao?: ValidacaoDocumento
} 