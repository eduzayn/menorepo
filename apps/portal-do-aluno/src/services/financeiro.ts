import { createClient } from '@supabase/supabase-js'
import { Parcela, PropostaNegociacao, ParcelaAcordo, EstatisticasFinanceiras, RegrasNegociacao } from '@/types/financeiro'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Busca as parcelas do aluno
 * @param alunoId ID do aluno
 * @param status Status das parcelas a serem buscadas (opcional)
 * @returns Lista de parcelas
 */
export async function buscarParcelas(alunoId: string, status?: string[]): Promise<Parcela[]> {
  try {
    let query = supabase
      .from('financeiro_parcelas')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data_vencimento', { ascending: true })
    
    if (status && status.length > 0) {
      query = query.in('status', status)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar parcelas:', error)
    throw new Error('Falha ao buscar parcelas')
  }
}

/**
 * Busca o detalhe de uma parcela específica
 * @param parcelaId ID da parcela
 * @returns Detalhes da parcela
 */
export async function buscarDetalheParcela(parcelaId: string): Promise<Parcela> {
  try {
    const { data, error } = await supabase
      .from('financeiro_parcelas')
      .select(`
        *,
        matriculas (
          id,
          curso:cursos (
            id,
            nome
          )
        )
      `)
      .eq('id', parcelaId)
      .single()
    
    if (error) throw error
    if (!data) throw new Error('Parcela não encontrada')
    
    return data
  } catch (error) {
    console.error('Erro ao buscar detalhe da parcela:', error)
    throw new Error('Falha ao buscar detalhe da parcela')
  }
}

/**
 * Busca as estatísticas financeiras do aluno
 * @param alunoId ID do aluno
 * @returns Estatísticas financeiras
 */
export async function buscarEstatisticasFinanceiras(alunoId: string): Promise<EstatisticasFinanceiras> {
  try {
    const { data, error } = await supabase
      .rpc('calcular_estatisticas_financeiras', { p_aluno_id: alunoId })
    
    if (error) throw error
    return data || {
      totalAberto: 0,
      totalAtrasado: 0,
      parcelasEmDia: 0,
      parcelasAtrasadas: 0,
      parcelasNegociando: 0,
      acordosVigentes: 0,
      descontosObtidos: 0
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas financeiras:', error)
    throw new Error('Falha ao buscar estatísticas financeiras')
  }
}

/**
 * Busca as regras de negociação automática
 * @returns Regras de negociação
 */
export async function buscarRegrasNegociacao(): Promise<RegrasNegociacao> {
  try {
    const { data, error } = await supabase
      .from('configuracoes_negociacao')
      .select('*')
      .single()
    
    if (error) throw error
    return {
      descontoMaximoAutomatico: data?.desconto_maximo_automatico || 10,
      parcelasMaximoAutomatico: data?.parcelas_maximo_automatico || 6,
      diasAtrasoMinimo: data?.dias_atraso_minimo || 10,
      valorMinimoNegociacao: data?.valor_minimo_negociacao || 100,
      permitirMultiplasNegociacoes: data?.permitir_multiplas_negociacoes || false
    }
  } catch (error) {
    console.error('Erro ao buscar regras de negociação:', error)
    // Retorna valores padrão em caso de erro
    return {
      descontoMaximoAutomatico: 10,
      parcelasMaximoAutomatico: 6,
      diasAtrasoMinimo: 10,
      valorMinimoNegociacao: 100,
      permitirMultiplasNegociacoes: false
    }
  }
}

/**
 * Verifica se o aluno pode negociar uma parcela
 * @param parcelaId ID da parcela
 * @param alunoId ID do aluno
 * @returns Objeto com informações sobre a possibilidade de negociação
 */
export async function verificarPossibilidadeNegociacao(
  parcelaId: string,
  alunoId: string
): Promise<{ podeNegociar: boolean; motivo?: string; regras: RegrasNegociacao }> {
  try {
    // Busca a parcela
    const parcela = await buscarDetalheParcela(parcelaId)
    
    // Verificar se a parcela pertence ao aluno
    if (parcela.alunoId !== alunoId) {
      return { 
        podeNegociar: false, 
        motivo: 'Parcela não pertence a este aluno',
        regras: await buscarRegrasNegociacao()
      }
    }
    
    // Verifica se a parcela já está paga
    if (parcela.status === 'paga') {
      return { 
        podeNegociar: false, 
        motivo: 'Parcela já está paga',
        regras: await buscarRegrasNegociacao()
      }
    }
    
    // Verifica se a parcela já está em negociação
    if (parcela.status === 'negociando' || parcela.status === 'acordo') {
      return { 
        podeNegociar: false, 
        motivo: 'Parcela já está em negociação ou acordo',
        regras: await buscarRegrasNegociacao()
      }
    }
    
    // Busca regras de negociação
    const regras = await buscarRegrasNegociacao()
    
    // Verifica se o aluno tem múltiplas negociações e se isso é permitido
    if (!regras.permitirMultiplasNegociacoes) {
      const { data, error } = await supabase
        .from('financeiro_negociacoes')
        .select('count', { count: 'exact' })
        .eq('aluno_id', alunoId)
        .in('status', ['pendente', 'aprovada'])
      
      if (error) throw error
      
      if (data && data > 0) {
        return { 
          podeNegociar: false, 
          motivo: 'Você já possui uma negociação em andamento',
          regras
        }
      }
    }
    
    // Verifica se a parcela está atrasada pelo mínimo de dias necessário
    const dataVencimento = new Date(parcela.dataVencimento)
    const hoje = new Date()
    const diasAtraso = Math.floor((hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diasAtraso < regras.diasAtrasoMinimo) {
      return { 
        podeNegociar: false, 
        motivo: `A parcela precisa estar atrasada há pelo menos ${regras.diasAtrasoMinimo} dias para negociação`,
        regras
      }
    }
    
    // Verifica se o valor da parcela é maior que o mínimo para negociação
    if (parcela.valor < regras.valorMinimoNegociacao) {
      return { 
        podeNegociar: false, 
        motivo: `O valor da parcela precisa ser maior que R$${regras.valorMinimoNegociacao.toFixed(2)} para negociação`,
        regras
      }
    }
    
    return { podeNegociar: true, regras }
  } catch (error) {
    console.error('Erro ao verificar possibilidade de negociação:', error)
    throw new Error('Falha ao verificar possibilidade de negociação')
  }
}

/**
 * Cria uma proposta de negociação
 * @param proposta Dados da proposta
 * @returns Proposta criada
 */
export async function criarPropostaNegociacao(
  proposta: Omit<PropostaNegociacao, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<PropostaNegociacao> {
  try {
    // Verifica se todas as parcelas pertencem ao aluno
    for (const parcelaId of proposta.parcelaIds) {
      const { podeNegociar, motivo } = await verificarPossibilidadeNegociacao(parcelaId, proposta.alunoId)
      if (!podeNegociar) {
        throw new Error(motivo)
      }
    }
    
    // Calcula se a proposta pode ser aprovada automaticamente
    const regras = await buscarRegrasNegociacao()
    const aprovacaoAutomatica = (
      proposta.desconto <= regras.descontoMaximoAutomatico &&
      proposta.numeroParcelas <= regras.parcelasMaximoAutomatico
    )
    
    // Insere a proposta de negociação
    const { data, error } = await supabase
      .from('financeiro_negociacoes')
      .insert({
        aluno_id: proposta.alunoId,
        parcela_ids: proposta.parcelaIds,
        valor_total: proposta.valorTotal,
        valor_proposto: proposta.valorProposto,
        desconto: proposta.desconto,
        justificativa: proposta.justificativa,
        numero_parcelas: proposta.numeroParcelas,
        data_primeira_parcela: proposta.dataPrimeiraParcela,
        status: aprovacaoAutomatica ? 'aprovada' : 'pendente',
        metodo_pagamento: proposta.metodoPagamento,
        data_aprovacao: aprovacaoAutomatica ? new Date().toISOString() : null,
        aprovado_por: aprovacaoAutomatica ? 'sistema' : null,
        observacao_interna: aprovacaoAutomatica ? 'Aprovação automática conforme regras do sistema' : null,
        feedback_aluno: aprovacaoAutomatica ? 
          'Sua proposta foi aprovada automaticamente! Você já pode pagar sua primeira parcela.' : 
          'Sua proposta está em análise. Em breve você receberá uma resposta.'
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Se for aprovação automática, atualiza o status das parcelas e cria as parcelas do acordo
    if (aprovacaoAutomatica && data) {
      await atualizarParcelasNegociacao(data.id, proposta.parcelaIds)
      await criarParcelasAcordo(data.id, proposta)
    }
    
    return data
  } catch (error) {
    console.error('Erro ao criar proposta de negociação:', error)
    throw new Error('Falha ao criar proposta de negociação')
  }
}

/**
 * Atualiza o status das parcelas de uma negociação
 * @param negociacaoId ID da negociação
 * @param parcelaIds IDs das parcelas
 */
async function atualizarParcelasNegociacao(negociacaoId: string, parcelaIds: string[]): Promise<void> {
  try {
    // Atualiza o status das parcelas para "negociando"
    const { error } = await supabase
      .from('financeiro_parcelas')
      .update({
        status: 'negociando',
        updated_at: new Date().toISOString()
      })
      .in('id', parcelaIds)
    
    if (error) throw error
    
    // Registra histórico para cada parcela
    for (const parcelaId of parcelaIds) {
      await supabase
        .from('financeiro_historico')
        .insert({
          negociacao_id: negociacaoId,
          data: new Date().toISOString(),
          acao: 'aprovacao',
          detalhes: `Parcela ${parcelaId} incluída em negociação`
        })
    }
  } catch (error) {
    console.error('Erro ao atualizar parcelas da negociação:', error)
    throw new Error('Falha ao atualizar parcelas da negociação')
  }
}

/**
 * Cria as parcelas de um acordo de negociação
 * @param negociacaoId ID da negociação
 * @param proposta Dados da proposta
 */
async function criarParcelasAcordo(
  negociacaoId: string,
  proposta: Omit<PropostaNegociacao, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<void> {
  try {
    const valorParcela = proposta.valorProposto / proposta.numeroParcelas
    const dataPrimeiraParcela = new Date(proposta.dataPrimeiraParcela)
    const parcelas = []
    
    // Cria as parcelas do acordo
    for (let i = 0; i < proposta.numeroParcelas; i++) {
      const dataVencimento = new Date(dataPrimeiraParcela)
      dataVencimento.setMonth(dataPrimeiraParcela.getMonth() + i)
      
      parcelas.push({
        negociacao_id: negociacaoId,
        valor: valorParcela,
        data_vencimento: dataVencimento.toISOString(),
        status: 'aberta',
        numero_parcela: i + 1,
        total_parcelas: proposta.numeroParcelas,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    
    // Insere as parcelas do acordo
    const { error } = await supabase
      .from('financeiro_parcelas_acordo')
      .insert(parcelas)
    
    if (error) throw error
  } catch (error) {
    console.error('Erro ao criar parcelas do acordo:', error)
    throw new Error('Falha ao criar parcelas do acordo')
  }
}

/**
 * Busca negociações do aluno
 * @param alunoId ID do aluno
 * @returns Lista de negociações
 */
export async function buscarNegociacoes(alunoId: string): Promise<PropostaNegociacao[]> {
  try {
    const { data, error } = await supabase
      .from('financeiro_negociacoes')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar negociações:', error)
    throw new Error('Falha ao buscar negociações')
  }
}

/**
 * Busca detalhes de uma negociação
 * @param negociacaoId ID da negociação
 * @param alunoId ID do aluno (para verificação de acesso)
 * @returns Detalhes da negociação e suas parcelas
 */
export async function buscarDetalheNegociacao(
  negociacaoId: string,
  alunoId: string
): Promise<{ negociacao: PropostaNegociacao; parcelas: ParcelaAcordo[] }> {
  try {
    // Busca a negociação
    const { data: negociacao, error: negociacaoError } = await supabase
      .from('financeiro_negociacoes')
      .select('*')
      .eq('id', negociacaoId)
      .eq('aluno_id', alunoId)
      .single()
    
    if (negociacaoError) throw negociacaoError
    if (!negociacao) throw new Error('Negociação não encontrada')
    
    // Busca as parcelas do acordo
    const { data: parcelas, error: parcelasError } = await supabase
      .from('financeiro_parcelas_acordo')
      .select('*')
      .eq('negociacao_id', negociacaoId)
      .order('numero_parcela', { ascending: true })
    
    if (parcelasError) throw parcelasError
    
    return {
      negociacao,
      parcelas: parcelas || []
    }
  } catch (error) {
    console.error('Erro ao buscar detalhe da negociação:', error)
    throw new Error('Falha ao buscar detalhe da negociação')
  }
}

/**
 * Gera link de pagamento para uma parcela de acordo
 * @param parcelaId ID da parcela
 * @param metodoPagamento Método de pagamento
 * @returns Link de pagamento
 */
export async function gerarLinkPagamento(
  parcelaId: string,
  metodoPagamento: string
): Promise<string> {
  try {
    // Aqui seria feita a integração com a API de pagamentos (Lytex)
    // Por enquanto, apenas simulamos um link de pagamento
    const link = `https://pagamento.edunexia.com/pagar/${metodoPagamento}/${parcelaId}`
    
    // Atualiza a parcela com o link de pagamento
    const { error } = await supabase
      .from('financeiro_parcelas_acordo')
      .update({
        link_pagamento: link,
        updated_at: new Date().toISOString()
      })
      .eq('id', parcelaId)
    
    if (error) throw error
    
    return link
  } catch (error) {
    console.error('Erro ao gerar link de pagamento:', error)
    throw new Error('Falha ao gerar link de pagamento')
  }
} 