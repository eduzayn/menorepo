-- Script para executar as migrações em blocos seguros (executar um por vez)
-- Cada bloco pode ser executado separadamente e verificado
-- INSTRUÇÕES: execute cada seção separadamente, confirmando o sucesso antes de continuar

---------------------------------------------
-- BLOCO 1: Verificar a estrutura atual do banco
---------------------------------------------
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('contabilidade', 'rh');

-- Se não existirem, criá-los
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'contabilidade') THEN
    CREATE SCHEMA contabilidade;
    RAISE NOTICE 'Schema contabilidade criado com sucesso';
  ELSE
    RAISE NOTICE 'Schema contabilidade já existe';
  END IF;
  
  IF NOT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'rh') THEN
    CREATE SCHEMA rh;
    RAISE NOTICE 'Schema rh criado com sucesso';
  ELSE
    RAISE NOTICE 'Schema rh já existe';
  END IF;
END $$;

---------------------------------------------
-- BLOCO 2: Criar tipos enumerados (se não existirem)
---------------------------------------------
-- Verificar tipos enumerados existentes
SELECT n.nspname as schema,
       t.typname as tipo
FROM pg_type t
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname IN ('contabilidade', 'rh')
  AND t.typtype = 'e' -- tipo enum
ORDER BY schema, tipo;

-- Criar tipo de conta (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                 WHERE t.typname = 'tipo_conta' AND n.nspname = 'contabilidade') THEN
    CREATE TYPE contabilidade.tipo_conta AS ENUM ('SINTETICA', 'ANALITICA');
    RAISE NOTICE 'Tipo contabilidade.tipo_conta criado com sucesso';
  ELSE
    RAISE NOTICE 'Tipo contabilidade.tipo_conta já existe';
  END IF;
END $$;

-- Criar natureza de conta (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                 WHERE t.typname = 'natureza_conta' AND n.nspname = 'contabilidade') THEN
    CREATE TYPE contabilidade.natureza_conta AS ENUM ('DEVEDORA', 'CREDORA');
    RAISE NOTICE 'Tipo contabilidade.natureza_conta criado com sucesso';
  ELSE
    RAISE NOTICE 'Tipo contabilidade.natureza_conta já existe';
  END IF;
END $$;

-- Criar tipo de lançamento (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                 WHERE t.typname = 'tipo_lancamento' AND n.nspname = 'contabilidade') THEN
    CREATE TYPE contabilidade.tipo_lancamento AS ENUM (
      'MANUAL', 'FOLHA_PAGAMENTO', 'PROVISAO_FERIAS', 'PROVISAO_13', 'BENEFICIOS', 'RESCISAO'
    );
    RAISE NOTICE 'Tipo contabilidade.tipo_lancamento criado com sucesso';
  ELSE
    RAISE NOTICE 'Tipo contabilidade.tipo_lancamento já existe';
  END IF;
END $$;

-- Criar status de pendência (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                 WHERE t.typname = 'status_pendencia' AND n.nspname = 'rh') THEN
    CREATE TYPE rh.status_pendencia AS ENUM (
      'PENDENTE', 'EM_PROCESSAMENTO', 'PROCESSADA', 'ERRO'
    );
    RAISE NOTICE 'Tipo rh.status_pendencia criado com sucesso';
  ELSE
    RAISE NOTICE 'Tipo rh.status_pendencia já existe';
  END IF;
END $$;

---------------------------------------------
-- BLOCO 3: Criar tabela de contas contábeis
---------------------------------------------
-- Verificar se a tabela existe
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_schema = 'contabilidade' AND table_name = 'contas'
) AS tabela_contas_existe;

-- Criar a tabela contas (se não existir)
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'contabilidade' AND table_name = 'contas') THEN
    CREATE TABLE contabilidade.contas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
      codigo VARCHAR(20) NOT NULL,
      nome VARCHAR(100) NOT NULL,
      descricao TEXT,
      tipo contabilidade.tipo_conta NOT NULL,
      natureza contabilidade.natureza_conta NOT NULL,
      conta_pai_id UUID REFERENCES contabilidade.contas(id),
      permite_lancamentos BOOLEAN NOT NULL DEFAULT FALSE,
      ativo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      
      CONSTRAINT uk_contas_codigo_instituicao UNIQUE (instituicao_id, codigo)
    );
    
    -- Índices para melhor performance
    CREATE INDEX idx_contas_instituicao ON contabilidade.contas(instituicao_id);
    CREATE INDEX idx_contas_pai ON contabilidade.contas(conta_pai_id);
    
    RAISE NOTICE 'Tabela contabilidade.contas criada com sucesso';
  ELSE
    RAISE NOTICE 'Tabela contabilidade.contas já existe';
  END IF;
