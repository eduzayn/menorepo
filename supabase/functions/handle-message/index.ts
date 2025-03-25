import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface Message {
  conversa_id: string
  remetente_id: string
  conteudo: string
  tipo: 'TEXTO' | 'IMAGEM' | 'ARQUIVO'
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { message }: { message: Message } = await req.json()

    // Inserir a mensagem
    const { data: mensagem, error: mensagemError } = await supabaseClient
      .from('mensagens')
      .insert({
        conversa_id: message.conversa_id,
        remetente_id: message.remetente_id,
        conteudo: message.conteudo,
        tipo: message.tipo
      })
      .select()
      .single()

    if (mensagemError) throw mensagemError

    // Atualizar a conversa
    const { error: conversaError } = await supabaseClient
      .from('conversas')
      .update({
        ultima_mensagem: message.conteudo,
        ultima_mensagem_at: new Date().toISOString(),
        nao_lidas: supabaseClient.rpc('increment_nao_lidas', {
          conversa_id: message.conversa_id
        })
      })
      .eq('id', message.conversa_id)

    if (conversaError) throw conversaError

    return new Response(JSON.stringify({ mensagem }), {
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