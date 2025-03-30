-- Script para criar tipos enumerados necessários para a integração RH-Contabilidade
-- Executado por: Supabase CLI
-- Criado em: 2024-07-01

-- Criar schemas se não existirem
DO $$
BEGIN
  -- Criar schema contabilidade se não existir
  IF NOT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'contabilidade') THEN
    CREATE SCHEMA contabilidade;
  END IF;
  
  -- Criar schema rh se não existir
  IF NOT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'rh') THEN
    CREATE SCHEMA rh;
  END IF;
END $$;

-- Tipos enumerados para o schema contabilidade
DO $$
BEGIN
  -- Tipo de conta (sintética ou analítica)
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'tipo_conta' AND n.nspname = 'contabilidade') THEN
    CREATE TYPE contabilidade.tipo_conta AS ENUM ('SINTETICA', 'ANALITICA');
    COMMENT ON TYPE contabilidade.tipo_conta IS 'Tipo de conta contábil: sintética (grupo) ou analítica (lançamentos)';
  END IF;
  
  -- Natureza da conta (devedora ou credora)
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'natureza_conta' AND n.nspname = 'contabilidade') THEN
    CREATE TYPE contabilidade.natureza_conta AS ENUM ('DEVEDORA', 'CREDORA');
    COMMENT ON TYPE contabilidade.natureza_conta IS 'Natureza da conta contábil: devedora ou credora';
  END IF;
  
  -- Tipo de lançamento contábil
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'tipo_lancamento' AND n.nspname = 'contabilidade') THEN
    CREATE TYPE contabilidade.tipo_lancamento AS ENUM (
      'MANUAL', 
      'FOLHA_PAGAMENTO', 
      'PROVISAO_FERIAS', 
      'PROVISAO_13', 
      'BENEFICIOS', 
      'RESCISAO'
    );
    COMMENT ON TYPE contabilidade.tipo_lancamento IS 'Tipo de lançamento contábil: manual ou automatizado por origem';
  END IF;
  
  -- Status de integração
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'status_integracao' AND n.nspname = 'contabilidade') THEN
    CREATE TYPE contabilidade.status_integracao AS ENUM (
      'PENDENTE', 
      'PROCESSANDO', 
      'CONCLUIDO', 
      'ERRO'
    );
    COMMENT ON TYPE contabilidade.status_integracao IS 'Status da integração entre módulos';
  END IF;
  
  -- Tipo de relatório
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'tipo_relatorio' AND n.nspname = 'contabilidade') THEN
    CREATE TYPE contabilidade.tipo_relatorio AS ENUM (
      'BALANCETE', 
      'CUSTOS_PESSOAL', 
      'PROVISOES', 
      'ENCARGOS'
    );
    COMMENT ON TYPE contabilidade.tipo_relatorio IS 'Tipos de relatórios contábeis disponíveis';
  END IF;
END $$;

-- Tipos enumerados para o schema rh
DO $$
BEGIN
  -- Status da folha de pagamento
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'status_folha' AND n.nspname = 'rh') THEN
    CREATE TYPE rh.status_folha AS ENUM (
      'EM_ELABORACAO', 
      'AGUARDANDO_APROVACAO', 
      'APROVADA', 
      'PAGA', 
      'CONTABILIZADA', 
      'CANCELADA'
    );
    COMMENT ON TYPE rh.status_folha IS 'Status da folha de pagamento';
  END IF;
  
  -- Tipo de pendência para contabilização
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'tipo_pendencia' AND n.nspname = 'rh') THEN
    CREATE TYPE rh.tipo_pendencia AS ENUM (
      'FOLHA_PAGAMENTO', 
      'FERIAS', 
      'DECIMO_TERCEIRO', 
      'RESCISAO', 
      'BENEFICIOS'
    );
    COMMENT ON TYPE rh.tipo_pendencia IS 'Tipo de pendência para contabilização';
  END IF;
  
  -- Status de pendência
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'status_pendencia' AND n.nspname = 'rh') THEN
    CREATE TYPE rh.status_pendencia AS ENUM (
      'PENDENTE', 
      'EM_PROCESSAMENTO', 
      'PROCESSADA', 
      'ERRO'
    );
    COMMENT ON TYPE rh.status_pendencia IS 'Status da pendência de contabilização';
  END IF;
END $$;

-- [Fim do arquivo] 