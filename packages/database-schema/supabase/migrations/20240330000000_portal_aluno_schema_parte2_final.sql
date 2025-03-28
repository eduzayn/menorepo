-- Schema para o Portal do Aluno - Parte 2: Políticas RLS e Views
-- Executado por: Supabase CLI
-- Criado em: 2024-03-30
-- IMPORTANTE: Este script depende do schema conteudo e da primeira parte do Portal do Aluno

----------------
-- Verificação prévia
----------------
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'portal_aluno') THEN
    RAISE EXCEPTION 'O schema "portal_aluno" não existe. Execute a parte 1 primeiro.';
  END IF;
END $$;

-------------------------------
-- Remover políticas existentes
-------------------------------
DROP POLICY IF EXISTS "Usuários veem apenas seus próprios dados de perfil" ON portal_aluno.perfil_aluno;
DROP POLICY IF EXISTS "Administradores podem ver todos os perfis" ON portal_aluno.perfil_aluno;
DROP POLICY IF EXISTS "Tutores podem ver perfis de seus alunos" ON portal_aluno.perfil_aluno;

DROP POLICY IF EXISTS "Usuários veem apenas seu próprio progresso" ON portal_aluno.progresso_conteudo;
DROP POLICY IF EXISTS "Administradores podem gerenciar todo o progresso" ON portal_aluno.progresso_conteudo;
DROP POLICY IF EXISTS "Tutores podem ver progresso de seus alunos" ON portal_aluno.progresso_conteudo;

DROP POLICY IF EXISTS "Usuários veem apenas seus próprios documentos" ON portal_aluno.documentos_aluno;
DROP POLICY IF EXISTS "Administradores podem gerenciar todos os documentos" ON portal_aluno.documentos_aluno;

DROP POLICY IF EXISTS "Usuários veem apenas seus próprios certificados" ON portal_aluno.certificados;
DROP POLICY IF EXISTS "Administradores podem gerenciar todos os certificados" ON portal_aluno.certificados;

DROP POLICY IF EXISTS "Usuários veem apenas seus próprios bloqueios" ON portal_aluno.bloqueios_acesso;
DROP POLICY IF EXISTS "Administradores podem ver e gerenciar todos os bloqueios" ON portal_aluno.bloqueios_acesso;

DROP POLICY IF EXISTS "Usuários veem apenas suas próprias atividades" ON portal_aluno.atividades_aluno;
DROP POLICY IF EXISTS "Administradores podem ver todas as atividades" ON portal_aluno.atividades_aluno;

DROP POLICY IF EXISTS "Usuários veem apenas sua própria gamificação" ON portal_aluno.gamificacao;
DROP POLICY IF EXISTS "Administradores podem ver todas as gamificações" ON portal_aluno.gamificacao;
DROP POLICY IF EXISTS "Sistema pode atualizar gamificação" ON portal_aluno.gamificacao;

-------------------------------
-- Criar políticas RLS
-------------------------------

-- Políticas para perfil_aluno
CREATE POLICY "Usuários veem apenas seus próprios dados de perfil" 
ON portal_aluno.perfil_aluno FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados de perfil" 
ON portal_aluno.perfil_aluno FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Administradores podem ver e gerenciar todos os perfis" 
ON portal_aluno.perfil_aluno FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'professor')
  )
);

CREATE POLICY "Tutores podem ver perfis de seus alunos" 
ON portal_aluno.perfil_aluno FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'professor'
    AND EXISTS (
      SELECT 1 FROM public.matriculas m
      JOIN public.cursos c ON m.curso_id = c.id
      WHERE m.aluno_id = portal_aluno.perfil_aluno.id
      AND c.coordenador_id = auth.uid()
    )
  )
);

-- Políticas para progresso_conteudo
CREATE POLICY "Usuários veem apenas seu próprio progresso" 
ON portal_aluno.progresso_conteudo FOR SELECT 
TO authenticated 
USING (aluno_id = auth.uid());

CREATE POLICY "Administradores podem gerenciar todo o progresso" 
ON portal_aluno.progresso_conteudo FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'professor')
  )
);

CREATE POLICY "Tutores podem ver progresso de seus alunos" 
ON portal_aluno.progresso_conteudo FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'professor'
    AND EXISTS (
      SELECT 1 FROM public.cursos c
      WHERE c.id = portal_aluno.progresso_conteudo.curso_id
      AND c.coordenador_id = auth.uid()
    )
  )
);

-- Políticas para documentos_aluno
CREATE POLICY "Usuários veem apenas seus próprios documentos" 
ON portal_aluno.documentos_aluno FOR SELECT 
TO authenticated 
USING (aluno_id = auth.uid());

CREATE POLICY "Usuários podem enviar seus próprios documentos" 
ON portal_aluno.documentos_aluno FOR INSERT 
TO authenticated 
WITH CHECK (aluno_id = auth.uid());

CREATE POLICY "Administradores podem gerenciar todos os documentos" 
ON portal_aluno.documentos_aluno FOR ALL
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'professor')
  )
);

-- Políticas para certificados
CREATE POLICY "Usuários veem apenas seus próprios certificados" 
ON portal_aluno.certificados FOR SELECT 
TO authenticated 
USING (aluno_id = auth.uid());

CREATE POLICY "Usuários podem solicitar seus próprios certificados" 
ON portal_aluno.certificados FOR INSERT 
TO authenticated 
WITH CHECK (aluno_id = auth.uid());

CREATE POLICY "Administradores podem gerenciar todos os certificados" 
ON portal_aluno.certificados FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'professor')
  )
);

-- Políticas para bloqueios_acesso
CREATE POLICY "Usuários veem apenas seus próprios bloqueios" 
ON portal_aluno.bloqueios_acesso FOR SELECT 
TO authenticated 
USING (aluno_id = auth.uid());