END $$;

---------------------------------------------
-- BLOCO 4: Criar função verificar_plano_contas_rh
---------------------------------------------
-- Função para verificar existência de plano de contas
CREATE OR REPLACE FUNCTION contabilidade.verificar_plano_contas_rh(
  p_instituicao_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, contabilidade
AS $$
DECLARE
  v_existe BOOLEAN := FALSE;
BEGIN
  -- Verificar se já existe alguma conta com código relacionado a RH
  SELECT EXISTS (
    SELECT 1 
    FROM contabilidade.contas 
    WHERE instituicao_id = p_instituicao_id 
      AND (
        codigo LIKE '3.1.1%' OR 
        codigo LIKE '3.1.2%' OR 
        codigo LIKE '2.1.3%' OR 
        codigo LIKE '2.1.4%'
      )
    LIMIT 1
  ) INTO v_existe;
  
  RETURN v_existe;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Erro ao verificar plano de contas: %', SQLERRM;
  RETURN FALSE;
END;
$$;

---------------------------------------------
-- BLOCO 5: Testar a função de verificação
---------------------------------------------
-- Obter uma instituição para teste (se existir)
SELECT id, nome 
FROM public.institutions
LIMIT 1;

-- Testar a função com uma instituição existente
-- Substitua o UUID pelo encontrado na consulta anterior
SELECT contabilidade.verificar_plano_contas_rh('COLOQUE-UM-UUID-AQUI'::UUID) AS ja_existe_plano_contas_rh;

---------------------------------------------
-- BLOCO 6: Criar a tabela pendencias_contabilizacao (se não existir)
---------------------------------------------
-- Verificar se o tipo pendência existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                 WHERE t.typname = 'tipo_pendencia' AND n.nspname = 'rh') THEN
    CREATE TYPE rh.tipo_pendencia AS ENUM (
      'FOLHA_PAGAMENTO', 'FERIAS', 'DECIMO_TERCEIRO', 'RESCISAO', 'BENEFICIOS'
    );
    RAISE NOTICE 'Tipo rh.tipo_pendencia criado com sucesso';
  ELSE
    RAISE NOTICE 'Tipo rh.tipo_pendencia já existe';
  END IF;
END $$;

-- Criar a tabela de pendências
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'rh' AND table_name = 'pendencias_contabilizacao') THEN
    CREATE TABLE rh.pendencias_contabilizacao (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
      tipo rh.tipo_pendencia NOT NULL,
      referencia_id UUID NOT NULL,
      mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
      ano INTEGER NOT NULL CHECK (ano >= 2000),
      valor DECIMAL(15,2) NOT NULL,
      detalhes JSONB,
      status rh.status_pendencia NOT NULL DEFAULT 'PENDENTE',
      data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data_processamento TIMESTAMPTZ,
      processado_por UUID REFERENCES auth.users(id),
      
      CONSTRAINT uk_pendencia_ref UNIQUE (instituicao_id, tipo, referencia_id, mes, ano)
    );
    
    -- Índices para melhor performance
    CREATE INDEX idx_pendencias_instituicao ON rh.pendencias_contabilizacao(instituicao_id);
    CREATE INDEX idx_pendencias_status ON rh.pendencias_contabilizacao(status);
    CREATE INDEX idx_pendencias_periodo ON rh.pendencias_contabilizacao(mes, ano);
    
    RAISE NOTICE 'Tabela rh.pendencias_contabilizacao criada com sucesso';
  ELSE
    RAISE NOTICE 'Tabela rh.pendencias_contabilizacao já existe';
  END IF;
END $$;

