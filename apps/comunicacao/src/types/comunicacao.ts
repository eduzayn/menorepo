import type { Database } from '@edunexia/database-schema';

export type ComunicacaoStatus = 'ATIVO' | 'ARQUIVADO' | 'FINALIZADO';
export type ComunicacaoCanal = 'CHAT' | 'EMAIL' | 'SMS' | 'WHATSAPP';
export type ComunicacaoTipoMensagem = 'TEXTO' | 'IMAGEM' | 'ARQUIVO' | 'VIDEO' | 'AUDIO' | 'LOCALIZACAO';
export type ComunicacaoTipoCampanha = 'marketing' | 'notificacao' | 'lembrete' | 'pesquisa';

export interface Participante {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  online: boolean;
  ultimo_acesso?: string;
}

export interface Conversa {
  id: string;
  titulo: string;
  status: ComunicacaoStatus;
  canal: ComunicacaoCanal;
  participantes: Participante[];
  ultima_mensagem?: string;
  ultima_mensagem_at?: string;
  nao_lidas: number;
  digitando?: string;
  criado_at: string;
  atualizado_at: string;
  usuario_id: string;
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  remetente_id: string;
  conteudo: string;
  tipo: 'TEXTO' | 'IMAGEM' | 'ARQUIVO' | 'VIDEO' | 'AUDIO' | 'LOCALIZACAO';
  metadata?: Record<string, any>;
  lida: boolean;
  criado_at: string;
  atualizado_at: string;
}

export interface Campanha {
  id: string;
  titulo: string;
  descricao: string;
  tipo: ComunicacaoTipoCampanha;
  status: ComunicacaoStatus;
  data_inicio: string;
  data_fim?: string;
  criado_at: string;
  atualizado_at: string;
}

export interface CampanhaDestinatario {
  id: string;
  campanha_id: string;
  destinatario_id: string;
  status: ComunicacaoStatus;
  enviado_at?: string;
  lido_at?: string;
  criado_at: string;
  atualizado_at: string;
}

export interface RespostaRapida {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  criado_at: string;
  atualizado_at: string;
}

export type InsertConversa = Database['public']['Tables']['conversas']['Insert'];
export type InsertMensagem = Database['public']['Tables']['mensagens']['Insert'];
export type InsertCampanha = Database['public']['Tables']['campanhas']['Insert'];
export type InsertCampanhaDestinatario = Database['public']['Tables']['campanha_destinatarios']['Insert'];
export type InsertRespostaRapida = Database['public']['Tables']['respostas_rapidas']['Insert'];

export type UpdateConversa = Database['public']['Tables']['conversas']['Update'];
export type UpdateMensagem = Database['public']['Tables']['mensagens']['Update'];
export type UpdateCampanha = Database['public']['Tables']['campanhas']['Update'];
export type UpdateCampanhaDestinatario = Database['public']['Tables']['campanha_destinatarios']['Update'];
export type UpdateRespostaRapida = Database['public']['Tables']['respostas_rapidas']['Update']; 