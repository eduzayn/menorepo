-- Script simplificado para configurar integração WhatsApp para Edunéxia
-- Versão compatível com PostgreSQL 12 e anteriores
-- Execute este script diretamente no console SQL do Supabase

BEGIN;

-- Verificar se o tipo canal_mensagem existe e adicionar WHATSAPP se necessário
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type 
    JOIN pg_namespace ON pg_namespace.oid = pg_type.typnamespace
    WHERE pg_type.typname = 'canal_mensagem' AND pg_namespace.nspname = 'public'
  ) THEN
    -- Se o tipo não existir, crie-o
    CREATE TYPE canal_mensagem AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'APP');
  ELSE
    -- Se o tipo existir, verifique se WHATSAPP já está incluído
    BEGIN
      ALTER TYPE canal_mensagem ADD VALUE 'WHATSAPP' IF NOT EXISTS;
    EXCEPTION
      -- Ignora erro se o valor já existir
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- Função para atualizar timestamp (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Criar tabela canais_integrados se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'canais_integrados') THEN
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
    
    -- Criar trigger para atualizar updated_at
    CREATE TRIGGER update_canais_integrados_updated_at
    BEFORE UPDATE ON canais_integrados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
    -- Ativar RLS
    ALTER TABLE canais_integrados ENABLE ROW LEVEL SECURITY;
    
    -- Criar política de acesso
    CREATE POLICY "Acesso público para canais_integrados"
    ON canais_integrados FOR ALL
    USING (true)
    WITH CHECK (true);
    
    -- Adicionar comentários à tabela
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
  ELSE
    -- Tabela já existe, verificar se é necessário alterar
    DO $$
    BEGIN
      -- Verificar se existe restrição UNIQUE para tipo
      IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'canais_integrados_tipo_key' 
        AND conrelid = 'canais_integrados'::regclass
      ) THEN
        -- Remover restrição para permitir múltiplos modos por tipo
        ALTER TABLE canais_integrados DROP CONSTRAINT canais_integrados_tipo_key;
      END IF;
      
      -- Adicionar restrição UNIQUE para tipo+modo (se não existir)
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'canais_integrados_tipo_modo_key' 
        AND conrelid = 'canais_integrados'::regclass
      ) THEN
        ALTER TABLE canais_integrados ADD CONSTRAINT canais_integrados_tipo_modo_key UNIQUE (tipo, modo_integracao);
      END IF;
    EXCEPTION
      WHEN undefined_column THEN
        -- Coluna não existe, nada a fazer
    END $$;
  END IF;
END $$;

-- Adicionar coluna meta à tabela mensagens (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'mensagens') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_attribute 
                  WHERE attrelid = 'mensagens'::regclass 
                  AND attname = 'meta' 
                  AND NOT attisdropped) THEN
      ALTER TABLE mensagens ADD COLUMN meta JSONB;
      COMMENT ON COLUMN mensagens.meta IS 'Metadados da mensagem, como IDs externos e informações do template';
    END IF;
  END IF;
END $$;

RAISE NOTICE 'Migração do WhatsApp concluída com sucesso!';

COMMIT; 