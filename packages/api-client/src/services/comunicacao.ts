import { ApiClient } from '../client';
import { ApiError } from '../types';

export interface Mensagem {
  id: string;
  remetente: string;
  destinatario: string;
  assunto: string;
  conteudo: string;
  lida: boolean;
  dataCriacao: Date | string;
  anexos?: Anexo[];
}

export interface Anexo {
  id: string;
  mensagemId: string;
  nome: string;
  url: string;
  tamanho: number;
  tipo: string;
}

export interface MensagemInput {
  destinatario: string;
  assunto: string;
  conteudo: string;
  anexos?: File[];
}

/**
 * Envia uma nova mensagem
 * @param client Cliente de API
 * @param remetente ID do remetente
 * @param dados Dados da mensagem
 * @returns Mensagem enviada ou erro
 */
export async function enviarMensagem(
  client: ApiClient,
  remetente: string,
  dados: MensagemInput
): Promise<{ mensagem: Mensagem | null; error: ApiError | null }> {
  try {
    // Primeiro criamos a mensagem
    const { data: mensagem, error: msgError } = await client.supabase
      .from('mensagens')
      .insert({
        remetente,
        destinatario: dados.destinatario,
        assunto: dados.assunto,
        conteudo: dados.conteudo,
        lida: false,
        dataCriacao: new Date().toISOString()
      })
      .select('*')
      .single();

    if (msgError) throw msgError;

    // Se tiver anexos, fazemos upload
    if (dados.anexos && dados.anexos.length > 0) {
      const anexosPromises = dados.anexos.map(async (anexo) => {
        const path = `mensagens/${mensagem.id}/${anexo.name}`;
        
        // Upload do arquivo
        const { error: uploadError } = await client.supabase.storage
          .from('anexos')
          .upload(path, anexo);
          
        if (uploadError) throw uploadError;
        
        // Obter URL pública
        const { data: { publicUrl } } = client.supabase.storage
          .from('anexos')
          .getPublicUrl(path);
          
        // Registrar anexo no banco
        const { data: anexoDB, error: anexoError } = await client.supabase
          .from('anexos')
          .insert({
            mensagemId: mensagem.id,
            nome: anexo.name,
            url: publicUrl,
            tamanho: anexo.size,
            tipo: anexo.type
          })
          .select('*')
          .single();
          
        if (anexoError) throw anexoError;
        
        return anexoDB;
      });
      
      try {
        const anexosResultado = await Promise.all(anexosPromises);
        mensagem.anexos = anexosResultado;
      } catch (error) {
        throw error;
      }
    }

    return { mensagem, error: null };
  } catch (error) {
    return {
      mensagem: null,
      error: client.handleError(error, 'comunicacao.enviarMensagem')
    };
  }
}

/**
 * Lista mensagens recebidas
 * @param client Cliente de API
 * @param userId ID do usuário
 * @returns Lista de mensagens
 */
export async function listarMensagensRecebidas(
  client: ApiClient,
  userId: string
): Promise<{ mensagens: Mensagem[]; error: ApiError | null }> {
  try {
    const { data, error } = await client.supabase
      .from('mensagens')
      .select(`
        *,
        anexos (*)
      `)
      .eq('destinatario', userId)
      .order('dataCriacao', { ascending: false });

    if (error) throw error;

    return { mensagens: data || [], error: null };
  } catch (error) {
    return {
      mensagens: [],
      error: client.handleError(error, 'comunicacao.listarMensagensRecebidas')
    };
  }
}

/**
 * Lista mensagens enviadas
 * @param client Cliente de API
 * @param userId ID do usuário
 * @returns Lista de mensagens
 */
export async function listarMensagensEnviadas(
  client: ApiClient,
  userId: string
): Promise<{ mensagens: Mensagem[]; error: ApiError | null }> {
  try {
    const { data, error } = await client.supabase
      .from('mensagens')
      .select(`
        *,
        anexos (*)
      `)
      .eq('remetente', userId)
      .order('dataCriacao', { ascending: false });

    if (error) throw error;

    return { mensagens: data || [], error: null };
  } catch (error) {
    return {
      mensagens: [],
      error: client.handleError(error, 'comunicacao.listarMensagensEnviadas')
    };
  }
}

/**
 * Marca uma mensagem como lida
 * @param client Cliente de API
 * @param mensagemId ID da mensagem
 * @returns Confirmação de sucesso ou erro
 */
export async function marcarComoLida(
  client: ApiClient,
  mensagemId: string
): Promise<{ success: boolean; error: ApiError | null }> {
  try {
    const { error } = await client.supabase
      .from('mensagens')
      .update({ lida: true })
      .eq('id', mensagemId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'comunicacao.marcarComoLida')
    };
  }
} 