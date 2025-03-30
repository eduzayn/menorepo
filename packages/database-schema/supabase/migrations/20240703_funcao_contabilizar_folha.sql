-- Script para criar função de contabilização de folha de pagamento
-- Executado por: Supabase CLI
-- Criado em: 2024-07-03

-- Função para contabilizar folha de pagamento
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
  v_integracao_id UUID;
  v_conta_debito_id UUID;
  v_conta_credito_id UUID;
  v_numero_lancamento VARCHAR(20);
  v_valor_total DECIMAL(15,2) := 0;
  v_contador INTEGER := 0;
  v_data_competencia DATE;
  v_pendencia RECORD;
  v_folha JSONB;
  v_existe_pendencia BOOLEAN := FALSE;
BEGIN
  -- Validar parâmetros
  IF p_mes < 1 OR p_mes > 12 THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Mês inválido. Deve estar entre 1 e 12.',
      'dados', NULL
    );
  END IF;
  
  IF p_ano < 2000 OR p_ano > EXTRACT(YEAR FROM CURRENT_DATE) + 1 THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Ano inválido.',
      'dados', NULL
    );
  END IF;
  
  -- Verificar se instituição existe
  IF NOT EXISTS (SELECT 1 FROM institutions WHERE id = p_instituicao_id) THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Instituição não encontrada',
      'dados', NULL
    );
  END IF;
  
  -- Verificar se já existe contabilização para o período
  IF EXISTS (
    SELECT 1 
    FROM contabilidade.lancamentos l
    WHERE l.instituicao_id = p_instituicao_id
      AND EXTRACT(MONTH FROM l.data_competencia) = p_mes
      AND EXTRACT(YEAR FROM l.data_competencia) = p_ano
      AND l.tipo = 'FOLHA_PAGAMENTO'
  ) THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Já existe contabilização de folha para o período ' || p_mes || '/' || p_ano,
      'dados', NULL
    );
  END IF;
  
  -- Definir data de competência (último dia do mês)
  v_data_competencia := (p_ano || '-' || p_mes || '-01')::DATE + INTERVAL '1 month - 1 day';
  
  -- Buscar contas contábeis para débito (despesa de pessoal) e crédito (obrigação)
  SELECT id INTO v_conta_debito_id
  FROM contabilidade.contas
  WHERE instituicao_id = p_instituicao_id
    AND codigo = '3.1.1.01' -- Salários e Ordenados
    AND permite_lancamentos = TRUE;
  
  SELECT id INTO v_conta_credito_id
  FROM contabilidade.contas
  WHERE instituicao_id = p_instituicao_id
    AND codigo = '2.1.3.01' -- Salários a Pagar
    AND permite_lancamentos = TRUE;
  
  -- Verificar se as contas contábeis necessárias existem
  IF v_conta_debito_id IS NULL OR v_conta_credito_id IS NULL THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Contas contábeis necessárias não encontradas. Execute a função gerar_plano_contas_rh primeiro.',
      'dados', NULL
    );
  END IF;
  
  -- Verificar se existe pendência de contabilização
  SELECT EXISTS (
    SELECT 1 
    FROM rh.pendencias_contabilizacao
    WHERE instituicao_id = p_instituicao_id
      AND mes = p_mes
      AND ano = p_ano
      AND tipo = 'FOLHA_PAGAMENTO'
      AND status = 'PENDENTE'
  ) INTO v_existe_pendencia;
  
  -- Se não existir pendência, verificar se existem dados de folha para contabilizar
  -- (Este bloco seria substituído pela lógica real de busca na tabela de folha)
  -- Neste exemplo, simulamos dados da folha para poder testar:
  IF NOT v_existe_pendencia THEN
    -- Simulação de dados de folha para teste
    v_folha := jsonb_build_object(
      'total_bruto', 50000.00,
      'total_inss', 5500.00,
      'total_fgts', 4000.00,
      'total_liquido', 40500.00
    );
    
    -- Na implementação real, faria um SELECT na tabela de folha de pagamento
    -- e verificaria se já foi aprovada, exemplo:
    /*
    SELECT jsonb_build_object(
      'total_bruto', SUM(valor_bruto),
      'total_inss', SUM(valor_inss),
      'total_fgts', SUM(valor_fgts),
      'total_liquido', SUM(valor_liquido)
    )
    FROM rh.folha_pagamento
    WHERE instituicao_id = p_instituicao_id
      AND mes = p_mes 
      AND ano = p_ano
      AND status = 'APROVADA'
    INTO v_folha;
    */
    
    IF v_folha IS NULL OR v_folha->>'total_bruto' IS NULL THEN
      RETURN jsonb_build_object(
        'sucesso', FALSE,
        'mensagem', 'Não foram encontrados dados de folha de pagamento para o período ' || p_mes || '/' || p_ano,
        'dados', NULL
      );
    END IF;
    
    -- Valor total a contabilizar
    v_valor_total := (v_folha->>'total_bruto')::DECIMAL(15,2);
  ELSE
    -- Buscar todas as pendências para o período
    FOR v_pendencia IN
      SELECT * 
      FROM rh.pendencias_contabilizacao
      WHERE instituicao_id = p_instituicao_id
        AND mes = p_mes
        AND ano = p_ano
        AND tipo = 'FOLHA_PAGAMENTO'
        AND status = 'PENDENTE'
    LOOP
      v_valor_total := v_valor_total + v_pendencia.valor;
    END FOR;
    
    IF v_valor_total <= 0 THEN
      RETURN jsonb_build_object(
        'sucesso', FALSE,
        'mensagem', 'Não há valores pendentes para contabilização no período ' || p_mes || '/' || p_ano,
        'dados', NULL
      );
    END IF;
  END IF;
  
  -- Criar registro de integração
  INSERT INTO contabilidade.integracoes (
    instituicao_id,
    modulo_origem,
    modulo_destino,
    referencia_origem,
    status,
    detalhes
  ) VALUES (
    p_instituicao_id,
    'RH',
    'CONTABILIDADE',
    'FOLHA-' || p_mes || '-' || p_ano,
    'PROCESSANDO',
    jsonb_build_object(
      'mes', p_mes,
      'ano', p_ano,
      'valor_total', v_valor_total
    )
  ) RETURNING id INTO v_integracao_id;
  
  -- Gerar número de lançamento
  v_numero_lancamento := 'FP' || TO_CHAR(v_data_competencia, 'YYYYMM') || '-' || LPAD(v_contador::TEXT, 3, '0');
  
  BEGIN
    -- Iniciar transação para garantir atomicidade
    -- Criar lançamento contábil principal (folha bruta)
    INSERT INTO contabilidade.lancamentos (
      instituicao_id,
      numero_lancamento,
      data_lancamento,
      data_competencia,
      tipo,
      conta_debito_id,
      conta_credito_id,
      valor,
      historico,
      integracao_id,
      created_by
    ) VALUES (
      p_instituicao_id,
      v_numero_lancamento,
      CURRENT_DATE,
      v_data_competencia,
      'FOLHA_PAGAMENTO',
      v_conta_debito_id,
      v_conta_credito_id,
      v_valor_total,
      'Folha de Pagamento - ' || TO_CHAR(v_data_competencia, 'MM/YYYY'),
      v_integracao_id,
      auth.uid()
    ) RETURNING id INTO v_lancamento_id;
    
    -- Atualizar número do contador para próximos lançamentos
    v_contador := v_contador + 1;
    
    -- Atualizar status das pendências para processado, se houverem
    IF v_existe_pendencia THEN
      UPDATE rh.pendencias_contabilizacao
      SET 
        status = 'PROCESSADA',
        data_processamento = NOW(),
        processado_por = auth.uid()
      WHERE instituicao_id = p_instituicao_id
        AND mes = p_mes
        AND ano = p_ano
        AND tipo = 'FOLHA_PAGAMENTO'
        AND status = 'PENDENTE';
    END IF;
    
    -- Atualizar registro de integração
    UPDATE contabilidade.integracoes
    SET 
      status = 'CONCLUIDO',
      referencia_destino = v_lancamento_id::TEXT,
      mensagem = 'Contabilização concluída com sucesso',
      detalhes = detalhes || jsonb_build_object(
        'lancamento_id', v_lancamento_id,
        'numero_lancamento', v_numero_lancamento,
        'data_processamento', NOW()
      )
    WHERE id = v_integracao_id;
    
    -- Construir resultado
    v_resultado := jsonb_build_object(
      'sucesso', TRUE,
      'mensagem', 'Folha de pagamento contabilizada com sucesso',
      'dados', jsonb_build_object(
        'lancamento_id', v_lancamento_id,
        'numero_lancamento', v_numero_lancamento,
        'valor_total', v_valor_total,
        'data_competencia', v_data_competencia,
        'integracao_id', v_integracao_id
      )
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Em caso de erro, registrar e reverter
    UPDATE contabilidade.integracoes
    SET 
      status = 'ERRO',
      mensagem = 'Erro ao contabilizar folha: ' || SQLERRM
    WHERE id = v_integracao_id;
    
    RAISE;
  END;
  
  RETURN v_resultado;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'sucesso', FALSE,
    'mensagem', 'Erro ao contabilizar folha de pagamento: ' || SQLERRM,
    'dados', NULL
  );
