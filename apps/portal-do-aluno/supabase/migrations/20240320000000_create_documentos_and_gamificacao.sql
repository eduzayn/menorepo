-- Criar tabela de documentos
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('RG', 'CPF', 'COMPROVANTE_RESIDENCIA', 'HISTORICO_ESCOLAR', 'DIPLOMA', 'OUTROS')),
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDENTE', 'APROVADO', 'REJEITADO')),
  data_upload TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  validacao JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de validação de documentos
CREATE TABLE validacao_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  documento_id UUID NOT NULL REFERENCES documentos(id),
  status TEXT NOT NULL CHECK (status IN ('PENDENTE', 'APROVADO', 'REJEITADO')),
  feedback TEXT NOT NULL,
  data_validacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  validado_por TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de progresso do aluno
CREATE TABLE progresso_aluno (
  aluno_id UUID PRIMARY KEY REFERENCES auth.users(id),
  pontos INTEGER NOT NULL DEFAULT 0,
  nivel INTEGER NOT NULL DEFAULT 1,
  conquistas UUID[] NOT NULL DEFAULT '{}',
  atividades_completas INTEGER NOT NULL DEFAULT 0,
  tempo_estudo INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de conquistas
CREATE TABLE conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  pontos INTEGER NOT NULL,
  icone TEXT NOT NULL,
  requisitos JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de atividades completadas
CREATE TABLE atividades_completadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES auth.users(id),
  atividade_id UUID NOT NULL,
  data_completada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(aluno_id, atividade_id)
);

-- Criar índices
CREATE INDEX idx_documentos_aluno_id ON documentos(aluno_id);
CREATE INDEX idx_validacao_documentos_documento_id ON validacao_documentos(documento_id);
CREATE INDEX idx_atividades_completadas_aluno_id ON atividades_completadas(aluno_id);

-- Criar políticas de segurança
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE validacao_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_aluno ENABLE ROW LEVEL SECURITY;
ALTER TABLE conquistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades_completadas ENABLE ROW LEVEL SECURITY;

-- Políticas para documentos
CREATE POLICY "Alunos podem ver seus próprios documentos"
  ON documentos FOR SELECT
  USING (auth.uid() = aluno_id);

CREATE POLICY "Alunos podem inserir seus próprios documentos"
  ON documentos FOR INSERT
  WITH CHECK (auth.uid() = aluno_id);

-- Políticas para validação de documentos
CREATE POLICY "Alunos podem ver validações de seus documentos"
  ON validacao_documentos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM documentos
      WHERE documentos.id = validacao_documentos.documento_id
      AND documentos.aluno_id = auth.uid()
    )
  );

-- Políticas para progresso do aluno
CREATE POLICY "Alunos podem ver seu próprio progresso"
  ON progresso_aluno FOR SELECT
  USING (auth.uid() = aluno_id);

-- Políticas para conquistas
CREATE POLICY "Todos podem ver conquistas"
  ON conquistas FOR SELECT
  USING (true);

-- Políticas para atividades completadas
CREATE POLICY "Alunos podem ver suas próprias atividades completadas"
  ON atividades_completadas FOR SELECT
  USING (auth.uid() = aluno_id);

CREATE POLICY "Alunos podem inserir suas próprias atividades completadas"
  ON atividades_completadas FOR INSERT
  WITH CHECK (auth.uid() = aluno_id);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_documentos_updated_at
  BEFORE UPDATE ON documentos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progresso_aluno_updated_at
  BEFORE UPDATE ON progresso_aluno
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 