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

    const { alunoId, atividadeId } = await req.json()

    // Buscar atividade
    const { data: atividade, error: atividadeError } = await supabaseClient
      .from('atividades')
      .select('*')
      .eq('id', atividadeId)
      .single()

    if (atividadeError) throw atividadeError

    // Verificar se atividade já foi completada
    const { data: atividadeCompletada, error: completadaError } = await supabaseClient
      .from('atividades_completadas')
      .select('*')
      .eq('aluno_id', alunoId)
      .eq('atividade_id', atividadeId)
      .single()

    if (completadaError && completadaError.code !== 'PGRST116') {
      throw completadaError
    }

    if (atividadeCompletada) {
      return new Response(
        JSON.stringify({ success: false, error: 'Atividade já completada' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Registrar atividade completada
    const { error: insertError } = await supabaseClient
      .from('atividades_completadas')
      .insert({
        aluno_id: alunoId,
        atividade_id: atividadeId,
        data_completada: new Date()
      })

    if (insertError) throw insertError

    // Atualizar progresso do aluno
    const { data: progresso, error: progressoError } = await supabaseClient
      .from('progresso_aluno')
      .select('*')
      .eq('aluno_id', alunoId)
      .single()

    if (progressoError) throw progressoError

    const { error: updateError } = await supabaseClient
      .from('progresso_aluno')
      .update({
        pontos: progresso.pontos + atividade.pontos,
        atividades_completas: progresso.atividades_completas + 1
      })
      .eq('aluno_id', alunoId)

    if (updateError) throw updateError

    // Verificar conquistas
    const { data: conquistas, error: conquistasError } = await supabaseClient
      .from('conquistas')
      .select('*')
      .not('id', 'in', progresso.conquistas)

    if (conquistasError) throw conquistasError

    const conquistasDesbloqueadas = conquistas.filter(conquista => {
      // Implementar lógica de verificação de requisitos
      return true // Por enquanto, retorna todas
    })

    if (conquistasDesbloqueadas.length > 0) {
      const { error: conquistasError } = await supabaseClient
        .from('progresso_aluno')
        .update({
          conquistas: [...progresso.conquistas, ...conquistasDesbloqueadas.map(c => c.id)]
        })
        .eq('aluno_id', alunoId)

      if (conquistasError) throw conquistasError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        conquistasDesbloqueadas 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 