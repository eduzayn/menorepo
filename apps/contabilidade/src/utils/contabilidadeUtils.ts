import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BeneficioRh, FeriasRh, FolhaPagamento, ItemFolhaPagamento } from '../types/contabilidade';

/**
 * Funções utilitárias para o módulo de contabilidade
 * Contém formatadores e validadores para lidar com dados de RH e financeiros
 */

/**
 * Formata um valor para moeda brasileira (R$)
 * @param value Valor numérico
 * @returns String formatada (ex: R$ 1.234,56)
 */
export function formatarMoeda(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata um mês/ano no formato yyyy-MM para exibição como MM/yyyy
 * @param mesAno String no formato yyyy-MM
 * @returns String formatada (ex: 05/2023)
 */
export function formatarMesAno(mesAno: string): string {
  const [ano, mes] = mesAno.split('-');
  return `${mes}/${ano}`;
}

/**
 * Formata data para exibição no padrão brasileiro
 * @param data Data ou string no formato ISO
 * @returns String formatada (ex: 15/05/2023)
 */
export function formatarData(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return format(dataObj, 'dd/MM/yyyy', { locale: ptBR });
}

/**
 * Formata período entre duas datas
 * @param dataInicio Data de início
 * @param dataFim Data de fim
 * @returns String formatada (ex: 10/05/2023 a 20/05/2023)
 */
export function formatarPeriodo(dataInicio: Date | string, dataFim: Date | string): string {
  return `${formatarData(dataInicio)} a ${formatarData(dataFim)}`;
}

/**
 * Calcula o total bruto de uma folha de pagamento
 * @param folha Dados da folha de pagamento
 * @returns Valor total bruto
 */
export function calcularTotalBrutoFolha(folha: FolhaPagamento): number {
  return folha.itens.reduce((total, item) => total + item.salarioBruto, 0);
}

/**
 * Calcula o total líquido de uma folha de pagamento
 * @param folha Dados da folha de pagamento
 * @returns Valor total líquido
 */
export function calcularTotalLiquidoFolha(folha: FolhaPagamento): number {
  return folha.itens.reduce((total, item) => total + item.salarioLiquido, 0);
}

/**
 * Calcula o total de descontos de uma folha de pagamento
 * @param folha Dados da folha de pagamento
 * @returns Valor total de descontos
 */
export function calcularTotalDescontosFolha(folha: FolhaPagamento): number {
  return folha.itens.reduce((total, item) => {
    return total + (
      item.descontos.inss + 
      item.descontos.irrf + 
      item.descontos.outrosDescontos
    );
  }, 0);
}

/**
 * Calcula o total de férias para um período
 * @param ferias Lista de férias
 * @returns Valor total de férias
 */
export function calcularTotalFerias(ferias: FeriasRh[]): number {
  return ferias.reduce((total, item) => total + item.valorTotal, 0);
}

/**
 * Calcula o total de benefícios para um período
 * @param beneficios Lista de benefícios
 * @returns Valor total de benefícios
 */
export function calcularTotalBeneficios(beneficios: BeneficioRh[]): number {
  return beneficios.reduce((total, item) => total + item.valorTotal, 0);
}

/**
 * Verifica se um lançamento contábil RH já foi processado
 * @param status Status do lançamento
 * @returns True se já foi contabilizado
 */
export function isLancamentoProcessado(status: string): boolean {
  return status === 'ja_contabilizado' || status === 'contabilizado';
}

/**
 * Verifica se um lançamento contábil RH está pendente
 * @param status Status do lançamento
 * @returns True se está pendente de contabilização
 */
export function isLancamentoPendente(status: string): boolean {
  return status === 'pendente_contabilizacao' || status === 'pendente';
}

/**
 * Gera uma descrição para lançamento contábil com base no tipo e período
 * @param tipo Tipo de lançamento (folha, férias, benefício)
 * @param periodo Período de referência
 * @returns Descrição formatada
 */
export function gerarDescricaoLancamento(tipo: string, periodo: string): string {
  const tiposTexto: Record<string, string> = {
    folha: 'Folha de Pagamento',
    ferias: 'Provisão de Férias',
    beneficios: 'Benefícios',
    vale_transporte: 'Vale Transporte',
    vale_refeicao: 'Vale Refeição',
    plano_saude: 'Plano de Saúde'
  };

  const tipoFormatado = tiposTexto[tipo.toLowerCase()] || tipo;
  return `${tipoFormatado} - ${periodo}`;
}

/**
 * Obtém o mês atual no formato yyyy-MM
 * @returns String no formato yyyy-MM (ex: 2023-05)
 */
export function obterMesAtual(): string {
  return format(new Date(), 'yyyy-MM');
}

/**
 * Obtém o nome do mês por extenso
 * @param mes Número do mês (1-12) ou string no formato yyyy-MM
 * @returns Nome do mês por extenso
 */
export function obterNomeMes(mes: number | string): string {
  let data: Date;
  
  if (typeof mes === 'string' && mes.includes('-')) {
    const [ano, mesNum] = mes.split('-');
    data = new Date(parseInt(ano), parseInt(mesNum) - 1, 1);
  } else if (typeof mes === 'number') {
    data = new Date(new Date().getFullYear(), mes - 1, 1);
  } else {
    return '';
  }
  
  return format(data, 'MMMM', { locale: ptBR });
}

/**
 * Gera a data do primeiro dia do mês atual
 * @returns Data do primeiro dia do mês atual
 */
export function obterPrimeiroDiaMesAtual(): Date {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
}

/**
 * Gera a data do último dia do mês atual
 * @returns Data do último dia do mês atual
 */
export function obterUltimoDiaMesAtual(): Date {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
}

/**
 * Calcula o valor total de encargos de um item da folha de pagamento
 * @param item Item da folha de pagamento
 * @returns Valor total dos encargos
 */
export function calcularEncargosItem(item: ItemFolhaPagamento): number {
  return item.encargos.fgts + item.encargos.inss + item.encargos.outrosEncargos;
}

/**
 * Calcula o período de férias em dias
 * @param dataInicio Data de início
 * @param dataFim Data de fim
 * @returns Número de dias do período
 */
export function calcularDiasFerias(dataInicio: Date | string, dataFim: Date | string): number {
  const inicio = typeof dataInicio === 'string' ? new Date(dataInicio) : dataInicio;
  const fim = typeof dataFim === 'string' ? new Date(dataFim) : dataFim;
  
  // Diferença em milissegundos
  const diferencaMs = fim.getTime() - inicio.getTime();
  
  // Converter para dias e adicionar 1 (para incluir o próprio dia final)
  return Math.floor(diferencaMs / (1000 * 60 * 60 * 24)) + 1;
}