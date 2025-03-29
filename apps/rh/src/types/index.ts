/**
 * Tipos e interfaces para o módulo de RH
 */

// Enums
export enum StatusVaga {
  ABERTA = 'aberta',
  EM_ANDAMENTO = 'em_andamento',
  ENCERRADA = 'encerrada',
  SUSPENSA = 'suspensa',
  CANCELADA = 'cancelada'
}

export enum StatusCandidato {
  INSCRITO = 'inscrito',
  EM_ANALISE = 'em_analise',
  ENTREVISTA_AGENDADA = 'entrevista_agendada',
  ENTREVISTADO = 'entrevistado',
  APROVADO = 'aprovado',
  CONTRATADO = 'contratado',
  REPROVADO = 'reprovado',
  DESISTENTE = 'desistente'
}

export enum TipoContrato {
  CLT = 'clt',
  PJ = 'pj',
  TEMPORARIO = 'temporario',
  ESTAGIO = 'estagio',
  TERCEIRIZADO = 'terceirizado'
}

// Interfaces
export interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  departamento: string;
  cargo: string;
  faixa_salarial_min?: number;
  faixa_salarial_max?: number;
  tipo_contrato: TipoContrato;
  local_trabalho: string;
  regime_trabalho: string;
  status: StatusVaga;
  data_publicacao: string;
  data_encerramento?: string;
  etapas_processo: EtapaProcesso[];
  created_at: string;
  updated_at: string;
}

export interface EtapaProcesso {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  duracao_estimada_dias?: number;
  obrigatoria: boolean;
}

export interface Candidato {
  id: string;
  vaga_id: string;
  nome: string;
  email: string;
  telefone?: string;
  linkedin_url?: string;
  github_url?: string;
  curriculo_url?: string;
  formacao: Formacao[];
  experiencia: Experiencia[];
  competencias: string[];
  status: StatusCandidato;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Formacao {
  instituicao: string;
  curso: string;
  grau: string;
  data_inicio: string;
  data_conclusao?: string;
  em_andamento: boolean;
  descricao?: string;
}

export interface Experiencia {
  empresa: string;
  cargo: string;
  data_inicio: string;
  data_fim?: string;
  atual: boolean;
  descricao: string;
}

export interface Colaborador {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  data_admissao: string;
  data_demissao?: string;
  cargo: string;
  departamento: string;
  gestor_id?: string;
  tipo_contrato: TipoContrato;
  salario?: number;
  linkedin_url?: string;
  foto_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Avaliacao {
  id: string;
  colaborador_id: string;
  avaliador_id: string;
  ciclo_avaliativo: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  pontuacao_geral?: number;
  metas: Meta[];
  competencias: CompetenciaAvaliada[];
  pontos_fortes?: string[];
  pontos_melhoria?: string[];
  plano_desenvolvimento?: string;
  feedback_geral?: string;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  id: string;
  descricao: string;
  indicador: string;
  valor_esperado: number;
  valor_alcancado?: number;
  peso: number;
  status: string;
  observacoes?: string;
}

export interface CompetenciaAvaliada {
  id: string;
  nome: string;
  descricao: string;
  peso: number;
  nota?: number;
  observacoes?: string;
}

// Tipos para integrações com redes sociais
export interface RedeSocialConfig {
  enabled: boolean;
  api_key?: string;
  api_secret?: string;
  redirect_uri?: string;
  scopes?: string[];
}

export interface SocialMediaConfig {
  linkedin: RedeSocialConfig;
  facebook: RedeSocialConfig;
  twitter: RedeSocialConfig;
  github: RedeSocialConfig;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
} 