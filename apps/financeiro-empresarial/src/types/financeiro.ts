/**
 * Tipos para o módulo financeiro empresarial
 */

/**
 * Status possíveis para uma cobrança
 */
export type StatusCobranca = 'pendente' | 'pago' | 'vencido' | 'cancelado';

/**
 * Tipos de cobrança
 */
export type TipoCobranca = 'mensalidade' | 'taxa' | 'material' | 'uniforme' | 'outro';

/**
 * Métodos de pagamento suportados
 */
export type MetodoPagamento = 'pix' | 'boleto' | 'cartao' | 'transferencia' | 'dinheiro' | null;

/**
 * Gateways de pagamento integrados
 */
export type GatewayPagamento = 'littex' | 'infinitepay' | 'manual';

/**
 * Categorias financeiras para contabilidade
 */
export type CategoriaFinanceira =
  | 'mensalidade'
  | 'matricula'
  | 'taxa'
  | 'multa'
  | 'desconto'
  | 'comissao'
  | 'salario'
  | 'aluguel'
  | 'servico'
  | 'marketing'
  | 'outros';

/**
 * Tipo de lançamento financeiro (entrada ou saída)
 */
export type TipoLancamento = 'entrada' | 'saida';

/**
 * Status do pagamento
 */
export type StatusPagamento = 'confirmado' | 'pendente' | 'cancelado' | 'estornado';

/**
 * Tipo de destinatário
 */
export type TipoDestinatario = 'aluno' | 'polo' | 'consultor' | 'fornecedor';

/**
 * Tipo de ação em logs financeiros
 */
export type TipoAcao = 'criacao' | 'alteracao' | 'cancelamento' | 'estorno' | 'pagamento';

/**
 * Tipo de entidade financeira
 */
export type TipoEntidade = 'cobranca' | 'pagamento' | 'comissao' | 'taxa';

/**
 * Tipo de beneficiário
 */
export type TipoBeneficiario = 'polo' | 'consultor';

/**
 * Ambiente de gateway
 */
export type AmbienteGateway = 'producao' | 'teste';

/**
 * Status da instituição
 */
export type StatusInstituicao = 'ativo' | 'inativo' | 'pendente';

/**
 * Interface para cobrança
 */
export interface Cobranca {
  id: string;
  aluno_id: string;
  aluno_nome: string;
  valor: number;
  valor_total?: number;
  valor_pago?: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: StatusCobranca;
  tipo: TipoCobranca;
  forma_pagamento?: MetodoPagamento;
  link_pagamento?: string;
  observacoes?: string;
  gateway?: GatewayPagamento;
  gateway_id?: string;
}

/**
 * Interface para pagamento (entrada ou saída financeira)
 */
