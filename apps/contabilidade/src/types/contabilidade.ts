/**
 * Tipos do módulo de contabilidade
 */

// Tipos de regimes tributários
export enum RegimeTributario {
  SIMPLES_NACIONAL = 'simples_nacional',
  LUCRO_PRESUMIDO = 'lucro_presumido',
  LUCRO_REAL = 'lucro_real'
}

// Tipos de lançamentos contábeis
export enum TipoLancamento {
  DEBITO = 'debito',
  CREDITO = 'credito'
}

// Interface para conta contábil
export interface ContaContabil {
  id: string;
  codigo: string;
  nome: string;
  tipo: 'ativo' | 'passivo' | 'patrimonio' | 'receita' | 'despesa' | 'resultado';
  contaMae?: string;
  nivel: number;
  analitica: boolean;
}

// Interface para lançamento contábil
export interface LancamentoContabil {
  id: string;
  numero: string;
  data: string;
  dataCompetencia: string;
  descricao: string;
  valor: number;
  tipoLancamento: TipoLancamento;
  contaDebito: string;
  contaCredito: string;
  centrosCusto?: string[];
  documentoFiscal?: string;
  usuarioId: string;
  criadoEm: string;
  atualizadoEm: string;
}

// Interface para obrigação fiscal
export interface ObrigacaoFiscal {
  id: string;
  nome: string;
  descricao: string;
  periodoApuracao: string;
  dataVencimento: string;
  regimesTributarios: RegimeTributario[];
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  valor?: number;
}

// Interface para integração com o módulo financeiro
export interface IntegracaoFinanceira {
  id: string;
  moduloOrigem: 'financeiro' | 'contabilidade';
  entidadeId: string;
  entidadeTipo: 'transacao' | 'conta' | 'lancamento';
  status: 'pendente' | 'processado' | 'erro';
  dadosIntegracao: Record<string, any>;
  criadoEm: string;
  processadoEm?: string;
  erro?: string;
}

// Interface para balancete mensal
export interface Balancete {
  id: string;
  periodo: string;
  mesAno: string;
  contas: BalanceteConta[];
  totalAtivo: number;
  totalPassivo: number;
  totalReceitas: number;
  totalDespesas: number;
  resultado: number;
  geradoEm: string;
}

// Interface para conta no balancete
export interface BalanceteConta {
  contaId: string;
  codigoConta: string;
  nomeConta: string;
  saldoAnterior: number;
  debitos: number;
  creditos: number;
  saldoAtual: number;
}

// Interface para documento fiscal
export interface DocumentoFiscal {
  id: string;
  tipo: 'nfe' | 'nfse' | 'cte' | 'nfce' | 'outro';
  numero: string;
  serie?: string;
  dataEmissao: string;
  valorTotal: number;
  cnpjEmitente: string;
  nomeEmitente: string;
  cnpjDestinatario: string;
  nomeDestinatario: string;
  chaveAcesso?: string;
  xmlPath?: string;
  pdfPath?: string;
  status: 'pendente' | 'contabilizado' | 'cancelado';
}

// Tipos para integração com o módulo RH

// Tipo de contrato (igual ao do módulo RH)
export enum TipoContratoRh {
  CLT = 'clt',
  PJ = 'pj',
  TEMPORARIO = 'temporario',
  ESTAGIO = 'estagio',
  TERCEIRIZADO = 'terceirizado'
}

// Interface para funcionário (versão simplificada para contabilidade)
export interface FuncionarioRh {
  id: string;
  nome: string;
  departamento: string;
  cargo: string;
  tipoContrato: TipoContratoRh;
  dataAdmissao: string;
  dataDemissao?: string;
  matricula: string;
  ativo: boolean;
}

// Interface para item de folha de pagamento
export interface ItemFolhaPagamento {
  id: string;
  funcionarioId: string;
  funcionario: FuncionarioRh;
  salarioBruto: number;
  descontos: {
    inss: number;
    irrf: number;
    outrosDescontos: number;
  };
  beneficios: {
    valeTransporte: number;
    valeRefeicao: number;
    planoSaude: number;
    outrosBeneficios: number;
  };
  provisoes: {
    ferias: number;
    decimoTerceiro: number;
    fgts: number;
  };
  salarioLiquido: number;
  competencia: string;
  dataReferencia: string;
  dataProcessamento: string;
}

// Interface para folha de pagamento completa
export interface FolhaPagamento {
  id: string;
  competencia: string;
  dataReferencia: string;
  dataProcessamento: string;
  itens: ItemFolhaPagamento[];
  totalSalarioBruto: number;
  totalDescontos: number;
  totalProvisoes: number;
  totalBeneficios: number;
  totalSalarioLiquido: number;
  status: 'processando' | 'processada' | 'contabilizada' | 'paga';
}

// Interface para férias
export interface FeriasRh {
  id: string;
  funcionarioId: string;
  funcionario: FuncionarioRh;
  dataInicio: string;
  dataFim: string;
  diasGozados: number;
  diasVendidos: number;
  valorFerias: number;
  valorTerco: number;
  valorTotal: number;
  observacoes?: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'contabilizada';
}

// Interface para benefícios
export interface BeneficioRh {
  id: string;
  tipo: 'vale_transporte' | 'vale_refeicao' | 'plano_saude' | 'auxilio_creche' | 'outro';
  nome: string;
  periodoReferencia: string;
  valor: number;
  descricao?: string;
  funcionarios: Array<{
    funcionarioId: string;
    valorIndividual: number;
  }>;
  valorTotal: number;
  status: 'processando' | 'processado' | 'contabilizado';
}

// Interface de resposta para integração com RH
export interface IntegracaoRhResponse {
  data: {
    folhaPagamento?: FolhaPagamento;
    ferias?: FeriasRh[];
    beneficios?: BeneficioRh[];
  };
  idEntidade?: string;
  periodo: string;
  status: 'pendente_contabilizacao' | 'ja_contabilizado' | 'erro';
  mensagem?: string;
} 