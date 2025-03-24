import { Matricula, MatriculaStatus } from '@edunexia/database-schema'
import { supabase } from '../lib/supabase'

export const matriculaService = {
  async listarMatriculas(filters?: {
    alunoId?: string
    cursoId?: string
    status?: MatriculaStatus
  }): Promise<Matricula[]> {
    let query = supabase
      .from('matriculas')
      .select(`
        *,
        cursos (
          nome,
          modalidade
        ),
        planos_pagamento (
          nome,
          valor_total
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
    return data
  },

  async buscarMatricula(id: string): Promise<Matricula | null> {
    const { data, error } = await supabase
      .from('matriculas')
      .select(`
        *,
        cursos (
          nome,
          modalidade,
          carga_horaria,
          duracao_meses
        ),
        planos_pagamento (
          nome,
          valor_total,
          numero_parcelas,
          valor_parcela,
          dia_vencimento
        ),
        documentos (
          id,
          tipo,
          nome,
          url,
          status
        ),
        contratos (
          id,
          numero_contrato,
          data_assinatura,
          url_documento,
          status
        ),
        pagamentos (
          id,
          valor,
          data_vencimento,
          data_pagamento,
          status,
          forma_pagamento
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async criarMatricula(matricula: Omit<Matricula, 'id' | 'created_at' | 'updated_at'>): Promise<Matricula> {
    const { data, error } = await supabase
      .from('matriculas')
      .insert([matricula])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async atualizarMatricula(id: string, matricula: Partial<Matricula>): Promise<Matricula> {
    const { data, error } = await supabase
      .from('matriculas')
      .update(matricula)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async cancelarMatricula(id: string, observacoes?: string): Promise<Matricula> {
    const { data, error } = await supabase
      .from('matriculas')
      .update({
        status: 'cancelada',
        observacoes: observacoes ? `${observacoes}\nMatrícula cancelada em ${new Date().toISOString()}` : `Matrícula cancelada em ${new Date().toISOString()}`
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
} 