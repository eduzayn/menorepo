-- Integração do módulo RH com Contabilidade
-- Executado por: Supabase CLI
-- Criado em: 2024-07-03

--------------------------
-- Funções de Integração
--------------------------

-- Função para contabilizar a folha de pagamento
CREATE OR REPLACE FUNCTION contabilidade.contabilizar_folha_pagamento(
  p_instituicao_id UUID,
  p_mes INTEGER,
  p_ano INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, contabilidade, rh
AS $$
DECLARE
  v_resultado JSONB;
  v_lancamento_id UUID;
  v_total_salarios DECIMAL(15,2) := 0;
  v_total_encargos DECIMAL(15,2) := 0;
  v_data_competencia DATE;
  v_count INTEGER := 0;
  v_historico TEXT;
BEGIN
  -- Definir a data de competência
  v_data_competencia := make_date(p_ano, p_mes, 1);
  
  -- Verificar se já existe contabilização para este período
  SELECT COUNT(*)
  INTO v_count
  FROM contabilidade.lancamentos
  WHERE instituicao_id = p_instituicao_id
    AND EXTRACT(MONTH FROM data_competencia) = p_mes
    AND EXTRACT(YEAR FROM data_competencia) = p_ano
    AND historico LIKE 'Folha de Pagamento%';
    
  IF v_count > 0 THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Folha de pagamento já contabilizada para este período',
      'dados', NULL
    );
  END IF;
  
  -- Calcular totais de salários e encargos
  SELECT 
    COALESCE(SUM(CASE WHEN fp.tipo = 'SALARIO' THEN fp.valor ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN fp.tipo = 'ENCARGO' THEN fp.valor ELSE 0 END), 0)
  INTO v_total_salarios, v_total_encargos
  FROM rh.folha_pagamento fp
  JOIN rh.colaboradores c ON c.id = fp.colaborador_id
  WHERE fp.instituicao_id = p_instituicao_id
    AND EXTRACT(MONTH FROM fp.data_pagamento) = p_mes
    AND EXTRACT(YEAR FROM fp.data_pagamento) = p_ano
    AND fp.status = 'APROVADO';
    
  -- Se não houver dados, retornar erro
  IF v_total_salarios = 0 AND v_total_encargos = 0 THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Não há folha de pagamento aprovada para este período',
      'dados', NULL
    );
  END IF;
  
  -- Histórico para o lançamento
  v_historico := 'Folha de Pagamento - ' || TO_CHAR(v_data_competencia, 'MM/YYYY');
  
  -- Iniciar uma transação
  BEGIN
    -- Contabilizar salários (débito em despesa de salários, crédito em salários a pagar)
    IF v_total_salarios > 0 THEN
      INSERT INTO contabilidade.lancamentos (
        instituicao_id,
        data_lancamento,
        data_competencia,
        tipo,
        valor,
        conta_debito_id,
        conta_credito_id,
        centro_custo_id,
        documento_fiscal,
        historico,
        status,
        usuario_id
      )
      SELECT
        p_instituicao_id,
        CURRENT_DATE,
        v_data_competencia,
        'NORMAL',
        v_total_salarios,
        (SELECT id FROM contabilidade.contas WHERE instituicao_id = p_instituicao_id AND codigo = '3.1.1.01'), -- Despesa com Salários
        (SELECT id FROM contabilidade.contas WHERE instituicao_id = p_instituicao_id AND codigo = '2.1.3.01'), -- Salários a Pagar
        NULL, -- Centro de custo pode ser adaptado conforme necessidade
        NULL,
        v_historico || ' - Salários',
        'APROVADO',
        auth.uid()
      RETURNING id INTO v_lancamento_id;
    END IF;
    
    -- Contabilizar encargos (débito em despesa de encargos, crédito em encargos a recolher)
    IF v_total_encargos > 0 THEN
      INSERT INTO contabilidade.lancamentos (
        instituicao_id,
        data_lancamento,
        data_competencia,
        tipo,
        valor,
        conta_debito_id,
        conta_credito_id,
        centro_custo_id,
        documento_fiscal,
        historico,
        status,
        usuario_id
      )
      SELECT
        p_instituicao_id,
        CURRENT_DATE,
        v_data_competencia,
        'NORMAL',
        v_total_encargos,
        (SELECT id FROM contabilidade.contas WHERE instituicao_id = p_instituicao_id AND codigo = '3.1.1.02'), -- Despesa com Encargos
        (SELECT id FROM contabilidade.contas WHERE instituicao_id = p_instituicao_id AND codigo = '2.1.3.02'), -- Encargos a Recolher
        NULL, -- Centro de custo pode ser adaptado conforme necessidade
        NULL,
        v_historico || ' - Encargos',
        'APROVADO',
        auth.uid()
      RETURNING id INTO v_lancamento_id;
    END IF;
    
    -- Registrar a integração na tabela de integrações
    INSERT INTO contabilidade.integracoes (
      instituicao_id,
      modulo_origem,
      referencia_origem,
      modulo_destino,
      referencia_destino,
      data_integracao,
      detalhes
    ) VALUES (
      p_instituicao_id,
      'RH',
      'FOLHA-' || TO_CHAR(v_data_competencia, 'MM-YYYY'),
      'CONTABILIDADE',
      v_lancamento_id::TEXT,
      CURRENT_TIMESTAMP,
      jsonb_build_object(
        'mes', p_mes,
        'ano', p_ano,
        'total_salarios', v_total_salarios,
        'total_encargos', v_total_encargos
      )
    );
    
    -- Construir resultado de sucesso
    v_resultado := jsonb_build_object(
      'sucesso', TRUE,
      'mensagem', 'Folha de pagamento contabilizada com sucesso',
      'dados', jsonb_build_object(
        'mes', p_mes,
        'ano', p_ano,
        'total_salarios', v_total_salarios,
        'total_encargos', v_total_encargos,
        'lancamento_id', v_lancamento_id
      )
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Desfazer em caso de erro
    RAISE NOTICE 'Erro ao contabilizar folha: %', SQLERRM;
    v_resultado := jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Erro ao contabilizar folha de pagamento: ' || SQLERRM,
      'dados', NULL
    );
  END;
  
  RETURN v_resultado;
