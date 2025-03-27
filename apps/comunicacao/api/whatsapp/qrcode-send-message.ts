import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Acessamos a mesma estrutura de sessões do módulo qrcode-session
import { activeSessions } from './session-store';

interface RequestBody {
  messageId: string;
  to: string;
  text: string;
  sessionId: string;
  templateName?: string;
  templateParams?: Record<string, string>;
}

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/node_modules/whatsapp-web.js/**',
    '**/node_modules/puppeteer/**',
  ],
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Método não permitido' },
      { status: 405 }
    );
  }

  try {
    const body: RequestBody = await req.json();
    
    // Validar dados necessários
    if (!body.messageId || !body.to || (!body.text && !body.templateName) || !body.sessionId) {
      return NextResponse.json(
        { error: 'Dados incompletos para envio de mensagem' },
        { status: 400 }
      );
    }

    // Preparar o número de telefone (garantir que está no formato internacional)
    let phoneNumber = body.to;
    if (!phoneNumber.includes('@c.us')) {
      // Remover caracteres não numéricos
      phoneNumber = phoneNumber.replace(/\D/g, '');
      
      // Garantir que está no formato correto para o WhatsApp
      if (!phoneNumber.includes('@c.us')) {
        phoneNumber = `${phoneNumber}@c.us`;
      }
    }

    // Obter configurações da sessão do QR Code
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data: config, error: configError } = await supabase
      .from('canais_integrados')
      .select('*')
      .eq('tipo', 'WHATSAPP')
      .eq('modo_integracao', 'QRCODE')
      .eq('session_id', body.sessionId)
      .eq('qrcode_status', 'CONNECTED')
      .eq('ativo', true)
      .single();

    if (configError || !config) {
      return NextResponse.json(
        { error: 'Sessão do WhatsApp não encontrada ou inativa' },
        { status: 400 }
      );
    }

    // Obter a sessão ativa do WhatsApp
    const client = activeSessions.get(body.sessionId);
    
    if (!client) {
      // Atualizar status no banco para refletir a desconexão
      await supabase
        .from('canais_integrados')
        .update({
          qrcode_status: 'DISCONNECTED',
          ativo: false
        })
        .eq('session_id', body.sessionId);
        
      return NextResponse.json(
        { error: 'Sessão do WhatsApp não está ativa' },
        { status: 400 }
      );
    }

    // Atualizar status da mensagem para "Enviando"
    await supabase
      .from('mensagens')
      .update({
        status: 'ENVIANDO',
        data_envio: new Date()
      })
      .eq('id', body.messageId);

    // Enviar a mensagem pelo WhatsApp
    let whatsappMessageId;
    
    try {
      if (body.templateName) {
        // Envio de template não é suportado diretamente pelo whatsapp-web.js
        // Implementaremos como texto simples
        const templateText = `Template: ${body.templateName}\n${body.text || ''}`;
        const result = await client.sendMessage(phoneNumber, templateText);
        whatsappMessageId = result.id._serialized;
      } else {
        const result = await client.sendMessage(phoneNumber, body.text);
        whatsappMessageId = result.id._serialized;
      }
      
      // Configurar listener para atualização de status (em produção, você teria um sistema mais robusto)
      client.on('message_ack', async (msg, ack) => {
        if (msg.id._serialized === whatsappMessageId) {
          let status;
          
          switch(ack) {
            case 1: status = 'ENVIADA'; break;
            case 2: status = 'ENTREGUE'; break;
            case 3: status = 'LIDA'; break;
            default: status = 'ENVIADA';
          }
          
          await supabase
            .from('mensagens')
            .update({
              status: status,
              meta: {
                whatsapp_message_id: whatsappMessageId,
                qrcode_session_id: body.sessionId,
                ack: ack
              }
            })
            .eq('id', body.messageId);
        }
      });
      
      // Atualizar mensagem no banco com status de enviada e ID externo
      await supabase
        .from('mensagens')
        .update({
          status: 'ENVIADA',
          meta: {
            whatsapp_message_id: whatsappMessageId,
            qrcode_session_id: body.sessionId
          }
        })
        .eq('id', body.messageId);

      return NextResponse.json({
        success: true,
        messageId: body.messageId,
        whatsappMessageId: whatsappMessageId
      });
    } catch (sendError) {
      // Em caso de erro no envio, atualizar o status da mensagem
      await supabase
        .from('mensagens')
        .update({
          status: 'ERRO',
          error: sendError.message || 'Erro ao enviar mensagem'
        })
        .eq('id', body.messageId);
        
      throw sendError;
    }
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
} 