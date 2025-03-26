import { ApiClient } from '../client';
import { ApiError } from '../types';

export interface Documento {
  id: string;
  alunoId: string;
  tipo: string;
  nome: string;
  url: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  dataUpload: Date | string;
  validacao?: ValidacaoDocumento;
}

export interface ValidacaoDocumento {
  id: string;
  documentoId: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  feedback: string;
  dataValidacao: Date | string;
  validadoPor: string;
}

export interface DocumentoUploadParams {
  arquivo: File;
  tipo: string;
  alunoId: string;
}

/**
 * Faz upload de um documento para o sistema
 * @param client Cliente de API
 * @param params Parâmetros do upload
 * @returns Documento criado ou erro
 */
export async function uploadDocumento(
  client: ApiClient,
  params: DocumentoUploadParams
): Promise<{ documento: Documento | null; error: ApiError | null }> {
  try {
    // Upload do arquivo para o Supabase Storage
    const nomeArquivo = `${params.alunoId}/${Date.now()}-${params.arquivo.name}`;
    const { data: uploadData, error: uploadError } = await client.supabase.storage
      .from('documentos')
      .upload(nomeArquivo, params.arquivo);

    if (uploadError) throw uploadError;

    // Obter URL pública do arquivo
    const { data: { publicUrl } } = client.supabase.storage
      .from('documentos')
      .getPublicUrl(nomeArquivo);

    // Criar registro do documento no banco
    const { data: documento, error: dbError } = await client.supabase
      .from('documentos')
      .insert({
        alunoId: params.alunoId,
        tipo: params.tipo,
        nome: params.arquivo.name,
        url: publicUrl,
        status: 'PENDENTE',
        dataUpload: new Date().toISOString()
      })
      .select('*')
      .single();

    if (dbError) throw dbError;

    // Iniciar validação IA
    await validarDocumentoIA(client, documento.id);

    return { documento, error: null };
  } catch (error) {
    return {
      documento: null,
      error: client.handleError(error, 'documentos.uploadDocumento')
    };
  }
}

/**
 * Validação automática de documentos via IA
 * @param client Cliente de API
 * @param documentoId ID do documento
 * @returns Resultado da validação
 */
export async function validarDocumentoIA(
  client: ApiClient,
  documentoId: string
): Promise<{ validacao: ValidacaoDocumento | null; error: ApiError | null }> {
  try {
    // Em uma implementação real, chamaria um serviço de IA
    // Aqui estamos simulando o resultado
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validacao: ValidacaoDocumento = {
      id: crypto.randomUUID(),
      documentoId,
      status: 'APROVADO',
      feedback: 'Documento validado automaticamente pela IA',
      dataValidacao: new Date().toISOString(),
      validadoPor: 'IA'
    };

    // Atualizar status do documento
    const { error } = await client.supabase
      .from('documentos')
      .update({
        status: validacao.status,
        validacao
      })
      .eq('id', documentoId);

    if (error) throw error;

    return { validacao, error: null };
  } catch (error) {
    return {
      validacao: null,
      error: client.handleError(error, 'documentos.validarDocumentoIA')
    };
  }
}

/**
 * Lista todos os documentos de um aluno
 * @param client Cliente de API
 * @param alunoId ID do aluno
 * @returns Lista de documentos
 */
export async function listarDocumentos(
  client: ApiClient,
  alunoId: string
): Promise<{ documentos: Documento[]; error: ApiError | null }> {
  try {
    const { data, error } = await client.supabase
      .from('documentos')
      .select('*')
      .eq('alunoId', alunoId)
      .order('dataUpload', { ascending: false });

    if (error) throw error;

    return { documentos: data || [], error: null };
  } catch (error) {
    return {
      documentos: [],
      error: client.handleError(error, 'documentos.listarDocumentos')
    };
  }
} 