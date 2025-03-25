import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface WebhookPayload {
  service: 'whatsapp' | 'email' | 'sms'
  event: string
  data: {
    message_id?: string
    status?: string
    error?: string
    [key: string]: any
  }
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { webhook }: { webhook: WebhookPayload } = await req.json()

    switch (webhook.service) {
      case 'whatsapp':
        // Processar webhook do WhatsApp
        if (webhook.event === 'message.status') {
          const { data: mensagem, error: mensagemError } = await supabaseClient
            .from('mensagens')
            .update({
              status: webhook.data.status,
              error: webhook.data.error
            })
            .eq('id', webhook.data.message_id)
            .select()
            .single()

          if (mensagemError) throw mensagemError

          // Criar notificação se houver erro
          if (webhook.data.error) {
            await supabaseClient
              .from('notificacoes')
              .insert({
                usuario_id: mensagem.remetente_id,
                titulo: 'Erro no envio de mensagem',
                mensagem: webhook.data.error,
                tipo: 'ERRO'
              })
          }
        }
        break

      case 'email':
        // Processar webhook de email
        if (webhook.event === 'email.status') {
          // Implementar lógica para atualizar status de email
        }
        break

      case 'sms':
        // Processar webhook de SMS
        if (webhook.event === 'sms.status') {
          // Implementar lógica para atualizar status de SMS
        }
        break

      default:
        throw new Error('Serviço não suportado')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }
}) 