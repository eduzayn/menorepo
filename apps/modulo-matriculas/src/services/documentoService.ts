import { Documento } from '@edunexia/database-schema'
import { supabase } from '../lib/supabase'

export const documentoService = {
  async listarDocumentos(matriculaId: string): Promise<Documento[]> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('matricula_id', matriculaId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async buscarDocumento(id: string): Promise<Documento | null> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async criarDocumento(documento: Omit<Documento, 'id' | 'created_at' | 'updated_at'>): Promise<Documento> {
    const { data, error } = await supabase
      .from('documentos')
      .insert([documento])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async atualizarDocumento(id: string, documento: Partial<Documento>): Promise<Documento> {
    const { data, error } = await supabase
      .from('documentos')
      .update(documento)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async excluirDocumento(id: string): Promise<void> {
    const { error } = await supabase
      .from('documentos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async uploadDocumento(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('documentos')
      .upload(path, file)

    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('documentos')
      .getPublicUrl(data.path)

    return publicUrl
  }
} 