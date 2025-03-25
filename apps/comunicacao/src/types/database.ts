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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]; 