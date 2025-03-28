-- Schema para o módulo de Material Didático (conteudo) - Parte 2: Políticas RLS
-- Executado por: Supabase CLI
-- Criado em: 2024-03-28

----------------------
-- RLS (Row Level Security)
----------------------

-- Verificar se o schema existe antes de continuar
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'conteudo') THEN
    RAISE EXCEPTION 'Schema conteudo não existe. Execute a parte 1 primeiro.';
  END IF;

  -- Remover verificação da coluna role, pois está gerando erro
  /* O código abaixo está sendo comentado porque gerou erro na execução
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'role') THEN
    RAISE EXCEPTION 'Coluna role não encontrada na tabela profiles.';
  END IF;
  */
END $$;

-- Ativar RLS em todas as tabelas
ALTER TABLE conteudo.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.versoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.autores ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.midias ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo.publicacoes ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes, se houver
DROP POLICY IF EXISTS "Os administradores podem gerenciar todos os cursos" ON conteudo.cursos;
DROP POLICY IF EXISTS "Os tutores podem ver todos os cursos" ON conteudo.cursos;
DROP POLICY IF EXISTS "Os autores podem ver cursos aos quais têm acesso" ON conteudo.cursos;

DROP POLICY IF EXISTS "Os administradores podem gerenciar todas as disciplinas" ON conteudo.disciplinas;
DROP POLICY IF EXISTS "Os tutores podem ver todas as disciplinas" ON conteudo.disciplinas;
DROP POLICY IF EXISTS "Os autores podem ver disciplinas aos quais têm acesso" ON conteudo.disciplinas;

DROP POLICY IF EXISTS "Os administradores podem gerenciar todas as aulas" ON conteudo.aulas;
DROP POLICY IF EXISTS "Os tutores podem ver todas as aulas" ON conteudo.aulas;
DROP POLICY IF EXISTS "Os autores podem editar aulas que criaram" ON conteudo.aulas;
DROP POLICY IF EXISTS "Os alunos podem ver aulas publicadas" ON conteudo.aulas;

DROP POLICY IF EXISTS "Os autores podem ver versões das aulas que criaram" ON conteudo.versoes;
DROP POLICY IF EXISTS "Os administradores podem gerenciar todas as versões" ON conteudo.versoes;

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

-- Políticas para autores
CREATE POLICY "Os administradores podem gerenciar todos os autores"
  ON conteudo.autores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_instituicao')
    )
  );

CREATE POLICY "Os usuários podem ver seus próprios registros de autor"
  ON conteudo.autores
  FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- Políticas para mídias
CREATE POLICY "Os administradores podem gerenciar todas as mídias"
  ON conteudo.midias
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_instituicao')
    )
  );

CREATE POLICY "Os autores podem gerenciar suas próprias mídias"
  ON conteudo.midias
  FOR ALL
  TO authenticated
  USING (autor_id = auth.uid());

CREATE POLICY "Qualquer usuário pode ver mídias de aulas publicadas"
  ON conteudo.midias
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conteudo.aulas
      WHERE aulas.id = conteudo.midias.aula_id
      AND aulas.status = 'publicado'
    )
  );

-- Políticas para publicações
CREATE POLICY "Os administradores podem gerenciar todas as publicações"
  ON conteudo.publicacoes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_instituicao')
    )
  );

CREATE POLICY "Os autores podem ver publicações de suas aulas"
  ON conteudo.publicacoes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conteudo.aulas
      WHERE aulas.id = conteudo.publicacoes.aula_id
      AND aulas.autor_id = auth.uid()
    )
  );

-- Storage Buckets para material didático
INSERT INTO storage.buckets (id, name, public)
VALUES ('material_didatico', 'Arquivos de material didático', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para storage
DROP POLICY IF EXISTS "Os administradores e tutores podem acessar todos os arquivos de material didático" ON storage.objects;
DROP POLICY IF EXISTS "Os autores podem acessar seus próprios arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Os autores podem enviar seus próprios arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Os alunos podem ver arquivos de material didático publicados" ON storage.objects;

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