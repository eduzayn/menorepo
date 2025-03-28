-- Políticas para documentos
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos podem ver seus próprios documentos"
ON documentos
FOR SELECT
USING (auth.uid() = aluno_id);

CREATE POLICY "Alunos podem enviar documentos"
ON documentos
FOR INSERT
WITH CHECK (auth.uid() = aluno_id);

CREATE POLICY "Sistema pode atualizar documentos"
ON documentos
FOR UPDATE
USING (auth.uid() = aluno_id)
WITH CHECK (auth.uid() = aluno_id);

-- Políticas para validacao_documentos
ALTER TABLE validacao_documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos podem ver validações de seus documentos"
ON validacao_documentos
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM documentos
    WHERE documentos.id = validacao_documentos.documento_id
    AND documentos.aluno_id = auth.uid()
  )
);

CREATE POLICY "Sistema pode criar validações"
ON validacao_documentos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM documentos
    WHERE documentos.id = validacao_documentos.documento_id
    AND documentos.aluno_id = auth.uid()
  )
);

CREATE POLICY "Sistema pode atualizar validações"
ON validacao_documentos
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM documentos
    WHERE documentos.id = validacao_documentos.documento_id
    AND documentos.aluno_id = auth.uid()
  )
); 