export interface Pagamento {
  id: string;
  cobranca_id?: string;
  tipo: TipoLancamento;
  categoria: CategoriaFinanceira;
  valor: number;
  data_pagamento: string;
  forma_pagamento: MetodoPagamento;
  status: StatusPagamento;
  destinatario_id?: string;
  destinatario_tipo?: TipoDestinatario;
  descricao: string;
  comprovante_url?: string;
  instituicao_id: string;
  criado_por: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface para comissão
 */
export interface Comissao {
  id: string;
  colaborador_id: string;
  colaborador_nome: string;
  valor: number;
  percentual: number;
  base_calculo: number;
  data_referencia: string;
  data_pagamento?: string;
  status: StatusCobranca;
  observacoes?: string;
}

/**
 * Interface para taxa administrativa
 */
export interface TaxaAdministrativa {
  id: string;
  nome: string;
  descricao: string;
  valor: number | null;
  percentual: number | null;
  ativo: boolean;
  aplicacao: 'matricula' | 'mensalidade' | 'material' | 'certificado' | 'todas';
}

/**
 * Interface para resumo de Dashboard
 */
export interface DashboardResumo {
  receitas_mes_atual: number;
  despesas_mes_atual: number;
  saldo_atual: number;
  inadimplencia_total: number;
  percentual_inadimplencia: number;
  cobrancas_pendentes: number;
  cobrancas_pagas: number;
  cobrancas_vencidas: number;
  comissoes_a_pagar: number;
}

/**
 * Interface para configurações do gateway de pagamento
 */
export interface ConfiguracaoGateway {
  id: string;
  gateway: GatewayPagamento;
  chave_api?: string;
  token_secreto?: string;
  ambiente: AmbienteGateway;
  webhook_url?: string;
  taxa_percentual?: number;
  taxa_fixa?: number;
  padrao_para: MetodoPagamento[];
  ativo: boolean;
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface para regra de comissão
 */
export interface RegraComissao {
  id: string;
  tipo_beneficiario: TipoBeneficiario;
  curso_id?: string;
  valor_fixo?: number;
  percentual?: number;
  recorrente: boolean;
  parcelas_aplicaveis?: number[];
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface para log financeiro (auditoria)
 */
export interface LogFinanceiro {
  id: string;
  entidade_tipo: TipoEntidade;
  entidade_id: string;
  acao: TipoAcao;
  valor_anterior?: Record<string, any>;
  valor_novo?: Record<string, any>;
  usuario_id: string;
  ip_usuario?: string;
  created_at: string;
}

/**
 * Interface para parâmetros de relatórios
 */
export interface ParametrosRelatorio {
  data_inicio: string;
  data_fim: string;
  tipo_relatorio: 'receitas' | 'despesas' | 'fluxo_caixa' | 'inadimplencia' | 'comissoes' | 'dre';
  categorias?: CategoriaFinanceira[];
  polo_id?: string;
  curso_id?: string;
  formato_saida: 'json' | 'excel' | 'pdf';
  agrupar_por?: 'dia' | 'semana' | 'mes' | 'categoria' | 'curso' | 'polo';
}

/**
 * Interface para integração com contabilidade
 */
export interface LancamentoContabil {
  id: string;
  pagamento_id?: string;
  cobranca_id?: string;
  tipo: 'debito' | 'credito';
  conta_contabil: string;
  centro_custo?: string;
  valor: number;
  data_lancamento: string;
  descricao: string;
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

export interface Instituicao {
  id: string;
  nome: string;
  cnpj: string;
  status: StatusInstituicao;
}

export interface PlanoFinanceiro {
  id: string;
  nome: string;
  valor_total: number;
  parcelas: number;
  taxa_juros?: number;
  desconto_pagamento_unico?: number;
  permitir_pagamento_parcial: boolean;
  ativo: boolean;
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

export interface Lancamento {
  id: string;
  tipo: TipoLancamento;
  categoria: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: StatusCobranca;
  aluno_id?: string;
  responsavel_id?: string;
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

export interface DadoRelatorio {
  id: string;
  periodo: string;
  valor: number;
  total_alunos?: number;
  total_inadimplentes?: number;
  categoria?: string;
  sub_categoria?: string; 
}

export interface MetricaFinanceira {
  titulo: string;
  valor: string | number;
  icone: React.ReactNode;
  tendencia?: 'positiva' | 'negativa' | 'neutra';
  variacao?: number;
}

/**
 * Tipos de status para despesas
 */
export type StatusDespesa = 'pendente' | 'pago' | 'vencido' | 'cancelado';

/**
 * Categorias de despesa
 */
export type CategoriaDespesa = 'folha' | 'fornecedor' | 'aluguel' | 'servicos' | 'impostos' | 'marketing' | 'outro';

/**
 * Interface de Despesa
 */
export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: StatusDespesa;
  categoria: CategoriaDespesa;
  forma_pagamento?: MetodoPagamento;
  observacoes?: string;
}

/**
 * Aplicação da taxa
 */
export type TipoAplicacaoTaxa = 'matricula' | 'mensalidade' | 'material' | 'certificado' | 'todas';

/**
 * Interface para o dashboard financeiro
 */
export interface DadosDashboard {
  receitas: {
    total: number;
    pendente: number;
    recebido: number;
    vencido: number;
  };
  despesas: {
    total: number;
    pendente: number;
    pago: number;
    vencido: number;
  };
  fluxoCaixa: {
    entradas: number;
    saidas: number;
    saldo: number;
  };
  historico: Array<{
    mes: string;
    receitas: number;
    despesas: number;
  }>;
  inadimplencia: {
    taxa: number;
    valor: number;
    comparacao_mes_anterior: number;
  };
}

export interface RelatorioFinanceiro {
  periodo: {
    inicio: string;
    fim: string;
  };
  tipo: 'receitas' | 'despesas' | 'fluxo_caixa' | 'inadimplencia';
  dados: Array<any>; // Tipo específico dependendo do relatório
  total: number;
  comparativo_periodo_anterior?: {
    valor: number;
    percentual: number;
  };
} 