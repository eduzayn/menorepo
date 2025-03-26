import { supabase } from '@/lib/supabase'
import type { Aluno } from '@/types/matricula'

export const alunoService = {
  async listarAlunos(): Promise<Aluno[]> {
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .order('nome')

    if (error) throw error
    return data || []
  },

  async buscarAluno(id: string): Promise<Aluno> {
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Aluno não encontrado')
    return data
  },

  async criarAluno(aluno: Omit<Aluno, 'id' | 'created_at' | 'updated_at'>): Promise<Aluno> {
    const { data, error } = await supabase
      .from('alunos')
      .insert([aluno])
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Erro ao criar aluno')
    return data
  },

  async atualizarAluno(
    id: string, 
    aluno: Partial<Omit<Aluno, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Aluno> {
    const { data, error } = await supabase
      .from('alunos')
      .update(aluno)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Erro ao atualizar aluno')
    return data
  },

  async excluirAluno(id: string): Promise<void> {
    const { error } = await supabase
      .from('alunos')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 