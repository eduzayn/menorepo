-- Criação da tabela de canais integrados se não existir
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
  config JSONB,
  UNIQUE (tipo, modo_integracao)
);

-- Comentários nas tabelas e colunas (em bloco DO para verificar existência)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'canais_integrados') THEN
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
  END IF;
END $$;

-- Trigger para atualizar o timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_canais_integrados_updated_at
BEFORE UPDATE ON canais_integrados
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Criar RLS para proteção dos dados
ALTER TABLE canais_integrados ENABLE ROW LEVEL SECURITY;

-- Políticas simplificadas sem depender de user_profiles
CREATE POLICY "Acesso público para canais_integrados"
ON canais_integrados FOR ALL
USING (true)
WITH CHECK (true);

-- Atualização na estrutura da tabela de mensagens para suportar metadados do WhatsApp
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mensagens') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mensagens' AND column_name = 'meta') THEN
      ALTER TABLE mensagens ADD COLUMN meta JSONB;
      
      -- Comentário na coluna meta apenas se ela foi adicionada com sucesso
      COMMENT ON COLUMN mensagens.meta IS 'Metadados da mensagem, como IDs externos e informações do template';
    END IF;
  END IF;
END $$;

-- Adicionar tipo WHATSAPP nos canais de mensagem se ainda não existir
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