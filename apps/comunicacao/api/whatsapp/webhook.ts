import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Verificar o método da requisição
  if (req.method === 'GET') {
    // Verificação do webhook pelo WhatsApp
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    // Obter o token de verificação do banco de dados
    const { data: config } = await supabase
      .from('canais_integrados')
      .select('webhookSecret')
      .eq('tipo', 'WHATSAPP')
      .eq('ativo', true)
      .single();

    if (mode === 'subscribe' && token === config?.webhookSecret && challenge) {
      return new Response(challenge, { status: 200 });
    } else {
      return new Response('Erro de verificação', { status: 403 });
    }
  } else if (req.method === 'POST') {
    // Obter o token de verificação do banco de dados
    const { data: config } = await supabase
      .from('canais_integrados')
      .select('webhookSecret')
      .eq('tipo', 'WHATSAPP')
      .eq('ativo', true)
      .single();

    if (!config) {
      return NextResponse.json(
        { error: 'Configuração do WhatsApp não encontrada' },
        { status: 400 }
      );
    }

    // Verificar a assinatura do webhook
    const signature = req.headers.get('x-hub-signature-256');
    const body = await req.text();
    
    if (!verifyWebhookSignature(body, signature, config.webhookSecret)) {
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 401 }
      );
    }

    // Processar os dados do webhook
    try {
      const data = JSON.parse(body);
      
      // Processar apenas eventos de mensagens
      if (data.object === 'whatsapp_business_account') {
        // Loop através de todas as entradas de eventos
        for (const entry of data.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              const value = change.value;
              
              // Processar mensagens recebidas
              if (value.messages && value.messages.length > 0) {
                for (const message of value.messages) {
                  await processIncomingMessage(supabase, value.metadata.phone_number_id, message);
                }
              }
              
              // Processar atualizações de status
              if (value.statuses && value.statuses.length > 0) {
                for (const status of value.statuses) {
                  await processStatusUpdate(supabase, status);
                }
              }
            }
          }
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return NextResponse.json(
        { error: 'Erro ao processar webhook', details: error.message },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: 'Método não permitido' },
      { status: 405 }
    );
  }
}

// Função para verificar a assinatura do webhook
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  
  const expectedSignature = 'sha256=' +
    crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Processa mensagens recebidas
async function processIncomingMessage(
  supabase: any,
  phoneNumberId: string,
  message: any
) {
  try {
    // Extrair dados da mensagem
    const messageId = message.id;
    const from = message.from; // Número do remetente
    const timestamp = new Date(parseInt(message.timestamp) * 1000);
    
    // Extrair o conteúdo da mensagem baseado no tipo
    let content = '';
    let attachmentUrl = null;
    let messageType = 'TEXT';
    
    if (message.type === 'text' && message.text) {
      content = message.text.body;
    } else if (message.type === 'image' && message.image) {
      messageType = 'IMAGE';
      attachmentUrl = message.image.id; // ID da mídia
      if (message.image.caption) {
        content = message.image.caption;
      }
    } else if (message.type === 'document' && message.document) {
      messageType = 'DOCUMENT';
      attachmentUrl = message.document.id;
      if (message.document.caption) {
        content = message.document.caption;
      }
    } else if (message.type === 'audio' && message.audio) {
      messageType = 'AUDIO';
      attachmentUrl = message.audio.id;
    } else if (message.type === 'video' && message.video) {
      messageType = 'VIDEO';
      attachmentUrl = message.video.id;
      if (message.video.caption) {
        content = message.video.caption;
      }
    }
    
    // Verificar se o contato já existe
    const { data: contato, error: contatoError } = await supabase
      .from('contatos')
      .select('id')
      .eq('telefone', from)
      .single();
      
    let contatoId;
    
    if (contatoError || !contato) {
      // Criar um novo contato
      const { data: novoContato, error: novoContatoError } = await supabase
        .from('contatos')
        .insert({
          nome: `Contato ${from}`,
          telefone: from,
          tipo: 'PROSPECT',
          canal_preferencial: 'WHATSAPP'
        })
        .select('id')
        .single();
        
      if (novoContatoError) {
        console.error('Erro ao criar contato:', novoContatoError);
        return;
      }
      
      contatoId = novoContato.id;
    } else {
      contatoId = contato.id;
    }
    
    // Inserir a mensagem no banco
    const { error: mensagemError } = await supabase
      .from('mensagens')
      .insert({
        contato_id: contatoId,
        origem: 'RECEBIDA',
        canal: 'WHATSAPP',
        conteudo: content,
        tipo: messageType,
        arquivo_url: attachmentUrl,
        status: 'RECEBIDA',
        data_envio: timestamp,
        meta: {
          whatsapp_message_id: messageId,
          phone_number_id: phoneNumberId
        }
      });
      
    if (mensagemError) {
      console.error('Erro ao salvar mensagem:', mensagemError);
    }
  } catch (error) {
    console.error('Erro ao processar mensagem recebida:', error);
  }
}

// Processa atualizações de status
async function processStatusUpdate(supabase: any, status: any) {
  try {
    const messageId = status.id;
    const statusType = status.status; // sent, delivered, read, failed
    
    // Mapear o status do WhatsApp para o status interno
    let internalStatus;
    switch (statusType) {
      case 'sent':
        internalStatus = 'ENVIADA';
        break;
      case 'delivered':
        internalStatus = 'ENTREGUE';
        break;
      case 'read':
        internalStatus = 'LIDA';
        break;
      case 'failed':
        internalStatus = 'ERRO';
        break;
      default:
        internalStatus = 'DESCONHECIDO';
    }
    
    // Atualizar o status da mensagem no banco
    const { error } = await supabase
      .from('mensagens')
      .update({
        status: internalStatus,
        ...(status.errors ? { error: JSON.stringify(status.errors) } : {})
      })
      .eq('meta->whatsapp_message_id', messageId);
      
    if (error) {
      console.error('Erro ao atualizar status da mensagem:', error);
    }
  } catch (error) {
    console.error('Erro ao processar atualização de status:', error);
  }
} 