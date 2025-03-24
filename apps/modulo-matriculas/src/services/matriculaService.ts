import { supabase, TABLES } from '../lib/supabase'
import { Matricula, MatriculaFormData } from '../types/matricula'

export const matriculaService = {
  async listarMatriculas() {
    const { data, error } = await supabase
      .from(TABLES.MATRICULAS)
      .select('*')
      .order('dataMatricula', { ascending: false })

    if (error) {
      throw error
    }

    return data as Matricula[]
  },

  async buscarMatricula(id: string) {
    const { data, error } = await supabase
      .from(TABLES.MATRICULAS)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data as Matricula
  },

  async criarMatricula(matricula: MatriculaFormData) {
    const { data, error } = await supabase
      .from(TABLES.MATRICULAS)
      .insert([
        {
          ...matricula,
          status: 'ativa',
          dataMatricula: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as Matricula
  },

  async atualizarMatricula(id: string, matricula: Partial<MatriculaFormData>) {
    const { data, error } = await supabase
      .from(TABLES.MATRICULAS)
      .update(matricula)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as Matricula
  },

  async cancelarMatricula(id: string) {
    const { data, error } = await supabase
      .from(TABLES.MATRICULAS)
      .update({ status: 'cancelada' })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as Matricula
  }
} 