import { createClient } from '@supabase/supabase-js'
import type { Documento, ValidacaoDocumento } from '@/types/documentos'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function uploadDocumento(
  arquivo: File,
  tipo: Documento['tipo'],
  alunoId: string
): Promise<Documento> {
  try {
    // Upload do arquivo para o Supabase Storage
    const nomeArquivo = `${alunoId}/${Date.now()}-${arquivo.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(nomeArquivo, arquivo)

    if (uploadError) throw uploadError

    // Obter URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from('documentos')
      .getPublicUrl(nomeArquivo)

    // Criar registro do documento no banco
    const { data: documento, error: dbError } = await supabase
      .from('documentos')
      .insert({
        alunoId,
        tipo,
        nome: arquivo.name,
        url: publicUrl,
        status: 'PENDENTE',
        dataUpload: new Date()
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Iniciar validação IA
    await validarDocumentoIA(documento.id)

    return documento
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error)
    throw new Error('Falha ao fazer upload do documento')
  }
}

async function validarDocumentoIA(documentoId: string): Promise<ValidacaoDocumento> {
  try {
    // Simular validação IA
    await new Promise(resolve => setTimeout(resolve, 2000))

    const validacao: ValidacaoDocumento = {
      id: crypto.randomUUID(),
      documentoId,
      status: 'APROVADO',
      feedback: 'Documento validado com sucesso pela IA',
      dataValidacao: new Date(),
      validadoPor: 'IA'
    }

    // Atualizar status do documento
    const { error } = await supabase
      .from('documentos')
      .update({
        status: validacao.status,
        validacao
      })
      .eq('id', documentoId)

    if (error) throw error

    return validacao
  } catch (error) {
    console.error('Erro ao validar documento:', error)
    throw new Error('Falha ao validar documento')
  }
}

export async function listarDocumentos(alunoId: string): Promise<Documento[]> {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('alunoId', alunoId)
      .order('dataUpload', { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Erro ao listar documentos:', error)
    throw new Error('Falha ao listar documentos')
  }
} 