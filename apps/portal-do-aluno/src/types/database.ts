/**
 * Tipos para o Schema do Portal do Aluno
 * 
 * Este arquivo contém as definições de tipos TypeScript
 * que correspondem às tabelas no schema 'portal_aluno' do banco de dados.
 */

// Enums

export type DocumentoStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'em_analise';

export type CertificadoStatus = 'disponivel' | 'indisponivel' | 'solicitado' | 'emitido' | 'enviado' | 'cancelado';

export type MotivoBloqueio = 'inadimplencia' | 'documentacao_pendente' | 'administrativo' | 'suspensao_temporaria' | 'inatividade';

export type TipoConteudo = 'aula' | 'video' | 'documento' | 'quiz' | 'tarefa' | 'forum' | 'material_complementar';

export type ProgressoStatus = 'nao_iniciado' | 'em_progresso' | 'concluido' | 'atrasado' | 'cancelado';

// Interfaces das tabelas

/**
 * Perfil do Aluno
 */
export interface PerfilAluno {
  id: string;
  matricula_id?: string;
  foto_url?: string;
  bio?: string;
  telefone?: string;
  data_nascimento?: string; // ISO date string
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  preferencias?: {
    tema?: 'light' | 'dark';
    notificacoes?: boolean;
    email_marketing?: boolean;
  };
  links_sociais?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    site?: string;
  };
  ultimo_acesso?: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

/**
 * Progresso de Conteúdo
 */
export interface ProgressoConteudo {
  id: string;
  aluno_id: string;
  curso_id: string;
  disciplina_id?: string;
  aula_id?: string;
  tipo: TipoConteudo;
  status: ProgressoStatus;
  porcentagem_concluida: number;
  nota?: number;
  tempo_gasto?: number; // em segundos
  ultima_interacao?: string; // ISO date string
  data_conclusao?: string; // ISO date string
  metadados?: Record<string, any>;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

/**
 * Documento do Aluno
 */
export interface DocumentoAluno {
  id: string;
  aluno_id: string;
  tipo: string;
  nome: string;
  descricao?: string;
  arquivo_url: string;
  status: DocumentoStatus;
  feedback?: string;
  revisado_por?: string;
  data_revisao?: string; // ISO date string
  metadata?: Record<string, any>;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

/**
 * Certificado
 */
export interface Certificado {
  id: string;
  aluno_id: string;
  curso_id: string;
  codigo_validacao: string;
  data_solicitacao: string; // ISO date string
  data_emissao?: string; // ISO date string
  data_envio?: string; // ISO date string
  status: CertificadoStatus;
  url_certificado?: string;
  motivo_indisponibilidade?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  // Relações expandidas
  curso?: {
    nome: string;
  };
}

/**
 * Bloqueio de Acesso
 */
export interface BloqueioAcesso {
  id: string;
  aluno_id: string;
  motivo: MotivoBloqueio;
  descricao?: string;
  data_inicio: string; // ISO date string
  data_fim?: string; // ISO date string
  ativo: boolean;
  criado_por?: string;
  metadata?: Record<string, any>;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

/**
 * Atividade do Aluno
 */
export interface AtividadeAluno {
  id: string;
  aluno_id: string;
  tipo: string;
  descricao: string;
  pagina?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string; // ISO date string
}

/**
 * Gamificação
 */
export interface Gamificacao {
  id: string;
  aluno_id: string;
  pontos: number;
  nivel: number;
  medalhas: Array<{
    id: string;
    nome: string;
    descricao?: string;
    imagem_url?: string;
    data_conquista: string; // ISO date string
  }>;
  conquistas: Array<{
    id: string;
    nome: string;
    descricao?: string;
    pontos: number;
    imagem_url?: string;
    data_conquista: string; // ISO date string
  }>;
  historico_pontos: Array<{
    pontos: number;
    motivo: string;
    data: string; // ISO date string
  }>;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

/**
 * Situação do Aluno (View)
 */
export interface SituacaoAluno {
  aluno_id: string;
  full_name: string;
  email: string;
  matricula_id?: string;
  status_matricula?: string;
  curso_nome?: string;
  curso_id?: string;
  bloqueios_ativos: number;
  motivos_bloqueio?: string;
  documentos_pendentes: number;
  parcelas_atrasadas: number;
  ultimo_acesso?: string; // ISO date string
  progresso_curso?: number;
}

/**
 * Tipo para Database Supabase
 */
export interface Database {
  portal_aluno: {
    Tables: {
      perfil_aluno: {
        Row: PerfilAluno;
        Insert: Omit<PerfilAluno, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PerfilAluno, 'id' | 'created_at' | 'updated_at'>>;
      };
      progresso_conteudo: {
        Row: ProgressoConteudo;
        Insert: Omit<ProgressoConteudo, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProgressoConteudo, 'id' | 'aluno_id' | 'curso_id' | 'created_at' | 'updated_at'>>;
      };
      documentos_aluno: {
        Row: DocumentoAluno;
        Insert: Omit<DocumentoAluno, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DocumentoAluno, 'id' | 'aluno_id' | 'created_at' | 'updated_at'>>;
      };
      certificados: {
        Row: Certificado;
        Insert: Omit<Certificado, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Certificado, 'id' | 'aluno_id' | 'curso_id' | 'created_at' | 'updated_at'>>;
      };
      bloqueios_acesso: {
        Row: BloqueioAcesso;
        Insert: Omit<BloqueioAcesso, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BloqueioAcesso, 'id' | 'created_at' | 'updated_at'>>;
      };
      atividades_aluno: {
        Row: AtividadeAluno;
        Insert: Omit<AtividadeAluno, 'id' | 'created_at'>;
        Update: Partial<Omit<AtividadeAluno, 'id' | 'created_at'>>;
      };
      gamificacao: {
        Row: Gamificacao;
        Insert: Omit<Gamificacao, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Gamificacao, 'id' | 'aluno_id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      situacao_aluno: {
        Row: SituacaoAluno;
      };
      estatisticas_uso: {
        Row: {
          data: string;
          alunos_ativos: number;
          total_atividades: number;
          tipo: string;
          alunos_concluiram_conteudo: number;
        };
      };
    };
    Functions: {
      register_activity: {
        Args: {
          p_aluno_id: string;
          p_tipo: string;
          p_descricao: string;
          p_pagina?: string;
          p_ip_address?: string;
          p_user_agent?: string;
        };
        Returns: string;
      };
      verificar_elegibilidade_certificado: {
        Args: {
          p_aluno_id: string;
          p_curso_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      documento_status: DocumentoStatus;
      certificado_status: CertificadoStatus;
      motivo_bloqueio: MotivoBloqueio;
      tipo_conteudo: TipoConteudo;
      progresso_status: ProgressoStatus;
    };
  };
} 