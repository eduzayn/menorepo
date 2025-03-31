// Tipos base
export type ComunicacaoStatus = 'ATIVO' | 'ARQUIVADO' | 'FINALIZADO';
export type ComunicacaoCanal = 'CHAT' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
export type ComunicacaoTipoMensagem = 'TEXTO' | 'IMAGEM' | 'ARQUIVO' | 'VIDEO' | 'AUDIO' | 'LOCALIZACAO';
export type ComunicacaoTipoCampanha = 'marketing' | 'notificacao' | 'lembrete' | 'pesquisa';
export type GrupoRole = 'admin' | 'moderador' | 'membro';
export type TipoNotificacao = 'mensagem' | 'campanha' | 'sistema' | 'lembrete';
export type LeadStatus = 'NOVO' | 'EM_CONTATO' | 'QUALIFICADO' | 'CONVERTIDO' | 'PERDIDO';

// Tipos para CRM avançado
export type LeadScoreCategoria = 'DEMOGRAFICO' | 'COMPORTAMENTAL' | 'ENGAJAMENTO' | 'INTERESSE' | 'INTERACAO';
export type AutomacaoTrigger = 'LEAD_CRIADO' | 'STATUS_ALTERADO' | 'PONTUACAO_ATINGIDA' | 'TEMPO_INATIVO' | 'INTERACAO_RECEBIDA';
export type AutomacaoAcao = 'ENVIAR_EMAIL' | 'ENVIAR_SMS' | 'ATRIBUIR_RESPONSAVEL' | 'MUDAR_STATUS' | 'ADICIONAR_TAREFA' | 'AGENDAR_REUNIAO';
export type PipelineEtapa = 'PROSPECCAO' | 'QUALIFICACAO' | 'PROPOSTA' | 'NEGOCIACAO' | 'FECHAMENTO' | 'POS_VENDA';

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
  status: LeadStatus;
  ultima_interacao: string;
  engajamento?: number;
  canal_origem?: string;
  observacoes?: string;
  online: boolean;
  ultimo_acesso?: string;
  criado_at: string;
  atualizado_at: string;
  // Campos utilizados no mock
  empresa?: string;
  cargo?: string;
  origem?: string;
  data_ultimo_contato?: string;
  pontuacao?: number;
  notas?: string;
  // Novos campos para CRM avançado
  score?: number;
  responsavel_id?: string;
  segmento?: string[];
  tags?: string[];
  pipeline_etapa?: PipelineEtapa;
  pipeline_valor?: number;
  pipeline_probabilidade?: number;
  fonte_aquisicao?: string;
  ultima_campanha_id?: string;
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

export interface InsertConversa extends Omit<Conversa, 'id' | 'criado_at' | 'atualizado_at' | 'ultima_mensagem' | 'ultima_mensagem_at' | 'nao_lidas'> {}
export interface UpdateConversa extends Partial<InsertConversa> {}

export interface InsertMensagem extends Omit<Mensagem, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateMensagem extends Partial<InsertMensagem> {}

export interface InsertCampanha extends Omit<Campanha, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateCampanha extends Partial<InsertCampanha> {}

export interface InsertCampanhaDestinatario extends Omit<CampanhaDestinatario, 'id' | 'criado_at' | 'atualizado_at' | 'enviado_at' | 'lido_at'> {}
export interface UpdateCampanhaDestinatario extends Partial<InsertCampanhaDestinatario> {}

export interface InsertRespostaRapida extends Omit<RespostaRapida, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateRespostaRapida extends Partial<InsertRespostaRapida> {}

// Novas interfaces para CRM avançado

export interface LeadScore {
  id: string;
  lead_id: string;
  categoria: LeadScoreCategoria;
  nome: string;
  valor: number;
  descricao: string;
  criado_at: string;
  atualizado_at: string;
}

export interface LeadSegmento {
  id: string;
  nome: string;
  criterios: Record<string, any>;
  descricao: string;
  criado_por: string;
  criado_at: string;
  atualizado_at: string;
}

export interface Automacao {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  trigger: AutomacaoTrigger;
  condicoes: Record<string, any>;
  acoes: {
    tipo: AutomacaoAcao;
    parametros: Record<string, any>;
    intervalo?: number;
  }[];
  segmento_id?: string;
  criado_por: string;
  criado_at: string;
  atualizado_at: string;
}

export interface Oportunidade {
  id: string;
  lead_id: string;
  titulo: string;
  descricao: string;
  valor: number;
  etapa: PipelineEtapa;
  probabilidade: number;
  data_estimada_fechamento: string;
  responsavel_id: string;
  produtos?: {
    produto_id: string;
    quantidade: number;
    valor_unitario: number;
  }[];
  criado_at: string;
  atualizado_at: string;
}

export interface Reuniao {
  id: string;
  lead_id?: string;
  oportunidade_id?: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local?: string;
  link_virtual?: string;
  responsavel_id: string;
  participantes: string[];
  notas?: string;
  criado_at: string;
  atualizado_at: string;
}

export interface RelatorioConversao {
  id: string;
  nome: string;
  descricao?: string;
  filtros: Record<string, any>;
  periodo: {
    inicio: string;
    fim: string;
  };
  agrupamento: 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano';
  criado_por: string;
  criado_at: string;
  atualizado_at: string;
}

// Tipos para inserção e atualização - CRM avançado
export interface InsertLeadScore extends Omit<LeadScore, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateLeadScore extends Partial<InsertLeadScore> {}

export interface InsertLeadSegmento extends Omit<LeadSegmento, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateLeadSegmento extends Partial<InsertLeadSegmento> {}

export interface InsertAutomacao extends Omit<Automacao, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateAutomacao extends Partial<InsertAutomacao> {}

export interface InsertOportunidade extends Omit<Oportunidade, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateOportunidade extends Partial<InsertOportunidade> {}

export interface InsertReuniao extends Omit<Reuniao, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateReuniao extends Partial<InsertReuniao> {}

export interface InsertRelatorioConversao extends Omit<RelatorioConversao, 'id' | 'criado_at' | 'atualizado_at'> {}
export interface UpdateRelatorioConversao extends Partial<InsertRelatorioConversao> {} 