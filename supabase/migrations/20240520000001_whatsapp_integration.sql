-- Criação das tabelas para integração com WhatsApp
-- Configuração do WhatsApp
CREATE TABLE IF NOT EXISTS public.comunicacao_whatsapp_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key TEXT NOT NULL,
    phone_number_id TEXT NOT NULL,
    business_account_id TEXT NOT NULL,
    webhook_secret TEXT NOT NULL,
    ativo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para templates do WhatsApp
CREATE TABLE IF NOT EXISTS public.comunicacao_whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    language TEXT NOT NULL,
    components_text TEXT[] DEFAULT '{}',
    template_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para mensagens do WhatsApp
CREATE TABLE IF NOT EXISTS public.comunicacao_whatsapp_mensagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_phone TEXT NOT NULL,
    from_phone TEXT NOT NULL,
    message_type TEXT NOT NULL,
    content TEXT,
    template_name TEXT,
    template_params JSONB,
    status TEXT DEFAULT 'pending',
    whatsapp_message_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para webhooks recebidos
CREATE TABLE IF NOT EXISTS public.comunicacao_whatsapp_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Permissões RLS
ALTER TABLE public.comunicacao_whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicacao_whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicacao_whatsapp_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicacao_whatsapp_webhooks ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso autenticado
CREATE POLICY "Acesso autenticado para configuração WhatsApp" 
ON public.comunicacao_whatsapp_config
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Acesso autenticado para templates WhatsApp" 
ON public.comunicacao_whatsapp_templates
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Acesso autenticado para mensagens WhatsApp" 
ON public.comunicacao_whatsapp_mensagens
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Acesso autenticado para webhooks WhatsApp" 
ON public.comunicacao_whatsapp_webhooks
FOR ALL USING (auth.role() = 'authenticated');

-- Funções 

-- Função para processar webhooks
CREATE OR REPLACE FUNCTION public.whatsapp_process_webhook(webhook_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    webhook_data JSONB;
    message_id TEXT;
    status TEXT;
    result JSONB;
BEGIN
    -- Buscar dados do webhook
    SELECT payload INTO webhook_data
    FROM public.comunicacao_whatsapp_webhooks
    WHERE id = webhook_id;
    
    IF webhook_data IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Webhook não encontrado');
    END IF;
    
    -- Processar notificação de status
    IF webhook_data->>'type' = 'message_status' THEN
        message_id := webhook_data->>'message_id';
        status := webhook_data->>'status';
        
        -- Atualizar status da mensagem
        IF message_id IS NOT NULL AND status IS NOT NULL THEN
            IF status = 'sent' THEN
                UPDATE public.comunicacao_whatsapp_mensagens
                SET status = 'sent', sent_at = NOW()
                WHERE whatsapp_message_id = message_id;
            ELSIF status = 'delivered' THEN
                UPDATE public.comunicacao_whatsapp_mensagens
                SET status = 'delivered', delivered_at = NOW()
                WHERE whatsapp_message_id = message_id;
            ELSIF status = 'read' THEN
                UPDATE public.comunicacao_whatsapp_mensagens
                SET status = 'read', read_at = NOW()
                WHERE whatsapp_message_id = message_id;
            ELSIF status = 'failed' THEN
                UPDATE public.comunicacao_whatsapp_mensagens
                SET status = 'failed', error_message = webhook_data->>'error'
                WHERE whatsapp_message_id = message_id;
            END IF;
        END IF;
    END IF;
    
    -- Marcar webhook como processado
    UPDATE public.comunicacao_whatsapp_webhooks
    SET processed = true
    WHERE id = webhook_id;
    
    RETURN jsonb_build_object('success', true);
END;
$$;

-- Gatilho para marcar mensagens como atualizadas
CREATE OR REPLACE FUNCTION update_timestamp_comunicacao_whatsapp_config()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comunicacao_whatsapp_config_timestamp
BEFORE UPDATE ON public.comunicacao_whatsapp_config
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_comunicacao_whatsapp_config();

-- Gatilho para marcar templates como atualizados
CREATE OR REPLACE FUNCTION update_timestamp_comunicacao_whatsapp_templates()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comunicacao_whatsapp_templates_timestamp
BEFORE UPDATE ON public.comunicacao_whatsapp_templates
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_comunicacao_whatsapp_templates();

-- Gatilho para marcar mensagens como atualizadas
CREATE OR REPLACE FUNCTION update_timestamp_comunicacao_whatsapp_mensagens()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comunicacao_whatsapp_mensagens_timestamp
BEFORE UPDATE ON public.comunicacao_whatsapp_mensagens
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_comunicacao_whatsapp_mensagens(); 