-- Schema para o módulo Portal do Polo
-- Executado por: Supabase CLI
-- Criado em: 2024-04-20

--------------------------
-- Verificações Iniciais
--------------------------
DO $$ 
BEGIN
  -- Verificar se o schema já existe
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'polos') THEN
    RAISE NOTICE 'Schema polos já existe.';
  ELSE
    -- Criar o schema
    CREATE SCHEMA polos;
    RAISE NOTICE 'Schema polos criado com sucesso.';
  END IF;
END $$;

-- Definir o owner do schema
ALTER SCHEMA polos OWNER TO postgres;

--------------------------
-- Tipos Enumerados
--------------------------

-- Status do polo
CREATE TYPE polos.status_polo AS ENUM (
  'ativo',
  'inativo',
  'pendente',
  'suspenso'
);

-- Status do repasse
CREATE TYPE polos.status_repasse AS ENUM (
  'pendente',
  'processando',
  'pago',
  'cancelado',
  'estornado'
);

-- Tipo de comissão
CREATE TYPE polos.tipo_comissao AS ENUM (
  'matricula',
  'mensalidade',
  'certificacao',
  'material'
);

-- Tipo de contrato
CREATE TYPE polos.tipo_contrato AS ENUM (
  'parceria',
  'aditivo',
  'termo_adesao',
  'outros'
);

--------------------------
-- Tabelas
--------------------------

-- Tabela principal de polos
CREATE TABLE polos.polos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  cnpj VARCHAR(20) NOT NULL UNIQUE,
  inscricao_estadual VARCHAR(30),
  inscricao_municipal VARCHAR(30),
  endereco JSONB NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  site VARCHAR(255),
  status polos.status_polo NOT NULL DEFAULT 'pendente',
  responsavel_nome VARCHAR(255) NOT NULL,
  responsavel_cpf VARCHAR(14) NOT NULL,
  responsavel_email VARCHAR(255) NOT NULL,
  responsavel_telefone VARCHAR(20) NOT NULL,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  data_fim TIMESTAMP WITH TIME ZONE,
  logo_url TEXT,
  observacoes TEXT,
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de usuários do polo
CREATE TABLE polos.usuarios_polo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polo_id UUID NOT NULL REFERENCES polos.polos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id),
  perfil VARCHAR(30) NOT NULL DEFAULT 'atendente_polo',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (polo_id, usuario_id)
);

