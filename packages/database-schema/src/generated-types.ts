export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contratos: {
        Row: {
          created_at: string | null
          data_assinatura: string | null
          id: string
          matricula_id: string
          numero_contrato: string
          status: string | null
          updated_at: string | null
          url_documento: string | null
        }
        Insert: {
          created_at?: string | null
          data_assinatura?: string | null
          id?: string
          matricula_id: string
          numero_contrato: string
          status?: string | null
          updated_at?: string | null
          url_documento?: string | null
        }
        Update: {
          created_at?: string | null
          data_assinatura?: string | null
          id?: string
          matricula_id?: string
          numero_contrato?: string
          status?: string | null
          updated_at?: string | null
          url_documento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          carga_horaria: number
          coordenador_id: string | null
          created_at: string | null
          descricao: string | null
          duracao_meses: number
          id: string
          institution_id: string
          modalidade: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          carga_horaria: number
          coordenador_id?: string | null
          created_at?: string | null
          descricao?: string | null
          duracao_meses: number
          id?: string
          institution_id: string
          modalidade: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          carga_horaria?: number
          coordenador_id?: string | null
          created_at?: string | null
          descricao?: string | null
          duracao_meses?: number
          id?: string
          institution_id?: string
          modalidade?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cursos_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          created_at: string | null
          id: string
          matricula_id: string
          nome: string
          observacoes: string | null
          status: string | null
          tipo: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          matricula_id: string
          nome: string
          observacoes?: string | null
          status?: string | null
          tipo: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          matricula_id?: string
          nome?: string
          observacoes?: string | null
          status?: string | null
          tipo?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verifications: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      institutions: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      matriculas: {
        Row: {
          aluno_id: string
          created_at: string | null
          curso_id: string
          data_conclusao_prevista: string
          data_inicio: string
          id: string
          observacoes: string | null
          plano_id: string
          status: Database["public"]["Enums"]["matricula_status"] | null
          updated_at: string | null
        }
        Insert: {
          aluno_id: string
          created_at?: string | null
          curso_id: string
          data_conclusao_prevista: string
          data_inicio: string
          id?: string
          observacoes?: string | null
          plano_id: string
          status?: Database["public"]["Enums"]["matricula_status"] | null
          updated_at?: string | null
        }
        Update: {
          aluno_id?: string
          created_at?: string | null
          curso_id?: string
          data_conclusao_prevista?: string
          data_inicio?: string
          id?: string
          observacoes?: string | null
          plano_id?: string
          status?: Database["public"]["Enums"]["matricula_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matriculas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_pagamento"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          comprovante_url: string | null
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string
          forma_pagamento: string | null
          id: string
          matricula_id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
          valor: number
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          forma_pagamento?: string | null
          id?: string
          matricula_id: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          valor: number
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          forma_pagamento?: string | null
          id?: string
          matricula_id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      password_resets: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      planos_pagamento: {
        Row: {
          created_at: string | null
          curso_id: string
          desconto_pontualidade: number | null
          dia_vencimento: number
          id: string
          nome: string
          numero_parcelas: number
          taxa_matricula: number | null
          updated_at: string | null
          valor_parcela: number
          valor_total: number
        }
        Insert: {
          created_at?: string | null
          curso_id: string
          desconto_pontualidade?: number | null
          dia_vencimento: number
          id?: string
          nome: string
          numero_parcelas: number
          taxa_matricula?: number | null
          updated_at?: string | null
          valor_parcela: number
          valor_total: number
        }
        Update: {
          created_at?: string | null
          curso_id?: string
          desconto_pontualidade?: number | null
          dia_vencimento?: number
          id?: string
          nome?: string
          numero_parcelas?: number
          taxa_matricula?: number | null
          updated_at?: string | null
          valor_parcela?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "planos_pagamento_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          institution_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          institution_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          institution_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          provider: Database["public"]["Enums"]["auth_provider"]
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: string | null
          provider: Database["public"]["Enums"]["auth_provider"]
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          provider?: Database["public"]["Enums"]["auth_provider"]
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      auth_provider: "email" | "google" | "facebook" | "github"
      matricula_status:
        | "pendente"
        | "ativa"
        | "cancelada"
        | "trancada"
        | "concluida"
      payment_status: "pendente" | "aprovado" | "recusado" | "reembolsado"
      user_role:
        | "super_admin"
        | "admin_instituicao"
        | "consultor_comercial"
        | "tutor"
        | "aluno"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
