-- Script para criar a tabela de usuários instituições
-- Executado por: Supabase CLI
-- Criado em: 2024-07-05

-- Criar a tabela usuarios_instituicoes se não existir
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'usuarios_instituicoes') THEN
    CREATE TABLE public.usuarios_instituicoes (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      instituicao_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
      perfil text NOT NULL,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    );

    -- Create index for better performance
    CREATE INDEX idx_usuarios_instituicoes_usuario_id ON public.usuarios_instituicoes(usuario_id);
    CREATE INDEX idx_usuarios_instituicoes_instituicao_id ON public.usuarios_instituicoes(instituicao_id);
    
    -- Enable Row Level Security
    ALTER TABLE public.usuarios_instituicoes ENABLE ROW LEVEL SECURITY;

    -- Policies for Row Level Security
    CREATE POLICY "Users can view their institutions" ON public.usuarios_instituicoes
      FOR SELECT
      USING (auth.uid() = usuario_id);

    CREATE POLICY "Users can insert their institutions" ON public.usuarios_instituicoes
      FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);
      
    RAISE NOTICE 'Tabela usuarios_instituicoes criada com sucesso';
  ELSE
    RAISE NOTICE 'Tabela usuarios_instituicoes já existe';
  END IF;
END $$;

-- Adicionar coluna de tipo de usuário se não existir
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios_instituicoes' AND column_name = 'tipo_usuario') THEN
    ALTER TABLE public.usuarios_instituicoes ADD COLUMN tipo_usuario text DEFAULT 'padrao';
    RAISE NOTICE 'Coluna tipo_usuario adicionada à tabela usuarios_instituicoes';
  ELSE
    RAISE NOTICE 'Coluna tipo_usuario já existe';
  END IF;
END $$;

-- Verificar se existem usuários para criar registros de exemplo
DO $$
DECLARE
  v_usuario_id uuid;
  v_instituicao_id uuid;
BEGIN
  -- Verificar se já existem registros
  IF NOT EXISTS(SELECT 1 FROM public.usuarios_instituicoes LIMIT 1) THEN
    -- Verificar se existem usuários e instituições
    SELECT id INTO v_usuario_id FROM auth.users LIMIT 1;
    SELECT id INTO v_instituicao_id FROM public.institutions LIMIT 1;
    
    -- Se existem usuários e instituições, criar um registro de exemplo
    IF v_usuario_id IS NOT NULL AND v_instituicao_id IS NOT NULL THEN
      INSERT INTO public.usuarios_instituicoes 
        (usuario_id, instituicao_id, perfil, tipo_usuario)
      VALUES 
        (v_usuario_id, v_instituicao_id, 'admin', 'administrador');
      RAISE NOTICE 'Registro de exemplo criado na tabela usuarios_instituicoes';
    ELSE
      RAISE NOTICE 'Não foram encontrados usuários ou instituições para criar registro de exemplo';
    END IF;
  ELSE
    RAISE NOTICE 'Já existem registros na tabela usuarios_instituicoes';
  END IF;
END $$;
 