import { supabase } from './supabase';
import type { Conversa, ComunicacaoStatus } from '../types/comunicacao';

interface BuscarConversasOptions {
  busca?: string;
  status?: ComunicacaoStatus;
  pagina?: number;
  porPagina?: number;
  ordenarPor?: 'criado_at' | 'atualizado_at' | 'ultima_mensagem_at';
  ordem?: 'asc' | 'desc';
}

interface BuscarConversasResult {
  conversas: Conversa[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export async function buscarConversas({
  busca = '',
  status,
  pagina = 1,
  porPagina = 20,
  ordenarPor = 'atualizado_at',
  ordem = 'desc'
}: BuscarConversasOptions = {}): Promise<BuscarConversasResult> {
  try {
    let query = supabase
      .from('conversas')
      .select(`
        *,
        participantes:conversa_participantes(
          id,
          usuario:usuarios(
            id,
            nome,
            email,
            avatar_url,
            online,
            ultimo_acesso
          )
        )
      `, { count: 'exact' });

    // Aplicar busca
    if (busca) {
      query = query.ilike('titulo', `%${busca}%`);
    }

    // Aplicar filtro de status
    if (status) {
      query = query.eq('status', status);
    }

    // Aplicar ordenação
    query = query.order(ordenarPor, { ascending: ordem === 'asc' });

    // Aplicar paginação
    const inicio = (pagina - 1) * porPagina;
    query = query.range(inicio, inicio + porPagina - 1);

    const { data: conversas, error, count } = await query;

    if (error) throw error;

    return {
      conversas: conversas || [],
      total: count || 0,
      pagina,
      totalPaginas: Math.ceil((count || 0) / porPagina)
    };
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    throw error;
  }
}

export async function buscarConversa(id: string): Promise<Conversa | null> {
  try {
    const { data, error } = await supabase
      .from('conversas')
      .select(`
        *,
        participantes:conversa_participantes(
          id,
          usuario:usuarios(
            id,
            nome,
            email,
            avatar_url,
            online,
            ultimo_acesso
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    throw error;
  }
}

export async function criarConversa(dados: Omit<Conversa, 'id' | 'criado_at' | 'atualizado_at'>): Promise<Conversa> {
  try {
    const { data, error } = await supabase
      .from('conversas')
      .insert([dados])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    throw error;
  }
}

export async function atualizarConversa(id: string, dados: Partial<Conversa>): Promise<Conversa> {
  try {
    const { data, error } = await supabase
      .from('conversas')
      .update(dados)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar conversa:', error);
    throw error;
  }
}

export async function excluirConversa(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('conversas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao excluir conversa:', error);
    throw error;
  }
}

export async function arquivarConversa(id: string): Promise<Conversa> {
  return atualizarConversa(id, { status: 'ARQUIVADO' });
}

export async function reativarConversa(id: string): Promise<Conversa> {
  return atualizarConversa(id, { status: 'ATIVO' });
} 