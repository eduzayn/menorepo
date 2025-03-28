-- Schema para o módulo Financeiro Empresarial - Parte 2
-- Executado por: Supabase CLI
-- Criado em: 2024-04-01

--------------------------
-- Verificações Iniciais
--------------------------
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'financeiro') THEN
    RAISE EXCEPTION 'Schema financeiro não existe. Execute a parte 1 primeiro.';
  END IF;
END $$;

--------------------------
-- Triggers e Funções
--------------------------

-- Função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION financeiro.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o campo updated_at em cobrancas
CREATE TRIGGER trg_cobrancas_updated_at
BEFORE UPDATE ON financeiro.cobrancas
FOR EACH ROW EXECUTE FUNCTION financeiro.set_updated_at();

-- Trigger para atualizar o campo updated_at em pagamentos
CREATE TRIGGER trg_pagamentos_updated_at
BEFORE UPDATE ON financeiro.pagamentos
FOR EACH ROW EXECUTE FUNCTION financeiro.set_updated_at();

-- Trigger para atualizar o campo updated_at em comissoes
CREATE TRIGGER trg_comissoes_updated_at
BEFORE UPDATE ON financeiro.comissoes
FOR EACH ROW EXECUTE FUNCTION financeiro.set_updated_at();

-- Trigger para atualizar o campo updated_at em taxas_administrativas
CREATE TRIGGER trg_taxas_administrativas_updated_at
BEFORE UPDATE ON financeiro.taxas_administrativas
FOR EACH ROW EXECUTE FUNCTION financeiro.set_updated_at();

-- Trigger para atualizar o campo updated_at em configuracao_gateways
CREATE TRIGGER trg_configuracao_gateways_updated_at
BEFORE UPDATE ON financeiro.configuracao_gateways
FOR EACH ROW EXECUTE FUNCTION financeiro.set_updated_at();

-- Trigger para atualizar o campo updated_at em regras_comissao
CREATE TRIGGER trg_regras_comissao_updated_at
BEFORE UPDATE ON financeiro.regras_comissao
FOR EACH ROW EXECUTE FUNCTION financeiro.set_updated_at();

