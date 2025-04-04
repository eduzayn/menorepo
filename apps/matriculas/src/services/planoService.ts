import { DbPlanoPagamento } from '@edunexia/database-schema'
import { supabase } from '../lib/supabase'

export const planoService = {
  async listarPlanos(cursoId?: string): Promise<DbPlanoPagamento[]> {
    let query = supabase
      .from('planos_pagamento')
      .select('*')
      .order('valor_total')

    if (cursoId) {
      query = query.eq('curso_id', cursoId)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async buscarPlano(id: string): Promise<DbPlanoPagamento | null> {
    const { data, error } = await supabase
      .from('planos_pagamento')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async criarPlano(plano: Omit<DbPlanoPagamento, 'id' | 'created_at' | 'updated_at'>): Promise<DbPlanoPagamento> {
    const { data, error } = await supabase
      .from('planos_pagamento')
      .insert([plano])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async atualizarPlano(id: string, plano: Partial<DbPlanoPagamento>): Promise<DbPlanoPagamento> {
    const { data, error } = await supabase
      .from('planos_pagamento')
      .update(plano)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async excluirPlano(id: string): Promise<void> {
    const { error } = await supabase
      .from('planos_pagamento')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 