-- Vínculo entre alunos e polos
CREATE TABLE polos.alunos_polo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polo_id UUID NOT NULL REFERENCES polos.polos(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES auth.users(id),
  matricula_id UUID REFERENCES public.matriculas(id),
  curso_id UUID REFERENCES public.cursos(id),
  data_vinculo TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  captado_por UUID REFERENCES auth.users(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (aluno_id, matricula_id)
);

-- Tabela de comissões geradas para os polos
CREATE TABLE polos.comissoes_polos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polo_id UUID NOT NULL REFERENCES polos.polos(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES auth.users(id),
  matricula_id UUID REFERENCES public.matriculas(id),
  curso_id UUID REFERENCES public.cursos(id),
  pagamento_id UUID REFERENCES financeiro.pagamentos(id),
  valor DECIMAL(10,2) NOT NULL,
  percentual DECIMAL(5,2) NOT NULL,
  base_calculo DECIMAL(10,2) NOT NULL,
  tipo polos.tipo_comissao NOT NULL,
  data_referencia DATE NOT NULL,
  data_calculo TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status polos.status_repasse NOT NULL DEFAULT 'pendente',
  repasse_id UUID,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de repasses financeiros para polos
CREATE TABLE polos.repasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polo_id UUID NOT NULL REFERENCES polos.polos(id) ON DELETE CASCADE,
  valor_total DECIMAL(10,2) NOT NULL,
  quantidade_comissoes INTEGER NOT NULL,
  data_prevista DATE NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  numero_documento VARCHAR(50),
  status polos.status_repasse NOT NULL DEFAULT 'pendente',
  comprovante_url TEXT,
  observacoes TEXT,
  gerado_por UUID REFERENCES auth.users(id) NOT NULL,
  aprovado_por UUID REFERENCES auth.users(id),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Atualizar referência na tabela de comissões
ALTER TABLE polos.comissoes_polos
ADD CONSTRAINT fk_repasse
FOREIGN KEY (repasse_id) 
REFERENCES polos.repasses(id);

-- Tabela de contratos dos polos
CREATE TABLE polos.contratos_polos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polo_id UUID NOT NULL REFERENCES polos.polos(id) ON DELETE CASCADE,
  tipo polos.tipo_contrato NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  data_assinatura TIMESTAMP WITH TIME ZONE,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'pendente',
  assinado_por UUID REFERENCES auth.users(id),
  gerado_por UUID REFERENCES auth.users(id) NOT NULL,
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de regras de comissão por polo/curso
CREATE TABLE polos.regras_comissao_polo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polo_id UUID NOT NULL REFERENCES polos.polos(id) ON DELETE CASCADE,
  curso_id UUID REFERENCES public.cursos(id),
  tipo polos.tipo_comissao NOT NULL,
  percentual DECIMAL(5,2) NOT NULL,
  valor_fixo DECIMAL(10,2),
  descricao TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (polo_id, curso_id, tipo)
);

-- Tabela para relatórios e métricas
CREATE TABLE polos.relatorios_polo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polo_id UUID NOT NULL REFERENCES polos.polos(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  filtros JSONB,
  dados JSONB,
  tipo VARCHAR(50) NOT NULL,
  periodo_inicio DATE,
  periodo_fim DATE,
  gerado_por UUID REFERENCES auth.users(id) NOT NULL,
  publico BOOLEAN NOT NULL DEFAULT FALSE,
  url_acesso TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  instituicao_id UUID REFERENCES public.institutions(id) NOT NULL
);

-- Tabela de logs de atividades
CREATE TABLE polos.logs_atividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polo_id UUID REFERENCES polos.polos(id) ON DELETE SET NULL,
  usuario_id UUID REFERENCES auth.users(id),
  acao VARCHAR(50) NOT NULL,
  entidade_tipo VARCHAR(50) NOT NULL,
  entidade_id UUID NOT NULL,
  dados_antigos JSONB,
  dados_novos JSONB,
  ip_usuario VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

--------------------------
-- Índices
--------------------------

-- Índices para polos
CREATE INDEX idx_polos_instituicao ON polos.polos(instituicao_id);
CREATE INDEX idx_polos_status ON polos.polos(status);
CREATE INDEX idx_polos_cnpj ON polos.polos(cnpj);

-- Índices para usuários do polo
CREATE INDEX idx_usuarios_polo_polo_id ON polos.usuarios_polo(polo_id);
CREATE INDEX idx_usuarios_polo_usuario_id ON polos.usuarios_polo(usuario_id);

-- Índices para alunos do polo
CREATE INDEX idx_alunos_polo_polo_id ON polos.alunos_polo(polo_id);
CREATE INDEX idx_alunos_polo_aluno_id ON polos.alunos_polo(aluno_id);
CREATE INDEX idx_alunos_polo_matricula_id ON polos.alunos_polo(matricula_id);
CREATE INDEX idx_alunos_polo_curso_id ON polos.alunos_polo(curso_id);

-- Índices para comissões
CREATE INDEX idx_comissoes_polos_polo_id ON polos.comissoes_polos(polo_id);
CREATE INDEX idx_comissoes_polos_aluno_id ON polos.comissoes_polos(aluno_id);
CREATE INDEX idx_comissoes_polos_matricula_id ON polos.comissoes_polos(matricula_id);
CREATE INDEX idx_comissoes_polos_status ON polos.comissoes_polos(status);
CREATE INDEX idx_comissoes_polos_repasse_id ON polos.comissoes_polos(repasse_id);

-- Índices para repasses
CREATE INDEX idx_repasses_polo_id ON polos.repasses(polo_id);
CREATE INDEX idx_repasses_status ON polos.repasses(status);
CREATE INDEX idx_repasses_instituicao ON polos.repasses(instituicao_id);
CREATE INDEX idx_repasses_data_prevista ON polos.repasses(data_prevista);

-- Índices para contratos
CREATE INDEX idx_contratos_polos_polo_id ON polos.contratos_polos(polo_id);
CREATE INDEX idx_contratos_polos_instituicao ON polos.contratos_polos(instituicao_id);

-- Índices para regras de comissão
CREATE INDEX idx_regras_comissao_polo_id ON polos.regras_comissao_polo(polo_id);
CREATE INDEX idx_regras_comissao_curso_id ON polos.regras_comissao_polo(curso_id);
CREATE INDEX idx_regras_comissao_ativo ON polos.regras_comissao_polo(ativo);

-- Índices para relatórios
CREATE INDEX idx_relatorios_polo_id ON polos.relatorios_polo(polo_id);

-- Índices para logs
CREATE INDEX idx_logs_atividades_polo_id ON polos.logs_atividades(polo_id);
CREATE INDEX idx_logs_atividades_usuario_id ON polos.logs_atividades(usuario_id);
CREATE INDEX idx_logs_atividades_entidade ON polos.logs_atividades(entidade_tipo, entidade_id);

--------------------------
-- Funções e Triggers
--------------------------

-- Função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION polos.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar o campo updated_at automaticamente
CREATE TRIGGER set_updated_at_polos
BEFORE UPDATE ON polos.polos
FOR EACH ROW EXECUTE FUNCTION polos.set_updated_at();

CREATE TRIGGER set_updated_at_usuarios_polo
BEFORE UPDATE ON polos.usuarios_polo
FOR EACH ROW EXECUTE FUNCTION polos.set_updated_at();

CREATE TRIGGER set_updated_at_alunos_polo
BEFORE UPDATE ON polos.alunos_polo
FOR EACH ROW EXECUTE FUNCTION polos.set_updated_at();

CREATE TRIGGER set_updated_at_comissoes_polos
BEFORE UPDATE ON polos.comissoes_polos
FOR EACH ROW EXECUTE FUNCTION polos.set_updated_at();

CREATE TRIGGER set_updated_at_repasses
BEFORE UPDATE ON polos.repasses
FOR EACH ROW EXECUTE FUNCTION polos.set_updated_at();

CREATE TRIGGER set_updated_at_contratos_polos
BEFORE UPDATE ON polos.contratos_polos
FOR EACH ROW EXECUTE FUNCTION polos.set_updated_at();

CREATE TRIGGER set_updated_at_regras_comissao_polo
BEFORE UPDATE ON polos.regras_comissao_polo
FOR EACH ROW EXECUTE FUNCTION polos.set_updated_at();

-- Função para registrar logs de atividades
CREATE OR REPLACE FUNCTION polos.registrar_log_atividade()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO polos.logs_atividades (
    polo_id, 
    usuario_id, 
    acao, 
    entidade_tipo, 
    entidade_id,
    dados_antigos,
    dados_novos
  ) VALUES (
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.polo_id
      ELSE NEW.polo_id
    END,
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    CASE 
      WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
      WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)
      ELSE NULL
    END,
    CASE 
      WHEN TG_OP = 'DELETE' THEN NULL
      ELSE row_to_json(NEW)
    END
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para log em polos
CREATE TRIGGER log_polos_trigger
AFTER INSERT OR UPDATE OR DELETE ON polos.polos
FOR EACH ROW EXECUTE FUNCTION polos.registrar_log_atividade();

-- Trigger para log em contratos
CREATE TRIGGER log_contratos_polos_trigger
AFTER INSERT OR UPDATE OR DELETE ON polos.contratos_polos
FOR EACH ROW EXECUTE FUNCTION polos.registrar_log_atividade();

-- Trigger para log em repasses
CREATE TRIGGER log_repasses_trigger
AFTER INSERT OR UPDATE OR DELETE ON polos.repasses
FOR EACH ROW EXECUTE FUNCTION polos.registrar_log_atividade();

--------------------------
-- Row Level Security
--------------------------

-- Habilitar RLS
ALTER TABLE polos.polos ENABLE ROW LEVEL SECURITY;
ALTER TABLE polos.usuarios_polo ENABLE ROW LEVEL SECURITY;
ALTER TABLE polos.alunos_polo ENABLE ROW LEVEL SECURITY;
ALTER TABLE polos.comissoes_polos ENABLE ROW LEVEL SECURITY;
ALTER TABLE polos.repasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE polos.contratos_polos ENABLE ROW LEVEL SECURITY;
ALTER TABLE polos.regras_comissao_polo ENABLE ROW LEVEL SECURITY;
ALTER TABLE polos.relatorios_polo ENABLE ROW LEVEL SECURITY;
ALTER TABLE polos.logs_atividades ENABLE ROW LEVEL SECURITY;

-- Políticas para super_admin (acesso total)
CREATE POLICY admin_all_polos ON polos.polos
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_all_usuarios_polo ON polos.usuarios_polo
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_all_alunos_polo ON polos.alunos_polo
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_all_comissoes_polos ON polos.comissoes_polos
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_all_repasses ON polos.repasses
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_all_contratos_polos ON polos.contratos_polos
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_all_regras_comissao_polo ON polos.regras_comissao_polo
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_all_relatorios_polo ON polos.relatorios_polo
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_all_logs_atividades ON polos.logs_atividades
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'super_admin');

