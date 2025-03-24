-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comunicacao_status') THEN
        CREATE TYPE public.comunicacao_status AS ENUM (
            'aberto',
            'em_andamento',
            'fechado',
            'arquivado'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comunicacao_canal') THEN
        CREATE TYPE public.comunicacao_canal AS ENUM (
            'interno',
            'email',
            'whatsapp',
            'sms',
            'push'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comunicacao_tipo_mensagem') THEN
        CREATE TYPE public.comunicacao_tipo_mensagem AS ENUM (
            'texto',
            'imagem',
            'arquivo',
            'video',
            'audio',
            'localizacao'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comunicacao_tipo_campanha') THEN
        CREATE TYPE public.comunicacao_tipo_campanha AS ENUM (
            'marketing',
            'notificacao',
            'lembrete',
            'pesquisa'
        );
    END IF;
END$$;

-- Tables
CREATE TABLE IF NOT EXISTS public.conversas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    status comunicacao_status NOT NULL DEFAULT 'aberto',
    canal comunicacao_canal NOT NULL DEFAULT 'interno',
    remetente_id UUID NOT NULL REFERENCES auth.users(id),
    destinatario_id UUID REFERENCES auth.users(id),
    lead_id UUID REFERENCES public.leads(id),
    ultima_mensagem_at TIMESTAMPTZ,
    criado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_remetente FOREIGN KEY (remetente_id) REFERENCES auth.users(id),
    CONSTRAINT fk_destinatario FOREIGN KEY (destinatario_id) REFERENCES auth.users(id),
    CONSTRAINT fk_lead FOREIGN KEY (lead_id) REFERENCES public.leads(id)
);

CREATE TABLE IF NOT EXISTS public.mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversa_id UUID NOT NULL REFERENCES public.conversas(id) ON DELETE CASCADE,
    remetente_id UUID NOT NULL REFERENCES auth.users(id),
    tipo comunicacao_tipo_mensagem NOT NULL DEFAULT 'texto',
    conteudo TEXT NOT NULL,
    metadata JSONB,
    lida_at TIMESTAMPTZ,
    criado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_conversa FOREIGN KEY (conversa_id) REFERENCES public.conversas(id),
    CONSTRAINT fk_remetente FOREIGN KEY (remetente_id) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.campanhas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    tipo comunicacao_tipo_campanha NOT NULL,
    conteudo TEXT NOT NULL,
    metadata JSONB,
    status TEXT NOT NULL DEFAULT 'rascunho',
    data_inicio TIMESTAMPTZ,
    data_fim TIMESTAMPTZ,
    criado_por UUID NOT NULL REFERENCES auth.users(id),
    criado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_criado_por FOREIGN KEY (criado_por) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.campanha_destinatarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campanha_id UUID NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id),
    lead_id UUID REFERENCES public.leads(id),
    status TEXT NOT NULL DEFAULT 'pendente',
    enviado_at TIMESTAMPTZ,
    erro TEXT,
    criado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_campanha FOREIGN KEY (campanha_id) REFERENCES public.campanhas(id),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES auth.users(id),
    CONSTRAINT fk_lead FOREIGN KEY (lead_id) REFERENCES public.leads(id)
);

CREATE TABLE IF NOT EXISTS public.respostas_rapidas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    categoria TEXT,
    criado_por UUID NOT NULL REFERENCES auth.users(id),
    criado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_criado_por FOREIGN KEY (criado_por) REFERENCES auth.users(id)
);

-- RLS Policies
ALTER TABLE public.conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campanha_destinatarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respostas_rapidas ENABLE ROW LEVEL SECURITY;

-- Policies for conversas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversas' 
        AND policyname = 'Usuários podem ver suas próprias conversas'
    ) THEN
        CREATE POLICY "Usuários podem ver suas próprias conversas"
            ON public.conversas FOR SELECT
            USING (
                auth.uid() = remetente_id OR
                auth.uid() = destinatario_id
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversas' 
        AND policyname = 'Usuários podem criar conversas'
    ) THEN
        CREATE POLICY "Usuários podem criar conversas"
            ON public.conversas FOR INSERT
            WITH CHECK (auth.uid() = remetente_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversas' 
        AND policyname = 'Usuários podem atualizar suas próprias conversas'
    ) THEN
        CREATE POLICY "Usuários podem atualizar suas próprias conversas"
            ON public.conversas FOR UPDATE
            USING (auth.uid() = remetente_id OR auth.uid() = destinatario_id);
    END IF;
END$$;