-- Função para registrar logs financeiros
CREATE OR REPLACE FUNCTION financeiro.registrar_log()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO financeiro.logs_financeiros (
      entidade_tipo,
      entidade_id,
      acao,
      valor_anterior,
      valor_novo,
      usuario_id,
      ip_usuario
    ) VALUES (
      TG_ARGV[0],
      NEW.id,
      'criacao',
      NULL,
      to_jsonb(NEW),
      auth.uid(),
      inet_client_addr()::text
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO financeiro.logs_financeiros (
      entidade_tipo,
      entidade_id,
      acao,
      valor_anterior,
      valor_novo,
      usuario_id,
      ip_usuario
    ) VALUES (
      TG_ARGV[0],
      NEW.id,
      'alteracao',
      to_jsonb(OLD),
      to_jsonb(NEW),
      auth.uid(),
      inet_client_addr()::text
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO financeiro.logs_financeiros (
      entidade_tipo,
      entidade_id,
      acao,
      valor_anterior,
      valor_novo,
      usuario_id,
      ip_usuario
    ) VALUES (
      TG_ARGV[0],
      OLD.id,
      'cancelamento',
      to_jsonb(OLD),
      NULL,
      auth.uid(),
      inet_client_addr()::text
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para log de cobrancas
CREATE TRIGGER trg_log_cobrancas
AFTER INSERT OR UPDATE OR DELETE ON financeiro.cobrancas
FOR EACH ROW EXECUTE FUNCTION financeiro.registrar_log('cobranca');

-- Trigger para log de pagamentos
CREATE TRIGGER trg_log_pagamentos
AFTER INSERT OR UPDATE OR DELETE ON financeiro.pagamentos
FOR EACH ROW EXECUTE FUNCTION financeiro.registrar_log('pagamento');

-- Trigger para log de comissoes
CREATE TRIGGER trg_log_comissoes
AFTER INSERT OR UPDATE OR DELETE ON financeiro.comissoes
FOR EACH ROW EXECUTE FUNCTION financeiro.registrar_log('comissao');

-- Trigger para log de taxas_administrativas
CREATE TRIGGER trg_log_taxas
AFTER INSERT OR UPDATE OR DELETE ON financeiro.taxas_administrativas
FOR EACH ROW EXECUTE FUNCTION financeiro.registrar_log('taxa');

-- Função para atualizar status de cobrança quando um pagamento é confirmado
CREATE OR REPLACE FUNCTION financeiro.atualizar_status_cobranca()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmado' AND NEW.cobranca_id IS NOT NULL THEN
    UPDATE financeiro.cobrancas
    SET 
      status = 'pago',
      data_pagamento = NEW.data_pagamento
    WHERE id = NEW.cobranca_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar status de cobrança
CREATE TRIGGER trg_atualizar_status_cobranca
AFTER INSERT OR UPDATE ON financeiro.pagamentos
FOR EACH ROW EXECUTE FUNCTION financeiro.atualizar_status_cobranca();

-- Função para verificar cobranças vencidas diariamente
CREATE OR REPLACE FUNCTION financeiro.verificar_cobrancas_vencidas()
RETURNS void AS $$
BEGIN
  UPDATE financeiro.cobrancas
  SET status = 'vencido'
  WHERE status = 'pendente'
    AND data_vencimento < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular comissões
CREATE OR REPLACE FUNCTION financeiro.calcular_comissao()
RETURNS TRIGGER AS $$
DECLARE
  v_cobranca financeiro.cobrancas%ROWTYPE;
  v_regra financeiro.regras_comissao%ROWTYPE;
  v_comissao_valor DECIMAL(10,2);
  v_base_calculo DECIMAL(10,2);
  v_curso_id UUID;
BEGIN
  -- Obter dados da cobrança
  SELECT * INTO v_cobranca FROM financeiro.cobrancas WHERE id = NEW.id;
  
  -- Verificar se a cobrança está paga
  IF v_cobranca.status != 'pago' THEN
    RETURN NEW;
  END IF;
  
  -- Obter curso_id da matrícula
  SELECT curso_id INTO v_curso_id 
  FROM public.matriculas 
  WHERE id = v_cobranca.matricula_id;
  
  -- Buscar regras de comissão para o curso
  FOR v_regra IN 
    SELECT * FROM financeiro.regras_comissao 
    WHERE (curso_id = v_curso_id OR curso_id IS NULL)
    ORDER BY curso_id NULLS LAST
  LOOP
    v_base_calculo := v_cobranca.valor;
    
    -- Calcular valor da comissão
    IF v_regra.percentual IS NOT NULL THEN
      v_comissao_valor := v_base_calculo * (v_regra.percentual / 100);
    ELSIF v_regra.valor_fixo IS NOT NULL THEN
      v_comissao_valor := v_regra.valor_fixo;
    ELSE
      v_comissao_valor := 0;
    END IF;
    
    -- Inserir registro de comissão
    IF v_comissao_valor > 0 THEN
      INSERT INTO financeiro.comissoes (
        colaborador_id,
        colaborador_nome,
        cobranca_id,
        valor,
        percentual,
        base_calculo,
        data_referencia,
        status,
        regra_comissao_id,
        instituicao_id
      )
      VALUES (
        (SELECT id FROM auth.users WHERE id = 
          CASE 
            WHEN v_regra.tipo_beneficiario = 'consultor' THEN
              (SELECT id FROM public.profiles WHERE id = 
                (SELECT coordenador_id FROM public.cursos WHERE id = v_curso_id)
              )
            WHEN v_regra.tipo_beneficiario = 'polo' THEN
              (SELECT institution_id FROM public.profiles WHERE id = v_cobranca.aluno_id)
            END
        ),
        (SELECT full_name FROM public.profiles WHERE id = 
          CASE 
            WHEN v_regra.tipo_beneficiario = 'consultor' THEN
              (SELECT id FROM public.profiles WHERE id = 
                (SELECT coordenador_id FROM public.cursos WHERE id = v_curso_id)
              )
            WHEN v_regra.tipo_beneficiario = 'polo' THEN
              (SELECT institution_id FROM public.profiles WHERE id = v_cobranca.aluno_id)
            END
        ),
        v_cobranca.id,
        v_comissao_valor,
        COALESCE(v_regra.percentual, 0),
        v_base_calculo,
        CURRENT_DATE,
        'pendente',
        v_regra.id,
        v_cobranca.instituicao_id
      );
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular comissões quando uma cobrança é paga
CREATE TRIGGER trg_calcular_comissao
AFTER UPDATE OF status ON financeiro.cobrancas
FOR EACH ROW
WHEN (NEW.status = 'pago' AND OLD.status != 'pago')
EXECUTE FUNCTION financeiro.calcular_comissao();

--------------------------
-- Row Level Security (RLS)
--------------------------

-- Ativar RLS para todas as tabelas
ALTER TABLE financeiro.cobrancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro.comissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro.taxas_administrativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro.logs_financeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro.configuracao_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro.regras_comissao ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (caso existam)
DROP POLICY IF EXISTS "Usuários veem as próprias cobranças" ON financeiro.cobrancas;
DROP POLICY IF EXISTS "Administradores veem todas as cobranças" ON financeiro.cobrancas;
DROP POLICY IF EXISTS "Usuários veem as próprias comissões" ON financeiro.comissoes;
DROP POLICY IF EXISTS "Administradores veem todas as comissões" ON financeiro.comissoes;
DROP POLICY IF EXISTS "Usuários veem as próprias transações" ON financeiro.pagamentos;
DROP POLICY IF EXISTS "Administradores veem todas as transações" ON financeiro.pagamentos;
DROP POLICY IF EXISTS "Financeiro vê todas as taxas" ON financeiro.taxas_administrativas;
DROP POLICY IF EXISTS "Administradores gerenciam configurações de gateway" ON financeiro.configuracao_gateways;
DROP POLICY IF EXISTS "Administradores gerenciam logs financeiros" ON financeiro.logs_financeiros;
DROP POLICY IF EXISTS "Administradores gerenciam regras de comissão" ON financeiro.regras_comissao;

-- Políticas para cobrancas
CREATE POLICY "Usuários veem as próprias cobranças"
  ON financeiro.cobrancas
  FOR SELECT
  TO authenticated
  USING (
    aluno_id = auth.uid()
  );

CREATE POLICY "Administradores veem todas as cobranças"
  ON financeiro.cobrancas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'professor')
    )
  );

