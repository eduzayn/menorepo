-- Script SQL para criar a Edge Function do Webhook do Lytex
-- Este script cria uma função do Supabase Edge Functions para processar webhooks do gateway Lytex

-- 1. Primeiro, criamos a schema de pagamentos se não existir
CREATE SCHEMA IF NOT EXISTS pagamentos;

-- 2. Criamos uma tabela para registrar todos os webhooks recebidos (para auditoria)
CREATE TABLE IF NOT EXISTS pagamentos.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway TEXT NOT NULL,
  payload JSONB NOT NULL,
  headers JSONB NOT NULL,
  processado BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Criamos uma tabela para o status das transações
CREATE TABLE IF NOT EXISTS pagamentos.transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway TEXT NOT NULL,
  gateway_transaction_id TEXT NOT NULL,
  referencia TEXT NOT NULL, -- ID da matrícula ou outra entidade
  entidade TEXT NOT NULL, -- 'matricula', 'mensalidade', etc.
  entidade_id UUID NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL, -- 'pendente', 'pago', 'cancelado', 'expirado', etc.
  metodo_pagamento TEXT, -- 'pix', 'boleto', 'cartao'
  url_pagamento TEXT,
  pix_copia_cola TEXT,
  qr_code_url TEXT,
  linha_digitavel TEXT,
  pdf_boleto_url TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_pagamento TIMESTAMP WITH TIME ZONE,
  data_cancelamento TIMESTAMP WITH TIME ZONE,
  tentativas INT DEFAULT 0,
  metadata JSONB,
  webhook_id UUID REFERENCES pagamentos.webhook_logs(id),
  UNIQUE(gateway, gateway_transaction_id)
);

-- 4. Criamos a função que será chamada para processar o webhook
CREATE OR REPLACE FUNCTION pagamentos.processar_webhook_lytex(payload JSONB, headers JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  webhook_id UUID;
  transacao_id UUID;
  webhook_event TEXT;
  transacao_status TEXT;
  gateway_transaction_id TEXT;
  referencia TEXT;
  entidade TEXT;
  entidade_id UUID;
  valor DECIMAL(10,2);
  data_pagamento TIMESTAMP;
BEGIN
  -- Registra o webhook recebido
  INSERT INTO pagamentos.webhook_logs (gateway, payload, headers)
  VALUES ('lytex', payload, headers)
  RETURNING id INTO webhook_id;
  
  -- Extrai informações do payload
  webhook_event := payload->>'event';
  gateway_transaction_id := payload->>'transaction_id';
  
  -- Extrair status da transação com base no evento
  CASE webhook_event
    WHEN 'payment.confirmed' THEN
      transacao_status := 'pago';
      data_pagamento := (payload->>'payment_date')::TIMESTAMP;
    WHEN 'payment.expired' THEN
      transacao_status := 'expirado';
    WHEN 'payment.canceled' THEN
      transacao_status := 'cancelado';
    WHEN 'payment.created' THEN
      transacao_status := 'pendente';
    ELSE
      transacao_status := 'desconhecido';
  END CASE;
  
  -- Extrai a referência (ID da matrícula)
  referencia := payload->>'reference';
  
  -- Determina a entidade e ID da entidade a partir da referência
  -- Assumimos formato 'entidade:id', ex: 'matricula:123e4567-e89b-12d3-a456-426614174000'
  IF position(':' in referencia) > 0 THEN
    entidade := split_part(referencia, ':', 1);
    entidade_id := split_part(referencia, ':', 2)::UUID;
  ELSE
    -- Se não seguir o formato esperado, assumimos que é matricula
    entidade := 'matricula';
    entidade_id := referencia::UUID;
  END IF;
  
  -- Valor da transação
  valor := (payload->>'amount')::DECIMAL / 100.0;
  
  -- Atualiza ou cria registro da transação
  INSERT INTO pagamentos.transacoes (
    gateway, 
    gateway_transaction_id,
    referencia,
    entidade,
    entidade_id,
    valor,
    status,
    metodo_pagamento,
    url_pagamento,
    data_pagamento,
    webhook_id,
    metadata
  ) VALUES (
    'lytex',
    gateway_transaction_id,
    referencia,
    entidade,
    entidade_id,
    valor,
    transacao_status,
    payload->>'payment_method',
    payload->>'payment_url',
    data_pagamento,
    webhook_id,
    payload
  )
  ON CONFLICT (gateway, gateway_transaction_id) 
  DO UPDATE SET
    status = transacao_status,
    data_pagamento = EXCLUDED.data_pagamento,
    webhook_id = EXCLUDED.webhook_id,
    metadata = EXCLUDED.metadata,
    atualizado_em = now()
  RETURNING id INTO transacao_id;
  
  -- Se o pagamento foi confirmado, atualizamos a matrícula ou entidade correspondente
  IF transacao_status = 'pago' THEN
    -- Lógica para atualizar a entidade correspondente com base no tipo e ID
    IF entidade = 'matricula' THEN
      -- Atualiza a matrícula
      UPDATE matriculas
      SET status = CASE 
                    WHEN status = 'pendente' THEN 'ativa'
                    ELSE status -- mantém o status atual para outros casos
                   END,
          data_pagamento = data_pagamento,
          atualizado_em = now()
      WHERE id = entidade_id;
    ELSIF entidade = 'mensalidade' THEN
      -- Atualiza a mensalidade
      UPDATE mensalidades
      SET status = 'paga',
          data_pagamento = data_pagamento,
          atualizado_em = now()
      WHERE id = entidade_id;
    END IF;
    
    -- Atualizamos o log de webhook como processado
    UPDATE pagamentos.webhook_logs
    SET processado = true,
        atualizado_em = now()
    WHERE id = webhook_id;
  END IF;
  
  -- Retorna resposta para o Lytex
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Webhook processado com sucesso',
    'transaction_id', gateway_transaction_id,
    'reference', referencia,
    'status', transacao_status
  );
