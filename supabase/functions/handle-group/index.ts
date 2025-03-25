import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface GroupAction {
  action: 'ADD' | 'REMOVE' | 'UPDATE_ROLE'
  grupo_id: string
  usuario_id: string
  role?: 'ADMIN' | 'MEMBRO'
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { groupAction }: { groupAction: GroupAction } = await req.json()

    switch (groupAction.action) {
      case 'ADD':
        const { data: newParticipante, error: addError } = await supabaseClient
          .from('participantes')
          .insert({
            grupo_id: groupAction.grupo_id,
            usuario_id: groupAction.usuario_id,
            role: groupAction.role || 'MEMBRO'
          })
          .select()
          .single()

        if (addError) throw addError
        return new Response(JSON.stringify({ participante: newParticipante }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        })

      case 'REMOVE':
        const { error: removeError } = await supabaseClient
          .from('participantes')
          .delete()
          .eq('grupo_id', groupAction.grupo_id)
          .eq('usuario_id', groupAction.usuario_id)

        if (removeError) throw removeError
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        })

      case 'UPDATE_ROLE':
        if (!groupAction.role) throw new Error('Role é obrigatória para atualização')

        const { data: updatedParticipante, error: updateError } = await supabaseClient
          .from('participantes')
          .update({ role: groupAction.role })
          .eq('grupo_id', groupAction.grupo_id)
          .eq('usuario_id', groupAction.usuario_id)
          .select()
          .single()

        if (updateError) throw updateError
        return new Response(JSON.stringify({ participante: updatedParticipante }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        })

      default:
        throw new Error('Ação inválida')
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }
}) 