END;
$$;

-- Função para contabilizar provisão de férias
CREATE OR REPLACE FUNCTION contabilidade.contabilizar_provisao_ferias(
  p_instituicao_id UUID,
  p_mes INTEGER,
  p_ano INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, contabilidade, rh
AS $$
DECLARE
  v_resultado JSONB;
  v_lancamento_id UUID;
  v_total_provisao DECIMAL(15,2) := 0;
  v_data_competencia DATE;
  v_count INTEGER := 0;
  v_historico TEXT;
BEGIN
  -- Definir a data de competência
  v_data_competencia := make_date(p_ano, p_mes, 1);
  
  -- Verificar se já existe provisão para este período
  SELECT COUNT(*)
  INTO v_count
  FROM contabilidade.lancamentos
  WHERE instituicao_id = p_instituicao_id
    AND EXTRACT(MONTH FROM data_competencia) = p_mes
    AND EXTRACT(YEAR FROM data_competencia) = p_ano
    AND historico LIKE 'Provisão de Férias%';
    
  IF v_count > 0 THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Provisão de férias já contabilizada para este período',
      'dados', NULL
    );
  END IF;
  
  -- Calcular total de provisão de férias (1/12 do salário por mês trabalhado + 1/3 constitucional)
  SELECT 
    COALESCE(SUM((c.salario / 12) * 1.33), 0)
  INTO v_total_provisao
  FROM rh.colaboradores c
  WHERE c.instituicao_id = p_instituicao_id
    AND c.status = 'ATIVO'
    AND c.tipo_contrato = 'CLT';
    
  -- Se não houver dados, retornar erro
  IF v_total_provisao = 0 THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Não há colaboradores ativos para provisão de férias neste período',
      'dados', NULL
    );
  END IF;
  
  -- Histórico para o lançamento
  v_historico := 'Provisão de Férias - ' || TO_CHAR(v_data_competencia, 'MM/YYYY');
  
  -- Iniciar uma transação
  BEGIN
    -- Contabilizar provisão (débito em despesa de provisão, crédito em provisão para férias)
    INSERT INTO contabilidade.lancamentos (
      instituicao_id,
      data_lancamento,
      data_competencia,
      tipo,
      valor,
      conta_debito_id,
      conta_credito_id,
      centro_custo_id,
      documento_fiscal,
      historico,
      status,
      usuario_id
    )
    SELECT
      p_instituicao_id,
      CURRENT_DATE,
      v_data_competencia,
      'NORMAL',
      v_total_provisao,
      (SELECT id FROM contabilidade.contas WHERE instituicao_id = p_instituicao_id AND codigo = '3.1.2.01'), -- Despesa com Provisão de Férias
      (SELECT id FROM contabilidade.contas WHERE instituicao_id = p_instituicao_id AND codigo = '2.1.4.01'), -- Provisão para Férias
      NULL, -- Centro de custo pode ser adaptado conforme necessidade
      NULL,
      v_historico,
      'APROVADO',
      auth.uid()
    RETURNING id INTO v_lancamento_id;
    
    -- Registrar a integração na tabela de integrações
    INSERT INTO contabilidade.integracoes (
      instituicao_id,
      modulo_origem,
      referencia_origem,
      modulo_destino,
      referencia_destino,
      data_integracao,
      detalhes
    ) VALUES (
      p_instituicao_id,
      'RH',
      'PROVISAO-FERIAS-' || TO_CHAR(v_data_competencia, 'MM-YYYY'),
      'CONTABILIDADE',
      v_lancamento_id::TEXT,
      CURRENT_TIMESTAMP,
      jsonb_build_object(
        'mes', p_mes,
        'ano', p_ano,
        'total_provisao', v_total_provisao
      )
    );
    
    -- Construir resultado de sucesso
    v_resultado := jsonb_build_object(
      'sucesso', TRUE,
      'mensagem', 'Provisão de férias contabilizada com sucesso',
      'dados', jsonb_build_object(
        'mes', p_mes,
        'ano', p_ano,
        'total_provisao', v_total_provisao,
        'lancamento_id', v_lancamento_id
      )
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Desfazer em caso de erro
    RAISE NOTICE 'Erro ao contabilizar provisão de férias: %', SQLERRM;
    v_resultado := jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Erro ao contabilizar provisão de férias: ' || SQLERRM,
      'dados', NULL
    );
  END;
  
  RETURN v_resultado;
