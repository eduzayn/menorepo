// Definição de tabelas de forma simplificada para desenvolvimento local

// Tipo utilitário para selecionar tabelas pelo nome
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

// Tipo utilitário para inserção de dados em tabelas
export type TablesInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

// Estrutura base de banco de dados
export interface Database {
  public: {
    Tables: {
      respostas_rapidas: {
        Row: {
          id: string;
          titulo: string;
          conteudo: string;
          categoria_id?: string;
          criado_por: string;
          criado_em: string;
          atualizado_em?: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          conteudo: string;
          categoria_id?: string;
          criado_por: string;
          criado_em?: string;
          atualizado_em?: string;
        };
      };
      mensagens: {
        Row: {
          id: string;
          conversa_id: string;
          remetente_id: string;
          conteudo: string;
          tipo: string;
          status: string;
          criado_em: string;
          lido_em?: string;
        };
        Insert: {
          id?: string;
          conversa_id: string;
          remetente_id: string;
          conteudo: string;
          tipo?: string;
          status?: string;
          criado_em?: string;
          lido_em?: string;
        };
      };
      conversas: {
        Row: {
          id: string;
          titulo: string;
          tipo: string;
          status: string;
          participantes: string[];
          criado_em: string;
          atualizado_em: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          tipo?: string;
          status?: string;
          participantes: string[];
          criado_em?: string;
          atualizado_em?: string;
        };
      };
      usuarios: {
        Row: {
          id: string;
          nome: string;
          email: string;
          avatar_url?: string;
          role: string;
          status: string;
          criado_em: string;
          ultimo_acesso?: string;
        };
        Insert: {
          id?: string;
          nome: string;
          email: string;
          avatar_url?: string;
          role?: string;
          status?: string;
          criado_em?: string;
          ultimo_acesso?: string;
        };
      };
    };
  };
} 