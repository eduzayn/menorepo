-- Schema para o módulo Financeiro Empresarial - Parte 1
-- Executado por: Supabase CLI
-- Criado em: 2024-04-01

--------------------------
-- Verificações Iniciais
--------------------------
DO $$ 
BEGIN
  -- Verificar se o schema já existe
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'financeiro') THEN
    RAISE NOTICE 'Schema financeiro já existe.';
  ELSE
    -- Criar o schema
    CREATE SCHEMA financeiro;
    RAISE NOTICE 'Schema financeiro criado com sucesso.';
  END IF;
END $$;

-- Definir o owner do schema
ALTER SCHEMA financeiro OWNER TO postgres;

--------------------------
-- Tipos Enumerados
--------------------------

-- Tipo de status para cobrança
CREATE TYPE financeiro.status_cobranca AS ENUM (
  'pendente',
  'pago',
  'vencido',
  'cancelado'
);

-- Tipo de cobrança
CREATE TYPE financeiro.tipo_cobranca AS ENUM (
  'mensalidade',
  'taxa',
  'material',
  'uniforme',
  'outro'
);

-- Métodos de pagamento
CREATE TYPE financeiro.metodo_pagamento AS ENUM (
  'pix',
  'boleto',
  'cartao',
  'transferencia',
  'dinheiro'
);

-- Gateways de pagamento
CREATE TYPE financeiro.gateway_pagamento AS ENUM (
  'littex',
  'infinitepay',
  'manual'
);

-- Categorias financeiras
CREATE TYPE financeiro.categoria_financeira AS ENUM (
  'mensalidade',
  'matricula',
  'taxa',
  'multa',
  'desconto',
  'comissao',
  'salario',
  'aluguel',
  'servico',
  'marketing',
  'outros'
);

-- Status para pagamentos
CREATE TYPE financeiro.status_pagamento AS ENUM (
  'confirmado',
  'pendente',
  'cancelado',
  'estornado'
);

-- Tipo de beneficiário para comissões
CREATE TYPE financeiro.tipo_beneficiario AS ENUM (
  'polo',
  'consultor'
);

-- Tipo de aplicação de taxa
CREATE TYPE financeiro.tipo_aplicacao_taxa AS ENUM (
  'matricula',
  'mensalidade',
  'material',
  'certificado',
  'todas'
);

-- Tipo de lançamento financeiro
CREATE TYPE financeiro.tipo_lancamento AS ENUM (
  'entrada',
  'saida'
);

-- Tipo de destinatário
CREATE TYPE financeiro.tipo_destinatario AS ENUM (
  'aluno',
  'polo',
  'consultor',
  'fornecedor'
);

-- Tipo de entidade para logs
CREATE TYPE financeiro.tipo_entidade AS ENUM (
  'cobranca',
  'pagamento',
  'comissao',
  'taxa'
);

-- Tipo de ação para logs
CREATE TYPE financeiro.tipo_acao AS ENUM (
  'criacao',
  'alteracao',
  'cancelamento',
  'estorno',
  'pagamento'
);

-- Ambiente do gateway
CREATE TYPE financeiro.ambiente_gateway AS ENUM (
  'producao',
  'teste'
);

-- Status para instituição
CREATE TYPE financeiro.status_instituicao AS ENUM (
  'ativo',
  'inativo',
  'pendente'
);

--------------------------
-- Tabelas
--------------------------