-- Policies for mensagens
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mensagens' 
        AND policyname = 'Usuários podem ver mensagens de suas conversas'
    ) THEN
        CREATE POLICY "Usuários podem ver mensagens de suas conversas"
            ON public.mensagens FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.conversas
                    WHERE conversas.id = mensagens.conversa_id
                    AND (conversas.remetente_id = auth.uid() OR conversas.destinatario_id = auth.uid())
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mensagens' 
        AND policyname = 'Usuários podem enviar mensagens em suas conversas'
    ) THEN
        CREATE POLICY "Usuários podem enviar mensagens em suas conversas"
            ON public.mensagens FOR INSERT
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.conversas
                    WHERE conversas.id = mensagens.conversa_id
                    AND (conversas.remetente_id = auth.uid() OR conversas.destinatario_id = auth.uid())
                )
            );
    END IF;
END$$;

-- Policies for campanhas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'campanhas' 
        AND policyname = 'Usuários podem ver campanhas que criaram'
    ) THEN
        CREATE POLICY "Usuários podem ver campanhas que criaram"
            ON public.campanhas FOR SELECT
            USING (auth.uid() = criado_por);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'campanhas' 
        AND policyname = 'Usuários podem criar campanhas'
    ) THEN
        CREATE POLICY "Usuários podem criar campanhas"
            ON public.campanhas FOR INSERT
            WITH CHECK (auth.uid() = criado_por);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'campanhas' 
        AND policyname = 'Usuários podem atualizar suas próprias campanhas'
    ) THEN
        CREATE POLICY "Usuários podem atualizar suas próprias campanhas"
            ON public.campanhas FOR UPDATE
            USING (auth.uid() = criado_por);
    END IF;
END$$;

-- Policies for campanha_destinatarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'campanha_destinatarios' 
        AND policyname = 'Usuários podem ver destinatários das campanhas que criaram'
    ) THEN
        CREATE POLICY "Usuários podem ver destinatários das campanhas que criaram"
            ON public.campanha_destinatarios FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.campanhas
                    WHERE campanhas.id = campanha_destinatarios.campanha_id
                    AND campanhas.criado_por = auth.uid()
                )
            );
    END IF;
END$$;

-- Policies for respostas_rapidas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'respostas_rapidas' 
        AND policyname = 'Usuários podem ver suas próprias respostas rápidas'
    ) THEN
        CREATE POLICY "Usuários podem ver suas próprias respostas rápidas"
            ON public.respostas_rapidas FOR SELECT
            USING (auth.uid() = criado_por);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'respostas_rapidas' 
        AND policyname = 'Usuários podem criar respostas rápidas'
    ) THEN
        CREATE POLICY "Usuários podem criar respostas rápidas"
            ON public.respostas_rapidas FOR INSERT
            WITH CHECK (auth.uid() = criado_por);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'respostas_rapidas' 
        AND policyname = 'Usuários podem atualizar suas próprias respostas rápidas'
    ) THEN
        CREATE POLICY "Usuários podem atualizar suas próprias respostas rápidas"
            ON public.respostas_rapidas FOR UPDATE
            USING (auth.uid() = criado_por);
    END IF;
END$$;

-- Functions
CREATE OR REPLACE FUNCTION public.atualizar_ultima_mensagem()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversas
    SET ultima_mensagem_at = NEW.criado_at
    WHERE id = NEW.conversa_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS atualizar_ultima_mensagem_trigger ON public.mensagens;
CREATE TRIGGER atualizar_ultima_mensagem_trigger
    AFTER INSERT ON public.mensagens
    FOR EACH ROW
    EXECUTE FUNCTION public.atualizar_ultima_mensagem();

-- Storage buckets
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets 
        WHERE id = 'mensagens'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('mensagens', 'mensagens', false);
    END IF;
END$$;

-- Storage policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.policies 
        WHERE bucket_id = 'mensagens' 
        AND name = 'Usuários podem fazer upload de arquivos para suas mensagens'
    ) THEN
        CREATE POLICY "Usuários podem fazer upload de arquivos para suas mensagens"
            ON storage.objects FOR INSERT
            WITH CHECK (
                bucket_id = 'mensagens' AND
                (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM storage.policies 
        WHERE bucket_id = 'mensagens' 
        AND name = 'Usuários podem ver arquivos de suas mensagens'
    ) THEN
        CREATE POLICY "Usuários podem ver arquivos de suas mensagens"
            ON storage.objects FOR SELECT
            USING (
                bucket_id = 'mensagens' AND
                (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;
END$$; 