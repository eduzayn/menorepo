import { ApiClient } from '../client';
import { ApiError } from '../types';

export interface Mensagem {
  id: string;
  remetente: {
    id: string;
    nome: string;
    email: string;
  };
  destinatario: {
    id: string;
    nome: string;
    email: string;
  };
  assunto: string;
  conteudo: string;
  dataEnvio: Date | string;
  lida: boolean;
  anexos?: Array<{
    id: string;
    nome: string;
    url: string;
    tamanho?: number;
    tipo?: string;
  }>;
}

export interface EnviarMensagemParams {
  destinatarioId: string;
  assunto: string;
  conteudo: string;
  anexos?: File[];
}

/**
 * Envia uma nova mensagem de comunicação
 * @param client Cliente de API
 * @param params Parâmetros da mensagem
 * @returns Mensagem criada ou erro
 */
export async function enviarMensagem(
  client: ApiClient,
  params: EnviarMensagemParams
): Promise<{ mensagem: Mensagem | null; error: ApiError | null }> {
  try {
    // Upload de anexos (se houver)
    const anexosIds: string[] = [];
    if (params.anexos && params.anexos.length > 0) {
      for (const arquivo of params.anexos) {
        const path = `comunicacao/anexos/${Date.now()}_${arquivo.name}`;
        
        const { data: uploadData, error: uploadError } = await client.storage
          .from('anexos')
          .upload(path, arquivo);
        
        if (uploadError) throw uploadError;
        
        if (uploadData) {
          anexosIds.push(uploadData.path);
        }
      }
    }
    
    // Envio da mensagem com anexos
    const { data, error } = await client.from('comunicacao.mensagens')
      .insert({
        destinatario_id: params.destinatarioId,
        assunto: params.assunto,
        conteudo: params.conteudo,
        anexos: anexosIds.length > 0 ? anexosIds : null
      })
      .select(`
        id, 
        assunto,
        conteudo,
        data_envio,
        lida,
        remetente:remetente_id(*),
        destinatario:destinatario_id(*),
        anexos:anexos_mensagens(*)
      `)
      .single();
    
    if (error) throw error;
    
    // Transformação dos dados para o formato esperado
    const mensagem: Mensagem = {
      id: data.id,
      assunto: data.assunto,
      conteudo: data.conteudo,
      dataEnvio: data.data_envio,
      lida: data.lida,
      remetente: {
        id: data.remetente.id,
        nome: data.remetente.nome,
        email: data.remetente.email
      },
      destinatario: {
        id: data.destinatario.id,
        nome: data.destinatario.nome,
        email: data.destinatario.email
      },
      anexos: data.anexos?.map((anexo: any) => ({
        id: anexo.id,
        nome: anexo.nome,
        url: anexo.url,
        tamanho: anexo.tamanho,
        tipo: anexo.tipo
      }))
    };
    
    return { mensagem, error: null };
  } catch (error) {
    return {
      mensagem: null,
      error: client.handleError(error, 'comunicacao.enviarMensagem')
    };
  }
}

/**
 * Lista mensagens recebidas pelo usuário
 * @param client Cliente de API
 * @param userId ID do usuário
 * @returns Lista de mensagens ou erro
 */
export async function listarMensagensRecebidas(
  client: ApiClient,
  userId: string
): Promise<{ mensagens: Mensagem[]; error: ApiError | null }> {
  try {
    const { data, error } = await client.from('comunicacao.mensagens')
      .select(`
        id, 
        assunto,
        conteudo,
        data_envio,
        lida,
        remetente:remetente_id(*),
        destinatario:destinatario_id(*),
        anexos:anexos_mensagens(*)
      `)
      .eq('destinatario_id', userId)
      .order('data_envio', { ascending: false });
    
    if (error) throw error;
    
    const mensagens: Mensagem[] = data.map((item: any) => ({
      id: item.id,
      assunto: item.assunto,
      conteudo: item.conteudo,
      dataEnvio: item.data_envio,
      lida: item.lida,
      remetente: {
        id: item.remetente.id,
        nome: item.remetente.nome,
        email: item.remetente.email
      },
      destinatario: {
        id: item.destinatario.id,
        nome: item.destinatario.nome,
        email: item.destinatario.email
      }
    }));
    
    return { mensagens, error: null };
  } catch (error) {
    return {
      mensagens: [],
      error: client.handleError(error, 'comunicacao.listarMensagensRecebidas')
    };
  }
}

/**
 * Lista mensagens enviadas pelo usuário
 * @param client Cliente de API
 * @param userId ID do usuário
 * @returns Lista de mensagens ou erro
 */
export async function listarMensagensEnviadas(
  client: ApiClient,
  userId: string
): Promise<{ mensagens: Mensagem[]; error: ApiError | null }> {
  try {
    const { data, error } = await client.from('comunicacao.mensagens')
      .select(`
        id, 
        assunto,
        conteudo,
        data_envio,
        lida,
        remetente:remetente_id(*),
        destinatario:destinatario_id(*),
        anexos:anexos_mensagens(*)
      `)
      .eq('remetente_id', userId)
      .order('data_envio', { ascending: false });
    
    if (error) throw error;
    
    const mensagens: Mensagem[] = data.map((item: any) => ({
      id: item.id,
      assunto: item.assunto,
      conteudo: item.conteudo,
      dataEnvio: item.data_envio,
      lida: item.lida,
      remetente: {
        id: item.remetente.id,
        nome: item.remetente.nome,
        email: item.remetente.email
      },
      destinatario: {
        id: item.destinatario.id,
        nome: item.destinatario.nome,
        email: item.destinatario.email
      }
    }));
    
    return { mensagens, error: null };
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
    const { error } = await client.from('comunicacao.mensagens')
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