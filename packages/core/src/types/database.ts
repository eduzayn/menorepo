import { Database as BaseDatabase } from '@edunexia/database-types';

export interface ComunicacaoTables {
  conversas: {
    Row: {
      id: string;
      titulo: string;
      status: 'ATIVO' | 'INATIVO';
      usuario_id: string;
      participante_id: string;
      participante_tipo: 'LEAD' | 'ALUNO';
      ultima_mensagem: string | null;
      ultima_mensagem_at: string | null;
      nao_lidas: number;
      criado_at: string;
      atualizado_at: string;
    };
    Insert: Omit<ComunicacaoTables['conversas']['Row'], 'id' | 'criado_at' | 'atualizado_at' | 'ultima_mensagem' | 'ultima_mensagem_at' | 'nao_lidas'>;
    Update: Partial<ComunicacaoTables['conversas']['Insert']>;
  };
  mensagens: {
    Row: {
      id: string;
      conversa_id: string;
      remetente_id: string;
      conteudo: string;
      tipo: 'TEXTO' | 'IMAGEM' | 'ARQUIVO';
      lida: boolean;
      criado_at: string;
      atualizado_at: string;
    };
    Insert: Omit<ComunicacaoTables['mensagens']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
    Update: Partial<ComunicacaoTables['mensagens']['Insert']>;
  };
  campanhas: {
    Row: {
      id: string;
      titulo: string;
      descricao: string;
      status: 'ATIVA' | 'INATIVA' | 'CONCLUIDA';
      tipo: 'EMAIL' | 'SMS' | 'WHATSAPP';
      data_inicio: string;
      data_fim: string | null;
      criado_at: string;
      atualizado_at: string;
    };
    Insert: Omit<ComunicacaoTables['campanhas']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
    Update: Partial<ComunicacaoTables['campanhas']['Insert']>;
  };
  respostas_rapidas: {
    Row: {
      id: string;
      titulo: string;
      conteudo: string;
      categoria: string;
      criado_at: string;
      atualizado_at: string;
    };
    Insert: Omit<ComunicacaoTables['respostas_rapidas']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
    Update: Partial<ComunicacaoTables['respostas_rapidas']['Insert']>;
  };
  grupos: {
    Row: {
      id: string;
      nome: string;
      descricao: string;
      criado_at: string;
      atualizado_at: string;
    };
    Insert: Omit<ComunicacaoTables['grupos']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
    Update: Partial<ComunicacaoTables['grupos']['Insert']>;
  };
  participantes: {
    Row: {
      id: string;
      grupo_id: string;
      usuario_id: string;
      role: 'ADMIN' | 'MEMBRO';
      criado_at: string;
      atualizado_at: string;
    };
    Insert: Omit<ComunicacaoTables['participantes']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
    Update: Partial<ComunicacaoTables['participantes']['Insert']>;
  };
  notificacoes: {
    Row: {
      id: string;
      usuario_id: string;
      titulo: string;
      mensagem: string;
      tipo: 'INFO' | 'SUCESSO' | 'ERRO' | 'ALERTA';
      lida: boolean;
      criado_at: string;
      atualizado_at: string;
    };
    Insert: Omit<ComunicacaoTables['notificacoes']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
    Update: Partial<ComunicacaoTables['notificacoes']['Insert']>;
  };
  configuracoes_notificacao: {
    Row: {
      id: string;
      usuario_id: string;
      tipo_notificacao: string;
      canal: 'EMAIL' | 'SMS' | 'PUSH';
      ativo: boolean;
      criado_at: string;
      atualizado_at: string;
    };
    Insert: Omit<ComunicacaoTables['configuracoes_notificacao']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
    Update: Partial<ComunicacaoTables['configuracoes_notificacao']['Insert']>;
  };
}

export interface Database extends BaseDatabase {
  public: ComunicacaoTables & BaseDatabase['public'];
} 