-- Políticas para progresso_aluno
ALTER TABLE progresso_aluno ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos podem ver seu próprio progresso"
ON progresso_aluno
FOR SELECT
USING (auth.uid() = aluno_id);

CREATE POLICY "Sistema pode atualizar progresso"
ON progresso_aluno
FOR UPDATE
USING (auth.uid() = aluno_id)
WITH CHECK (auth.uid() = aluno_id);

-- Políticas para conquistas
ALTER TABLE conquistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver conquistas"
ON conquistas
FOR SELECT
USING (true);

-- Políticas para conquistas_aluno
ALTER TABLE conquistas_aluno ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos podem ver suas próprias conquistas"
ON conquistas_aluno
FOR SELECT
USING (auth.uid() = aluno_id);

CREATE POLICY "Sistema pode registrar conquistas"
ON conquistas_aluno
FOR INSERT
WITH CHECK (auth.uid() = aluno_id);

-- Políticas para atividades_gamificadas
ALTER TABLE atividades_gamificadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver atividades"
ON atividades_gamificadas
FOR SELECT
USING (true);

-- Políticas para atividades_completadas
ALTER TABLE atividades_completadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos podem ver suas atividades completadas"
ON atividades_completadas
FOR SELECT
USING (auth.uid() = aluno_id);

CREATE POLICY "Sistema pode registrar atividades completadas"
ON atividades_completadas
FOR INSERT
WITH CHECK (auth.uid() = aluno_id); 