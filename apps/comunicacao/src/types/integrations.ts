import type { ComunicacaoCanal } from './comunicacao';

// Tipos comuns
export interface PreferenciasNotificacao {
  email: boolean;
  sms: boolean;
  push: boolean;
  whatsapp?: boolean;
}

export interface NotificacaoBase {
  titulo: string;
  conteudo: string;
  aluno_id: string;
  link?: string;
}

// Portal do Aluno
export type PortalAlunoTipoNotificacao = 
  | 'evento' 
  | 'mensagem' 
  | 'atividade' 
  | 'prova';

export interface NotificacaoPortalAluno extends NotificacaoBase {
  tipo: PortalAlunoTipoNotificacao;
  curso_id?: string;
  disciplina_id?: string;
  data?: string;
}

// Matrícula
export type MatriculaTipoNotificacao = 
  | 'status' 
  | 'documentacao' 
  | 'prazo' 
  | 'confirmacao';

export interface NotificacaoMatricula extends NotificacaoBase {
  tipo: MatriculaTipoNotificacao;
  matricula_id: string;
  prazo?: string;
  documentos_pendentes?: string[];
}

// Financeiro
export type FinanceiroTipoNotificacao = 
  | 'pagamento' 
  | 'fatura' 
  | 'boleto' 
  | 'atraso';

export interface NotificacaoFinanceiro extends NotificacaoBase {
  tipo: FinanceiroTipoNotificacao;
  valor?: number;
  vencimento?: string;
}

// Interfaces de resposta
export interface NotificacaoResponse {
  success: boolean;
  messageId?: string;
  error?: Error;
  canaisUtilizados: ComunicacaoCanal[];
}

// Interfaces de configuração
export interface IntegracaoConfig {
  ativo: boolean;
  canais: ComunicacaoCanal[];
  templates?: Record<string, string>;
  remetente?: {
    nome: string;
    email: string;
    telefone?: string;
  };
}

export interface IntegracoesConfig {
  portalAluno: IntegracaoConfig;
  matricula: IntegracaoConfig;
  financeiro: IntegracaoConfig;
} 