-- Tabela de cobrancas
CREATE TABLE financeiro.cobrancas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id),
  matricula_id UUID REFERENCES public.matriculas(id),
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  status financeiro.status_cobranca NOT NULL DEFAULT 'pendente',
  tipo financeiro.tipo_cobranca NOT NULL,
  forma_pagamento financeiro.metodo_pagamento,
  gateway financeiro.gateway_pagamento,
  url_pagamento TEXT,
  codigo_barras TEXT,
  qrcode_pix TEXT,
  taxa_gateway DECIMAL(10,2),
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  descricao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pagamentos
CREATE TABLE financeiro.pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cobranca_id UUID REFERENCES financeiro.cobrancas(id),
  tipo financeiro.tipo_lancamento NOT NULL,
  categoria financeiro.categoria_financeira NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  forma_pagamento financeiro.metodo_pagamento NOT NULL,
  status financeiro.status_pagamento NOT NULL DEFAULT 'pendente',
  destinatario_id UUID,
  destinatario_tipo financeiro.tipo_destinatario,
  descricao TEXT NOT NULL,
  comprovante_url TEXT,
  codigo_transacao TEXT,
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  criado_por UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comissões
CREATE TABLE financeiro.comissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id UUID REFERENCES auth.users(id) NOT NULL,
  colaborador_nome TEXT NOT NULL,
  pagamento_id UUID REFERENCES financeiro.pagamentos(id),
  cobranca_id UUID REFERENCES financeiro.cobrancas(id),
  valor DECIMAL(10,2) NOT NULL,
  percentual DECIMAL(5,2) NOT NULL,
  base_calculo DECIMAL(10,2) NOT NULL,
  data_referencia DATE NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  status financeiro.status_cobranca NOT NULL DEFAULT 'pendente',
  regra_comissao_id UUID,
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de taxas administrativas
CREATE TABLE financeiro.taxas_administrativas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  valor DECIMAL(10,2),
  percentual DECIMAL(5,2),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  aplicacao financeiro.tipo_aplicacao_taxa NOT NULL,
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  criado_por UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valor_ou_percentual CHECK (
    (valor IS NOT NULL AND percentual IS NULL) OR
    (valor IS NULL AND percentual IS NOT NULL)
  )
);

-- Tabela de logs financeiros
CREATE TABLE financeiro.logs_financeiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade_tipo financeiro.tipo_entidade NOT NULL,
  entidade_id UUID NOT NULL,
  acao financeiro.tipo_acao NOT NULL,
  valor_anterior JSONB,
  valor_novo JSONB,
  usuario_id UUID REFERENCES auth.users(id) NOT NULL,
  ip_usuario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configuração de gateways
CREATE TABLE financeiro.configuracao_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway financeiro.gateway_pagamento NOT NULL,
  chave_api TEXT,
  token_secreto TEXT,
  ambiente financeiro.ambiente_gateway NOT NULL DEFAULT 'teste',
  webhook_url TEXT,
  taxa_percentual DECIMAL(5,2),
  taxa_fixa DECIMAL(10,2),
  padrao_para TEXT[] NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT FALSE,
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de regras de comissão
CREATE TABLE financeiro.regras_comissao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_beneficiario financeiro.tipo_beneficiario NOT NULL,
  curso_id UUID REFERENCES public.cursos(id),
  valor_fixo DECIMAL(10,2),
  percentual DECIMAL(5,2),
  recorrente BOOLEAN NOT NULL DEFAULT FALSE,
  parcelas_aplicaveis INTEGER[],
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valor_ou_percentual CHECK (
    (valor_fixo IS NOT NULL AND percentual IS NULL) OR
    (valor_fixo IS NULL AND percentual IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_cobrancas_aluno ON financeiro.cobrancas(aluno_id);
CREATE INDEX idx_cobrancas_instituicao ON financeiro.cobrancas(instituicao_id);
CREATE INDEX idx_cobrancas_status ON financeiro.cobrancas(status);
CREATE INDEX idx_cobrancas_data_vencimento ON financeiro.cobrancas(data_vencimento);

CREATE INDEX idx_pagamentos_cobranca ON financeiro.pagamentos(cobranca_id);
CREATE INDEX idx_pagamentos_instituicao ON financeiro.pagamentos(instituicao_id);
CREATE INDEX idx_pagamentos_status ON financeiro.pagamentos(status);
CREATE INDEX idx_pagamentos_data ON financeiro.pagamentos(data_pagamento);

CREATE INDEX idx_comissoes_colaborador ON financeiro.comissoes(colaborador_id);
CREATE INDEX idx_comissoes_status ON financeiro.comissoes(status);
CREATE INDEX idx_comissoes_instituicao ON financeiro.comissoes(instituicao_id);

CREATE INDEX idx_taxas_instituicao ON financeiro.taxas_administrativas(instituicao_id);
CREATE INDEX idx_taxas_aplicacao ON financeiro.taxas_administrativas(aplicacao);

CREATE INDEX idx_logs_entidade ON financeiro.logs_financeiros(entidade_tipo, entidade_id);
CREATE INDEX idx_logs_usuario ON financeiro.logs_financeiros(usuario_id);

CREATE INDEX idx_regras_comissao_beneficiario ON financeiro.regras_comissao(tipo_beneficiario);
CREATE INDEX idx_regras_comissao_curso ON financeiro.regras_comissao(curso_id); 