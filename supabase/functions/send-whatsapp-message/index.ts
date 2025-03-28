import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestBody {
  messageId: string;
  to: string;
  type: 'text' | 'template' | 'media';
  content: string;
  templateName?: string;
  templateParams?: Record<string, string>;
  mediaUrl?: string;
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter dados da solicitação
    const requestData: RequestBody = await req.json()
    
    // Validar dados de entrada
    if (!requestData.messageId || !requestData.to || !requestData.type) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Buscar configuração do WhatsApp
    const { data: configData, error: configError } = await supabaseClient
      .from('comunicacao_whatsapp_config')
      .select('*')
      .limit(1)
      .single()

    if (configError || !configData) {
      return new Response(
        JSON.stringify({ error: 'Configuração do WhatsApp não encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!configData.ativo) {
      return new Response(
        JSON.stringify({ error: 'Integração do WhatsApp está desativada' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Preparar dados da mensagem conforme o tipo
    let messagePayload: any = {}
    
    if (requestData.type === 'text') {
      messagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: requestData.to,
        type: 'text',
        text: {
          preview_url: false,
          body: requestData.content
        }
      }
    } else if (requestData.type === 'template' && requestData.templateName) {
      // Preparar parâmetros do template
      const components = []
      
      if (requestData.templateParams) {
        const parameters = Object.entries(requestData.templateParams).map(([_, value]) => ({
          type: 'text',
          text: value
        }))
        
        if (parameters.length > 0) {
          components.push({
            type: 'body',
            parameters
          })
        }
      }
      
      messagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: requestData.to,
        type: 'template',
        template: {
          name: requestData.templateName,
          language: {
            code: 'pt_BR'
          },
          components
        }
      }
    } else if (requestData.type === 'media' && requestData.mediaUrl) {
      // Identificar o tipo de mídia pela URL
      let mediaType = 'image'
      const url = requestData.mediaUrl.toLowerCase()
      
      if (url.endsWith('.pdf')) {
        mediaType = 'document'
      } else if (url.endsWith('.mp4') || url.endsWith('.mov')) {
        mediaType = 'video'
      } else if (url.endsWith('.mp3') || url.endsWith('.ogg')) {
        mediaType = 'audio'
      }
      
      messagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: requestData.to,
        type: mediaType,
        [mediaType]: {
          link: requestData.mediaUrl,
          caption: requestData.content || ''
        }
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Tipo de mensagem inválido ou dados incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Enviar mensagem para a API do WhatsApp
    const whatsappResponse = await fetch(
      `https://graph.facebook.com/v18.0/${configData.phone_number_id}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configData.api_key}`
        },
        body: JSON.stringify(messagePayload)
      }
    )

    if (!whatsappResponse.ok) {
      const errorData = await whatsappResponse.json()
      
      // Atualizar status da mensagem para falha
      await supabaseClient
        .from('comunicacao_whatsapp_mensagens')
        .update({
          status: 'failed',
          atualizado_at: new Date().toISOString()
        })
        .eq('id', requestData.messageId)
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao enviar mensagem pelo WhatsApp',
          details: errorData
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const responseData = await whatsappResponse.json()
    
    // Extrair o ID da mensagem da resposta
    const whatsappMessageId = responseData?.messages?.[0]?.id

    // Atualizar a mensagem no banco de dados
    await supabaseClient
      .from('comunicacao_whatsapp_mensagens')
      .update({
        status: 'sent',
        whatsapp_message_id: whatsappMessageId,
        atualizado_at: new Date().toISOString()
      })
      .eq('id', requestData.messageId)

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: whatsappMessageId
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno ao processar mensagem',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 