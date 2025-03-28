-- Schema para o Portal do Aluno - Parte 1: Estrutura de Tabelas
-- Executado por: Supabase CLI
-- Criado em: 2024-03-30
-- IMPORTANTE: Este script depende do schema conteudo que deve ser criado primeiro

----------------
-- Verificação prévia
----------------
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'conteudo') THEN
    RAISE EXCEPTION 'O schema "conteudo" não existe. Execute o script do módulo material_didatico primeiro.';
  END IF;
END $$;

----------------
-- Criar schema
----------------
CREATE SCHEMA IF NOT EXISTS portal_aluno;

-- Atribuir propriedade ao postgres (necessário para o Supabase)
ALTER SCHEMA portal_aluno OWNER TO postgres;

--------------------
-- Tipos enumerados
--------------------

-- Tipo para status de documentos
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'documento_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'portal_aluno')) THEN
    CREATE TYPE portal_aluno.documento_status AS ENUM (
      'pendente',
      'aprovado',
      'rejeitado',
      'em_analise'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'certificado_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'portal_aluno')) THEN
    CREATE TYPE portal_aluno.certificado_status AS ENUM (
      'disponivel',
      'indisponivel',
      'solicitado',
      'emitido',
      'enviado',
      'cancelado'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'motivo_bloqueio' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'portal_aluno')) THEN
    CREATE TYPE portal_aluno.motivo_bloqueio AS ENUM (
      'inadimplencia',
      'documentacao_pendente',
      'administrativo',
      'suspensao_temporaria',
      'inatividade'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_conteudo' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'portal_aluno')) THEN
    CREATE TYPE portal_aluno.tipo_conteudo AS ENUM (
      'aula',
      'video',
      'documento',
      'quiz',
      'tarefa',
      'forum',
      'material_complementar'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'progresso_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'portal_aluno')) THEN
    CREATE TYPE portal_aluno.progresso_status AS ENUM (
      'nao_iniciado',
      'em_progresso',
      'concluido',
      'atrasado',
      'cancelado'
    );
  END IF;
END $$;

----------------------
-- Criação de tabelas
----------------------

-- Tabela de perfil do aluno (complemento aos dados gerais do usuário)
CREATE TABLE IF NOT EXISTS portal_aluno.perfil_aluno (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  matricula_id UUID REFERENCES public.matriculas(id),
  foto_url TEXT,
  bio TEXT,
  telefone VARCHAR(20),
  data_nascimento DATE,
  endereco JSONB DEFAULT '{}'::jsonb,
  preferencias JSONB DEFAULT '{}'::jsonb,
  links_sociais JSONB DEFAULT '{}'::jsonb,
  ultimo_acesso TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de progresso de conteúdo
CREATE TABLE IF NOT EXISTS portal_aluno.progresso_conteudo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  disciplina_id UUID REFERENCES conteudo.disciplinas(id) ON DELETE CASCADE,
  aula_id UUID REFERENCES conteudo.aulas(id) ON DELETE CASCADE,
  tipo portal_aluno.tipo_conteudo NOT NULL,
  status portal_aluno.progresso_status DEFAULT 'nao_iniciado',
  porcentagem_concluida INTEGER DEFAULT 0,
  nota DECIMAL(5,2),
  tempo_gasto INTEGER, -- em segundos
  ultima_interacao TIMESTAMPTZ,
  data_conclusao TIMESTAMPTZ,
  metadados JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(aluno_id, aula_id)
);

-- Tabela de documentos do aluno
CREATE TABLE IF NOT EXISTS portal_aluno.documentos_aluno (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo VARCHAR(100) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  status portal_aluno.documento_status DEFAULT 'pendente',
  feedback TEXT,
  revisado_por UUID REFERENCES auth.users(id),
  data_revisao TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de certificados
CREATE TABLE IF NOT EXISTS portal_aluno.certificados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  codigo_validacao VARCHAR(100) UNIQUE,
  data_solicitacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_emissao TIMESTAMPTZ,
  data_envio TIMESTAMPTZ,
  status portal_aluno.certificado_status DEFAULT 'indisponivel',
  url_certificado TEXT,
  motivo_indisponibilidade TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de bloqueios de acesso
CREATE TABLE IF NOT EXISTS portal_aluno.bloqueios_acesso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  motivo portal_aluno.motivo_bloqueio NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_fim TIMESTAMPTZ,
  ativo BOOLEAN DEFAULT TRUE,
  criado_por UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de atividades do aluno (histórico de uso)
CREATE TABLE IF NOT EXISTS portal_aluno.atividades_aluno (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  descricao TEXT NOT NULL,
  pagina VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de gamificação (pontos e conquistas)
CREATE TABLE IF NOT EXISTS portal_aluno.gamificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pontos INTEGER DEFAULT 0,
  nivel INTEGER DEFAULT 1,
  medalhas JSONB DEFAULT '[]'::jsonb,
  conquistas JSONB DEFAULT '[]'::jsonb,
  historico_pontos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(aluno_id)
);

---------------------------------
-- Índices para melhor performance
---------------------------------
CREATE INDEX IF NOT EXISTS idx_perfil_aluno_matricula ON portal_aluno.perfil_aluno(matricula_id);
CREATE INDEX IF NOT EXISTS idx_progresso_aluno ON portal_aluno.progresso_conteudo(aluno_id);
CREATE INDEX IF NOT EXISTS idx_progresso_curso ON portal_aluno.progresso_conteudo(curso_id);
CREATE INDEX IF NOT EXISTS idx_progresso_aula ON portal_aluno.progresso_conteudo(aula_id);
CREATE INDEX IF NOT EXISTS idx_progresso_status ON portal_aluno.progresso_conteudo(status);
CREATE INDEX IF NOT EXISTS idx_documentos_aluno ON portal_aluno.documentos_aluno(aluno_id);
CREATE INDEX IF NOT EXISTS idx_documentos_status ON portal_aluno.documentos_aluno(status);
CREATE INDEX IF NOT EXISTS idx_certificados_aluno ON portal_aluno.certificados(aluno_id);
CREATE INDEX IF NOT EXISTS idx_certificados_curso ON portal_aluno.certificados(curso_id);
CREATE INDEX IF NOT EXISTS idx_certificados_status ON portal_aluno.certificados(status);
CREATE INDEX IF NOT EXISTS idx_bloqueios_aluno ON portal_aluno.bloqueios_acesso(aluno_id);
CREATE INDEX IF NOT EXISTS idx_bloqueios_ativo ON portal_aluno.bloqueios_acesso(ativo);
CREATE INDEX IF NOT EXISTS idx_atividades_aluno ON portal_aluno.atividades_aluno(aluno_id);
CREATE INDEX IF NOT EXISTS idx_atividades_tipo ON portal_aluno.atividades_aluno(tipo);
CREATE INDEX IF NOT EXISTS idx_gamificacao_aluno ON portal_aluno.gamificacao(aluno_id);
CREATE INDEX IF NOT EXISTS idx_gamificacao_nivel ON portal_aluno.gamificacao(nivel);

-------------------------------
-- Habilitar RLS em todas as tabelas
-------------------------------
ALTER TABLE portal_aluno.perfil_aluno ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_aluno.progresso_conteudo ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_aluno.documentos_aluno ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_aluno.certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_aluno.bloqueios_acesso ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_aluno.atividades_aluno ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_aluno.gamificacao ENABLE ROW LEVEL SECURITY;

-------------------------------
-- Funções e Triggers
-------------------------------

-- Função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION portal_aluno.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para perfil_aluno
CREATE TRIGGER update_perfil_aluno_updated_at
BEFORE UPDATE ON portal_aluno.perfil_aluno
FOR EACH ROW
EXECUTE FUNCTION portal_aluno.update_updated_at_column();

-- Trigger para progresso_conteudo
CREATE TRIGGER update_progresso_conteudo_updated_at
BEFORE UPDATE ON portal_aluno.progresso_conteudo
FOR EACH ROW
EXECUTE FUNCTION portal_aluno.update_updated_at_column();

-- Trigger para documentos_aluno
CREATE TRIGGER update_documentos_aluno_updated_at
BEFORE UPDATE ON portal_aluno.documentos_aluno
FOR EACH ROW
EXECUTE FUNCTION portal_aluno.update_updated_at_column();

-- Trigger para certificados
CREATE TRIGGER update_certificados_updated_at
BEFORE UPDATE ON portal_aluno.certificados
FOR EACH ROW
EXECUTE FUNCTION portal_aluno.update_updated_at_column();

-- Trigger para bloqueios_acesso
CREATE TRIGGER update_bloqueios_acesso_updated_at
BEFORE UPDATE ON portal_aluno.bloqueios_acesso
FOR EACH ROW
EXECUTE FUNCTION portal_aluno.update_updated_at_column();

-- Trigger para gamificacao
CREATE TRIGGER update_gamificacao_updated_at
BEFORE UPDATE ON portal_aluno.gamificacao
FOR EACH ROW
EXECUTE FUNCTION portal_aluno.update_updated_at_column();

-- Função para criar perfil de aluno automaticamente
CREATE OR REPLACE FUNCTION portal_aluno.create_perfil_aluno()
RETURNS TRIGGER AS $$
BEGIN
  -- Verifica se o usuário é do tipo aluno
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = NEW.id AND role::text = 'aluno'
  ) THEN
    INSERT INTO portal_aluno.perfil_aluno (id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil de aluno automaticamente
DROP TRIGGER IF EXISTS on_user_created_portal_aluno ON public.profiles;
CREATE TRIGGER on_user_created_portal_aluno
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION portal_aluno.create_perfil_aluno();

-- Função para registrar atividade do aluno
CREATE OR REPLACE FUNCTION portal_aluno.register_activity(
  p_aluno_id UUID,
  p_tipo VARCHAR,
  p_descricao TEXT,
  p_pagina VARCHAR DEFAULT NULL,
  p_ip_address VARCHAR DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO portal_aluno.atividades_aluno (
    aluno_id, 
    tipo, 
    descricao, 
    pagina, 
    ip_address,
    user_agent
  ) VALUES (
    p_aluno_id,
    p_tipo,
    p_descricao,
    p_pagina,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar elegibilidade para certificado
CREATE OR REPLACE FUNCTION portal_aluno.verificar_elegibilidade_certificado(
  p_aluno_id UUID,
  p_curso_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_elegivel BOOLEAN := FALSE;
  v_total_conteudos INTEGER;
  v_concluidos INTEGER;
  v_media DECIMAL;
  v_inadimplente BOOLEAN;
  v_docs_pendentes BOOLEAN;
BEGIN
  -- Verificar conclusão de conteúdos
  SELECT 
    COUNT(*) AS total,
    SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) AS concluidos
  INTO v_total_conteudos, v_concluidos
  FROM portal_aluno.progresso_conteudo
  WHERE aluno_id = p_aluno_id 
  AND curso_id = p_curso_id;
  
  -- Verificar média de notas
  SELECT COALESCE(AVG(nota), 0)
  INTO v_media
  FROM portal_aluno.progresso_conteudo
  WHERE aluno_id = p_aluno_id 
  AND curso_id = p_curso_id
  AND nota IS NOT NULL;
  
  -- Verificar situação financeira (simplificado)
  SELECT EXISTS (
    SELECT 1 FROM public.pagamentos p
    JOIN public.matriculas m ON p.matricula_id = m.id
    WHERE m.aluno_id = p_aluno_id
    AND m.curso_id = p_curso_id
    AND p.status = 'pendente'
    AND p.data_vencimento < CURRENT_DATE - INTERVAL '30 days'
  ) INTO v_inadimplente;
  
  -- Verificar documentação pendente
  SELECT EXISTS (
    SELECT 1 FROM portal_aluno.documentos_aluno
    WHERE aluno_id = p_aluno_id
    AND status IN ('pendente', 'rejeitado')
  ) INTO v_docs_pendentes;
  
  -- Verificar elegibilidade
  IF (v_concluidos > 0 AND v_total_conteudos > 0 AND 
      (v_concluidos::FLOAT / v_total_conteudos::FLOAT) >= 0.7 AND
      v_media >= 70 AND
      NOT v_inadimplente AND
      NOT v_docs_pendentes) THEN
    v_elegivel := TRUE;
  END IF;
  
  RETURN v_elegivel;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-------------------------------
-- Storage Buckets
-------------------------------

-- Bucket para documentos de alunos
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos_aluno', 'Documentos de alunos', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket para certificados
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificados', 'Certificados emitidos', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket para fotos de perfil de alunos
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos_aluno', 'Fotos de perfil de alunos', true)
ON CONFLICT (id) DO NOTHING; 