END;
$$;

-- Função para gerar relatório de custos de pessoal
CREATE OR REPLACE FUNCTION contabilidade.relatorio_custos_pessoal(
  p_instituicao_id UUID,
  p_mes INTEGER,
  p_ano INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, contabilidade, rh
AS $$
DECLARE
  v_resultado JSONB;
  v_data_inicio DATE;
  v_data_fim DATE;
  v_relatorio JSONB;
BEGIN
  -- Definir período do relatório
  v_data_inicio := make_date(p_ano, p_mes, 1);
  v_data_fim := (v_data_inicio + interval '1 month' - interval '1 day')::date;
  
  -- Gerar estrutura do relatório
  SELECT jsonb_build_object(
    'periodo', jsonb_build_object(
      'mes', p_mes,
      'ano', p_ano,
      'inicio', v_data_inicio,
      'fim', v_data_fim
    ),
    'totais', jsonb_build_object(
      'salarios', COALESCE((
        SELECT SUM(fp.valor)
        FROM rh.folha_pagamento fp
        WHERE fp.instituicao_id = p_instituicao_id
          AND fp.tipo = 'SALARIO'
          AND fp.status = 'APROVADO'
          AND fp.data_pagamento BETWEEN v_data_inicio AND v_data_fim
      ), 0),
      'encargos', COALESCE((
        SELECT SUM(fp.valor)
        FROM rh.folha_pagamento fp
        WHERE fp.instituicao_id = p_instituicao_id
          AND fp.tipo = 'ENCARGO'
          AND fp.status = 'APROVADO'
          AND fp.data_pagamento BETWEEN v_data_inicio AND v_data_fim
      ), 0),
      'beneficios', COALESCE((
        SELECT SUM(b.valor)
        FROM rh.beneficios b
        WHERE b.instituicao_id = p_instituicao_id
          AND b.data_concessao BETWEEN v_data_inicio AND v_data_fim
      ), 0),
      'ferias_provisao', COALESCE((
        SELECT valor
        FROM contabilidade.lancamentos
        WHERE instituicao_id = p_instituicao_id
          AND historico LIKE 'Provisão de Férias%'
          AND data_competencia = v_data_inicio
      ), 0)
    ),
    'por_departamento', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'departamento_id', d.id,
          'departamento_nome', d.nome,
          'total', COALESCE(SUM(fp.valor), 0),
          'qtd_colaboradores', COUNT(DISTINCT c.id)
        )
      )
      FROM rh.departamentos d
      LEFT JOIN rh.colaboradores c ON c.departamento_id = d.id
      LEFT JOIN rh.folha_pagamento fp ON fp.colaborador_id = c.id
      WHERE d.instituicao_id = p_instituicao_id
        AND fp.data_pagamento BETWEEN v_data_inicio AND v_data_fim
      GROUP BY d.id, d.nome
    ),
    'por_cargo', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'cargo_id', cg.id,
          'cargo_nome', cg.nome,
          'total', COALESCE(SUM(fp.valor), 0),
          'qtd_colaboradores', COUNT(DISTINCT c.id)
        )
      )
      FROM rh.cargos cg
      LEFT JOIN rh.colaboradores c ON c.cargo_id = cg.id
      LEFT JOIN rh.folha_pagamento fp ON fp.colaborador_id = c.id
      WHERE cg.instituicao_id = p_instituicao_id
        AND fp.data_pagamento BETWEEN v_data_inicio AND v_data_fim
      GROUP BY cg.id, cg.nome
    )
  ) INTO v_relatorio;
  
  -- Inserir o relatório no histórico
  INSERT INTO contabilidade.relatorios (
    instituicao_id,
    tipo, 
    periodo_inicio,
    periodo_fim, 
    conteudo,
    gerado_por,
    gerado_em
  ) VALUES (
    p_instituicao_id,
    'CUSTOS_PESSOAL',
    v_data_inicio,
    v_data_fim,
    v_relatorio,
    auth.uid(),
    CURRENT_TIMESTAMP
  );
  
  -- Construir resultado
  v_resultado := jsonb_build_object(
    'sucesso', TRUE,
    'mensagem', 'Relatório de custos de pessoal gerado com sucesso',
    'dados', v_relatorio
  );
  
  RETURN v_resultado;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'sucesso', FALSE,
    'mensagem', 'Erro ao gerar relatório: ' || SQLERRM,
    'dados', NULL
  );
