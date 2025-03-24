import { Contrato } from '@edunexia/database-schema'
import { supabase } from '../lib/supabase'

export const contratoService = {
  async listarContratos(matriculaId: string): Promise<Contrato[]> {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('matricula_id', matriculaId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async buscarContrato(id: string): Promise<Contrato | null> {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async criarContrato(contrato: Omit<Contrato, 'id' | 'created_at' | 'updated_at'>): Promise<Contrato> {
    const { data, error } = await supabase
      .from('contratos')
      .insert([contrato])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async atualizarContrato(id: string, contrato: Partial<Contrato>): Promise<Contrato> {
    const { data, error } = await supabase
      .from('contratos')
      .update(contrato)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async assinarContrato(id: string): Promise<Contrato> {
    const { data, error } = await supabase
      .from('contratos')
      .update({
        status: 'assinado',
        data_assinatura: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async uploadContrato(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('contratos')
      .upload(path, file)

    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('contratos')
      .getPublicUrl(data.path)

    return publicUrl
  }
} 