export type ComunicacaoStatus = 'ativo' | 'inativo' | 'pendente' | 'arquivado';
export type ComunicacaoCanal = 'whatsapp' | 'email' | 'chat' | 'sms';
export type ComunicacaoTipoMensagem = 'texto' | 'imagem' | 'arquivo' | 'video' | 'audio' | 'localizacao';
export type ComunicacaoTipoCampanha = 'marketing' | 'notificacao' | 'lembrete' | 'pesquisa';

export interface Conversa {
  id: string;
  titulo: string;
  status: ComunicacaoStatus;
  canal: ComunicacaoCanal;
  remetente_id: string;
  destinatario_id?: string;
  lead_id?: string;
  ultima_mensagem_at?: string;
  criado_at: string;
  atualizado_at: string;
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  remetente_id: string;
  tipo: ComunicacaoTipoMensagem;
  conteudo: string;
  metadata?: Record<string, any>;
  lida_at?: string;
  criado_at: string;
}

export interface Campanha {
  id: string;
  nome: string;
  descricao?: string;
  tipo: ComunicacaoTipoCampanha;
  conteudo: string;
  metadata?: Record<string, any>;
  status: string;
  data_inicio?: string;
  data_fim?: string;
  criado_por: string;
  criado_at: string;
  atualizado_at: string;
}

export interface CampanhaDestinatario {
  id: string;
  campanha_id: string;
  destinatario_id: string;
  status: string;
  enviado_at?: string;
  lido_at?: string;
  respondido_at?: string;
  criado_at: string;
}

export interface RespostaRapida {
  id: string;
  titulo: string;
  conteudo: string;
  categoria?: string;
  criado_por: string;
  criado_at: string;
  atualizado_at: string;
} 