import { supabase } from '../lib/supabase';
import type { InsertGrupo, UpdateGrupo, InsertParticipante, UpdateParticipante } from '../types/grupos';

export async function getGrupos() {
  const { data, error } = await supabase
    .from('grupos')
    .select('*');

  if (error) throw error;
  return data;
}

export async function getGrupo(id: string) {
  const { data, error } = await supabase
    .from('grupos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function criarGrupo(grupo: InsertGrupo) {
  const { data, error } = await supabase
    .from('grupos')
    .insert([grupo])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarGrupo(id: string, grupo: UpdateGrupo) {
  const { data, error } = await supabase
    .from('grupos')
    .update(grupo)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function excluirGrupo(id: string) {
  const { error } = await supabase
    .from('grupos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function adicionarParticipante(participante: InsertParticipante) {
  const { data, error } = await supabase
    .from('participantes')
    .insert([participante])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removerParticipante(id: string) {
  const { error } = await supabase
    .from('participantes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function atualizarRoleParticipante(id: string, role: UpdateParticipante['role']) {
  const { data, error } = await supabase
    .from('participantes')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
} 