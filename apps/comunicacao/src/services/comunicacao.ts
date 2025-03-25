import { supabase } from './supabase';
import type {
  Conversa,
  Mensagem,
  Campanha,
  CampanhaDestinatario,
  RespostaRapida,
  InsertConversa,
  InsertMensagem,
  InsertCampanha,
  InsertCampanhaDestinatario,
  InsertRespostaRapida,
  UpdateConversa,
  UpdateMensagem,
  UpdateCampanha,
  UpdateCampanhaDestinatario,
  UpdateRespostaRapida,
} from '../types/comunicacao';
import type { Database } from '../types/database';

// Conversas
export const getConversas = async () => {
  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .order('ultima_mensagem_at', { ascending: false });

  if (error) throw error;
  return data as Conversa[];
};

export const getConversa = async (id: string) => {
  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Conversa;
};

export const criarConversa = async (conversa: InsertConversa) => {
  const { data, error } = await supabase
    .from('conversas')
    .insert([conversa])
    .select()
    .single();

  if (error) throw error;
  return data as Conversa;
};

// Mensagens
export const getMensagens = async (conversaId: string) => {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('conversa_id', conversaId)
    .order('criado_at', { ascending: true });

  if (error) throw error;
  return data as Mensagem[];
};

export const enviarMensagem = async (mensagem: InsertMensagem) => {
  const { data, error } = await supabase
    .from('mensagens')
    .insert([mensagem])
    .select()
    .single();

  if (error) throw error;
  return data as Mensagem;
};

// Campanhas
export const getCampanhas = async () => {
  const { data, error } = await supabase
    .from('campanhas')
    .select('*')
    .order('criado_at', { ascending: false });

  if (error) throw error;
  return data as Campanha[];
};

export const getCampanha = async (id: string) => {
  const { data, error } = await supabase
    .from('campanhas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Campanha;
};

export const criarCampanha = async (campanha: InsertCampanha) => {
  const { data, error } = await supabase
    .from('campanhas')
    .insert([campanha])
    .select()
    .single();

  if (error) throw error;
  return data as Campanha;
};

// Respostas Rápidas
export const getRespostasRapidas = async () => {
  const { data, error } = await supabase
    .from('respostas_rapidas')
    .select('*')
    .order('criado_at', { ascending: false });

  if (error) throw error;
  return data as RespostaRapida[];
};

export const criarRespostaRapida = async (resposta: InsertRespostaRapida) => {
  const { data, error } = await supabase
    .from('respostas_rapidas')
    .insert([resposta])
    .select()
    .single();

  if (error) throw error;
  return data as RespostaRapida;
};

// Storage
export const uploadArquivo = async (file: File, conversaId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${conversaId}/${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('mensagens')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('mensagens')
    .getPublicUrl(filePath);

  return publicUrl;
}; 