-- Script para corrigir as políticas RLS que estão dando erro
-- Executado por: Supabase CLI
-- Criado em: 2024-07-05

-- Verifica políticas existentes
DO $$
DECLARE
  v_policy RECORD;
BEGIN
  RAISE NOTICE 'Verificando políticas RLS...';
  
  FOR v_policy IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname IN ('contabilidade', 'rh', 'public')
  LOOP
    RAISE NOTICE 'Política existente: %.%.%', v_policy.schemaname, v_policy.tablename, v_policy.policyname;
  END LOOP;
END $$;

-- Remove políticas com erros e recria corretamente
DO $$
BEGIN
  -- Verificar políticas na tabela integration_logs
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'integration_logs' AND policyname = 'Apenas administradores podem ver todos os logs'
  ) THEN
    DROP POLICY "Apenas administradores podem ver todos os logs" ON public.integration_logs;
    RAISE NOTICE 'Política "Apenas administradores podem ver todos os logs" removida';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'integration_logs' AND policyname = 'Usuários podem ver logs de suas instituições'
  ) THEN
    DROP POLICY "Usuários podem ver logs de suas instituições" ON public.integration_logs;
    RAISE NOTICE 'Política "Usuários podem ver logs de suas instituições" removida';
  END IF;
  
  -- Recria as políticas corretamente
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'integration_logs') THEN
    -- Verifica se a tabela usuarios_instituicoes existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'usuarios_instituicoes') THEN
      -- Criar política para administradores
      CREATE POLICY "Apenas administradores podem ver todos os logs"
        ON public.integration_logs
        FOR SELECT
        USING (EXISTS (
          SELECT 1 FROM public.usuarios_instituicoes 
          WHERE usuario_id = auth.uid() AND perfil = 'admin'
        ));
      
      -- Criar política para usuários verem logs de suas instituições
      CREATE POLICY "Usuários podem ver logs de suas instituições"
        ON public.integration_logs
        FOR SELECT
        USING (EXISTS (
          SELECT 1 FROM public.usuarios_instituicoes 
          WHERE usuario_id = auth.uid() AND instituicao_id = public.integration_logs.instituicao_id
        ));
        
      RAISE NOTICE 'Políticas de integration_logs recriadas com sucesso';
    ELSE
      RAISE NOTICE 'Tabela usuarios_instituicoes não existe. Criando primeiro...';
      
      -- Criar tabela usuarios_instituicoes se não existir
      CREATE TABLE IF NOT EXISTS public.usuarios_instituicoes (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        instituicao_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
        perfil text NOT NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );
      
      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS idx_usuarios_instituicoes_usuario_id ON public.usuarios_instituicoes(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_usuarios_instituicoes_instituicao_id ON public.usuarios_instituicoes(instituicao_id);
      
      -- Enable Row Level Security
      ALTER TABLE public.usuarios_instituicoes ENABLE ROW LEVEL SECURITY;
      
      -- Policies for Row Level Security
      CREATE POLICY "Users can view their institutions" ON public.usuarios_instituicoes
        FOR SELECT
        USING (auth.uid() = usuario_id);
      
      CREATE POLICY "Users can insert their institutions" ON public.usuarios_instituicoes
        FOR INSERT
        WITH CHECK (auth.uid() = usuario_id);
        
      -- Agora cria as políticas para integration_logs
      CREATE POLICY "Apenas administradores podem ver todos os logs"
        ON public.integration_logs
        FOR SELECT
        USING (EXISTS (
          SELECT 1 FROM public.usuarios_instituicoes 
          WHERE usuario_id = auth.uid() AND perfil = 'admin'
        ));
      
      CREATE POLICY "Usuários podem ver logs de suas instituições"
        ON public.integration_logs
        FOR SELECT
        USING (EXISTS (
          SELECT 1 FROM public.usuarios_instituicoes 
          WHERE usuario_id = auth.uid() AND instituicao_id = public.integration_logs.instituicao_id
        ));
        
      RAISE NOTICE 'Tabela usuarios_instituicoes e políticas de integration_logs criadas com sucesso';
    END IF;
  ELSE
    RAISE NOTICE 'Tabela integration_logs não existe';
  END IF;
  
  -- Verificar políticas na tabela rh.pendencias_contabilizacao
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'rh' AND tablename = 'pendencias_contabilizacao' AND policyname = 'Usuários podem ver pendências de suas instituições'
  ) THEN
    DROP POLICY "Usuários podem ver pendências de suas instituições" ON rh.pendencias_contabilizacao;
    RAISE NOTICE 'Política "Usuários podem ver pendências de suas instituições" removida de rh.pendencias_contabilizacao';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'rh' AND tablename = 'pendencias_contabilizacao' AND policyname = 'Apenas RH e contadores podem gerenciar pendências'
  ) THEN
    DROP POLICY "Apenas RH e contadores podem gerenciar pendências" ON rh.pendencias_contabilizacao;
    RAISE NOTICE 'Política "Apenas RH e contadores podem gerenciar pendências" removida de rh.pendencias_contabilizacao';
  END IF;
  
  -- Recria as políticas para rh.pendencias_contabilizacao
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'rh' AND table_name = 'pendencias_contabilizacao') THEN
    CREATE POLICY "Usuários podem ver pendências de suas instituições"
      ON rh.pendencias_contabilizacao
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM public.usuarios_instituicoes 
        WHERE usuario_id = auth.uid() AND instituicao_id = rh.pendencias_contabilizacao.instituicao_id
      ));
    
    CREATE POLICY "Apenas RH e contadores podem gerenciar pendências"
      ON rh.pendencias_contabilizacao
      FOR ALL
      USING (EXISTS (
        SELECT 1 FROM public.usuarios_instituicoes 
        WHERE usuario_id = auth.uid() 
          AND instituicao_id = rh.pendencias_contabilizacao.instituicao_id
          AND perfil IN ('admin', 'contador', 'rh')
      ));
      
    RAISE NOTICE 'Políticas de rh.pendencias_contabilizacao recriadas com sucesso';
  ELSE
    RAISE NOTICE 'Tabela rh.pendencias_contabilizacao não existe';
  END IF;
  
  -- Verificar e corrigir políticas em outras tabelas contabilidade
  -- Pode adicionar outras políticas conforme necessário para outras tabelas
END $$;

-- Verificar políticas atualizadas
DO $$
DECLARE
  v_policy RECORD;
BEGIN
  RAISE NOTICE 'Verificando políticas RLS após correções...';
  
  FOR v_policy IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname IN ('contabilidade', 'rh', 'public')
  LOOP
    RAISE NOTICE 'Política atualizada: %.%.%', v_policy.schemaname, v_policy.tablename, v_policy.policyname;
  END LOOP;
END $$; 