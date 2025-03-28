# Guia de Implantação Manual da Edge Function no Supabase

Este documento descreve como implantar manualmente a Edge Function do webhook Lytex usando o painel do Supabase, sem a necessidade de CLI ou Docker.

## Pré-requisitos

- Conta no Supabase com acesso ao projeto `npiyusbnaaibibcucspv`
- Arquivo `index.ts` da Edge Function

## Passo 1: Acessar o Painel do Supabase

1. Acesse [https://app.supabase.com/](https://app.supabase.com/)
2. Faça login com suas credenciais
3. Selecione o projeto `npiyusbnaaibibcucspv`

## Passo 2: Navegar até Edge Functions

1. No menu lateral esquerdo, clique em **Edge Functions**
2. Você verá a lista de funções existentes (caso existam)

## Passo 3: Criar Nova Edge Function

1. Clique no botão **New Function**
2. Insira o nome `lytex-webhook`
3. **Desmarque** a opção "HTTP Auth (JWT)" para permitir que a função receba webhooks sem autenticação
4. Clique em **Create Function**

## Passo 4: Copiar o Código da Função

1. Após criar a função, você verá um editor de código
2. Substitua todo o conteúdo do editor pelo código abaixo:

```typescript
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
```

3. Clique em **Save** para salvar o código

## Passo 5: Configurar Variáveis de Ambiente

1. No painel da Edge Function, clique na aba **Settings**
2. Adicione as seguintes variáveis de ambiente:

| Nome | Valor |
|------|-------|
| `LYTEX_WEBHOOK_SECRET` | `KftSqbqq3+DPEuqXdZ8ZKk9w6VPEyn5QUEGZ1qKIR5l1vtwUyc5ALHkoqFiA/Wfqp8Ctd9bnzOM5+d4+Lm6uNQ==` |
| `SUPABASE_URL` | `https://npiyusbnaaibibcucspv.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waXl1c2JuYWFpYmliY3Vjc3B2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgzMzUyOCwiZXhwIjoyMDU4NDA5NTI4fQ.YZKmlk2SAS68hqxbWg0TiOkaSRY4MpTehcVxAac3AxA` |

3. Clique em **Save**

## Passo 6: Implantar a Função

1. Volte para a aba **Code Editor**
2. Clique no botão **Deploy** no canto superior direito
3. Aguarde a implantação ser concluída (deve levar alguns segundos)

## Passo 7: Testar a Função

1. A URL da função será: `https://npiyusbnaaibibcucspv.supabase.co/functions/v1/lytex-webhook`
2. Para testar, você pode executar o script `lytex-charge-creator.js`:
   ```
   node apps/matriculas/scripts/lytex-charge-creator.js pix 10
   ```
3. Isso criará uma cobrança de teste e o webhook será enviado para a URL acima

## Notas Importantes

- Os logs da função podem ser visualizados na aba **Logs** no painel da função
- As variáveis de ambiente são acessíveis apenas pela função e são criptografadas
- Certifique-se de que o esquema SQL foi executado antes de testar a função:
  ```sql
  -- Arquivo: apps/matriculas/scripts/create-lytex-webhook.sql
  ```

## Solução de Problemas

- Se a função retornar erro 500, verifique os logs para identificar o problema
- Se a função não receber webhooks, verifique se a URL está correta na configuração do gateway
- Se os dados não estiverem sendo salvos, verifique se o esquema SQL foi executado corretamente 