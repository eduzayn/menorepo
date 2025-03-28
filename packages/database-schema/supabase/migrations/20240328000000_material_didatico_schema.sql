-- Schema for material didático module
-- Executed by Supabase CLI on production migration
-- Created: 2024-03-28

-----------------------
-- Verificação prévia
-----------------------
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'conteudo') THEN
    RAISE NOTICE 'Schema conteudo já existe, alguns comandos serão ignorados';
  END IF;
END $$;

-----------------------
-- Criação do schema
-----------------------
CREATE SCHEMA IF NOT EXISTS conteudo;

-- Atribuir propriedade ao postgres (necessário para o Supabase)
ALTER SCHEMA conteudo OWNER TO postgres;

-----------------------
-- Tipos enumerados
-----------------------
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_recurso' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'conteudo')) THEN
    CREATE TYPE conteudo.tipo_recurso AS ENUM ('curso', 'disciplina', 'aula');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permissao' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'conteudo')) THEN
    CREATE TYPE conteudo.permissao AS ENUM ('leitura', 'edicao', 'revisao', 'publicacao');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_conteudo' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'conteudo')) THEN
    CREATE TYPE conteudo.status_conteudo AS ENUM ('rascunho', 'revisao', 'aprovado', 'publicado', 'arquivado', 'ativo', 'inativo');
  END IF;
END $$;

-------------------
-- Create tables --
-------------------

-- Cursos (Courses)
CREATE TABLE IF NOT EXISTS conteudo.cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  carga_horaria INTEGER NOT NULL DEFAULT 0,
  codigo TEXT NOT NULL UNIQUE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'revisao', 'aprovado', 'publicado', 'arquivado', 'ativo', 'inativo')),
  instituicao_id UUID NOT NULL,
  coordenador_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Adicionar constraint foreign key após verificar se a tabela existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'institutions') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conrelid = 'conteudo.cursos'::regclass::oid 
      AND conname = 'cursos_instituicao_id_fkey'
    ) THEN
      ALTER TABLE conteudo.cursos 
      ADD CONSTRAINT cursos_instituicao_id_fkey 
      FOREIGN KEY (instituicao_id) REFERENCES public.institutions(id);
    END IF;
  END IF;
  
  -- Atualizar constraint no mapeamento de cursos para referenciar conteudo.cursos
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mapeamento_cursos') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conrelid = 'public.mapeamento_cursos'::regclass::oid 
      AND conname = 'mapeamento_cursos_curso_conteudo_id_fkey'
    ) THEN
      ALTER TABLE public.mapeamento_cursos 
      ADD CONSTRAINT mapeamento_cursos_curso_conteudo_id_fkey 
      FOREIGN KEY (curso_conteudo_id) REFERENCES conteudo.cursos(id);
    END IF;
  END IF;
END $$;

-- Disciplinas (Subjects)
CREATE TABLE IF NOT EXISTS conteudo.disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  codigo TEXT NOT NULL,
  curso_id UUID NOT NULL REFERENCES conteudo.cursos(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'revisao', 'aprovado', 'publicado', 'arquivado', 'ativo', 'inativo'))
);

-- Aulas (Lessons)
CREATE TABLE IF NOT EXISTS conteudo.aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  disciplina_id UUID NOT NULL REFERENCES conteudo.disciplinas(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 0,
  conteudo JSONB NOT NULL DEFAULT '[]'::JSONB,
  objetivos TEXT[] DEFAULT '{}'::TEXT[],
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'revisao', 'aprovado', 'publicado', 'arquivado', 'ativo', 'inativo')),
  autor_id UUID NOT NULL REFERENCES auth.users(id),
  duracao_estimada INTEGER DEFAULT 0
);

-- Templates
CREATE TABLE IF NOT EXISTS conteudo.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tipo conteudo.tipo_recurso NOT NULL,
  estrutura JSONB NOT NULL DEFAULT '{}'::JSONB,
  instituicao_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  criado_por UUID NOT NULL REFERENCES auth.users(id)
);

