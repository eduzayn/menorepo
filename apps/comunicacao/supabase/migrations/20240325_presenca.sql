-- Criar tabela de presença
CREATE TABLE IF NOT EXISTS presenca (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('LEAD', 'ALUNO', 'USUARIO')),
  online BOOLEAN DEFAULT false,
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (usuario_id, tipo)
);

-- Criar função para atualizar o timestamp de atualizado_at
CREATE OR REPLACE FUNCTION atualizar_timestamp_presenca()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o timestamp automaticamente
CREATE TRIGGER atualizar_timestamp_presenca
  BEFORE UPDATE ON presenca
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp_presenca();

-- Criar função para atualizar presença
CREATE OR REPLACE FUNCTION atualizar_presenca(
  p_usuario_id UUID,
  p_tipo VARCHAR,
  p_online BOOLEAN
)
RETURNS presenca AS $$
DECLARE
  v_presenca presenca;
BEGIN
  INSERT INTO presenca (usuario_id, tipo, online)
  VALUES (p_usuario_id, p_tipo, p_online)
  ON CONFLICT (usuario_id, tipo)
  DO UPDATE SET
    online = p_online,
    ultimo_acesso = NOW()
  RETURNING * INTO v_presenca;

  RETURN v_presenca;
END;
$$ LANGUAGE plpgsql;

-- Criar políticas de segurança
ALTER TABLE presenca ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública da presença"
  ON presenca FOR SELECT
  USING (true);

CREATE POLICY "Permitir atualização da própria presença"
  ON presenca FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Permitir inserção da própria presença"
  ON presenca FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_presenca_usuario_id ON presenca(usuario_id);
CREATE INDEX IF NOT EXISTS idx_presenca_tipo ON presenca(tipo);
CREATE INDEX IF NOT EXISTS idx_presenca_online ON presenca(online);
CREATE INDEX IF NOT EXISTS idx_presenca_ultimo_acesso ON presenca(ultimo_acesso); 