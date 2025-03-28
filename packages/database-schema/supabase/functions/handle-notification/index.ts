import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface Notification {
  usuario_id: string
  titulo: string
  mensagem: string
  tipo: 'INFO' | 'SUCESSO' | 'ERRO' | 'ALERTA'
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { notification }: { notification: Notification } = await req.json()

    // Buscar configurações de notificação do usuário
    const { data: configs, error: configError } = await supabaseClient
      .from('configuracoes_notificacao')
      .select('*')
      .eq('usuario_id', notification.usuario_id)
      .eq('tipo_notificacao', notification.tipo)
      .eq('ativo', true)

    if (configError) throw configError

    // Criar notificação
    const { data: notificacao, error: notificacaoError } = await supabaseClient
      .from('notificacoes')
      .insert({
        usuario_id: notification.usuario_id,
        titulo: notification.titulo,
        mensagem: notification.mensagem,
        tipo: notification.tipo
      })
      .select()
      .single()

    if (notificacaoError) throw notificacaoError

    // Enviar notificações pelos canais configurados
    if (configs) {
      for (const config of configs) {
        switch (config.canal) {
          case 'EMAIL':
            // Implementar envio de email
            break
          case 'SMS':
            // Implementar envio de SMS
            break
          case 'PUSH':
            // Implementar notificação push
            break
        }
      }
    }

    return new Response(JSON.stringify({ notificacao }), {
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