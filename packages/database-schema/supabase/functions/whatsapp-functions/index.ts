import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Verificar a assinatura do webhook
async function verifySignature(request: Request, secret: string): Promise<boolean> {
  try {
    const signature = request.headers.get('x-hub-signature-256')
    
    if (!signature) {
      console.error('Assinatura não encontrada nos headers')
      return false
    }
    
    const body = await request.clone().text()
    const hmacMessage = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(body + secret)
    )
    
    const hmacHex = Array.from(new Uint8Array(hmacMessage))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const expectedSignature = `sha256=${hmacHex}`
    
    return signature === expectedSignature
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return false
  }
}

// Processar webhook
async function handleWebhook(request: Request, supabase: any) {
  try {
    // Obter a configuração do WhatsApp
    const { data: configData, error: configError } = await supabase
      .from('comunicacao_whatsapp_config')
      .select('*')
      .eq('ativo', true)
      .maybeSingle()
    
    if (configError) {
      console.error('Erro ao buscar configuração:', configError)
      return new Response(JSON.stringify({ success: false, error: 'Configuração não encontrada' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (!configData) {
      console.error('Configuração não encontrada')
      return new Response(JSON.stringify({ success: false, error: 'Configuração não encontrada' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Verificar a assinatura do webhook
    const isValid = await verifySignature(request, configData.webhook_secret)
    
    if (!isValid) {
      console.error('Assinatura inválida')
      return new Response(JSON.stringify({ success: false, error: 'Assinatura inválida' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Processar o payload do webhook
    const payload = await request.json()
    
    // Salvar o webhook
    const { data: webhookData, error: webhookError } = await supabase
      .from('comunicacao_whatsapp_webhooks')
      .insert([{ payload }])
      .select()
    
    if (webhookError) {
      console.error('Erro ao salvar webhook:', webhookError)
      return new Response(JSON.stringify({ success: false, error: 'Erro ao salvar webhook' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const webhookId = webhookData[0].id
    
    // Processar o webhook com a função do banco de dados
    const { data: processData, error: processError } = await supabase
      .rpc('whatsapp_process_webhook', { webhook_id: webhookId })
    
    if (processError) {
      console.error('Erro ao processar webhook:', processError)
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return new Response(JSON.stringify({ success: false, error: 'Erro interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Verifica challenge para verificação da URL do webhook
function handleChallenge(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')
  
  // Token fixo que deve corresponder ao configurado no WhatsApp Business API
  const VERIFY_TOKEN = 'edunexia-whatsapp-verify-token'
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado com sucesso!')
    return new Response(challenge, { status: 200 })
  } else {
    console.error('Falha na verificação do webhook')
    return new Response('Falha na verificação', { status: 403 })
  }
}

serve(async (req) => {
  // Obter a URL com o caminho correto
  const url = new URL(req.url)
  const path = url.pathname.split('/').filter(Boolean)
  
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') as string
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') as string
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  // Rota para webhook
  if (path[1] === 'handle-webhook') {
    // Verifica a solicitação de verificação do webhook
    if (req.method === 'GET') {
      return handleChallenge(req)
    }
    
    // Processa as notificações
    if (req.method === 'POST') {
      return await handleWebhook(req, supabase)
    }
  }
  
  return new Response(JSON.stringify({ error: 'Rota não encontrada' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  })
}) 