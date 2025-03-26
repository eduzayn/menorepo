import { supabase } from '@/lib/supabase'
import type { Curso, PlanoPagamento } from '@/types/matricula'

export const cursoService = {
  async listarCursos(): Promise<Curso[]> {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .order('nome')

    if (error) throw error
    return data || []
  },

  async buscarCurso(id: string): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Curso não encontrado')
    return data
  },

  async criarCurso(curso: Omit<Curso, 'id' | 'created_at' | 'updated_at'>): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .insert([curso])
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Erro ao criar curso')
    return data
  },

  async atualizarCurso(
    id: string, 
    curso: Partial<Omit<Curso, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .update(curso)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Erro ao atualizar curso')
    return data
  },

  async excluirCurso(id: string): Promise<void> {
    const { error } = await supabase
      .from('cursos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async buscarPlanosPagamento(cursoId: string): Promise<PlanoPagamento[]> {
    const { data, error } = await supabase
      .from('planos_pagamento')
      .select('*')
      .eq('curso_id', cursoId)
      .order('valor_total')

    if (error) throw error
    return data || []
  },

  async buscarPlanoPagamento(id: string): Promise<PlanoPagamento> {
    const { data, error } = await supabase
      .from('planos_pagamento')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Plano de pagamento não encontrado')
    return data
  }
} 