/**
 * @edunexia/shared-types/rh
 * 
 * Definições de tipos para o módulo de Recursos Humanos (RH)
 */

/**
 * Enums para o módulo RH
 */
export enum StatusVaga {
  DRAFT = 'DRAFT',
  ABERTA = 'ABERTA',
  PAUSADA = 'PAUSADA',
  ENCERRADA = 'ENCERRADA',
  CANCELADA = 'CANCELADA'
}

export enum StatusCandidato {
  INSCRITO = 'INSCRITO',
  EM_ANALISE = 'EM_ANALISE',
  TESTE_TECNICO = 'TESTE_TECNICO',
  ENTREVISTA = 'ENTREVISTA',
  APROVADO = 'APROVADO',
  CONTRATADO = 'CONTRATADO',
  REPROVADO = 'REPROVADO',
  DESISTENTE = 'DESISTENTE'
}

export enum TipoContrato {
  CLT = 'CLT',
  PJ = 'PJ',
  ESTAGIO = 'ESTAGIO',
  FREELANCER = 'FREELANCER',
  TEMPORARIO = 'TEMPORARIO'
}

export enum StatusAvaliacao {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

/**
 * Interfaces para o módulo RH
 */

// Colaborador
export interface Colaborador {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  data_admissao: string;
  data_demissao?: string;
  data_readmissao?: string;
  salario: number;
  tipo_contrato: TipoContrato;
  nivel_educacional?: string;
  foto_url?: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  linkedin_url?: string;
  github_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface NovoColaborador {
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  data_admissao: string;
  salario: number;
  tipo_contrato: TipoContrato;
  nivel_educacional?: string;
  foto_url?: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  linkedin_url?: string;
  github_url?: string;
}

// Estatísticas de Colaboradores
export interface EstatisticasColaboradores {
  total: number;
  ativos: number;
  inativos: number;
  porDepartamento: { nome: string; total: number }[];
  porTipoContrato: { tipo: TipoContrato; total: number }[];
}

// Vaga
export interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  cargo: string;
  departamento: string;
  requisitos: string[];
  responsabilidades: string[];
  faixa_salarial_min?: number;
  faixa_salarial_max?: number;
  local_trabalho: string;
  tipo_contrato: TipoContrato;
  etapas_processo?: string[];
  competencias_desejadas?: string[];
  status: StatusVaga;
  prazo_inscricao?: string;
  total_candidatos: number;
  created_at: string;
  updated_at: string;
}

export interface NovaVaga {
  titulo: string;
  descricao: string;
  cargo: string;
  departamento: string;
  requisitos: string[];
  responsabilidades: string[];
  faixa_salarial_min?: number;
  faixa_salarial_max?: number;
  local_trabalho: string;
  tipo_contrato: TipoContrato;
  etapas_processo?: string[];
  competencias_desejadas?: string[];
  prazo_inscricao?: string;
}

// Estatísticas de Vagas
export interface EstatisticasVagas {
  total: number;
  abertas: number;
  encerradas: number;
  departamentos: { nome: string; total: number }[];
}

// Candidato
export interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  curriculo_url: string;
  formacao_academica: string;
  experiencia_profissional: string;
  competencias: string[];
  vaga_id: string;
  vaga_titulo?: string;
  status: StatusCandidato;
  notas_entrevista?: string;
  resultado_teste?: string;
  feedback_recusado?: string;
  created_at: string;
  updated_at: string;
}

export interface NovoCandidato {
  nome: string;
  email: string;
  telefone: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  curriculo_url: string;
  formacao_academica: string;
  experiencia_profissional: string;
  competencias: string[];
  vaga_id: string;
}

export interface EstatisticasCandidatos {
  total: number;
  inscritos: number;
  emAnalise: number;
  aprovados: number;
  contratados: number;
  reprovados: number;
  taxaConversao: number;
}

// Formação
export interface Formacao {
  instituicao: string;
  curso: string;
  grau: string;
  data_inicio: string;
  data_conclusao?: string;
  em_andamento: boolean;
  descricao?: string;
}

// Experiência
export interface Experiencia {
  empresa: string;
  cargo: string;
  data_inicio: string;
  data_fim?: string;
  atual: boolean;
  descricao: string;
}

// Avaliação
export interface Meta {
  id: string;
  avaliacao_id: string;
  descricao: string;
  peso: number;
  nota?: number;
  created_at: string;
  updated_at?: string;
}

export interface Competencia {
  id: string;
  avaliacao_id: string;
  nome: string;
  descricao?: string;
  peso: number;
  nota?: number;
  created_at: string;
  updated_at?: string;
}

export interface Avaliacao {
  id: string;
  ciclo_avaliativo: string;
  colaborador_id: string;
  colaborador?: Colaborador;
  avaliador_id: string;
  avaliador?: Colaborador;
  data_inicio: string;
  data_fim: string;
  data_conclusao?: string;
  status: StatusAvaliacao;
  nota_final?: number;
  feedback?: string;
  metas?: Meta[];
  competencias?: Competencia[];
  created_at: string;
  updated_at: string;
}

export interface NovaAvaliacao {
  ciclo_avaliativo: string;
  colaborador_id: string;
  avaliador_id: string;
  data_inicio: string;
  data_fim: string;
  metas?: Omit<Meta, 'id' | 'avaliacao_id' | 'created_at' | 'updated_at'>[];
  competencias?: Omit<Competencia, 'id' | 'avaliacao_id' | 'created_at' | 'updated_at'>[];
}

// Filtros para listagens
export interface FiltrosColaboradores {
  departamento?: string;
  cargo?: string;
  ativo?: boolean;
  termo_busca?: string;
  page?: number;
  limit?: number;
}

export interface FiltrosVagas {
  status?: StatusVaga;
  departamento?: string;
  termo_busca?: string;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

export interface FiltrosCandidatos {
  vaga_id?: string;
  status?: StatusCandidato;
  termo_busca?: string;
  page?: number;
  limit?: number;
}

// Respostas paginadas
export interface ResultadoPaginado<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Configurações para integração com redes sociais
export interface RedeSocialConfig {
  ativo: boolean;
  api_key?: string;
  api_secret?: string;
  redirect_uri?: string;
  scopes?: string[];
}

export interface RedesSociaisConfig {
  linkedin: RedeSocialConfig;
  facebook: RedeSocialConfig;
  twitter: RedeSocialConfig;
  instagram: RedeSocialConfig;
  github: RedeSocialConfig;
} 