import { DbMatricula, MatriculaStatus } from '@edunexia/database-schema'
import { supabase } from '../lib/supabase'
import { MatriculaDetalhada, Matricula } from '../types/matricula'

export const matriculaService = {
  async listarMatriculas(filters?: {
    alunoId?: string
    cursoId?: string
    status?: MatriculaStatus
  }): Promise<MatriculaDetalhada[]> {
    let query = supabase
      .from('matriculas')
      .select(`
        *,
        alunos (
          nome
        ),
        cursos (
          nome
        )
      `)
      .order('created_at', { ascending: false })

    if (filters?.alunoId) {
      query = query.eq('aluno_id', filters.alunoId)
    }

    if (filters?.cursoId) {
      query = query.eq('curso_id', filters.cursoId)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) throw error
    if (!data) return []

    return data.map(matricula => ({
      ...matricula,
      nomeAluno: matricula.alunos.nome,
      nomeCurso: matricula.cursos.nome,
      dataMatricula: matricula.created_at
    }))
  },

  async buscarMatricula(id: string): Promise<MatriculaDetalhada> {
    const { data, error } = await supabase
      .from('matriculas')
      .select(`
        *,
        alunos (
          nome
        ),
        cursos (
          nome
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) throw new Error('Matrícula não encontrada')

    return {
      ...data,
      nomeAluno: data.alunos.nome,
      nomeCurso: data.cursos.nome,
      dataMatricula: data.created_at
    }
  },

  async criarMatricula(matricula: Omit<Matricula, 'id' | 'created_at' | 'updated_at'>): Promise<Matricula> {
    const { data, error } = await supabase
      .from('matriculas')
      .insert(matricula)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async atualizarMatricula(id: string, matricula: Partial<DbMatricula>): Promise<DbMatricula> {
    const { data, error } = await supabase
      .from('matriculas')
      .update(matricula)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async cancelarMatricula(id: string, observacoes?: string): Promise<void> {
    const { error } = await supabase
      .from('matriculas')
      .update({
        status: 'cancelada',
        observacoes: observacoes ? `${observacoes}\nMatrícula cancelada em ${new Date().toISOString()}` : `Matrícula cancelada em ${new Date().toISOString()}`
      })
      .eq('id', id)

    if (error) throw error
  }
} 