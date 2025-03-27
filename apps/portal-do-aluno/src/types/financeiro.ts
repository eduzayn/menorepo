/**
 * Tipos para o módulo financeiro do Portal do Aluno
 */

// Status de parcela
export type StatusParcela = 'aberta' | 'paga' | 'atrasada' | 'negociando' | 'acordo' | 'cancelada';

// Status de negociação
export type StatusNegociacao = 'pendente' | 'aprovada' | 'rejeitada' | 'expirada' | 'concluida';

// Métodos de pagamento
export type MetodoPagamento = 'boleto' | 'pix' | 'cartao_credito' | 'cartao_debito';

// Interface para parcela
export interface Parcela {
  id: string;
  alunoId: string;
  matriculaId: string;
  cursoId: string;
  valor: number;
  valorOriginal: number;
  dataVencimento: string; // ISO date string
  dataPagamento?: string; // ISO date string
  status: StatusParcela;
  numeroParcela: number;
  totalParcelas: number;
  codigoBarras?: string;
  linkPagamento?: string;
  multa?: number;
  juros?: number;
  desconto?: number;
  comprovantePagamentoUrl?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Interface para proposta de negociação
export interface PropostaNegociacao {
  id: string;
  alunoId: string;
  parcelaIds: string[]; // IDs das parcelas incluídas na negociação
  valorTotal: number; // Valor total da dívida (soma das parcelas)
  valorProposto: number; // Valor proposto pelo aluno
  desconto: number; // Percentual de desconto
  justificativa?: string; // Justificativa do aluno para o pedido de desconto
  numeroParcelas: number; // Em quantas parcelas quer dividir
  dataPrimeiraParcela: string; // ISO date string
  status: StatusNegociacao;
  metodoPagamento: MetodoPagamento;
  dataAprovacao?: string; // ISO date string
  aprovadoPor?: string; // ID do usuário que aprovou
  observacaoInterna?: string; // Observação da instituição (não visível ao aluno)
  feedbackAluno?: string; // Feedback para o aluno (visível ao aluno)
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Interface para parcela de acordo
export interface ParcelaAcordo {
  id: string;
  negociacaoId: string;
  valor: number;
  dataVencimento: string; // ISO date string
  dataPagamento?: string; // ISO date string
  status: StatusParcela;
  numeroParcela: number;
  totalParcelas: number;
  codigoBarras?: string;
  linkPagamento?: string;
  comprovantePagamentoUrl?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Interface para estatísticas financeiras do aluno
export interface EstatisticasFinanceiras {
  totalAberto: number;
  totalAtrasado: number;
  parcelasEmDia: number;
  parcelasAtrasadas: number;
  parcelasNegociando: number;
  acordosVigentes: number;
  descontosObtidos: number;
}

// Interface para regras de negociação automática
export interface RegrasNegociacao {
  descontoMaximoAutomatico: number; // Percentual máximo de desconto automático
  parcelasMaximoAutomatico: number; // Número máximo de parcelas para aprovação automática
  diasAtrasoMinimo: number; // Dias mínimos de atraso para permitir negociação
  valorMinimoNegociacao: number; // Valor mínimo para negociação
  permitirMultiplasNegociacoes: boolean; // Se permite múltiplas negociações simultâneas
}

// Interface para histórico de negociações
export interface HistoricoNegociacao {
  id: string;
  negociacaoId: string;
  data: string; // ISO date string
  acao: 'criacao' | 'aprovacao' | 'rejeicao' | 'contraproposta' | 'pagamento' | 'cancelamento';
  usuarioId?: string; // ID do usuário que executou a ação (se aplicável)
  detalhes?: string; // Detalhes da ação
  created_at: string; // ISO date string
} 