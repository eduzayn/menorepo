import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface QuickResponse {
  conversa_id: string
  resposta_id: string
  remetente_id: string
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { quickResponse }: { quickResponse: QuickResponse } = await req.json()

    // Buscar resposta rápida
    const { data: resposta, error: respostaError } = await supabaseClient
      .from('respostas_rapidas')
      .select('*')
      .eq('id', quickResponse.resposta_id)
      .single()

    if (respostaError) throw respostaError
    if (!resposta) throw new Error('Resposta rápida não encontrada')

    // Enviar mensagem com a resposta rápida
    const { data: mensagem, error: mensagemError } = await supabaseClient
      .from('mensagens')
      .insert({
        conversa_id: quickResponse.conversa_id,
        remetente_id: quickResponse.remetente_id,
        conteudo: resposta.conteudo,
        tipo: 'TEXTO'
      })
      .select()
      .single()

    if (mensagemError) throw mensagemError

    // Atualizar conversa
    const { error: conversaError } = await supabaseClient
      .from('conversas')
      .update({
        ultima_mensagem: resposta.conteudo,
        ultima_mensagem_at: new Date().toISOString(),
        nao_lidas: supabaseClient.rpc('increment_nao_lidas', {
          conversa_id: quickResponse.conversa_id
        })
      })
      .eq('id', quickResponse.conversa_id)

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