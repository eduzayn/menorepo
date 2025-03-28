export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Schema conteudo - Tabelas para material didático
      cursos: {
        Row: {
          id: string
          titulo: string
          descricao: string
          carga_horaria: number
          codigo: string
          criado_em: string
          atualizado_em: string
          status: 'rascunho' | 'ativo' | 'inativo' | 'arquivado'
          instituicao_id: string
          coordenador_id: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao: string
          carga_horaria: number
          codigo: string
          criado_em?: string
          atualizado_em?: string
          status?: 'rascunho' | 'ativo' | 'inativo' | 'arquivado'
          instituicao_id: string
          coordenador_id: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string
          carga_horaria?: number
          codigo?: string
          criado_em?: string
          atualizado_em?: string
          status?: 'rascunho' | 'ativo' | 'inativo' | 'arquivado'
          instituicao_id?: string
          coordenador_id?: string
        }
      }
      disciplinas: {
        Row: {
          id: string
          titulo: string
          descricao: string
          codigo: string
          curso_id: string
          ordem: number
          criado_em: string
          atualizado_em: string
          status: 'rascunho' | 'ativo' | 'inativo' | 'arquivado'
        }
        Insert: {
          id?: string
          titulo: string
          descricao: string
          codigo: string
          curso_id: string
          ordem: number
          criado_em?: string
          atualizado_em?: string
          status?: 'rascunho' | 'ativo' | 'inativo' | 'arquivado'
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string
          codigo?: string
          curso_id?: string
          ordem?: number
          criado_em?: string
          atualizado_em?: string
          status?: 'rascunho' | 'ativo' | 'inativo' | 'arquivado'
        }
      }
      aulas: {
        Row: {
          id: string
          titulo: string
          descricao: string
          disciplina_id: string
          ordem: number
          conteudo: Json
          objetivos: string[]
          criado_em: string
          atualizado_em: string
          status: 'rascunho' | 'revisao' | 'aprovado' | 'publicado' | 'arquivado'
          autor_id: string
          duracao_estimada: number
        }
        Insert: {
          id?: string
          titulo: string
          descricao: string
          disciplina_id: string
          ordem: number
          conteudo: Json
          objetivos?: string[]
          criado_em?: string
          atualizado_em?: string
          status?: 'rascunho' | 'revisao' | 'aprovado' | 'publicado' | 'arquivado'
          autor_id: string
          duracao_estimada?: number
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string
          disciplina_id?: string
          ordem?: number
          conteudo?: Json
          objetivos?: string[]
          criado_em?: string
          atualizado_em?: string
          status?: 'rascunho' | 'revisao' | 'aprovado' | 'publicado' | 'arquivado'
          autor_id?: string
          duracao_estimada?: number
        }
      }
      templates: {
        Row: {
          id: string
          titulo: string
          descricao: string
          tipo: 'curso' | 'disciplina' | 'aula'
          estrutura: Json
          instituicao_id: string
          criado_em: string
          atualizado_em: string
          criado_por: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao: string
          tipo: 'curso' | 'disciplina' | 'aula'
          estrutura: Json
          instituicao_id: string
          criado_em?: string
          atualizado_em?: string
          criado_por: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string
          tipo?: 'curso' | 'disciplina' | 'aula'
          estrutura?: Json
          instituicao_id?: string
          criado_em?: string
          atualizado_em?: string
          criado_por?: string
        }
      }
      versoes: {
        Row: {
          id: string
          aula_id: string
          numero: number
          conteudo: Json
          criado_em: string
          autor_id: string
          comentario: string
        }
        Insert: {
          id?: string
          aula_id: string
          numero: number
          conteudo: Json
          criado_em?: string
          autor_id: string
          comentario?: string
        }
        Update: {
          id?: string
          aula_id?: string
          numero?: number
          conteudo?: Json
          criado_em?: string
          autor_id?: string
          comentario?: string
        }
      }
      autores: {
        Row: {
          id: string
          usuario_id: string
          recurso_id: string
          tipo_recurso: 'curso' | 'disciplina' | 'aula'
          permissao: 'leitura' | 'edicao' | 'revisao' | 'publicacao'
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          usuario_id: string
          recurso_id: string
          tipo_recurso: 'curso' | 'disciplina' | 'aula'
          permissao: 'leitura' | 'edicao' | 'revisao' | 'publicacao'
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          recurso_id?: string
          tipo_recurso?: 'curso' | 'disciplina' | 'aula'
          permissao?: 'leitura' | 'edicao' | 'revisao' | 'publicacao'
          criado_em?: string
          atualizado_em?: string
        }
      }
      midias: {
        Row: {
          id: string
          nome: string
          url: string
          tipo: string
          tamanho: number
          aula_id: string
          criado_em: string
          atualizado_em: string
          autor_id: string
        }
        Insert: {
          id?: string
          nome: string
          url: string
          tipo: string
          tamanho: number
          aula_id: string
          criado_em?: string
          atualizado_em?: string
          autor_id: string
        }
        Update: {
          id?: string
          nome?: string
          url?: string
          tipo?: string
          tamanho?: number
          aula_id?: string
          criado_em?: string
          atualizado_em?: string
          autor_id?: string
        }
      }
      publicacoes: {
        Row: {
          id: string
          aula_id: string
          versao_id: string
          status: 'pendente' | 'aprovado' | 'rejeitado'
          comentario: string
          revisor_id: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          aula_id: string
          versao_id: string
          status: 'pendente' | 'aprovado' | 'rejeitado'
          comentario?: string
          revisor_id?: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          aula_id?: string
          versao_id?: string
          status?: 'pendente' | 'aprovado' | 'rejeitado'
          comentario?: string
          revisor_id?: string
          criado_em?: string
          atualizado_em?: string
        }
      }
    }
    Views: {
      // Visualizações personalizadas
      cursos_completos: {
        Row: {
          id: string
          titulo: string
          descricao: string
          carga_horaria: number
          codigo: string
          status: string
          coordenador_id: string
          coordenador_nome: string
          coordenador_email: string
          instituicao_id: string
          instituicao_nome: string
          total_disciplinas: number
          total_aulas: number
        }
      }
      disciplinas_detalhadas: {
        Row: {
          id: string
          titulo: string
          descricao: string
          codigo: string
          curso_id: string
          curso_titulo: string
          ordem: number
          status: string
          total_aulas: number
          aulas_publicadas: number
        }
      }
    }
    Functions: {
      // Funções RPC específicas do material didático
      check_permission: {
        Args: {
          p_action: string
          p_resource: string
        }
        Returns: boolean
      }
      get_user_courses: {
        Args: Record<string, never>
        Returns: {
          id: string
          titulo: string
          descricao: string
          status: string
        }[]
      }
      get_user_disciplines: {
        Args: {
          p_curso_id: string
        }
        Returns: {
          id: string
          titulo: string
          descricao: string
          ordem: number
          status: string
        }[]
      }
      get_versoes_aula: {
        Args: {
          p_aula_id: string
        }
        Returns: {
          id: string
          numero: number
          autor_nome: string
          criado_em: string
          comentario: string
        }[]
      }
      // Funções adicionais específicas do módulo
    }
  }
} 