-- Políticas para pagamentos
CREATE POLICY "Usuários veem as próprias transações"
  ON financeiro.pagamentos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM financeiro.cobrancas
      WHERE cobrancas.id = pagamentos.cobranca_id
      AND cobrancas.aluno_id = auth.uid()
    )
    OR
    destinatario_id = auth.uid()
  );

CREATE POLICY "Administradores veem todas as transações"
  ON financeiro.pagamentos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'professor')
    )
  );

-- Políticas para comissões
CREATE POLICY "Usuários veem as próprias comissões"
  ON financeiro.comissoes
  FOR SELECT
  TO authenticated
  USING (
    colaborador_id = auth.uid()
  );

CREATE POLICY "Administradores veem todas as comissões"
  ON financeiro.comissoes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'professor')
    )
  );

-- Políticas para taxas administrativas
CREATE POLICY "Financeiro vê todas as taxas"
  ON financeiro.taxas_administrativas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'professor')
    )
  );

-- Políticas para configuração de gateways
CREATE POLICY "Administradores gerenciam configurações de gateway"
  ON financeiro.configuracao_gateways
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin')
    )
  );

-- Políticas para logs financeiros
CREATE POLICY "Administradores gerenciam logs financeiros"
  ON financeiro.logs_financeiros
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin')
    )
  );

-- Políticas para regras de comissão
CREATE POLICY "Administradores gerenciam regras de comissão"
  ON financeiro.regras_comissao
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin')
    )
  );

--------------------------
-- Views para Relatórios
--------------------------

-- View de resumo financeiro
CREATE OR REPLACE VIEW financeiro.resumo_financeiro AS
SELECT
  i.id AS instituicao_id,
  i.name AS instituicao_nome,
  (
    SELECT COALESCE(SUM(valor), 0)
    FROM financeiro.cobrancas c
    WHERE c.instituicao_id = i.id
    AND c.status = 'pago'
    AND DATE_TRUNC('month', c.data_pagamento) = DATE_TRUNC('month', CURRENT_DATE)
  ) AS receitas_mes_atual,
  (
    SELECT COALESCE(SUM(valor), 0)
    FROM financeiro.pagamentos p
    WHERE p.instituicao_id = i.id
    AND p.tipo = 'saida'
    AND p.status = 'confirmado'
    AND DATE_TRUNC('month', p.data_pagamento) = DATE_TRUNC('month', CURRENT_DATE)
  ) AS despesas_mes_atual,
  (
    SELECT COALESCE(SUM(valor), 0)
    FROM financeiro.cobrancas c
    WHERE c.instituicao_id = i.id
    AND c.status = 'pendente'
    AND c.data_vencimento < CURRENT_DATE
  ) AS inadimplencia_total,
  (
    SELECT 
      CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(100.0 * 
          COUNT(CASE WHEN status = 'vencido' THEN 1 END) /
          COUNT(*), 2)
      END
    FROM financeiro.cobrancas c
    WHERE c.instituicao_id = i.id
    AND DATE_TRUNC('month', c.data_vencimento) = DATE_TRUNC('month', CURRENT_DATE)
  ) AS percentual_inadimplencia,
  (
    SELECT COUNT(*)
    FROM financeiro.cobrancas c
    WHERE c.instituicao_id = i.id
    AND c.status = 'pendente'
  ) AS cobrancas_pendentes,
  (
    SELECT COUNT(*)
    FROM financeiro.cobrancas c
    WHERE c.instituicao_id = i.id
    AND c.status = 'pago'
    AND DATE_TRUNC('month', c.data_pagamento) = DATE_TRUNC('month', CURRENT_DATE)
  ) AS cobrancas_pagas,
  (
    SELECT COUNT(*)
    FROM financeiro.cobrancas c
    WHERE c.instituicao_id = i.id
    AND c.status = 'vencido'
  ) AS cobrancas_vencidas,
  (
    SELECT COALESCE(SUM(valor), 0)
    FROM financeiro.comissoes com
    WHERE com.instituicao_id = i.id
    AND com.status = 'pendente'
  ) AS comissoes_a_pagar
