import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RequestBody {
  messageId: string;
  to: string;
  text: string;
  templateName?: string;
  templateParams?: Record<string, string>;
}

export const config = {
  runtime: 'edge',
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
    if (!body.messageId || !body.to || (!body.text && !body.templateName)) {
      return NextResponse.json(
        { error: 'Dados incompletos para envio de mensagem' },
        { status: 400 }
      );
    }

    // Obter configurações do WhatsApp do banco de dados
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data: config, error: configError } = await supabase
      .from('canais_integrados')
      .select('*')
      .eq('tipo', 'WHATSAPP')
      .eq('ativo', true)
      .single();

    if (configError || !config) {
      return NextResponse.json(
        { error: 'Configuração do WhatsApp não encontrada ou inativa' },
        { status: 400 }
      );
    }

    // Preparar payload para a API do WhatsApp
    let payload;
    
    if (body.templateName) {
      // Envio usando template
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: body.to,
        type: 'template',
        template: {
          name: body.templateName,
          language: {
            code: 'pt_BR'
          },
          components: body.templateParams ? [
            {
              type: 'body',
              parameters: Object.entries(body.templateParams).map(([_, value]) => ({
                type: 'text',
                text: value
              }))
            }
          ] : []
        }
      };
    } else {
      // Envio de mensagem simples
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: body.to,
        type: 'text',
        text: {
          body: body.text
        }
      };
    }

    // Enviar mensagem para a API do WhatsApp
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${config.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      
      // Atualizar mensagem no banco com erro
      await supabase
        .from('mensagens')
        .update({
          status: 'ERRO',
          error: JSON.stringify(errorData)
        })
        .eq('id', body.messageId);
      
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem para o WhatsApp', details: errorData },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    
    // Atualizar mensagem no banco com status de enviada e ID externo
    await supabase
      .from('mensagens')
      .update({
        status: 'ENVIADA',
        meta: {
          ...body.templateName ? { template: body.templateName } : {},
          whatsapp_message_id: responseData.messages?.[0]?.id
        }
      })
      .eq('id', body.messageId);

    return NextResponse.json({
      success: true,
      messageId: body.messageId,
      whatsappMessageId: responseData.messages?.[0]?.id
    });
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
} 