END;
$$;

-- 5. Criamos os triggers necessários para atualizar timestamps automaticamente
CREATE OR REPLACE FUNCTION pagamentos.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_pagamentos_webhook_logs_updated_at
BEFORE UPDATE ON pagamentos.webhook_logs
FOR EACH ROW
EXECUTE FUNCTION pagamentos.set_updated_at();

CREATE TRIGGER set_pagamentos_transacoes_updated_at
BEFORE UPDATE ON pagamentos.transacoes
FOR EACH ROW
EXECUTE FUNCTION pagamentos.set_updated_at();

-- 6. Adicionamos políticas de acesso RLS
ALTER TABLE pagamentos.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos.transacoes ENABLE ROW LEVEL SECURITY;

-- Apenas usuários autenticados com role específica podem ver os logs de webhook
CREATE POLICY "Apenas admins e financeiro podem ver logs de webhook" 
ON pagamentos.webhook_logs
FOR SELECT 
USING (
  auth.role() IN ('service_role', 'authenticated') AND 
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'financeiro')
);

-- Apenas usuários autenticados com role específica podem ver as transações
CREATE POLICY "Apenas admins e financeiro podem ver transações" 
ON pagamentos.transacoes
FOR SELECT 
USING (
  auth.role() IN ('service_role', 'authenticated') AND 
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'financeiro')
);

-- 7. Criar o esqueleto da Edge Function em JavaScript/TypeScript
COMMENT ON FUNCTION pagamentos.processar_webhook_lytex IS $$
// Esqueleto da Edge Function a ser criado no Supabase Edge Functions

// Nome do arquivo: lytex-webhook.ts
// Salvar em: supabase/functions/lytex-webhook/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Tratar preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Verificar se é um POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método não permitido' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Capturar headers para autenticação e verificação
    const headers = Object.fromEntries(req.headers.entries())
    
    // TODO: Implementar verificação de segurança do webhook
    // Aqui seria necessário verificar a assinatura do Lytex, se disponível
    
    // Ler o corpo da requisição
    const payload = await req.json()
    
    // Criar cliente do Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { 
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
    
    // Chamar a função SQL para processar o webhook
    const { data, error } = await supabaseClient
      .rpc('pagamentos.processar_webhook_lytex', {
        payload,
        headers
      })
    
    if (error) {
      console.error('Erro ao processar webhook:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Retornar resposta de sucesso
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Erro ao processar webhook:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
$$; 