export type Database = {
  public: {
    Tables: {
      conversas: {
        Row: {
          id: string;
          titulo: string;
          status: string;
          canal: string;
          participante_id: string;
          participante_tipo: string;
          digitando?: string;
          ultima_mensagem?: string;
          ultima_mensagem_at?: string;
          nao_lidas: number;
          criado_at: string;
          atualizado_at: string;
          usuario_id: string;
        };
        Insert: Omit<Database['public']['Tables']['conversas']['Row'], 'id' | 'criado_at' | 'atualizado_at' | 'ultima_mensagem' | 'ultima_mensagem_at' | 'nao_lidas'>;
        Update: Partial<Database['public']['Tables']['conversas']['Insert']>;
      };
      mensagens: {
        Row: {
          id: string;
          conversa_id: string;
          remetente_id: string;
          conteudo: string;
          tipo: string;
          metadata?: Record<string, any>;
          lida: boolean;
          criado_at: string;
          atualizado_at: string;
        };
        Insert: Omit<Database['public']['Tables']['mensagens']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
        Update: Partial<Database['public']['Tables']['mensagens']['Insert']>;
      };
      campanhas: {
        Row: {
          id: string;
          titulo: string;
          descricao: string;
          tipo: string;
          status: string;
          data_inicio: string;
          data_fim?: string;
          criado_at: string;
          atualizado_at: string;
        };
        Insert: Omit<Database['public']['Tables']['campanhas']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
        Update: Partial<Database['public']['Tables']['campanhas']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['respostas_rapidas']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
        Update: Partial<Database['public']['Tables']['respostas_rapidas']['Insert']>;
      };
      grupos: {
        Row: {
          id: string;
          nome: string;
          descricao?: string;
          criado_por: string;
          criado_at: string;
          atualizado_at: string;
        };
        Insert: Omit<Database['public']['Tables']['grupos']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
        Update: Partial<Database['public']['Tables']['grupos']['Insert']>;
      };
      grupo_participantes: {
        Row: {
          id: string;
          grupo_id: string;
          usuario_id: string;
          role: string;
          criado_at: string;
        };
        Insert: Omit<Database['public']['Tables']['grupo_participantes']['Row'], 'id' | 'criado_at'>;
        Update: Partial<Database['public']['Tables']['grupo_participantes']['Insert']>;
      };
      notificacoes_config: {
        Row: {
          id: string;
          usuario_id: string;
          tipo_notificacao: string;
          canal: string;
          ativo: boolean;
          horario_inicio?: string;
          horario_fim?: string;
          dias_semana?: number[];
          criado_at: string;
          atualizado_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notificacoes_config']['Row'], 'id' | 'criado_at' | 'atualizado_at'>;
        Update: Partial<Database['public']['Tables']['notificacoes_config']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      atualizar_ultima_mensagem: {
        Args: { conversa_id_param: string };
        Returns: void;
      };
      marcar_mensagens_como_lidas: {
        Args: { conversa_id_param: string; usuario_id_param: string };
        Returns: void;
      };
      notificar_membros_grupo: {
        Args: { grupo_id_param: string; mensagem_param: string };
        Returns: void;
      };
    };
    Enums: {
      comunicacao_status: 'ATIVO' | 'ARQUIVADO' | 'FINALIZADO';
      comunicacao_canal: 'CHAT' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
      comunicacao_tipo_mensagem: 'TEXTO' | 'IMAGEM' | 'ARQUIVO' | 'VIDEO' | 'AUDIO' | 'LOCALIZACAO';
      comunicacao_tipo_campanha: 'marketing' | 'notificacao' | 'lembrete' | 'pesquisa';
      grupo_role: 'admin' | 'moderador' | 'membro';
      tipo_notificacao: 'mensagem' | 'campanha' | 'sistema' | 'lembrete';
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]; 