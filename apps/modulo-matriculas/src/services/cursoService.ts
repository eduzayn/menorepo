import { Curso } from '@edunexia/database-schema'
import { supabase } from '../lib/supabase'

export const cursoService = {
  async listarCursos(): Promise<Curso[]> {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .order('nome')

    if (error) {
      console.error('Erro ao listar cursos:', error)
      throw error
    }

    return data
  },

  async buscarCurso(id: string): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar curso:', error)
      throw error
    }

    return data
  },

  async criarCurso(curso: Partial<Curso>): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .insert([curso])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar curso:', error)
      throw error
    }

    return data
  },

  async atualizarCurso(id: string, curso: Partial<Curso>): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .update(curso)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar curso:', error)
      throw error
    }

    return data
  },

  async excluirCurso(id: string): Promise<void> {
    const { error } = await supabase
      .from('cursos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir curso:', error)
      throw error
    }
  }
} 