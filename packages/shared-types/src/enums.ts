/**
 * Enums comuns utilizados na aplicação
 */

/**
 * Status do pagamento
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REFUSED = 'refused',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

/**
 * Métodos de pagamento
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer'
}

/**
 * Status da matrícula
 */
export enum MatriculaStatus {
  PENDENTE = 'pendente',
  EM_ANALISE = 'em_analise',
  APROVADA = 'aprovada',
  REPROVADA = 'reprovada',
  CANCELADA = 'cancelada'
}

/**
 * Modalidades de curso
 */
export enum ModalidadeCurso {
  PRESENCIAL = 'presencial',
  SEMIPRESENCIAL = 'semipresencial',
  EAD = 'ead'
}

/**
 * Níveis de ensino
 */
export enum NivelEnsino {
  GRADUACAO = 'graduacao',
  POS_GRADUACAO = 'pos_graduacao',
  TECNICO = 'tecnico',
  EXTENSAO = 'extensao',
  LIVRE = 'livre'
}

/**
 * Status de documentos
 */
export enum DocumentoStatus {
  PENDENTE = 'pendente',
  ENVIADO = 'enviado',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado'
} 