-- Políticas para admin_instituicao (políticas específicas)
CREATE POLICY instituicao_all_polos ON polos.polos
    FOR ALL TO authenticated 
    USING (
      auth.jwt() ->> 'role' = 'admin_instituicao' AND
      instituicao_id = (
        SELECT instituicao_id FROM profiles 
        WHERE id = auth.uid()
      )
    );

-- Políticas para admin_polo e atendente_polo
CREATE POLICY polo_view_own_polo ON polos.polos
    FOR SELECT TO authenticated 
    USING (
      EXISTS (
        SELECT 1 FROM polos.usuarios_polo up
        WHERE up.polo_id = polos.polos.id
        AND up.usuario_id = auth.uid()
        AND up.ativo = true
      )
    );

CREATE POLICY polo_view_own_alunos ON polos.alunos_polo
    FOR SELECT TO authenticated 
    USING (
      EXISTS (
        SELECT 1 FROM polos.usuarios_polo up
        WHERE up.polo_id = polos.alunos_polo.polo_id
        AND up.usuario_id = auth.uid()
        AND up.ativo = true
      )
    );

CREATE POLICY polo_view_own_comissoes ON polos.comissoes_polos
    FOR SELECT TO authenticated 
    USING (
      EXISTS (
        SELECT 1 FROM polos.usuarios_polo up
        WHERE up.polo_id = polos.comissoes_polos.polo_id
        AND up.usuario_id = auth.uid()
        AND up.ativo = true
      )
    );