-- Versões (Versions)
CREATE TABLE IF NOT EXISTS conteudo.versoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aula_id UUID NOT NULL REFERENCES conteudo.aulas(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  conteudo JSONB NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  autor_id UUID NOT NULL REFERENCES auth.users(id),
  comentario TEXT DEFAULT NULL,
  UNIQUE(aula_id, numero)
);

-- Autores (Authors)
CREATE TABLE IF NOT EXISTS conteudo.autores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id),
  recurso_id UUID NOT NULL,
  tipo_recurso conteudo.tipo_recurso NOT NULL,
  permissao conteudo.permissao NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(usuario_id, recurso_id, tipo_recurso)
);

-- Mídias (Media)
CREATE TABLE IF NOT EXISTS conteudo.midias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo TEXT NOT NULL,
  tamanho INTEGER NOT NULL,
  aula_id UUID NOT NULL REFERENCES conteudo.aulas(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  autor_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Publicações (Publications)
CREATE TABLE IF NOT EXISTS conteudo.publicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aula_id UUID NOT NULL REFERENCES conteudo.aulas(id) ON DELETE CASCADE,
  versao_id UUID NOT NULL REFERENCES conteudo.versoes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  comentario TEXT DEFAULT NULL,
  revisor_id UUID REFERENCES auth.users(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

----------------------
-- Índices
----------------------
CREATE INDEX IF NOT EXISTS idx_aulas_disciplina ON conteudo.aulas(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_disciplinas_curso ON conteudo.disciplinas(curso_id);
CREATE INDEX IF NOT EXISTS idx_versoes_aula ON conteudo.versoes(aula_id);
CREATE INDEX IF NOT EXISTS idx_autores_usuario ON conteudo.autores(usuario_id);
CREATE INDEX IF NOT EXISTS idx_autores_recurso ON conteudo.autores(recurso_id, tipo_recurso);
CREATE INDEX IF NOT EXISTS idx_midias_aula ON conteudo.midias(aula_id);
CREATE INDEX IF NOT EXISTS idx_publicacoes_aula ON conteudo.publicacoes(aula_id);
CREATE INDEX IF NOT EXISTS idx_publicacoes_versao ON conteudo.publicacoes(versao_id);

----------------------
-- Views
----------------------

-- View for courses with additional info
CREATE OR REPLACE VIEW conteudo.cursos_completos AS
SELECT 
  c.id,
  c.titulo,
  c.descricao,
  c.carga_horaria,
  c.codigo,
  c.status,
  c.coordenador_id,
  u.email as coordenador_email,
  COALESCE(u.raw_user_meta_data->>'nome', u.raw_user_meta_data->>'name', u.email) as coordenador_nome,
  c.instituicao_id,
  i.nome as instituicao_nome,
  COALESCE((SELECT COUNT(*) FROM conteudo.disciplinas d WHERE d.curso_id = c.id), 0) as total_disciplinas,
  COALESCE((
    SELECT COUNT(*) 
    FROM conteudo.aulas a 
    JOIN conteudo.disciplinas d ON a.disciplina_id = d.id 
    WHERE d.curso_id = c.id
  ), 0) as total_aulas
FROM conteudo.cursos c
LEFT JOIN auth.users u ON c.coordenador_id = u.id
LEFT JOIN public.instituicoes i ON c.instituicao_id = i.id;

-- View for disciplines with additional info
CREATE OR REPLACE VIEW conteudo.disciplinas_detalhadas AS
SELECT 
  d.id,
  d.titulo,
  d.descricao,
  d.codigo,
  d.curso_id,
  c.titulo as curso_titulo,
  d.ordem,
  d.status,
  COALESCE((SELECT COUNT(*) FROM conteudo.aulas a WHERE a.disciplina_id = d.id), 0) as total_aulas,
  COALESCE((
    SELECT COUNT(*) 
    FROM conteudo.aulas a 
    WHERE a.disciplina_id = d.id AND a.status = 'publicado'
  ), 0) as aulas_publicadas
FROM conteudo.disciplinas d
JOIN conteudo.cursos c ON d.curso_id = c.id;

-- View para mapeamento entre cursos de matrícula e conteúdo
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mapeamento_cursos') THEN
    EXECUTE '
    CREATE OR REPLACE VIEW conteudo.mapeamento_cursos_view AS
    SELECT 
      m.curso_matricula_id,
      m.curso_conteudo_id,
      c_mat.nome as curso_matricula_nome,
      c_cont.titulo as curso_conteudo_titulo,
      c_mat.carga_horaria as carga_horaria_matricula,
      c_cont.carga_horaria as carga_horaria_conteudo
    FROM public.mapeamento_cursos m
    JOIN public.cursos c_mat ON m.curso_matricula_id = c_mat.id
    JOIN conteudo.cursos c_cont ON m.curso_conteudo_id = c_cont.id;
    ';
  END IF;
END $$;

----------------------
-- Funções
----------------------

-- Função para atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION conteudo.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar permissões
CREATE OR REPLACE FUNCTION conteudo.check_permission(p_action TEXT, p_resource TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_resource_type TEXT;
  v_resource_id UUID;
  v_has_permission BOOLEAN;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- If not authenticated, return false
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Special case for general module access
  IF p_resource = 'material_didatico' AND p_action = 'access' THEN
    -- Check if user has any role that gives access to the module
    RETURN EXISTS (
      SELECT 1 
      FROM auth.users u 
      JOIN public.profiles p ON u.id = p.id
      WHERE u.id = v_user_id 
      AND p.role IN ('super_admin', 'admin_instituicao', 'tutor')
    );
  END IF;
  
  -- For specific resources, check author permissions
  IF p_resource ~ '^curso:' THEN
    v_resource_type := 'curso';
    v_resource_id := (regexp_split_to_array(p_resource, ':'))[2]::UUID;
  ELSIF p_resource ~ '^disciplina:' THEN
    v_resource_type := 'disciplina';
    v_resource_id := (regexp_split_to_array(p_resource, ':'))[2]::UUID;
  ELSIF p_resource ~ '^aula:' THEN
    v_resource_type := 'aula';
    v_resource_id := (regexp_split_to_array(p_resource, ':'))[2]::UUID;
  ELSE
    RETURN FALSE;
  END IF;
  
  -- Check if user is super admin
  IF EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = v_user_id 
    AND role = 'super_admin'
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Actions require different permission levels
  IF p_action = 'view' THEN
    -- View requires at least 'leitura' permission
    v_has_permission := EXISTS (
      SELECT 1 
      FROM conteudo.autores
      WHERE usuario_id = v_user_id
      AND recurso_id = v_resource_id
      AND tipo_recurso = v_resource_type::conteudo.tipo_recurso
      AND permissao IN ('leitura', 'edicao', 'revisao', 'publicacao')
    );
  ELSIF p_action = 'edit' THEN
    -- Edit requires at least 'edicao' permission
    v_has_permission := EXISTS (
      SELECT 1 
      FROM conteudo.autores
      WHERE usuario_id = v_user_id
      AND recurso_id = v_resource_id
      AND tipo_recurso = v_resource_type::conteudo.tipo_recurso
      AND permissao IN ('edicao', 'revisao', 'publicacao')
    );
  ELSIF p_action = 'review' THEN
    -- Review requires at least 'revisao' permission
    v_has_permission := EXISTS (
      SELECT 1 
      FROM conteudo.autores
      WHERE usuario_id = v_user_id
      AND recurso_id = v_resource_id
      AND tipo_recurso = v_resource_type::conteudo.tipo_recurso
      AND permissao IN ('revisao', 'publicacao')
    );
  ELSIF p_action = 'publish' THEN
    -- Publish requires 'publicacao' permission
    v_has_permission := EXISTS (
      SELECT 1 
      FROM conteudo.autores
      WHERE usuario_id = v_user_id
      AND recurso_id = v_resource_id
      AND tipo_recurso = v_resource_type::conteudo.tipo_recurso
      AND permissao = 'publicacao'
    );
  ELSE
    v_has_permission := FALSE;
  END IF;
  
  RETURN v_has_permission;
END;
$$;

-- Função para criar uma nova versão de aula
CREATE OR REPLACE FUNCTION conteudo.criar_versao_aula(
  p_aula_id UUID, 
  p_comentario TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_versao_id UUID;
  v_numero INT;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- If not authenticated, raise exception
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Check if user has permission to edit this aula
  IF NOT conteudo.check_permission('edit', 'aula:' || p_aula_id::TEXT) THEN
    RAISE EXCEPTION 'User does not have permission to create a new version';
  END IF;
  
  -- Get next version number
  SELECT COALESCE(MAX(numero), 0) + 1 
  INTO v_numero 
  FROM conteudo.versoes
  WHERE aula_id = p_aula_id;
  
  -- Create new version
  INSERT INTO conteudo.versoes (aula_id, numero, conteudo, autor_id, comentario)
  SELECT 
    p_aula_id,
    v_numero,
    conteudo,
    v_user_id,
    p_comentario
  FROM conteudo.aulas
  WHERE id = p_aula_id
  RETURNING id INTO v_versao_id;
  
  RETURN v_versao_id;
END;
$$;

-- Função para associar curso do módulo de matrículas ao curso no módulo de conteúdo
CREATE OR REPLACE FUNCTION conteudo.associar_cursos(
  p_curso_matricula_id UUID,
  p_curso_conteudo_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se as tabelas e cursos existem
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mapeamento_cursos') THEN
    RAISE EXCEPTION 'Tabela de mapeamento não existe';
    RETURN FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.cursos WHERE id = p_curso_matricula_id) THEN
    RAISE EXCEPTION 'Curso de matrícula não encontrado';
    RETURN FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM conteudo.cursos WHERE id = p_curso_conteudo_id) THEN
    RAISE EXCEPTION 'Curso de conteúdo não encontrado';
    RETURN FALSE;
  END IF;
  
  -- Inserir ou atualizar mapeamento
  INSERT INTO public.mapeamento_cursos (curso_matricula_id, curso_conteudo_id, updated_at)
  VALUES (p_curso_matricula_id, p_curso_conteudo_id, NOW())
  ON CONFLICT (curso_matricula_id) 
  DO UPDATE SET 
    curso_conteudo_id = p_curso_conteudo_id,
    updated_at = NOW();
  
  RETURN TRUE;
END;
$$;

----------------------
-- Triggers
----------------------

-- Trigger para atualizar timestamp em cursos
CREATE TRIGGER update_curso_timestamp
BEFORE UPDATE ON conteudo.cursos
FOR EACH ROW
EXECUTE FUNCTION conteudo.update_timestamp();

-- Trigger para atualizar timestamp em disciplinas
CREATE TRIGGER update_disciplina_timestamp
BEFORE UPDATE ON conteudo.disciplinas
FOR EACH ROW
EXECUTE FUNCTION conteudo.update_timestamp();

-- Trigger para atualizar timestamp em aulas
CREATE TRIGGER update_aula_timestamp
BEFORE UPDATE ON conteudo.aulas
FOR EACH ROW
EXECUTE FUNCTION conteudo.update_timestamp();

-- Trigger para atualizar timestamp em templates
CREATE TRIGGER update_template_timestamp
BEFORE UPDATE ON conteudo.templates
FOR EACH ROW
EXECUTE FUNCTION conteudo.update_timestamp();

-- Trigger para atualizar timestamp em autores
CREATE TRIGGER update_autor_timestamp
BEFORE UPDATE ON conteudo.autores
FOR EACH ROW
EXECUTE FUNCTION conteudo.update_timestamp();

-- Trigger para atualizar timestamp em mídias
CREATE TRIGGER update_midia_timestamp
BEFORE UPDATE ON conteudo.midias
FOR EACH ROW
EXECUTE FUNCTION conteudo.update_timestamp();

-- Trigger para atualizar timestamp em publicações
CREATE TRIGGER update_publicacao_timestamp
BEFORE UPDATE ON conteudo.publicacoes
FOR EACH ROW
EXECUTE FUNCTION conteudo.update_timestamp();

----------------------
-- RLS (Row Level Security)
----------------------

-- Ativar RLS em todas as tabelas
ALTER TABLE conteudo.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.versoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.autores ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.midias ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.publicacoes ENABLE ROW LEVEL SECURITY;

-- Políticas para cursos
CREATE POLICY "Os administradores podem gerenciar todos os cursos"
  ON conteudo.cursos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_instituicao')
    )
  );

CREATE POLICY "Os tutores podem ver todos os cursos"
  ON conteudo.cursos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'tutor'
    )
  );

