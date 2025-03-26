import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

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

    const { documento_id, url, tipo } = await req.json()

    // Configurar OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Baixar documento
    const { data: documento, error: downloadError } = await supabaseClient
      .storage
      .from('documentos')
      .download(url)

    if (downloadError) {
      throw new Error('Erro ao baixar documento')
    }

    // Converter documento para texto (exemplo simplificado)
    const texto = await documento.text()

    // Validar documento com OpenAI
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Valide o seguinte ${tipo}:\n\n${texto}\n\nVerifique se:\n1. Todos os campos obrigatórios estão presentes\n2. O formato está correto\n3. Não há inconsistências\n\nResponda apenas com APROVADO ou REPROVADO, seguido de uma breve justificativa.`,
      max_tokens: 150,
    })

    const resultado = completion.data.choices[0].text?.trim() ?? ''
    const status = resultado.startsWith('APROVADO') ? 'APROVADO' : 'REPROVADO'
    const feedback = resultado.substring(resultado.indexOf(' ') + 1)

    // Atualizar status do documento
    const { error: updateError } = await supabaseClient
      .from('validacao_documentos')
      .update({
        status,
        feedback,
        data_validacao: new Date().toISOString(),
      })
      .eq('documento_id', documento_id)

    if (updateError) {
      throw new Error('Erro ao atualizar status do documento')
    }

    return new Response(
      JSON.stringify({ status, feedback }),
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