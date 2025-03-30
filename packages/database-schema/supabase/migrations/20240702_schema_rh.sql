-- Schema para o módulo RH (Recursos Humanos)
-- Executado por: Supabase CLI
-- Criado em: 2024-07-02

--------------------------
-- Verificações Iniciais
--------------------------
DO $$ 
BEGIN
  -- Verificar se o schema já existe
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'rh') THEN
    -- Criar o schema
    CREATE SCHEMA rh;
    RAISE NOTICE 'Schema RH criado com sucesso.';
  ELSE
    RAISE NOTICE 'Schema RH já existe.';
  END IF;
END $$;

-- Definir o owner do schema
ALTER SCHEMA rh OWNER TO postgres;

--------------------------
-- Tipos Enumerados
--------------------------

-- Tipo de contrato
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_contrato' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'rh')) THEN
    CREATE TYPE rh.tipo_contrato AS ENUM (
      'CLT',
      'PJ',
      'AUTONOMO',
      'ESTAGIO',
      'TEMPORARIO',
      'TERCEIRIZADO'
    );
  END IF;
END $$;

-- Status do colaborador
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_colaborador' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'rh')) THEN
    CREATE TYPE rh.status_colaborador AS ENUM (
      'ATIVO',
      'INATIVO',
      'FERIAS',
      'LICENCA',
      'AFASTADO',
      'DESLIGADO'
    );
  END IF;
END $$;

-- [Outros tipos enumerados omitidos por brevidade]

--------------------------
-- Tabelas Principais
--------------------------

-- Departamentos
CREATE TABLE IF NOT EXISTS rh.departamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  codigo VARCHAR(20),
  descricao TEXT,
  responsavel_id UUID REFERENCES auth.users(id),
  departamento_pai_id UUID REFERENCES rh.departamentos(id),
  centro_custo_id UUID,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cargos
CREATE TABLE IF NOT EXISTS rh.cargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  codigo VARCHAR(20),
  tipo rh.tipo_cargo NOT NULL,
  descricao TEXT,
  salario_base DECIMAL(10,2),
  carga_horaria_semanal INTEGER,
  requisitos TEXT,
  atribuicoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [Outras tabelas omitidas por brevidade]

--------------------------
-- Índices
--------------------------

-- Índices para colaboradores
CREATE INDEX IF NOT EXISTS idx_colaboradores_instituicao ON rh.colaboradores(instituicao_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_usuario ON rh.colaboradores(usuario_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_departamento ON rh.colaboradores(departamento_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_cargo ON rh.colaboradores(cargo_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_status ON rh.colaboradores(status);

-- [Outros índices omitidos por brevidade]

--------------------------
-- Comentários
--------------------------

COMMENT ON SCHEMA rh IS 'Schema para o módulo de Recursos Humanos da plataforma Edunéxia';
COMMENT ON TABLE rh.departamentos IS 'Departamentos da instituição';
COMMENT ON TABLE rh.cargos IS 'Cargos disponíveis na instituição';

-- [Fim do arquivo] 