FROM
  public.institutions i;

-- View de fluxo de caixa diário
CREATE OR REPLACE VIEW financeiro.fluxo_caixa_diario AS
WITH entradas AS (
  SELECT
    DATE_TRUNC('day', data_pagamento) AS data,
    instituicao_id,
    SUM(valor) AS valor_total
  FROM
    financeiro.cobrancas
  WHERE
    status = 'pago'
  GROUP BY
    DATE_TRUNC('day', data_pagamento),
    instituicao_id
),
saidas AS (
  SELECT
    DATE_TRUNC('day', data_pagamento) AS data,
    instituicao_id,
    SUM(valor) AS valor_total
  FROM
    financeiro.pagamentos
  WHERE
    tipo = 'saida'
    AND status = 'confirmado'
  GROUP BY
    DATE_TRUNC('day', data_pagamento),
    instituicao_id
)
SELECT
  COALESCE(e.data, s.data) AS data,
  COALESCE(e.instituicao_id, s.instituicao_id) AS instituicao_id,
  i.name AS instituicao_nome,
  COALESCE(e.valor_total, 0) AS entradas,
  COALESCE(s.valor_total, 0) AS saidas,
  COALESCE(e.valor_total, 0) - COALESCE(s.valor_total, 0) AS saldo_diario
FROM
  entradas e
FULL OUTER JOIN
  saidas s ON e.data = s.data AND e.instituicao_id = s.instituicao_id
JOIN
  public.institutions i ON COALESCE(e.instituicao_id, s.instituicao_id) = i.id
ORDER BY
  data DESC;

-- View de inadimplência por curso
CREATE OR REPLACE VIEW financeiro.inadimplencia_por_curso AS
SELECT
  c.id AS curso_id,
  c.nome AS curso_nome,
  i.id AS instituicao_id,
  i.name AS instituicao_nome,
  COUNT(DISTINCT cob.aluno_id) AS total_alunos_inadimplentes,
  SUM(cob.valor) AS valor_total_inadimplencia,
  (
    SELECT COUNT(DISTINCT aluno_id)
    FROM public.matriculas m
    WHERE m.curso_id = c.id
    AND m.status = 'ativa'
  ) AS total_alunos_ativos,
  CASE
    WHEN (SELECT COUNT(DISTINCT aluno_id) FROM public.matriculas m WHERE m.curso_id = c.id AND m.status = 'ativa') = 0 THEN 0
    ELSE ROUND(100.0 * COUNT(DISTINCT cob.aluno_id) / (SELECT COUNT(DISTINCT aluno_id) FROM public.matriculas m WHERE m.curso_id = c.id AND m.status = 'ativa'), 2)
  END AS percentual_inadimplencia
FROM
  financeiro.cobrancas cob
JOIN
  public.matriculas m ON cob.matricula_id = m.id
JOIN
  public.cursos c ON m.curso_id = c.id
JOIN
  public.institutions i ON c.institution_id = i.id
WHERE
  cob.status = 'vencido'
GROUP BY
  c.id, c.nome, i.id, i.name;

-- Storage Buckets para comprovantes financeiros
INSERT INTO storage.buckets (id, name, public)
VALUES ('comprovantes_financeiros', 'Comprovantes Financeiros', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para comprovantes financeiros
DROP POLICY IF EXISTS "Usuários podem ver seus próprios comprovantes" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem enviar seus próprios comprovantes" ON storage.objects;
DROP POLICY IF EXISTS "Administradores podem ver todos os comprovantes" ON storage.objects;

CREATE POLICY "Usuários podem ver seus próprios comprovantes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'comprovantes_financeiros'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Usuários podem enviar seus próprios comprovantes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'comprovantes_financeiros'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Administradores podem ver todos os comprovantes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'comprovantes_financeiros'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'professor')
    )
  ); 