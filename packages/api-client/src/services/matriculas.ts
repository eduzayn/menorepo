import { ApiClient } from '../client';
import { ApiError } from '../types';

export interface Matricula {
  id: string;
  alunoId: string;
  cursoId: string;
  planoPagamentoId: string;
  status: 'PENDENTE' | 'ATIVA' | 'CANCELADA' | 'CONCLUIDA';
  dataInicio: Date | string;
  dataFim?: Date | string;
  observacoes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface MatriculaInput {
  alunoId: string;
  cursoId: string;
  planoPagamentoId: string;
  status: 'PENDENTE' | 'ATIVA' | 'CANCELADA' | 'CONCLUIDA';
  dataInicio: Date | string;
  dataFim?: Date | string;
  observacoes?: string;
}

/**
 * Cria uma nova matrícula
 * @param client Cliente de API
 * @param data Dados da matrícula
 * @returns Matrícula criada ou erro
 */
export async function criarMatricula(
  client: ApiClient,
  data: MatriculaInput
): Promise<{ matricula: Matricula | null; error: ApiError | null }> {
  try {
    const { data: matricula, error } = await client.from('matriculas')
      .insert({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;

    return { matricula, error: null };
  } catch (error) {
    return {
      matricula: null,
      error: client.handleError(error, 'matriculas.criarMatricula')
    };
  }
}

/**
 * Busca uma matrícula pelo ID
 * @param client Cliente de API
 * @param id ID da matrícula
 * @returns Matrícula encontrada ou erro
 */
export async function obterMatricula(
  client: ApiClient,
  id: string
): Promise<{ matricula: Matricula | null; error: ApiError | null }> {
  try {
    const { data, error } = await client.from('matriculas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { matricula: data, error: null };
  } catch (error) {
    return {
      matricula: null,
      error: client.handleError(error, 'matriculas.obterMatricula')
    };
  }
}

/**
 * Lista todas as matrículas de um aluno
 * @param client Cliente de API
 * @param alunoId ID do aluno
 * @returns Lista de matrículas
 */
export async function listarMatriculasPorAluno(
  client: ApiClient,
  alunoId: string
): Promise<{ matriculas: Matricula[]; error: ApiError | null }> {
  try {
    const { data, error } = await client.from('matriculas')
      .select('*')
      .eq('alunoId', alunoId)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return { matriculas: data || [], error: null };
  } catch (error) {
    return {
      matriculas: [],
      error: client.handleError(error, 'matriculas.listarMatriculasPorAluno')
    };
  }
}

/**
 * Atualiza o status de uma matrícula
 * @param client Cliente de API
 * @param id ID da matrícula
 * @param status Novo status
 * @returns Matrícula atualizada ou erro
 */
export async function atualizarStatusMatricula(
  client: ApiClient,
  id: string,
  status: Matricula['status']
): Promise<{ success: boolean; error: ApiError | null }> {
  try {
    const { error } = await client.from('matriculas')
      .update({
        status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'matriculas.atualizarStatusMatricula')
    };
  }
} 