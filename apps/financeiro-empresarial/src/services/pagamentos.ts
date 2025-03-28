import { SupabaseClient } from '@supabase/supabase-js';
import { 
  Pagamento, 
  CategoriaFinanceira, 
  MetodoPagamento 
} from '../types/financeiro';

/**
 * Serviço para gerenciamento de pagamentos (entradas e saídas)
 */

interface FiltroPagamento {
  instituicao_id?: string;
  tipo?: 'entrada' | 'saida';
  categoria?: CategoriaFinanceira;
  status?: 'confirmado' | 'pendente' | 'cancelado' | 'estornado';
  data_inicio?: string;
  data_fim?: string;
  destinatario_id?: string;
  destinatario_tipo?: 'aluno' | 'polo' | 'consultor' | 'fornecedor';
  cobranca_id?: string;
}

interface PagamentoInput {
  cobranca_id?: string;
  tipo: 'entrada' | 'saida';
  categoria: CategoriaFinanceira;
  valor: number;
  data_pagamento: string;
  forma_pagamento: MetodoPagamento;
  status: 'confirmado' | 'pendente' | 'cancelado' | 'estornado';
  destinatario_id?: string;
  destinatario_tipo?: 'aluno' | 'polo' | 'consultor' | 'fornecedor';
  descricao: string;
  comprovante_url?: string;
  instituicao_id: string;
  criado_por: string;
}

interface RetornoPagamento {
  dados: Pagamento[] | null;
  erro: Error | null;
}

interface RetornoUnicoPagamento {
  dados: Pagamento | null;
  erro: Error | null;
}

/**
 * Busca pagamentos com base nos filtros fornecidos
 */
