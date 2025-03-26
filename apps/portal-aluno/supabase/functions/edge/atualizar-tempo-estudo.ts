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

    const { aluno_id, minutos } = await req.json()

    // Atualizar tempo de estudo
    const { data: tempo, error: tempoError } = await supabaseClient
      .rpc('atualizar_tempo_estudo', {
        p_aluno_id: aluno_id,
        p_minutos: minutos,
      })

    if (tempoError) {
      throw new Error('Erro ao atualizar tempo de estudo')
    }

    // Buscar progresso atualizado
    const { data: progresso, error: progressoError } = await supabaseClient
      .from('progresso_aluno')
      .select('*')
      .eq('aluno_id', aluno_id)
      .single()

    if (progressoError) {
      throw new Error('Erro ao buscar progresso')
    }

    return new Response(
      JSON.stringify({
        tempo_estudo: tempo,
        progresso,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 