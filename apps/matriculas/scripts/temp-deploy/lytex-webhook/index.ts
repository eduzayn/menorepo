/**
 * Webhook do Lytex para processar notificações de pagamento
 * 
 * Esta edge function recebe os webhooks do gateway Lytex e
 * atualiza o status das matrículas/pagamentos no banco de dados.
 * 
 * Webhook URL: https://[project-ref].supabase.co/functions/v1/lytex-webhook
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.7.1";

// Headers CORS para permitir chamadas de origens diferentes
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Chave compartilhada para verificar a autenticidade dos webhooks (seria ideal armazenar em variáveis de ambiente)
const WEBHOOK_SECRET = Deno.env.get('LYTEX_WEBHOOK_SECRET');

Deno.serve(async (req: Request) => {
  // Verificar requisições OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Verificar se o método é POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          error: 'Método não permitido',
          message: 'Esta função só aceita requisições POST' 
        }), 
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Obter os headers da requisição
    const headers = Object.fromEntries(req.headers.entries());
    
    // Validação de segurança (ideal implementar verificação de assinatura HMAC)
    // No futuro, implementar verificação da assinatura do webhook
    const authHeader = headers['x-webhook-signature'] || headers['authorization'];
    
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.warn('Assinatura de webhook inválida ou ausente');
      // Em produção, descomentar a linha abaixo para rejeitar webhooks sem autenticação válida
      // return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401, headers: corsHeaders });
    }
    
    // Ler o corpo da requisição como JSON
    const payload = await req.json();
    console.log('Webhook recebido:', JSON.stringify(payload, null, 2));
    
    // Validação básica do payload
    if (!payload.event || !payload.transaction_id) {
      return new Response(
        JSON.stringify({ 
          error: 'Payload inválido',
          message: 'O webhook deve conter event e transaction_id' 
        }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidas');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Chamar a função RPC no Supabase para processar o webhook
    const { data, error } = await supabaseClient
      .rpc('pagamentos.processar_webhook_lytex', {
        payload,
        headers
      });
    
    if (error) {
      console.error('Erro ao processar webhook:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao processar webhook',
          message: error.message 
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Retornar resposta de sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processado com sucesso',
        data
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro não tratado ao processar webhook:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno',
        message: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 