CREATE POLICY "Os autores podem ver cursos aos quais têm acesso"
  ON conteudo.cursos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conteudo.autores
      WHERE autores.usuario_id = auth.uid()
      AND autores.recurso_id = conteudo.cursos.id
      AND autores.tipo_recurso = 'curso'
    )
  );

-- Políticas para disciplinas
CREATE POLICY "Os administradores podem gerenciar todas as disciplinas"
  ON conteudo.disciplinas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_instituicao')
    )
  );

CREATE POLICY "Os tutores podem ver todas as disciplinas"
  ON conteudo.disciplinas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'tutor'
    )
  );

CREATE POLICY "Os autores podem ver disciplinas aos quais têm acesso"
  ON conteudo.disciplinas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conteudo.autores
      WHERE autores.usuario_id = auth.uid()
      AND (
        autores.recurso_id = conteudo.disciplinas.id AND autores.tipo_recurso = 'disciplina'
        OR
        autores.recurso_id = conteudo.disciplinas.curso_id AND autores.tipo_recurso = 'curso'
      )
    )
  );

-- Políticas para aulas
CREATE POLICY "Os administradores podem gerenciar todas as aulas"
  ON conteudo.aulas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_instituicao')
    )
  );

CREATE POLICY "Os tutores podem ver todas as aulas"
  ON conteudo.aulas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'tutor'
    )
  );

