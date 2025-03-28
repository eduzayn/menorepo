import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestBody {
  apiKey: string;
  phoneNumberId: string;
  businessAccountId: string;
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter dados da solicitação
    const requestData: RequestBody = await req.json()
    
    // Validar dados de entrada
    if (!requestData.apiKey || !requestData.phoneNumberId || !requestData.businessAccountId) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos para testar a conexão' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Testar a conexão com a API do WhatsApp consultando informações da conta
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${requestData.businessAccountId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${requestData.apiKey}`
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Falha na conexão com o WhatsApp',
          details: errorData
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const accountData = await response.json()

    return new Response(
      JSON.stringify({
        success: true,
        accountName: accountData.name,
        accountId: accountData.id,
        message: 'Conexão estabelecida com sucesso'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro ao testar conexão:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro interno ao testar conexão',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 