---------------------------------------------
-- BLOCO 7: Criar função gerar_plano_contas_rh
---------------------------------------------
-- Função para gerar plano de contas para RH
CREATE OR REPLACE FUNCTION contabilidade.gerar_plano_contas_rh(
  p_instituicao_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, contabilidade
AS $$
DECLARE
  v_resultado JSONB;
  v_conta_id UUID;
  v_ja_existente BOOLEAN := FALSE;
  v_inseridos INTEGER := 0;
  v_rejeitados INTEGER := 0;

  -- Estrutura de contas para RH
  v_contas_rh TEXT[][] := ARRAY[
    -- Apenas para demonstração, inclua apenas algumas contas aqui
    ARRAY['3', 'DESPESAS', 'SINTETICA', 'DEVEDORA', NULL],
    ARRAY['3.1', 'DESPESAS OPERACIONAIS', 'SINTETICA', 'DEVEDORA', '3'],
    ARRAY['3.1.1', 'DESPESAS COM PESSOAL', 'SINTETICA', 'DEVEDORA', '3.1']
    -- ... adicione mais contas conforme necessário
  ];
  
BEGIN
  -- Verificar se instituição existe
  IF NOT EXISTS (SELECT 1 FROM institutions WHERE id = p_instituicao_id) THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Instituição não encontrada',
      'dados', NULL
    );
  END IF;
  
  -- Verificar usando a função auxiliar
  v_ja_existente := contabilidade.verificar_plano_contas_rh(p_instituicao_id);
  
  IF v_ja_existente THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Plano de contas para RH já existe nesta instituição',
      'dados', NULL
    );
  END IF;
  
  -- Inserir apenas 3 contas para teste
  FOR i IN 1..array_length(v_contas_rh, 1) LOOP
    DECLARE
      v_codigo TEXT;
      v_nome TEXT;
      v_tipo TEXT;
      v_natureza TEXT;
      v_pai_codigo TEXT;
      v_pai_id UUID := NULL;
    BEGIN
      -- Atribuir valores do array
      v_codigo := v_contas_rh[i][1];
      v_nome := v_contas_rh[i][2];
      v_tipo := v_contas_rh[i][3];
      v_natureza := v_contas_rh[i][4];
      v_pai_codigo := v_contas_rh[i][5];
      
      -- Verificar se a conta já existe
      IF EXISTS (SELECT 1 FROM contabilidade.contas WHERE instituicao_id = p_instituicao_id AND codigo = v_codigo) THEN
        v_rejeitados := v_rejeitados + 1;
        CONTINUE;
      END IF;
      
      -- Se tiver pai, buscar o ID do pai
      IF v_pai_codigo IS NOT NULL THEN
        SELECT id INTO v_pai_id 
        FROM contabilidade.contas 
        WHERE instituicao_id = p_instituicao_id AND codigo = v_pai_codigo;
      END IF;
      
      -- Inserir a conta
      INSERT INTO contabilidade.contas (
        instituicao_id,
        codigo,
        nome,
        tipo,
        natureza,
        conta_pai_id,
        descricao,
        permite_lancamentos,
        ativo
      ) VALUES (
        p_instituicao_id,
        v_codigo,
        v_nome,
        v_tipo::contabilidade.tipo_conta,
        v_natureza::contabilidade.natureza_conta,
        v_pai_id,
        'Conta criada automaticamente para o módulo RH (teste)',
        CASE WHEN v_tipo = 'ANALITICA' THEN TRUE ELSE FALSE END,
        TRUE
      )
      RETURNING id INTO v_conta_id;
      
      v_inseridos := v_inseridos + 1;
    EXCEPTION WHEN OTHERS THEN
      -- Ignorar erros e continuar com a próxima conta
      v_rejeitados := v_rejeitados + 1;
      RAISE NOTICE 'Erro ao inserir conta %: %', v_codigo, SQLERRM;
    END;
  END LOOP;
  
  -- Construir resultado
  v_resultado := jsonb_build_object(
    'sucesso', TRUE,
    'mensagem', 'Plano de contas para RH (teste) gerado com sucesso',
    'dados', jsonb_build_object(
      'contas_inseridas', v_inseridos,
      'contas_rejeitados', v_rejeitados
    )
  );
  
  RETURN v_resultado;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'sucesso', FALSE,
    'mensagem', 'Erro ao gerar plano de contas para RH: ' || SQLERRM,
    'dados', NULL
  );
END;
$$;

---------------------------------------------
-- BLOCO 8: Testar a função gerar_plano_contas_rh
---------------------------------------------
-- Obter uma instituição para teste (se existir)
SELECT id, nome 
FROM public.institutions
LIMIT 1;

-- Executar a função com uma instituição (substitua o UUID)
SELECT contabilidade.gerar_plano_contas_rh('COLOQUE-UM-UUID-AQUI'::UUID);

-- Verificar as contas criadas
SELECT * FROM contabilidade.contas WHERE instituicao_id = 'COLOQUE-O-MESMO-UUID-AQUI'::UUID;

---------------------------------------------
-- BLOCO 9: Verificar se todas as migrações foram aplicadas
---------------------------------------------
-- Verificar schemas
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('contabilidade', 'rh');

-- Verificar tipos enumerados
SELECT n.nspname as schema,
       t.typname as tipo
FROM pg_type t
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname IN ('contabilidade', 'rh')
  AND t.typtype = 'e' -- tipo enum
ORDER BY schema, tipo;

-- Verificar tabelas
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema IN ('contabilidade', 'rh')
ORDER BY table_schema, table_name;

-- Verificar funções
SELECT routine_schema, routine_name
FROM information_schema.routines
WHERE routine_schema IN ('contabilidade', 'rh')
ORDER BY routine_schema, routine_name; 