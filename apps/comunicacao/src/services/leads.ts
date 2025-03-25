import { supabase } from '@/lib/supabase';
import type { Lead, LeadStatus } from '@/types/comunicacao';

interface BuscarLeadsOptions {
  busca?: string;
  status?: LeadStatus;
  pagina?: number;
  porPagina?: number;
  ordenarPor?: 'criado_at' | 'atualizado_at' | 'ultima_interacao';
  ordem?: 'asc' | 'desc';
}

export async function buscarLeads(options: BuscarLeadsOptions = {}): Promise<Lead[]> {
  const {
    busca = '',
    status,
    pagina = 1,
    porPagina = 10,
    ordenarPor = 'ultima_interacao',
    ordem = 'desc'
  } = options;

  let query = supabase
    .from('leads')
    .select(`
      *,
      online:presenca(online),
      ultimo_acesso:presenca(ultimo_acesso)
    `);

  if (busca) {
    query = query.or(`nome.ilike.%${busca}%,email.ilike.%${busca}%,telefone.ilike.%${busca}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query
    .order(ordenarPor, { ascending: ordem === 'asc' })
    .range((pagina - 1) * porPagina, pagina * porPagina - 1);

  if (error) throw error;

  return data.map(lead => ({
    ...lead,
    online: lead.online || false,
    ultimo_acesso: lead.ultimo_acesso || null
  })) as Lead[];
}

export async function buscarLead(id: string): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      online:presenca(online),
      ultimo_acesso:presenca(ultimo_acesso)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return {
    ...data,
    online: data.online || false,
    ultimo_acesso: data.ultimo_acesso || null
  } as Lead;
}

export async function criarLead(lead: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    online: false,
    ultimo_acesso: null
  } as Lead;
}

export async function atualizarLead(id: string, lead: Partial<Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update(lead)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    online: false,
    ultimo_acesso: null
  } as Lead;
}

export async function deletarLead(id: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 