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

    const { aluno_id, atividade_id } = await req.json()

    // Registrar atividade completada
    const { data: atividade, error: atividadeError } = await supabaseClient
      .rpc('atualizar_atividades_completadas', {
        p_aluno_id: aluno_id,
        p_atividade_id: atividade_id,
      })

    if (atividadeError) {
      throw new Error('Erro ao registrar atividade completada')
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
        progresso,
        conquistas: atividade,
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