CREATE POLICY "Os autores podem editar aulas que criaram"
  ON conteudo.aulas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = autor_id);

CREATE POLICY "Os alunos podem ver aulas publicadas"
  ON conteudo.aulas
  FOR SELECT
  TO authenticated
  USING (
    status = 'publicado'
    AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'aluno'
      AND EXISTS (
        SELECT 1 FROM public.matriculas
        JOIN conteudo.disciplinas ON conteudo.aulas.disciplina_id = conteudo.disciplinas.id
        WHERE matriculas.aluno_id = auth.uid()
        AND matriculas.curso_id IN (
          SELECT m.curso_matricula_id 
          FROM public.mapeamento_cursos m
          WHERE m.curso_conteudo_id = conteudo.disciplinas.curso_id
        )
        AND matriculas.status = 'ativa'
      )
    )
  );

-- Políticas para versões
CREATE POLICY "Os autores podem ver versões das aulas que criaram"
  ON conteudo.versoes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conteudo.aulas
      WHERE aulas.id = versoes.aula_id
      AND aulas.autor_id = auth.uid()
    )
  );

CREATE POLICY "Os administradores podem gerenciar todas as versões"
  ON conteudo.versoes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_instituicao')
    )
  );

-- Storage Buckets para material didático
INSERT INTO storage.buckets (id, name, public)
VALUES ('material_didatico', 'Arquivos de material didático', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para bucket material_didatico
CREATE POLICY "Os administradores e tutores podem acessar todos os arquivos de material didático"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'material_didatico'
    AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_instituicao', 'tutor')
    )
  );

CREATE POLICY "Os autores podem acessar seus próprios arquivos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'material_didatico'
    AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Os autores podem enviar seus próprios arquivos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'material_didatico'
    AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Os alunos podem ver arquivos de material didático publicados"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'material_didatico'
    AND
    EXISTS (
      SELECT 1 FROM conteudo.midias
      JOIN conteudo.aulas ON midias.aula_id = aulas.id
      JOIN conteudo.disciplinas ON aulas.disciplina_id = disciplinas.id
      JOIN public.mapeamento_cursos m ON m.curso_conteudo_id = disciplinas.curso_id
      JOIN public.matriculas ON matriculas.curso_id = m.curso_matricula_id
      WHERE midias.url LIKE '%' || storage.filename(name) || '%'
      AND aulas.status = 'publicado'
      AND matriculas.aluno_id = auth.uid()
      AND matriculas.status = 'ativa'
    )
  ); 