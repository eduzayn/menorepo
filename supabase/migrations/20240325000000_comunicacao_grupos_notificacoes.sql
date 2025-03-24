-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comunicacao_canal') THEN
        CREATE TYPE public.comunicacao_canal AS ENUM (
            'interno',
            'email',
            'whatsapp',
            'sms',
            'push'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grupo_role') THEN
        CREATE TYPE public.grupo_role AS ENUM (
            'admin',
            'moderador',
            'membro'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_notificacao') THEN
        CREATE TYPE public.tipo_notificacao AS ENUM (
            'mensagem',
            'campanha',
            'sistema',
            'lembrete'
        );
    END IF;
END$$;

-- Tables
CREATE TABLE IF NOT EXISTS public.grupos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    criado_por UUID NOT NULL REFERENCES auth.users(id),
    criado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_criado_por FOREIGN KEY (criado_por) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.grupo_participantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grupo_id UUID NOT NULL REFERENCES public.grupos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    role grupo_role NOT NULL DEFAULT 'membro',
    criado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(grupo_id, usuario_id),
    CONSTRAINT fk_grupo FOREIGN KEY (grupo_id) REFERENCES public.grupos(id),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.notificacoes_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    tipo_notificacao tipo_notificacao NOT NULL,
    canal comunicacao_canal NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    horario_inicio TIME,
    horario_fim TIME,
    dias_semana INTEGER[], -- 0-6 (Domingo-Sábado)
    criado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(usuario_id, tipo_notificacao, canal),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes_config ENABLE ROW LEVEL SECURITY;

-- Policies for grupos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'grupos' 
        AND policyname = 'Usuários podem ver grupos que participam'
    ) THEN
        CREATE POLICY "Usuários podem ver grupos que participam"
            ON public.grupos FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.grupo_participantes
                    WHERE grupo_participantes.grupo_id = grupos.id
                    AND grupo_participantes.usuario_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'grupos' 
        AND policyname = 'Usuários podem criar grupos'
    ) THEN
        CREATE POLICY "Usuários podem criar grupos"
            ON public.grupos FOR INSERT
            WITH CHECK (auth.uid() = criado_por);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'grupos' 
        AND policyname = 'Admins podem atualizar grupos'
    ) THEN
        CREATE POLICY "Admins podem atualizar grupos"
            ON public.grupos FOR UPDATE
            USING (
                EXISTS (
                    SELECT 1 FROM public.grupo_participantes
                    WHERE grupo_participantes.grupo_id = grupos.id
                    AND grupo_participantes.usuario_id = auth.uid()
                    AND grupo_participantes.role IN ('admin', 'moderador')
                )
            );
    END IF;
END$$;

-- Policies for grupo_participantes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'grupo_participantes' 
        AND policyname = 'Usuários podem ver participantes dos grupos'
    ) THEN
        CREATE POLICY "Usuários podem ver participantes dos grupos"
            ON public.grupo_participantes FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.grupo_participantes gp
                    WHERE gp.grupo_id = grupo_participantes.grupo_id
                    AND gp.usuario_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'grupo_participantes' 
        AND policyname = 'Admins podem gerenciar participantes'
    ) THEN
        CREATE POLICY "Admins podem gerenciar participantes"
            ON public.grupo_participantes FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM public.grupo_participantes gp
                    WHERE gp.grupo_id = grupo_participantes.grupo_id
                    AND gp.usuario_id = auth.uid()
                    AND gp.role IN ('admin', 'moderador')
                )
            );
    END IF;
END$$;

-- Policies for notificacoes_config
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notificacoes_config' 
        AND policyname = 'Usuários podem gerenciar suas notificações'
    ) THEN
        CREATE POLICY "Usuários podem gerenciar suas notificações"
            ON public.notificacoes_config FOR ALL
            USING (auth.uid() = usuario_id);
    END IF;
END$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grupo_participantes_grupo_id ON public.grupo_participantes(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupo_participantes_usuario_id ON public.grupo_participantes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_config_usuario_id ON public.notificacoes_config(usuario_id); 