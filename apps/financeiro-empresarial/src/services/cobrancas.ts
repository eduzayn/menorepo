import { SupabaseClient } from '@supabase/supabase-js';
import { 
  Cobranca, 
  StatusCobranca, 
  MetodoPagamento, 
  GatewayPagamento 
} from '../types/financeiro';

/**
 * Serviço para gerenciamento de cobranças
 */

interface FiltroCobranca {
  instituicao_id?: string;
  aluno_id?: string;
  matricula_id?: string;
  status?: StatusCobranca;
  data_inicio?: string;
  data_fim?: string;
  polo_id?: string;
  curso_id?: string;
}

interface CobrancaInput {
  aluno_id?: string;
  matricula_id?: string;
  tipo: 'mensalidade' | 'taxa' | 'matricula' | 'outros';
  valor_total: number;
  status: StatusCobranca;
  data_emissao: string;
  data_vencimento: string;
  metodo_pagamento?: MetodoPagamento;
  gateway?: GatewayPagamento;
  parcelas?: number;
  observacao?: string;
  instituicao_id: string;
  polo_id?: string;
  curso_id?: string;
  criado_por: string;
}

interface RetornoCobranca {
  dados: Cobranca[] | null;
  erro: Error | null;
}

interface RetornoUnicaCobranca {
  dados: Cobranca | null;
  erro: Error | null;
}

/**
 * Busca cobranças com base nos filtros fornecidos
 */
export async function buscarCobrancas(
  client: { supabase: SupabaseClient },
  filtros: FiltroCobranca
): Promise<RetornoCobranca> {
  try {
    let query = client.supabase
      .from('cobrancas')
      .select('*');

    // Aplicando filtros
    if (filtros.instituicao_id) {
      query = query.eq('instituicao_id', filtros.instituicao_id);
    }
    
    if (filtros.aluno_id) {
      query = query.eq('aluno_id', filtros.aluno_id);
    }
    
    if (filtros.matricula_id) {
      query = query.eq('matricula_id', filtros.matricula_id);
    }
    
    if (filtros.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros.polo_id) {
      query = query.eq('polo_id', filtros.polo_id);
    }
    
    if (filtros.curso_id) {
      query = query.eq('curso_id', filtros.curso_id);
    }
    
    if (filtros.data_inicio && filtros.data_fim) {
      query = query
        .gte('data_vencimento', filtros.data_inicio)
        .lte('data_vencimento', filtros.data_fim);
    }

    const { data, error } = await query.order('data_vencimento', { ascending: true });

    if (error) throw error;

    return { dados: data as Cobranca[], erro: null };
  } catch (error) {
    console.error('Erro ao buscar cobranças:', error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Busca uma cobrança específica pelo ID
 */
export async function buscarCobrancaPorId(
  client: { supabase: SupabaseClient },
  id: string
): Promise<RetornoUnicaCobranca> {
  try {
    const { data, error } = await client.supabase
      .from('cobrancas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { dados: data as Cobranca, erro: null };
  } catch (error) {
    console.error(`Erro ao buscar cobrança com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Cria uma nova cobrança
 */
export async function criarCobranca(
  client: { supabase: SupabaseClient },
  cobranca: CobrancaInput
): Promise<RetornoUnicaCobranca> {
  try {
    const { data, error } = await client.supabase
      .from('cobrancas')
      .insert([cobranca])
      .select()
      .single();

    if (error) throw error;

    return { dados: data as Cobranca, erro: null };
  } catch (error) {
    console.error('Erro ao criar cobrança:', error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Atualiza uma cobrança existente
 */
export async function atualizarCobranca(
  client: { supabase: SupabaseClient },
  id: string,
  alteracoes: Partial<Cobranca>
): Promise<RetornoUnicaCobranca> {
  try {
    const { data, error } = await client.supabase
      .from('cobrancas')
      .update(alteracoes)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { dados: data as Cobranca, erro: null };
  } catch (error) {
    console.error(`Erro ao atualizar cobrança com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Registra o pagamento de uma cobrança
 */
export async function registrarPagamento(
  client: { supabase: SupabaseClient },
  id: string,
  valorPago: number,
  metodoPagamento: MetodoPagamento,
  dataPagamento: string
): Promise<RetornoUnicaCobranca> {
  try {
    // Buscar a cobrança atual para verificar se já tem pagamento parcial
    const { dados: cobrancaAtual, erro: erroConsulta } = await buscarCobrancaPorId(client, id);
    
    if (erroConsulta || !cobrancaAtual) {
      throw erroConsulta || new Error('Cobrança não encontrada');
    }
    
    // Calcular o total pago
    const totalPago = (cobrancaAtual.valor_pago || 0) + valorPago;
    
    // Determinar o status do pagamento
    let novoStatus: StatusCobranca = 'pendente';
    
    if (totalPago >= cobrancaAtual.valor_total) {
      novoStatus = 'pago';
    } else if (totalPago > 0) {
      novoStatus = 'parcial';
    }
    
    // Atualizar a cobrança
    const atualizacao = {
      valor_pago: totalPago,
      status: novoStatus,
      data_pagamento: dataPagamento,
      metodo_pagamento: metodoPagamento,
      updated_at: new Date().toISOString()
    };
    
    return await atualizarCobranca(client, id, atualizacao);
  } catch (error) {
    console.error(`Erro ao registrar pagamento para cobrança com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Cancela uma cobrança
 */
export async function cancelarCobranca(
  client: { supabase: SupabaseClient },
  id: string,
  motivoCancelamento: string
): Promise<RetornoUnicaCobranca> {
  try {
    const atualizacao = {
      status: 'cancelado' as StatusCobranca,
      observacao: `Cancelado: ${motivoCancelamento}`,
      updated_at: new Date().toISOString()
    };
    
    return await atualizarCobranca(client, id, atualizacao);
  } catch (error) {
    console.error(`Erro ao cancelar cobrança com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Gera link de pagamento para uma cobrança
 */
export async function gerarLinkPagamento(
  client: { supabase: SupabaseClient },
  id: string, 
  gateway: GatewayPagamento
): Promise<RetornoUnicaCobranca> {
  try {
    // Este método seria integrado com o gateway de pagamento real
    // Por enquanto, apenas simula a criação de um link
    
    const link = `https://pagamento.edunexia.com.br/${gateway}/${id}`;
    
    const atualizacao = {
      link_pagamento: link,
      gateway: gateway,
      gateway_id: `${gateway}_${Date.now()}`,
      updated_at: new Date().toISOString()
    };
    
    return await atualizarCobranca(client, id, atualizacao);
  } catch (error) {
    console.error(`Erro ao gerar link de pagamento para cobrança com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Busca cobranças em atraso para a instituição
 */
export async function buscarCobrancasEmAtraso(
  client: { supabase: SupabaseClient },
  instituicao_id: string
): Promise<RetornoCobranca> {
  try {
    const dataAtual = new Date().toISOString().split('T')[0];
    
    const { data, error } = await client.supabase
      .from('cobrancas')
      .select('*')
      .eq('instituicao_id', instituicao_id)
      .lt('data_vencimento', dataAtual)
      .in('status', ['pendente', 'parcial'])
      .order('data_vencimento', { ascending: true });

    if (error) throw error;

    return { dados: data as Cobranca[], erro: null };
  } catch (error) {
    console.error(`Erro ao buscar cobranças em atraso para instituição ${instituicao_id}:`, error);
    return { dados: null, erro: error as Error };
  }
} 