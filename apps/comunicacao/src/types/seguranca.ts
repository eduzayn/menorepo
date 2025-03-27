import type { Database } from './database';

// Tipos de Consentimento
export type TipoConsentimento = 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP' | 'MARKETING';

export interface Consentimento {
  id: string;
  usuario_id: string;
  tipo: TipoConsentimento;
  consentido: boolean;
  data_consentimento: string;
  ip_consentimento: string;
  dispositivo_consentimento: string;
  navegador_consentimento: string;
  sistema_operacional_consentimento: string;
  versao_termos: string;
  dados_consentidos: string[];
  criado_at: string;
  atualizado_at: string;
}

// Tipos de Auditoria
export type TipoLogAuditoria = 'CRIACAO' | 'ATUALIZACAO' | 'DELECAO' | 'ACESSO' | 'CONSENTIMENTO';

export interface LogAuditoria {
  id: string;
  usuario_id: string;
  acao: string;
  tipo: TipoLogAuditoria;
  entidade: string;
  entidade_id: string;
  dados_anteriores?: Record<string, any>;
  dados_novos?: Record<string, any>;
  ip: string;
  user_agent: string;
  dispositivo: string;
  navegador: string;
  sistema_operacional: string;
  criado_at: string;
}

// Tipos de Segurança
export interface ConfiguracaoSeguranca {
  id: string;
  usuario_id: string;
  autenticacao_2fatores: boolean;
  notificacoes_seguranca: boolean;
  sessao_ativa: boolean;
  ultimo_acesso: string;
  ip_ultimo_acesso: string;
  dispositivo_ultimo_acesso: string;
  navegador_ultimo_acesso: string;
  sistema_operacional_ultimo_acesso: string;
  criado_at: string;
  atualizado_at: string;
}

export interface TentativaLogin {
  id: string;
  usuario_id: string;
  ip: string;
  user_agent: string;
  dispositivo: string;
  navegador: string;
  sistema_operacional: string;
  sucesso: boolean;
  motivo_falha?: string;
  criado_at: string;
}

export type TipoBloqueio = 'LOGIN' | 'API' | 'SMS' | 'EMAIL';

export interface BloqueioTemporario {
  id: string;
  usuario_id: string;
  tipo: TipoBloqueio;
  motivo: string;
  data_inicio: string;
  data_fim: string;
  ip_bloqueio: string;
  user_agent_bloqueio: string;
  criado_at: string;
}

// Tipos de Resposta
export interface NotificacaoResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  canaisUtilizados: Database['public']['Enums']['comunicacao_canal'][];
}

export interface AuditoriaResponse {
  logs: LogAuditoria[];
  total: number;
}

export interface SegurancaResponse {
  bloqueado: boolean;
  motivo?: string;
  tentativas_restantes?: number;
} 