export async function buscarPagamentos(
  client: { supabase: SupabaseClient },
  filtros: FiltroPagamento
): Promise<RetornoPagamento> {
  try {
    let query = client.supabase
      .from('pagamentos')
      .select('*');

    // Aplicando filtros
    if (filtros.instituicao_id) {
      query = query.eq('instituicao_id', filtros.instituicao_id);
    }
    
    if (filtros.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    
    if (filtros.categoria) {
      query = query.eq('categoria', filtros.categoria);
    }
    
    if (filtros.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros.destinatario_id) {
      query = query.eq('destinatario_id', filtros.destinatario_id);
    }
    
    if (filtros.destinatario_tipo) {
      query = query.eq('destinatario_tipo', filtros.destinatario_tipo);
    }
    
    if (filtros.cobranca_id) {
      query = query.eq('cobranca_id', filtros.cobranca_id);
    }
    
    if (filtros.data_inicio && filtros.data_fim) {
      query = query
        .gte('data_pagamento', filtros.data_inicio)
        .lte('data_pagamento', filtros.data_fim);
    }

    const { data, error } = await query.order('data_pagamento', { ascending: false });

    if (error) throw error;

    return { dados: data as Pagamento[], erro: null };
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Busca um pagamento específico pelo ID
 */
export async function buscarPagamentoPorId(
  client: { supabase: SupabaseClient },
  id: string
): Promise<RetornoUnicoPagamento> {
  try {
    const { data, error } = await client.supabase
      .from('pagamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { dados: data as Pagamento, erro: null };
  } catch (error) {
    console.error(`Erro ao buscar pagamento com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Cria um novo pagamento (entrada ou saída)
 */
export async function criarPagamento(
  client: { supabase: SupabaseClient },
  pagamento: PagamentoInput
): Promise<RetornoUnicoPagamento> {
  try {
    const { data, error } = await client.supabase
      .from('pagamentos')
      .insert([pagamento])
      .select()
      .single();

    if (error) throw error;

    return { dados: data as Pagamento, erro: null };
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Atualiza um pagamento existente
 */
export async function atualizarPagamento(
  client: { supabase: SupabaseClient },
  id: string,
  alteracoes: Partial<Pagamento>
): Promise<RetornoUnicoPagamento> {
  try {
    const { data, error } = await client.supabase
      .from('pagamentos')
      .update(alteracoes)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { dados: data as Pagamento, erro: null };
  } catch (error) {
    console.error(`Erro ao atualizar pagamento com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Cancela um pagamento
 */
export async function cancelarPagamento(
  client: { supabase: SupabaseClient },
  id: string,
  motivoCancelamento: string
): Promise<RetornoUnicoPagamento> {
  try {
    const atualizacao: Partial<Pagamento> = {
      status: 'cancelado',
      descricao: `Cancelado: ${motivoCancelamento}`,
      updated_at: new Date().toISOString()
    };
    
    return await atualizarPagamento(client, id, atualizacao);
  } catch (error) {
    console.error(`Erro ao cancelar pagamento com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Estorna um pagamento
 */
export async function estornarPagamento(
  client: { supabase: SupabaseClient },
  id: string,
  motivoEstorno: string
): Promise<RetornoUnicoPagamento> {
  try {
    const atualizacao: Partial<Pagamento> = {
      status: 'estornado',
      descricao: `Estornado: ${motivoEstorno}`,
      updated_at: new Date().toISOString()
    };
    
    return await atualizarPagamento(client, id, atualizacao);
  } catch (error) {
    console.error(`Erro ao estornar pagamento com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Confirma um pagamento pendente
 */
export async function confirmarPagamento(
  client: { supabase: SupabaseClient },
  id: string,
  comprovanteUrl?: string
): Promise<RetornoUnicoPagamento> {
  try {
    const atualizacao: Partial<Pagamento> = {
      status: 'confirmado',
      updated_at: new Date().toISOString()
    };
    
    if (comprovanteUrl) {
      atualizacao.comprovante_url = comprovanteUrl;
    }
    
    return await atualizarPagamento(client, id, atualizacao);
  } catch (error) {
    console.error(`Erro ao confirmar pagamento com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Registra um comprovante para um pagamento
 */
export async function registrarComprovante(
  client: { supabase: SupabaseClient },
  id: string,
  comprovanteUrl: string
): Promise<RetornoUnicoPagamento> {
  try {
    const atualizacao = {
      comprovante_url: comprovanteUrl,
      updated_at: new Date().toISOString()
    };
    
    return await atualizarPagamento(client, id, atualizacao);
  } catch (error) {
    console.error(`Erro ao registrar comprovante para pagamento com ID ${id}:`, error);
    return { dados: null, erro: error as Error };
  }
}

/**
 * Calcula o saldo no período
 */
export async function calcularSaldoPeriodo(
  client: { supabase: SupabaseClient },
  instituicao_id: string,
  dataInicio: string,
  dataFim: string
): Promise<{ receitas: number, despesas: number, saldo: number, erro: Error | null }> {
  try {
    // Buscar receitas
    const { dados: dadosReceitas } = await buscarPagamentos(client, {
      instituicao_id,
      tipo: 'entrada',
      status: 'confirmado',
      data_inicio: dataInicio,
      data_fim: dataFim
    });
    
    // Buscar despesas
    const { dados: dadosDespesas } = await buscarPagamentos(client, {
      instituicao_id,
      tipo: 'saida',
      status: 'confirmado',
      data_inicio: dataInicio,
      data_fim: dataFim
    });
    
    // Calcular totais
    const totalReceitas = dadosReceitas 
      ? dadosReceitas.reduce((total, item) => total + item.valor, 0)
      : 0;
    
    const totalDespesas = dadosDespesas 
      ? dadosDespesas.reduce((total, item) => total + item.valor, 0)
      : 0;
    
    return {
      receitas: totalReceitas,
      despesas: totalDespesas,
      saldo: totalReceitas - totalDespesas,
      erro: null
    };
  } catch (error) {
    console.error(`Erro ao calcular saldo para o período:`, error);
    return { 
      receitas: 0, 
      despesas: 0, 
      saldo: 0, 
      erro: error as Error 
    };
  }
} 