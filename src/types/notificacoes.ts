export interface Notificacao {
  id: string;
  usuario_id: string;
  titulo: string;
  mensagem: string;
  tipo: 'INFO' | 'SUCESSO' | 'ERRO' | 'ALERTA';
  lida: boolean;
  criado_at: string;
  atualizado_at: string;
}

export interface ConfiguracaoNotificacao {
  id: string;
  usuario_id: string;
  tipo_notificacao: string;
  canal: 'EMAIL' | 'SMS' | 'PUSH';
  ativo: boolean;
  criado_at: string;
  atualizado_at: string;
}

export type InsertNotificacao = Omit<Notificacao, 'id' | 'criado_at' | 'atualizado_at'>;
export type UpdateNotificacao = Partial<InsertNotificacao>;

export type InsertConfiguracao = Omit<ConfiguracaoNotificacao, 'id' | 'criado_at' | 'atualizado_at'>;
export type UpdateConfiguracao = Partial<InsertConfiguracao>; 