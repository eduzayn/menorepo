/**
 * Definições de tipos relacionados a matrículas
 */
import { BaseEntity, ISODateString } from './common';
import { MatriculaStatus, ModalidadeCurso, NivelEnsino, PaymentStatus } from './enums';
import { UserBase } from './user';

/**
 * Interface para Curso
 */
export interface Curso extends BaseEntity {
  nome: string;
  codigo: string;
  descricao: string;
  carga_horaria: number;
  modalidade: ModalidadeCurso;
  nivel: NivelEnsino;
  ativo: boolean;
  valor: number;
  imagem_url?: string;
}

/**
 * Interface para Turma
 */
export interface Turma extends BaseEntity {
  curso_id: string;
  codigo: string;
  nome: string;
  data_inicio: ISODateString;
  data_fim: ISODateString;
  status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada';
  vagas_totais: number;
  vagas_preenchidas: number;
  instituicao_id: string;
  polo_id?: string;
}

/**
 * Interface para Matrícula
 */
export interface Matricula extends BaseEntity {
  aluno_id: string;
  curso_id: string;
  turma_id: string;
  polo_id?: string;
  instituicao_id: string;
  status: MatriculaStatus;
  codigo: string;
  data_matricula: ISODateString;
  valor_total: number;
  valor_desconto: number;
  valor_final: number;
  forma_pagamento: string;
  parcelas: number;
  status_pagamento: PaymentStatus;
  observacoes?: string;
  responsavel_matricula_id?: string;
  documentos: {
    id: string;
    tipo: string;
    status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado';
    url?: string;
  }[];
}

/**
 * Interface para DTO de criação de matrícula
 */
export interface CriarMatriculaDTO {
  aluno_id: string;
  curso_id: string;
  turma_id: string;
  polo_id?: string;
  forma_pagamento: string;
  parcelas: number;
  cupom_desconto?: string;
  convenio_id?: string;
}

/**
 * Interface para resposta de matrícula com dados relacionados
 */
export interface MatriculaComRelacionamentos {
  matricula: Matricula;
  aluno: UserBase;
  curso: Curso;
  turma: Turma;
  responsavel?: UserBase;
} 