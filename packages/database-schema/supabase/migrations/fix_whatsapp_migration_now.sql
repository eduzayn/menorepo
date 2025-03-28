-- Solução rápida para o erro de sintaxe
-- Execute este script no console SQL do Supabase para corrigir o problema

BEGIN;

-- Criar tabela canais_integrados se não existir (sem comentários)
CREATE TABLE IF NOT EXISTS canais_integrados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('WHATSAPP', 'EMAIL', 'SMS')),
  modo_integracao TEXT CHECK (modo_integracao IN ('API', 'QRCODE')),
  apiKey TEXT,
  phoneNumberId TEXT,
  businessAccountId TEXT,
  webhookSecret TEXT,
  session_id TEXT,
  qrcode_image TEXT,
  qrcode_status TEXT CHECK (qrcode_status IN ('PENDING', 'CONNECTED', 'DISCONNECTED')),
  last_connection TIMESTAMP WITH TIME ZONE,
  ativo BOOLEAN DEFAULT false NOT NULL,
  config JSONB
);

-- Remover restrição UNIQUE para tipo se existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'canais_integrados_tipo_key' 
    AND conrelid = 'canais_integrados'::regclass
  ) THEN
    ALTER TABLE canais_integrados DROP CONSTRAINT canais_integrados_tipo_key;
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- Tabela não existe, nada a fazer
  WHEN undefined_column THEN
    -- Coluna não existe, nada a fazer
END $$;

-- Adicionar restrição UNIQUE para tipo+modo
ALTER TABLE canais_integrados ADD CONSTRAINT canais_integrados_tipo_modo_key UNIQUE (tipo, modo_integracao);

-- Adicionar coluna meta à tabela mensagens se ela existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'mensagens'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'mensagens' AND column_name = 'meta'
    ) THEN
      ALTER TABLE mensagens ADD COLUMN meta JSONB;
    END IF;
  END IF;
END $$;

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_canais_integrados_updated_at'
  ) THEN
    CREATE TRIGGER update_canais_integrados_updated_at
    BEFORE UPDATE ON canais_integrados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- Tabela não existe, nada a fazer
END $$;

-- Ativar RLS e criar política básica
ALTER TABLE canais_integrados ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'canais_integrados'::regclass
  ) THEN
    DROP POLICY IF EXISTS "Acesso público para canais_integrados" ON canais_integrados;
    DROP POLICY IF EXISTS "Administradores podem fazer qualquer operação em canais_integrados" ON canais_integrados;
    DROP POLICY IF EXISTS "Operadores podem visualizar canais_integrados" ON canais_integrados;
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- Tabela não existe, nada a fazer
END $$;

-- Criar política de acesso simples
CREATE POLICY "Acesso público para canais_integrados"
ON canais_integrados FOR ALL
USING (true)
WITH CHECK (true);

COMMIT;

-- Exiba esta mensagem após a execução
SELECT 'Migração do WhatsApp corrigida com sucesso!' AS resultado; 