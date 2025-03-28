-- Script para configurar integração WhatsApp na Edunéxia
-- Versão compatível com PostgreSQL antigo
-- Execute este script diretamente no console SQL do Supabase

BEGIN;

-- Verificar se o tipo canal_mensagem existe
DO $$
DECLARE
  enum_exists boolean;
  whatsapp_exists boolean;
BEGIN
  -- Verificar se o tipo já existe
  SELECT EXISTS(
    SELECT 1 FROM pg_type 
    JOIN pg_namespace ON pg_namespace.oid = pg_type.typnamespace
    WHERE pg_type.typname = 'canal_mensagem' AND pg_namespace.nspname = 'public'
  ) INTO enum_exists;
  
  IF NOT enum_exists THEN
    -- Criar o tipo se não existir
    CREATE TYPE canal_mensagem AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'APP');
  ELSE
    -- Verificar se WHATSAPP já existe no enum
    SELECT EXISTS(
      SELECT 1 FROM pg_enum 
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
      WHERE pg_type.typname = 'canal_mensagem' AND pg_enum.enumlabel = 'WHATSAPP'
    ) INTO whatsapp_exists;
    
    -- Adicionar valor apenas se não existir
    IF NOT whatsapp_exists THEN
      -- Esta parte pode falhar se o valor já existir, mas o bloco EXCEPTION vai capturar
      BEGIN
        ALTER TYPE canal_mensagem ADD VALUE 'WHATSAPP';
      EXCEPTION
        WHEN duplicate_object THEN
          -- Ignorar erro se já existir
      END;
    END IF;
  END IF;
END
$$;

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Verificar se a tabela canais_integrados existe
DO $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'canais_integrados'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    -- Criar tabela se não existir
    CREATE TABLE canais_integrados (
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
    
    -- Comentários na tabela e colunas
    COMMENT ON TABLE canais_integrados IS 'Configurações de integrações com canais de comunicação';
    COMMENT ON COLUMN canais_integrados.tipo IS 'Tipo de canal (WHATSAPP, EMAIL, SMS)';
    COMMENT ON COLUMN canais_integrados.modo_integracao IS 'Modo de integração do WhatsApp (API ou QRCODE)';
    COMMENT ON COLUMN canais_integrados.apiKey IS 'Chave de API para autenticação (modo API)';
    COMMENT ON COLUMN canais_integrados.phoneNumberId IS 'ID do número de telefone no WhatsApp Business (modo API)';
    COMMENT ON COLUMN canais_integrados.businessAccountId IS 'ID da conta comercial no WhatsApp Business (modo API)';
    COMMENT ON COLUMN canais_integrados.webhookSecret IS 'Token secreto para verificação de webhooks (modo API)';
    COMMENT ON COLUMN canais_integrados.session_id IS 'ID da sessão do WhatsApp Web (modo QRCODE)';
    COMMENT ON COLUMN canais_integrados.qrcode_image IS 'Imagem do QR Code em base64 (modo QRCODE)';
    COMMENT ON COLUMN canais_integrados.qrcode_status IS 'Status da conexão via QR Code';
    COMMENT ON COLUMN canais_integrados.last_connection IS 'Data e hora da última conexão';
    COMMENT ON COLUMN canais_integrados.ativo IS 'Indicador se a integração está ativa';
    COMMENT ON COLUMN canais_integrados.config IS 'Configurações adicionais em formato JSON';
    
    -- Adicionar trigger na criação inicial
    CREATE TRIGGER update_canais_integrados_updated_at
    BEFORE UPDATE ON canais_integrados
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  ELSE
    -- A tabela já existe, verificar se precisamos modificá-la
    DECLARE
      constraint_exists boolean;
      trigger_exists boolean;
    BEGIN
      -- Verificar se a restrição único por tipo existe (para removê-la)
      SELECT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'canais_integrados_tipo_key' 
        AND conrelid = 'canais_integrados'::regclass
      ) INTO constraint_exists;
      
      IF constraint_exists THEN
        ALTER TABLE canais_integrados DROP CONSTRAINT canais_integrados_tipo_key;
      END IF;
      
      -- Verificar se o trigger existe
      SELECT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_canais_integrados_updated_at'
        AND tgrelid = 'canais_integrados'::regclass
      ) INTO trigger_exists;
      
      -- Criar trigger se não existir
      IF NOT trigger_exists THEN
        CREATE TRIGGER update_canais_integrados_updated_at
        BEFORE UPDATE ON canais_integrados
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
      END IF;
    END;
  END IF;
END
$$;

-- Adicionar restrição UNIQUE para tipo+modo (só se ainda não existir)
DO $$
DECLARE
  constraint_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'canais_integrados_tipo_modo_key' 
    AND conrelid = 'canais_integrados'::regclass
  ) INTO constraint_exists;
  
  IF NOT constraint_exists THEN
    ALTER TABLE canais_integrados ADD CONSTRAINT canais_integrados_tipo_modo_key UNIQUE (tipo, modo_integracao);
  END IF;
END
$$;

-- Ativar RLS para canais_integrados
ALTER TABLE canais_integrados ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (para evitar conflitos)
DO $$
DECLARE 
  policy_exists boolean;
BEGIN
  -- Verificar se política pública existe
  SELECT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Acesso público para canais_integrados'
  ) INTO policy_exists;
  
  IF policy_exists THEN
    DROP POLICY "Acesso público para canais_integrados" ON canais_integrados;
  END IF;
  
  -- Verificar se política para administradores existe
  SELECT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Administradores podem fazer qualquer operação em canais_integrados'
  ) INTO policy_exists;
  
  IF policy_exists THEN
    DROP POLICY "Administradores podem fazer qualquer operação em canais_integrados" ON canais_integrados;
  END IF;
  
  -- Verificar se política para operadores existe
  SELECT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Operadores podem visualizar canais_integrados'
  ) INTO policy_exists;
  
  IF policy_exists THEN
    DROP POLICY "Operadores podem visualizar canais_integrados" ON canais_integrados;
  END IF;
END
$$;

-- Criar política de acesso
CREATE POLICY "Acesso público para canais_integrados"
ON canais_integrados FOR ALL
USING (true)
WITH CHECK (true);

-- Adicionar coluna meta à tabela mensagens se ela existir
DO $$
DECLARE
  mensagens_exists boolean;
  meta_exists boolean;
BEGIN
  -- Verificar se tabela mensagens existe
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'mensagens'
  ) INTO mensagens_exists;
  
  IF mensagens_exists THEN
    -- Verificar se coluna meta já existe
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'mensagens' AND column_name = 'meta'
    ) INTO meta_exists;
    
    -- Adicionar coluna se não existir
    IF NOT meta_exists THEN
      ALTER TABLE mensagens ADD COLUMN meta JSONB;
      COMMENT ON COLUMN mensagens.meta IS 'Metadados da mensagem, como IDs externos e informações do template';
    END IF;
  END IF;
END
$$;

COMMIT;

-- Verificação final
SELECT 'Migração do WhatsApp concluída com sucesso!' AS resultado; 