CREATE POLICY "Administradores podem ver e gerenciar todos os bloqueios" 
ON portal_aluno.bloqueios_acesso FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'professor')
  )
);

-- Políticas para atividades_aluno
CREATE POLICY "Usuários veem apenas suas próprias atividades" 
ON portal_aluno.atividades_aluno FOR SELECT 
TO authenticated 
USING (aluno_id = auth.uid());

CREATE POLICY "Administradores podem ver todas as atividades" 
ON portal_aluno.atividades_aluno FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'professor')
  )
);

-- Políticas para gamificação
CREATE POLICY "Usuários veem apenas sua própria gamificação" 
ON portal_aluno.gamificacao FOR SELECT 
TO authenticated 
USING (aluno_id = auth.uid());

CREATE POLICY "Administradores podem ver todas as gamificações" 
ON portal_aluno.gamificacao FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'professor')
  )
);

CREATE POLICY "Sistema pode atualizar gamificação" 
ON portal_aluno.gamificacao FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'professor')
  )
);

-------------------------------
-- Políticas para buckets
-------------------------------

-- Políticas para documentos_aluno bucket
DROP POLICY IF EXISTS "Usuários podem ver apenas seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Administradores podem ver todos os documentos" ON storage.objects;

CREATE POLICY "Usuários podem ver apenas seus próprios documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos_aluno' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários podem inserir apenas seus próprios documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos_aluno' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Administradores podem ver todos os documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos_aluno' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'professor')
  )
);

-- Políticas para certificados bucket
DROP POLICY IF EXISTS "Usuários podem ver apenas seus próprios certificados" ON storage.objects;
DROP POLICY IF EXISTS "Administradores podem gerenciar todos os certificados" ON storage.objects;

CREATE POLICY "Usuários podem ver apenas seus próprios certificados"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'certificados' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Administradores podem gerenciar todos os certificados"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'certificados' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'professor')
  )
);

-- Políticas para fotos_aluno bucket
DROP POLICY IF EXISTS "Fotos de perfil são públicas para leitura" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem inserir apenas suas próprias fotos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas suas próprias fotos" ON storage.objects;

CREATE POLICY "Fotos de perfil são públicas para leitura"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'fotos_aluno');

CREATE POLICY "Usuários podem inserir apenas suas próprias fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'fotos_aluno' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários podem atualizar apenas suas próprias fotos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'fotos_aluno' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-------------------------------
-- Views úteis
-------------------------------

-- View de situação atual do aluno
CREATE OR REPLACE VIEW portal_aluno.situacao_aluno AS
SELECT 
  p.id AS aluno_id,
  p.full_name,
  p.email,
  m.id AS matricula_id,
  m.status AS status_matricula,
  c.nome AS curso_nome,
  c.id AS curso_id,
  (
    SELECT COUNT(*) FROM portal_aluno.bloqueios_acesso ba 
    WHERE ba.aluno_id = p.id AND ba.ativo = true
  ) AS bloqueios_ativos,
  (
    SELECT STRING_AGG(ba.motivo::TEXT, ', ') 
    FROM portal_aluno.bloqueios_acesso ba 
    WHERE ba.aluno_id = p.id AND ba.ativo = true
  ) AS motivos_bloqueio,
  (
    SELECT COUNT(*) FROM portal_aluno.documentos_aluno da 
    WHERE da.aluno_id = p.id AND da.status = 'pendente'
  ) AS documentos_pendentes,
  (
    SELECT COUNT(*) FROM public.pagamentos pa
    JOIN public.matriculas ma ON pa.matricula_id = ma.id
    WHERE ma.aluno_id = p.id AND pa.status = 'pending'
    AND pa.data_vencimento < CURRENT_DATE - INTERVAL '30 days'
  ) AS parcelas_atrasadas,
  pa.ultimo_acesso,
  (
    SELECT ROUND(AVG(pc.porcentagem_concluida)) 
    FROM portal_aluno.progresso_conteudo pc
    WHERE pc.aluno_id = p.id AND pc.curso_id = c.id
  ) AS progresso_curso
FROM 
  public.profiles p
JOIN 
  portal_aluno.perfil_aluno pa ON p.id = pa.id
LEFT JOIN 
  public.matriculas m ON pa.matricula_id = m.id
LEFT JOIN 
  public.cursos c ON m.curso_id = c.id
WHERE 
  p.role = 'aluno';

-- View de estatísticas de uso - Corrigida para resolver o erro de coluna não agrupada
CREATE OR REPLACE VIEW portal_aluno.estatisticas_uso AS
WITH alunos_concluiram AS (
  SELECT 
    DATE_TRUNC('day', pc.updated_at) AS data_conclusao,
    COUNT(DISTINCT pc.aluno_id) AS alunos_concluiram
  FROM 
    portal_aluno.progresso_conteudo pc
  WHERE 
    pc.status = 'concluido'
  GROUP BY 
    DATE_TRUNC('day', pc.updated_at)
)
SELECT
  DATE_TRUNC('day', aa.created_at) AS data,
  COUNT(DISTINCT aa.aluno_id) AS alunos_ativos,
  COUNT(*) AS total_atividades,
  aa.tipo,
  COALESCE(ac.alunos_concluiram, 0) AS alunos_concluiram_conteudo
FROM 
  portal_aluno.atividades_aluno aa
LEFT JOIN
  alunos_concluiram ac ON DATE_TRUNC('day', aa.created_at) = ac.data_conclusao
GROUP BY 
  DATE_TRUNC('day', aa.created_at), 
  aa.tipo,
  ac.alunos_concluiram
ORDER BY 
  data DESC, 
  alunos_ativos DESC; 