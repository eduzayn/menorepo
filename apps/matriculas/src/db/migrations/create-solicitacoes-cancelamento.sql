-- Criação da tabela de solicitações de cancelamento
CREATE TABLE IF NOT EXISTS solicitacoes_cancelamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matriculas(id),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  motivo VARCHAR(50) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'aprovada', 'negada', 'expirada')),
  data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL,
  data_analise TIMESTAMP WITH TIME ZONE,
  analisado_por VARCHAR(50),
  observacoes_analise TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Índices para melhorar a performance de consultas comuns
  CONSTRAINT fk_matricula FOREIGN KEY (matricula_id) REFERENCES matriculas(id) ON DELETE CASCADE
);

-- Índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_solicitacoes_cancelamento_matricula_id ON solicitacoes_cancelamento(matricula_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_cancelamento_aluno_id ON solicitacoes_cancelamento(aluno_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_cancelamento_status ON solicitacoes_cancelamento(status);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_cancelamento_data ON solicitacoes_cancelamento(data_solicitacao);

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_solicitacao_cancelamento_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_solicitacao_cancelamento_updated_at
BEFORE UPDATE ON solicitacoes_cancelamento
FOR EACH ROW
EXECUTE FUNCTION update_solicitacao_cancelamento_updated_at();

-- Trigger para expirar solicitações pendentes após 30 dias
CREATE OR REPLACE FUNCTION expirar_solicitacoes_pendentes()
RETURNS TRIGGER AS $$
BEGIN
  -- Expirar solicitações pendentes com mais de 30 dias
  UPDATE solicitacoes_cancelamento
  SET 
    status = 'expirada',
    data_analise = NOW(),
    analisado_por = 'sistema',
    observacoes_analise = 'Solicitação expirada automaticamente após 30 dias sem análise'
  WHERE 
    status = 'pendente' 
    AND data_solicitacao < NOW() - INTERVAL '30 days';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger que executa a função de expiração diariamente (via evento programado)
CREATE OR REPLACE FUNCTION agendar_expiracao_solicitacoes()
RETURNS void AS $$
BEGIN
  PERFORM expirar_solicitacoes_pendentes();
END;
$$ LANGUAGE plpgsql;

-- Função para cancelamento automático por inadimplência
CREATE OR REPLACE FUNCTION cancelar_matriculas_inadimplentes()
RETURNS void AS $$
DECLARE
  v_matricula RECORD;
  v_solicitacao_id UUID;
BEGIN
  -- Buscar matrículas inadimplentes há mais de 90 dias
  FOR v_matricula IN
    SELECT id, aluno_id
    FROM matriculas
    WHERE 
      status = 'inadimplente'
      AND updated_at < NOW() - INTERVAL '90 days'
  LOOP
    -- Verificar se já existe solicitação pendente para esta matrícula
    PERFORM id 
    FROM solicitacoes_cancelamento 
    WHERE matricula_id = v_matricula.id AND status = 'pendente';
    
    -- Se não existir, criar uma solicitação automática já aprovada
    IF NOT FOUND THEN
      INSERT INTO solicitacoes_cancelamento (
        matricula_id, 
        aluno_id, 
        motivo, 
        descricao, 
        status, 
        data_solicitacao, 
        data_analise, 
        analisado_por, 
        observacoes_analise, 
        created_at, 
        updated_at
      ) VALUES (
        v_matricula.id,
        v_matricula.aluno_id,
        'financeiro',
        'Cancelamento automático por inadimplência superior a 90 dias',
        'aprovada',
        NOW(),
        NOW(),
        'sistema',
        'Cancelamento automático conforme política da instituição',
        NOW(),
        NOW()
      ) RETURNING id INTO v_solicitacao_id;
      
      -- Cancelar a matrícula
      UPDATE matriculas
      SET 
        status = 'cancelada',
        observacoes = COALESCE(observacoes, '') || ' | Cancelada automaticamente por inadimplência superior a 90 dias. ID da solicitação: ' || v_solicitacao_id,
        updated_at = NOW()
      WHERE id = v_matricula.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql; 