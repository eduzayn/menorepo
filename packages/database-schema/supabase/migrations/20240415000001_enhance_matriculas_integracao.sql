-- Migração para melhorar a integração do módulo de matrículas
-- 20240415000001_enhance_matriculas_integracao.sql

--------------------------
-- Verificações Iniciais
--------------------------
DO $$ 
BEGIN
  -- Verificar se o schema matriculas existe
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'matriculas') THEN
    RAISE EXCEPTION 'Schema matriculas não existe. Execute primeiro a migração 20240415000000_enhance_matriculas_structure.sql.';
  END IF;
END $$;

--------------------------
-- Funções de Integração com Portal do Aluno
--------------------------

-- Função para criar automaticamente um perfil no portal do aluno
CREATE OR REPLACE FUNCTION matriculas.criar_perfil_aluno()
RETURNS TRIGGER AS $$
BEGIN
  -- Verifica se já existe um perfil para este aluno
  IF NOT EXISTS (SELECT 1 FROM portal_aluno.perfil_aluno WHERE id = NEW.aluno_id) THEN
    -- Cria o perfil do aluno
    INSERT INTO portal_aluno.perfil_aluno (
      id,
      matricula_id,
      created_at,
      updated_at
    ) VALUES (
      NEW.aluno_id,
      NEW.id,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Perfil de aluno criado com sucesso para a matrícula %', NEW.id;
  ELSE
    -- Atualiza o perfil existente
    UPDATE portal_aluno.perfil_aluno
    SET 
      matricula_id = NEW.id,
      updated_at = NOW()
    WHERE id = NEW.aluno_id;
    
    RAISE NOTICE 'Perfil de aluno atualizado para a matrícula %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar perfil de aluno
DROP TRIGGER IF EXISTS trg_criar_perfil_aluno ON matriculas;
CREATE TRIGGER trg_criar_perfil_aluno
AFTER INSERT ON matriculas
FOR EACH ROW EXECUTE FUNCTION matriculas.criar_perfil_aluno();

--------------------------
-- Funções de Integração com Financeiro
--------------------------

-- Função para atualizar status financeiro da matrícula
CREATE OR REPLACE FUNCTION matriculas.atualizar_status_financeiro()
RETURNS TRIGGER AS $$
BEGIN
  -- Se um pagamento foi marcado como aprovado
  IF (NEW.status = 'aprovado' AND OLD.status != 'aprovado') THEN
    -- Verifica se é a primeira parcela para matriculas pendentes
    IF EXISTS (
      SELECT 1 FROM matriculas m
      WHERE m.id = NEW.matricula_id
      AND m.status = 'pendente'
    ) THEN
      -- Atualiza o status da matrícula para ativa
      UPDATE matriculas
      SET 
        status = 'ativa',
        ultima_verificacao_situacao = NOW()
      WHERE id = NEW.matricula_id;
      
      RAISE NOTICE 'Matrícula % ativada após pagamento da primeira parcela', NEW.matricula_id;
    -- Verifica se é um pagamento de regularização para matriculas inadimplentes
    ELSIF EXISTS (
      SELECT 1 FROM matriculas m
      WHERE m.id = NEW.matricula_id
      AND m.status = 'inadimplente'
      AND NOT EXISTS (
        -- Verifica se ainda existem outras parcelas vencidas
        SELECT 1 FROM pagamentos p
        WHERE p.matricula_id = m.id
        AND p.id != NEW.id
        AND p.status = 'pendente'
        AND p.data_vencimento < CURRENT_DATE - INTERVAL '30 days'
      )
    ) THEN
      -- Atualiza o status da matrícula para reativada
      UPDATE matriculas
      SET 
        status = 'reativada',
        ultima_verificacao_situacao = NOW()
      WHERE id = NEW.matricula_id;
      
      -- Remove bloqueios de acesso por inadimplência
      UPDATE portal_aluno.bloqueios_acesso
      SET 
        ativo = FALSE,
        data_fim = NOW(),
        updated_at = NOW()
      FROM matriculas m
      WHERE 
        portal_aluno.bloqueios_acesso.aluno_id = m.aluno_id
        AND m.id = NEW.matricula_id
        AND portal_aluno.bloqueios_acesso.motivo = 'inadimplencia'
        AND portal_aluno.bloqueios_acesso.ativo = TRUE;
      
      RAISE NOTICE 'Matrícula % reativada após regularização de pagamentos', NEW.matricula_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar status financeiro
DROP TRIGGER IF EXISTS trg_atualizar_status_financeiro ON pagamentos;
CREATE TRIGGER trg_atualizar_status_financeiro
AFTER UPDATE ON pagamentos
FOR EACH ROW EXECUTE FUNCTION matriculas.atualizar_status_financeiro();

--------------------------
-- Funções de Integração com Documentos
--------------------------

-- Função para verificar documentação completa
CREATE OR REPLACE FUNCTION matriculas.verificar_documentacao_completa(p_matricula_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_aluno_id UUID;
  v_documentacao_completa BOOLEAN := TRUE;
BEGIN
  -- Obter o aluno_id da matrícula
  SELECT aluno_id INTO v_aluno_id
  FROM matriculas
  WHERE id = p_matricula_id;
  
  -- Verificar se existem documentos pendentes na tabela documentos
  IF EXISTS (
    SELECT 1 FROM documentos
    WHERE matricula_id = p_matricula_id
    AND status = 'pendente'
  ) THEN
    v_documentacao_completa := FALSE;
  END IF;
  
  -- Verificar também na tabela portal_aluno.documentos_aluno
  IF EXISTS (
    SELECT 1 FROM portal_aluno.documentos_aluno
    WHERE aluno_id = v_aluno_id
    AND status = 'pendente'
  ) THEN
    v_documentacao_completa := FALSE;
  END IF;
  
  RETURN v_documentacao_completa;
END;
$$ LANGUAGE plpgsql;

-- Trigger de documentos na tabela principal
CREATE OR REPLACE FUNCTION matriculas.verificar_status_documentos()
RETURNS TRIGGER AS $$
DECLARE
  v_matricula_id UUID;
  v_aluno_id UUID;
BEGIN
  -- Obter matricula_id
  v_matricula_id := NEW.matricula_id;
  
  -- Se todos os documentos estiverem aprovados, 
  -- verificar se deve remover bloqueio
  IF NOT EXISTS (
    SELECT 1 FROM documentos 
    WHERE matricula_id = v_matricula_id 
    AND status = 'pendente'
  ) THEN
    -- Obter aluno_id
    SELECT aluno_id INTO v_aluno_id
    FROM matriculas
    WHERE id = v_matricula_id;
    
    -- Verificar se não há documentos pendentes no portal do aluno
    IF NOT EXISTS (
      SELECT 1 FROM portal_aluno.documentos_aluno
      WHERE aluno_id = v_aluno_id
      AND status = 'pendente'
    ) THEN
      -- Remover bloqueio por documentação
      UPDATE portal_aluno.bloqueios_acesso
      SET 
        ativo = FALSE,
        data_fim = NOW(),
        updated_at = NOW()
      WHERE aluno_id = v_aluno_id
        AND motivo = 'documentacao_pendente'
        AND ativo = TRUE;
      
      RAISE NOTICE 'Bloqueio por documentação removido para o aluno %', v_aluno_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger à tabela documentos
DROP TRIGGER IF EXISTS trg_verificar_status_documentos ON documentos;
CREATE TRIGGER trg_verificar_status_documentos
AFTER UPDATE ON documentos
FOR EACH ROW EXECUTE FUNCTION matriculas.verificar_status_documentos();

--------------------------
-- Criar Views de Integração
--------------------------

-- View para relatório de situação de alunos
CREATE OR REPLACE VIEW matriculas.relatorio_situacao_alunos AS
SELECT 
  m.id as matricula_id,
  m.aluno_id,
  u.email as email_aluno,
  COALESCE(u.raw_user_meta_data->>'nome', u.raw_user_meta_data->>'name', u.email) as nome_aluno,
  c.nome as curso_nome,
  m.status as status_matricula,
  m.data_inicio,
  m.data_conclusao_prevista,
  pp.valor_total,
  pp.numero_parcelas,
  COALESCE((SELECT SUM(valor) FROM pagamentos WHERE matricula_id = m.id AND status = 'aprovado'), 0) as valor_pago,
  COALESCE((SELECT SUM(valor) FROM pagamentos WHERE matricula_id = m.id AND status = 'pendente' AND data_vencimento < CURRENT_DATE), 0) as valor_vencido,
  COALESCE((SELECT COUNT(*) FROM documentos WHERE matricula_id = m.id AND status = 'pendente'), 0) as docs_pendentes,
  COALESCE((SELECT EXISTS(SELECT 1 FROM portal_aluno.bloqueios_acesso WHERE aluno_id = m.aluno_id AND ativo = TRUE)), FALSE) as acesso_bloqueado,
  COALESCE((SELECT STRING_AGG(motivo::text, ', ') FROM portal_aluno.bloqueios_acesso WHERE aluno_id = m.aluno_id AND ativo = TRUE), '') as motivos_bloqueio,
  COALESCE(pa.ultimo_acesso, m.created_at) as ultimo_acesso,
  (SELECT COUNT(*) FROM matriculas.logs WHERE matricula_id = m.id) as total_eventos,
  m.tem_bolsa,
  m.percentual_bolsa,
  m.origem_matricula
FROM 
  matriculas m
JOIN 
  auth.users u ON m.aluno_id = u.id
JOIN 
  cursos c ON m.curso_id = c.id
JOIN 
  planos_pagamento pp ON m.plano_id = pp.id
LEFT JOIN 
  portal_aluno.perfil_aluno pa ON m.aluno_id = pa.id;

-- View para estatísticas por curso
CREATE OR REPLACE VIEW matriculas.estatisticas_curso AS
SELECT
  c.id as curso_id,
  c.nome as curso_nome,
  c.institution_id,
  COUNT(m.id) as total_matriculas,
  SUM(CASE WHEN m.status = 'ativa' THEN 1 ELSE 0 END) as matriculas_ativas,
  SUM(CASE WHEN m.status = 'pendente' THEN 1 ELSE 0 END) as matriculas_pendentes,
  SUM(CASE WHEN m.status = 'inadimplente' THEN 1 ELSE 0 END) as matriculas_inadimplentes,
  SUM(CASE WHEN m.status = 'cancelada' THEN 1 ELSE 0 END) as matriculas_canceladas,
  SUM(CASE WHEN m.status = 'concluida' THEN 1 ELSE 0 END) as matriculas_concluidas,
  SUM(CASE WHEN m.tem_bolsa = TRUE THEN 1 ELSE 0 END) as alunos_bolsistas,
  AVG(CASE WHEN m.tem_bolsa = TRUE THEN m.percentual_bolsa ELSE 0 END) as media_desconto,
  (SELECT COUNT(*) 
   FROM portal_aluno.bloqueios_acesso ba
   JOIN matriculas mx ON ba.aluno_id = mx.aluno_id
   WHERE mx.curso_id = c.id AND ba.ativo = TRUE
  ) as alunos_bloqueados
FROM
  cursos c
LEFT JOIN
  matriculas m ON c.id = m.curso_id
GROUP BY
  c.id, c.nome, c.institution_id;

--------------------------
-- Adicionar Funções de Controle de Acesso
--------------------------

-- Função para atualizar o controle de acesso do aluno
CREATE OR REPLACE FUNCTION matriculas.atualizar_controle_acesso()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando uma matrícula é cancelada ou trancada
  IF NEW.status IN ('cancelada', 'trancada') AND OLD.status NOT IN ('cancelada', 'trancada') THEN
    -- Cria bloqueio de acesso
    INSERT INTO portal_aluno.bloqueios_acesso (
      aluno_id,
      motivo,
      descricao,
      ativo,
      criado_por
    ) VALUES (
      NEW.aluno_id,
      CASE 
        WHEN NEW.status = 'cancelada' THEN 'administrativo'
        ELSE 'suspensao_temporaria'
      END,
      CASE 
        WHEN NEW.status = 'cancelada' THEN 'Matrícula cancelada'
        ELSE 'Matrícula temporariamente trancada'
      END,
      TRUE,
      (SELECT auth.uid())
    )
    ON CONFLICT (aluno_id) DO UPDATE SET
      ativo = TRUE,
      motivo = CASE WHEN NEW.status = 'cancelada' THEN 'administrativo' ELSE 'suspensao_temporaria' END,
      descricao = CASE WHEN NEW.status = 'cancelada' THEN 'Matrícula cancelada' ELSE 'Matrícula temporariamente trancada' END,
      data_inicio = NOW(),
      updated_at = NOW();
    
    RAISE NOTICE 'Acesso bloqueado para o aluno % devido à alteração de status para %', NEW.aluno_id, NEW.status;
  
  -- Quando uma matrícula é reativada
  ELSIF NEW.status IN ('ativa', 'reativada') AND OLD.status IN ('cancelada', 'trancada', 'inadimplente') THEN
    -- Remove bloqueios de acesso administrativos ou por suspensão temporária
    UPDATE portal_aluno.bloqueios_acesso
    SET 
      ativo = FALSE,
      data_fim = NOW(),
      updated_at = NOW()
    WHERE aluno_id = NEW.aluno_id
      AND motivo IN ('administrativo', 'suspensao_temporaria')
      AND ativo = TRUE;
    
    RAISE NOTICE 'Bloqueio administrativo removido para o aluno %', NEW.aluno_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger para controle de acesso
DROP TRIGGER IF EXISTS trg_atualizar_controle_acesso ON matriculas;
CREATE TRIGGER trg_atualizar_controle_acesso
AFTER UPDATE ON matriculas
FOR EACH ROW EXECUTE FUNCTION matriculas.atualizar_controle_acesso();

-- Criar função para API pública
CREATE OR REPLACE FUNCTION public.aluno_situacao(p_aluno_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'aluno_id', m.aluno_id,
      'email', u.email,
      'nome', COALESCE(u.raw_user_meta_data->>'nome', u.raw_user_meta_data->>'name', u.email),
      'matricula_id', m.id,
      'curso', c.nome,
      'status', m.status,
      'data_inicio', m.data_inicio,
      'data_conclusao_prevista', m.data_conclusao_prevista,
      'financeiro', jsonb_build_object(
        'total_parcelas', pp.numero_parcelas,
        'valor_total', pp.valor_total,
        'valor_pago', COALESCE((SELECT SUM(valor) FROM pagamentos WHERE matricula_id = m.id AND status = 'aprovado'), 0),
        'parcelas_pendentes', COALESCE((SELECT COUNT(*) FROM pagamentos WHERE matricula_id = m.id AND status = 'pendente'), 0),
        'proximo_vencimento', COALESCE((SELECT MIN(data_vencimento) FROM pagamentos WHERE matricula_id = m.id AND status = 'pendente'), NULL)
      ),
      'documentos_pendentes', COALESCE((SELECT COUNT(*) FROM documentos WHERE matricula_id = m.id AND status = 'pendente'), 0),
      'acesso_bloqueado', COALESCE((SELECT EXISTS(SELECT 1 FROM portal_aluno.bloqueios_acesso WHERE aluno_id = m.aluno_id AND ativo = TRUE)), FALSE),
      'ultimo_acesso', COALESCE(pa.ultimo_acesso, m.created_at)
    )
  INTO v_result
  FROM 
    matriculas m
  JOIN 
    auth.users u ON m.aluno_id = u.id
  JOIN 
    cursos c ON m.curso_id = c.id
  JOIN 
    planos_pagamento pp ON m.plano_id = pp.id
  LEFT JOIN 
    portal_aluno.perfil_aluno pa ON m.aluno_id = pa.id
  WHERE 
    m.aluno_id = p_aluno_id
  ORDER BY 
    m.created_at DESC
  LIMIT 1;

  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 