import { supabase } from './supabase';
import type {
  Grupo,
  GrupoParticipante,
  InsertGrupo,
  UpdateGrupo,
  InsertGrupoParticipante,
  UpdateGrupoParticipante,
} from '../types/comunicacao';

export const gruposService = {
  // Operações de Grupos
  listarGrupos: async () => {
    const { data, error } = await supabase
      .from('grupos')
      .select('*')
      .order('criado_at', { ascending: false });

    if (error) throw error;
    return data as Grupo[];
  },

  obterGrupo: async (id: string) => {
    const { data, error } = await supabase
      .from('grupos')
      .select(`
        *,
        participantes:grupo_participantes(
          *,
          usuario:profiles(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Grupo & { participantes: (GrupoParticipante & { usuario: any })[] };
  },

  criarGrupo: async (grupo: InsertGrupo) => {
    const { data, error } = await supabase
      .from('grupos')
      .insert([grupo])
      .select()
      .single();

    if (error) throw error;
    return data as Grupo;
  },

  atualizarGrupo: async (id: string, grupo: UpdateGrupo) => {
    const { data, error } = await supabase
      .from('grupos')
      .update(grupo)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Grupo;
  },

  excluirGrupo: async (id: string) => {
    const { error } = await supabase
      .from('grupos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Operações de Participantes
  listarParticipantes: async (grupoId: string) => {
    const { data, error } = await supabase
      .from('grupo_participantes')
      .select(`
        *,
        usuario:profiles(*)
      `)
      .eq('grupo_id', grupoId)
      .order('criado_at', { ascending: true });

    if (error) throw error;
    return data as (GrupoParticipante & { usuario: any })[];
  },

  adicionarParticipante: async (participante: InsertGrupoParticipante) => {
    const { data, error } = await supabase
      .from('grupo_participantes')
      .insert([participante])
      .select(`
        *,
        usuario:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data as GrupoParticipante & { usuario: any };
  },

  atualizarParticipante: async (
    grupoId: string,
    usuarioId: string,
    participante: UpdateGrupoParticipante
  ) => {
    const { data, error } = await supabase
      .from('grupo_participantes')
      .update(participante)
      .match({ grupo_id: grupoId, usuario_id: usuarioId })
      .select(`
        *,
        usuario:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data as GrupoParticipante & { usuario: any };
  },

  removerParticipante: async (grupoId: string, usuarioId: string) => {
    const { error } = await supabase
      .from('grupo_participantes')
      .delete()
      .match({ grupo_id: grupoId, usuario_id: usuarioId });

    if (error) throw error;
  },

  // Verificações de permissão
  verificarPermissao: async (grupoId: string, usuarioId: string) => {
    const { data, error } = await supabase
      .from('grupo_participantes')
      .select('role')
      .match({ grupo_id: grupoId, usuario_id: usuarioId })
      .single();

    if (error) return null;
    return data?.role;
  }
}; 