END;
$$;

-- Comentários
COMMENT ON FUNCTION contabilidade.contabilizar_folha_pagamento IS 
  'Contabiliza a folha de pagamento gerando lançamentos contábeis para o período informado';

-- Trigger para criar pendência de contabilização quando folha for aprovada
-- Este seria um exemplo, mas depende da estrutura exata da tabela de folha
/*
CREATE OR REPLACE FUNCTION rh.trigger_folha_aprovada_contabilizar() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'APROVADA' AND OLD.status <> 'APROVADA' THEN
    INSERT INTO rh.pendencias_contabilizacao (
      instituicao_id,
      tipo,
      referencia_id,
      mes,
      ano,
      valor,
      detalhes
    ) VALUES (
      NEW.instituicao_id,
      'FOLHA_PAGAMENTO',
      NEW.id,
      NEW.mes,
      NEW.ano,
      NEW.valor_bruto,
      jsonb_build_object(
        'numero_folha', NEW.numero,
        'data_aprovacao', NEW.data_aprovacao
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar o trigger (se tabela de folha existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.tables
    WHERE table_schema = 'rh' AND table_name = 'folha_pagamento'
  ) THEN
    DROP TRIGGER IF EXISTS trigger_folha_aprovada ON rh.folha_pagamento;
    CREATE TRIGGER trigger_folha_aprovada
      AFTER UPDATE ON rh.folha_pagamento
      FOR EACH ROW
      EXECUTE PROCEDURE rh.trigger_folha_aprovada_contabilizar();
  END IF;
END $$;
*/

-- [Fim do arquivo] 