import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface Campaign {
  id: string
  titulo: string
  descricao?: string
  tipo: 'EMAIL' | 'SMS' | 'WHATSAPP'
  data_inicio: string
  data_fim?: string
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { campaign }: { campaign: Campaign } = await req.json()

    // Verificar se a campanha está ativa
    const { data: campanha, error: campanhaError } = await supabaseClient
      .from('campanhas')
      .select('*')
      .eq('id', campaign.id)
      .eq('status', 'ATIVA')
      .single()

    if (campanhaError) throw campanhaError
    if (!campanha) throw new Error('Campanha não encontrada ou inativa')

    // Processar campanha de acordo com o tipo
    switch (campaign.tipo) {
      case 'EMAIL':
        // Implementar lógica de envio de email em massa
        break
      case 'SMS':
        // Implementar lógica de envio de SMS em massa
        break
      case 'WHATSAPP':
        // Implementar lógica de envio de WhatsApp em massa
        break
    }

    // Atualizar status da campanha se data_fim for atingida
    if (campaign.data_fim && new Date(campaign.data_fim) <= new Date()) {
      const { error: updateError } = await supabaseClient
        .from('campanhas')
        .update({ status: 'CONCLUIDA' })
        .eq('id', campaign.id)

      if (updateError) throw updateError
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