CREATE POLICY polo_view_own_repasses ON polos.repasses
    FOR SELECT TO authenticated 
    USING (
      EXISTS (
        SELECT 1 FROM polos.usuarios_polo up
        WHERE up.polo_id = polos.repasses.polo_id
        AND up.usuario_id = auth.uid()
        AND up.ativo = true
      )
    );

CREATE POLICY polo_view_own_contratos ON polos.contratos_polos
    FOR SELECT TO authenticated 
    USING (
      EXISTS (
        SELECT 1 FROM polos.usuarios_polo up
        WHERE up.polo_id = polos.contratos_polos.polo_id
        AND up.usuario_id = auth.uid()
        AND up.ativo = true
      )
    );

CREATE POLICY polo_view_own_regras ON polos.regras_comissao_polo
    FOR SELECT TO authenticated 
    USING (
      EXISTS (
        SELECT 1 FROM polos.usuarios_polo up
        WHERE up.polo_id = polos.regras_comissao_polo.polo_id
        AND up.usuario_id = auth.uid()
        AND up.ativo = true
      )
    );

CREATE POLICY polo_view_own_relatorios ON polos.relatorios_polo
    FOR SELECT TO authenticated 
    USING (
      EXISTS (
        SELECT 1 FROM polos.usuarios_polo up
        WHERE up.polo_id = polos.relatorios_polo.polo_id
        AND up.usuario_id = auth.uid()
        AND up.ativo = true
      ) OR 
      publico = true
    );

