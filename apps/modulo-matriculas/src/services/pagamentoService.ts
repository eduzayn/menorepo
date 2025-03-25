import { DbPagamento, PaymentStatus } from '@edunexia/database-schema'
import { supabase } from '../lib/supabase'

export const pagamentoService = {
  async listarPagamentos(matriculaId: string): Promise<DbPagamento[]> {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('matricula_id', matriculaId)
      .order('data_vencimento', { ascending: true })

    if (error) throw error
    return data
  },

  async buscarPagamento(id: string): Promise<DbPagamento | null> {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async criarPagamento(pagamento: Omit<DbPagamento, 'id' | 'created_at' | 'updated_at'>): Promise<DbPagamento> {
    const { data, error } = await supabase
      .from('pagamentos')
      .insert([pagamento])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async criarPagamentosMatricula(
    matriculaId: string,
    valorTotal: number,
    numeroParcelas: number,
    diaVencimento: number,
    dataInicio: Date
  ): Promise<DbPagamento[]> {
    const pagamentos = Array.from({ length: numeroParcelas }, (_, i) => {
      const dataVencimento = new Date(dataInicio)
      dataVencimento.setMonth(dataVencimento.getMonth() + i)
      dataVencimento.setDate(diaVencimento)

      return {
        matricula_id: matriculaId,
        valor: valorTotal / numeroParcelas,
        data_vencimento: dataVencimento.toISOString().split('T')[0],
        status: 'pendente' as PaymentStatus
      }
    })

    const { data, error } = await supabase
      .from('pagamentos')
      .insert(pagamentos)
      .select()

    if (error) throw error
    return data
  },

  async registrarPagamento(
    id: string,
    formaPagamento: string,
    comprovante?: File
  ): Promise<DbPagamento> {
    let comprovanteUrl: string | undefined

    if (comprovante) {
      const path = `comprovantes/${id}/${comprovante.name}`
      const { data, error } = await supabase.storage
        .from('pagamentos')
        .upload(path, comprovante)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('pagamentos')
        .getPublicUrl(data.path)

      comprovanteUrl = publicUrl
    }

    const { data, error } = await supabase
      .from('pagamentos')
      .update({
        status: 'aprovado',
        data_pagamento: new Date().toISOString(),
        forma_pagamento: formaPagamento,
        comprovante_url: comprovanteUrl
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async estornarPagamento(id: string): Promise<DbPagamento> {
    const { data, error } = await supabase
      .from('pagamentos')
      .update({
        status: 'reembolsado',
        data_pagamento: null,
        forma_pagamento: null,
        comprovante_url: null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
} 