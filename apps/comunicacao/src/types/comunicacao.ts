// Tipos base
export type ComunicacaoStatus = 'ATIVO' | 'ARQUIVADO' | 'FINALIZADO';
export type ComunicacaoCanal = 'CHAT' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
export type ComunicacaoTipoMensagem = 'TEXTO' | 'IMAGEM' | 'ARQUIVO' | 'VIDEO' | 'AUDIO' | 'LOCALIZACAO';
export type ComunicacaoTipoCampanha = 'marketing' | 'notificacao' | 'lembrete' | 'pesquisa';
export type GrupoRole = 'admin' | 'moderador' | 'membro';
export type TipoNotificacao = 'mensagem' | 'campanha' | 'sistema' | 'lembrete';

// Interfaces base
export interface Participante {
  id: string;
  nome: string;
  email: string;
  tipo: 'USUARIO' | 'LEAD' | 'ALUNO';
  avatar_url?: string;
  online: boolean;
  ultimo_acesso?: string;
}

// Interfaces de comunicação
export interface Conversa {
  id: string;
  titulo: string;
  status: ComunicacaoStatus;
  canal: ComunicacaoCanal;
  participante_id: string;
  participante_tipo: 'LEAD' | 'ALUNO';
  digitando?: string;
  participantes: Participante[];
  ultima_mensagem?: string;
  ultima_mensagem_at?: string;
  nao_lidas: number;
  criado_at: string;
  atualizado_at: string;
  usuario_id: string;
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  remetente_id: string;
  conteudo: string;
  tipo: ComunicacaoTipoMensagem;
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

// Interfaces de grupos e notificações
export interface Grupo {
  id: string;
  nome: string;
  descricao?: string;
  criado_por: string;
  criado_at: string;
  atualizado_at: string;
}

export interface GrupoParticipante {
  id: string;
  grupo_id: string;
  usuario_id: string;
  role: GrupoRole;
  criado_at: string;
}

export interface NotificacaoConfig {
  id: string;
  usuario_id: string;
  tipo_notificacao: TipoNotificacao;
  canal: ComunicacaoCanal;
  ativo: boolean;
  horario_inicio?: string;
  horario_fim?: string;
  dias_semana?: number[];
  criado_at: string;
  atualizado_at: string;
}

// Tipos para inserção e atualização
export interface InsertGrupo extends Omit<Grupo, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateGrupo extends Partial<InsertGrupo> {}

export interface InsertGrupoParticipante extends Omit<GrupoParticipante, 'id' | 'criado_at'> {}
export interface UpdateGrupoParticipante extends Partial<InsertGrupoParticipante> {}

export interface InsertNotificacaoConfig extends Omit<NotificacaoConfig, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateNotificacaoConfig extends Partial<InsertNotificacaoConfig> {}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'NOVO' | 'QUALIFICADO' | 'CONTATO' | 'NEGOCIACAO' | 'FECHADO';
  ultima_interacao: string;
  engajamento: number;
  canal_origem: string;
  observacoes?: string;
  criado_at: string;
  atualizado_at: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  matricula: string;
  curso: string;
  status: 'ATIVO' | 'INATIVO' | 'TRANCADO';
  ultima_interacao: string;
  engajamento: number;
  observacoes?: string;
  criado_at: string;
  atualizado_at: string;
}

export interface Interacao {
  id: string;
  tipo: 'MENSAGEM' | 'CHAMADA' | 'EMAIL' | 'VISITA' | 'MATRICULA';
  data: string;
  descricao: string;
  participante_id: string;
  participante_tipo: 'LEAD' | 'ALUNO';
  usuario_id: string;
  criado_at: string;
} 