--------------------------
-- Visões (Views)
--------------------------

-- Visão para dashboard do polo
CREATE VIEW polos.vw_dashboard_polo AS
SELECT 
  p.id AS polo_id,
  p.nome AS polo_nome,
  COUNT(DISTINCT ap.aluno_id) AS total_alunos,
  COUNT(DISTINCT CASE WHEN m.status = 'ativa' THEN ap.aluno_id END) AS alunos_ativos,
  COUNT(DISTINCT CASE WHEN m.status = 'pendente' THEN ap.aluno_id END) AS alunos_pendentes,
  COUNT(DISTINCT CASE WHEN m.status = 'cancelada' THEN ap.aluno_id END) AS alunos_cancelados,
  COUNT(DISTINCT CASE WHEN m.status = 'trancada' THEN ap.aluno_id END) AS alunos_trancados,
  SUM(CASE WHEN cp.status = 'pendente' THEN cp.valor ELSE 0 END) AS comissoes_pendentes,
  SUM(CASE WHEN cp.status = 'pago' THEN cp.valor ELSE 0 END) AS comissoes_pagas,
  COUNT(DISTINCT CASE WHEN r.status = 'pendente' THEN r.id END) AS repasses_pendentes,
  COUNT(DISTINCT CASE WHEN r.status = 'pago' THEN r.id END) AS repasses_realizados
FROM polos.polos p
LEFT JOIN polos.alunos_polo ap ON p.id = ap.polo_id
LEFT JOIN public.matriculas m ON ap.matricula_id = m.id
LEFT JOIN polos.comissoes_polos cp ON p.id = cp.polo_id
LEFT JOIN polos.repasses r ON p.id = r.polo_id
GROUP BY p.id, p.nome;

-- Visão de relatório financeiro por polo
CREATE VIEW polos.vw_financeiro_polo AS
SELECT 
  p.id AS polo_id,
  p.nome AS polo_nome,
  c.id AS curso_id,
  c.nome AS curso_nome,
  EXTRACT(MONTH FROM cp.data_referencia) AS mes,
  EXTRACT(YEAR FROM cp.data_referencia) AS ano,
  SUM(cp.valor) AS valor_comissoes,
  COUNT(DISTINCT cp.aluno_id) AS qtd_alunos,
  cp.tipo,
  cp.status
FROM polos.polos p
JOIN polos.comissoes_polos cp ON p.id = cp.polo_id
JOIN public.cursos c ON cp.curso_id = c.id
GROUP BY p.id, p.nome, c.id, c.nome, mes, ano, cp.tipo, cp.status;

-- Visão para histórico de repasses
CREATE VIEW polos.vw_historico_repasses AS
SELECT 
  r.id AS repasse_id,
  p.id AS polo_id,
  p.nome AS polo_nome,
  r.valor_total,
  r.quantidade_comissoes,
  r.data_prevista,
  r.data_pagamento,
  r.status,
  u1.email AS gerado_por_email,
  u2.email AS aprovado_por_email,
  r.created_at
FROM polos.repasses r
JOIN polos.polos p ON r.polo_id = p.id
JOIN auth.users u1 ON r.gerado_por = u1.id
LEFT JOIN auth.users u2 ON r.aprovado_por = u2.id
ORDER BY r.created_at DESC; 