END;
$$;

--------------------------
-- Triggers
--------------------------

-- Trigger para atualizar contabilidade ao aprovar folha de pagamento
CREATE OR REPLACE FUNCTION rh.trigger_folha_aprovada_contabilizar()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_resultado JSONB;
  v_mes INTEGER;
  v_ano INTEGER;
BEGIN
  -- Verificar se o status mudou para APROVADO
  IF NEW.status = 'APROVADO' AND (OLD.status IS NULL OR OLD.status <> 'APROVADO') THEN
    -- Extrair mês e ano da data de pagamento
    v_mes := EXTRACT(MONTH FROM NEW.data_pagamento);
    v_ano := EXTRACT(YEAR FROM NEW.data_pagamento);
    
    -- Chamar função de contabilização
    -- Observe que isso é apenas um registro para contabilização futura em lote
    -- A contabilização efetiva deve ser feita pela função apropriada
    INSERT INTO rh.pendencias_contabilizacao (
      instituicao_id,
      tipo,
      referencia_id,
      mes,
      ano,
      status,
      criado_em
    ) VALUES (
      NEW.instituicao_id,
      'FOLHA_PAGAMENTO',
      NEW.id,
      v_mes,
      v_ano,
      'PENDENTE',
      CURRENT_TIMESTAMP
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar o trigger para a tabela de folha de pagamento
DROP TRIGGER IF EXISTS trigger_folha_aprovada_contabilizar ON rh.folha_pagamento;
CREATE TRIGGER trigger_folha_aprovada_contabilizar
AFTER UPDATE OF status ON rh.folha_pagamento
FOR EACH ROW
EXECUTE FUNCTION rh.trigger_folha_aprovada_contabilizar();

--------------------------
-- Políticas de Segurança (RLS)
--------------------------

-- Política para tabela de integrações - apenas visualização por instituição
CREATE POLICY policy_integracoes_select
  ON contabilidade.integracoes
  FOR SELECT
  TO authenticated
  USING (instituicao_id IN (
    SELECT instituicao_id FROM public.users_institutions WHERE user_id = auth.uid()
  ));

-- Política para tabela de integrações - apenas inserção para usuários com permissão
CREATE POLICY policy_integracoes_insert
  ON contabilidade.integracoes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    instituicao_id IN (
      SELECT ui.instituicao_id 
      FROM public.users_institutions ui
      JOIN public.permissions p ON p.user_id = ui.user_id 
      WHERE ui.user_id = auth.uid()
        AND p.permission = 'admin'
    )
  );

-- [Fim do arquivo] 