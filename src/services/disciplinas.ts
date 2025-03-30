import { ApiClient } from '../client';
import { ApiError } from '../types';

export interface Disciplina {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'active' | 'inactive';
  lastUpdate: Date | string;
  authorId: string;
  coAuthors?: string[];
}

export interface DisciplinaInput {
  title: string;
  description: string;
  duration: string;
  status: 'active' | 'inactive';
  authorId: string;
  coAuthors?: string[];
}

/**
 * Lista todas as disciplinas disponíveis
 * @param client Cliente de API
 * @returns Lista de disciplinas
 */
export async function listarDisciplinas(
  client: ApiClient
): Promise<{ disciplinas: Disciplina[]; error: ApiError | null }> {
  try {
    const { data, error } = await client.from('disciplinas')
      .select('*')
      .order('lastUpdate', { ascending: false });

    if (error) throw error;

    return { disciplinas: data || [], error: null };
  } catch (error) {
    return {
      disciplinas: [],
      error: client.handleError(error, 'disciplinas.listarDisciplinas')
    };
  }
}

/**
 * Busca uma disciplina pelo ID
 * @param client Cliente de API
 * @param id ID da disciplina
 * @returns Disciplina encontrada ou erro
 */
export async function obterDisciplina(
  client: ApiClient,
  id: string
): Promise<{ disciplina: Disciplina | null; error: ApiError | null }> {
  try {
    const { data, error } = await client.from('disciplinas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { disciplina: data, error: null };
  } catch (error) {
    return {
      disciplina: null,
      error: client.handleError(error, 'disciplinas.obterDisciplina')
    };
  }
}

/**
 * Cria uma nova disciplina
 * @param client Cliente de API
 * @param data Dados da disciplina
 * @returns Disciplina criada ou erro
 */
export async function criarDisciplina(
  client: ApiClient,
  data: DisciplinaInput
): Promise<{ disciplina: Disciplina | null; error: ApiError | null }> {
  try {
    const { data: disciplina, error } = await client.from('disciplinas')
      .insert({
        ...data,
        lastUpdate: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return { disciplina, error: null };
  } catch (error) {
    return {
      disciplina: null,
      error: client.handleError(error, 'disciplinas.criarDisciplina')
    };
  }
}

/**
 * Atualiza uma disciplina existente
 * @param client Cliente de API
 * @param id ID da disciplina
 * @param data Dados atualizados
 * @returns Sucesso da operação ou erro
 */
export async function atualizarDisciplina(
  client: ApiClient,
  id: string,
  data: Partial<DisciplinaInput>
): Promise<{ success: boolean; error: ApiError | null }> {
  try {
    const { error } = await client.from('disciplinas')
      .update({
        ...data,
        lastUpdate: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'disciplinas.atualizarDisciplina')
    };
  }
}

/**
 * Remove uma disciplina
 * @param client Cliente de API
 * @param id ID da disciplina
 * @returns Sucesso da operação ou erro
 */
export async function removerDisciplina(
  client: ApiClient,
  id: string
): Promise<{ success: boolean; error: ApiError | null }> {
  try {
    const { error } = await client.from('disciplinas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'disciplinas.removerDisciplina')
    };
  }
} 