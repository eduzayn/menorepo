import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { documentoId } = await req.json()

    // Buscar documento
    const { data: documento, error: documentoError } = await supabaseClient
      .from('documentos')
      .select('*')
      .eq('id', documentoId)
      .single()

    if (documentoError) throw documentoError

    // Simular validação IA
    await new Promise(resolve => setTimeout(resolve, 2000))

    const validacao = {
      id: crypto.randomUUID(),
      documentoId,
      status: 'APROVADO',
      feedback: 'Documento validado com sucesso pela IA',
      dataValidacao: new Date(),
      validadoPor: 'IA'
    }

    // Atualizar status do documento
    const { error: updateError } = await supabaseClient
      .from('documentos')
      .update({
        status: validacao.status,
        validacao
      })
      .eq('id', documentoId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, validacao }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
 