-- Tabela de configuração do WhatsApp
CREATE TABLE IF NOT EXISTS public.comunicacao_whatsapp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT NOT NULL,
  phone_number_id TEXT NOT NULL,
  business_account_id TEXT NOT NULL,
  webhook_secret TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT false,
  criado_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para mensagens enviadas via WhatsApp
CREATE TABLE IF NOT EXISTS public.comunicacao_whatsapp_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'template', 'media')),
  content TEXT NOT NULL,
  template_name TEXT,
  template_params JSONB,
  media_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  whatsapp_message_id TEXT,
  criado_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para templates do WhatsApp
CREATE TABLE IF NOT EXISTS public.comunicacao_whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp_template_id TEXT NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL,
  components_text JSONB,
  criado_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Função para atualizar automaticamente o timestamp atualizado_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp atualizado_at na tabela de configuração
CREATE TRIGGER update_comunicacao_whatsapp_config_updated_at
BEFORE UPDATE ON public.comunicacao_whatsapp_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar o timestamp atualizado_at na tabela de mensagens
CREATE TRIGGER update_comunicacao_whatsapp_mensagens_updated_at
BEFORE UPDATE ON public.comunicacao_whatsapp_mensagens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar o timestamp atualizado_at na tabela de templates
CREATE TRIGGER update_comunicacao_whatsapp_templates_updated_at
BEFORE UPDATE ON public.comunicacao_whatsapp_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Políticas de segurança RLS
ALTER TABLE public.comunicacao_whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicacao_whatsapp_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicacao_whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para administradores
CREATE POLICY "Administradores podem gerenciar configurações do WhatsApp"
ON public.comunicacao_whatsapp_config 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Administradores podem gerenciar mensagens do WhatsApp"
ON public.comunicacao_whatsapp_mensagens
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Administradores podem gerenciar templates do WhatsApp"
ON public.comunicacao_whatsapp_templates
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin'); 