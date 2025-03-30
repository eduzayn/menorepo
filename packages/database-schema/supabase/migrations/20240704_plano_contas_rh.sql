-- Script para gerar Plano de Contas específico para RH
-- Executado por: Supabase CLI
-- Criado em: 2024-07-04

-- Função para criar plano de contas específico para RH
CREATE OR REPLACE FUNCTION contabilidade.gerar_plano_contas_rh(
  p_instituicao_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, contabilidade
AS $$
DECLARE
  v_resultado JSONB;
  v_conta_id UUID;
  v_ja_existente BOOLEAN := FALSE;
  v_inseridos INTEGER := 0;
  v_rejeitados INTEGER := 0;

  -- Estrutura de contas para RH
  v_contas_rh TEXT[][] := ARRAY[
    -- Código, Nome, Tipo, Natureza, Pai (código)
    -- Estrutura para despesas com RH
    ARRAY['3', 'DESPESAS', 'SINTETICA', 'DEVEDORA', NULL],
    ARRAY['3.1', 'DESPESAS OPERACIONAIS', 'SINTETICA', 'DEVEDORA', '3'],
    ARRAY['3.1.1', 'DESPESAS COM PESSOAL', 'SINTETICA', 'DEVEDORA', '3.1'],
    ARRAY['3.1.1.01', 'Salários e Ordenados', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    ARRAY['3.1.1.02', 'Encargos Sociais', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    ARRAY['3.1.1.03', 'INSS', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    ARRAY['3.1.1.04', 'FGTS', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    ARRAY['3.1.1.05', 'PIS sobre Folha', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    ARRAY['3.1.1.06', 'Vale Transporte', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    ARRAY['3.1.1.07', 'Vale Alimentação/Refeição', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    ARRAY['3.1.1.08', 'Assistência Médica', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    ARRAY['3.1.1.09', 'Seguro de Vida', 'ANALITICA', 'DEVEDORA', '3.1.1'],
    
    -- Provisões
    ARRAY['3.1.2', 'PROVISÕES TRABALHISTAS', 'SINTETICA', 'DEVEDORA', '3.1'],
    ARRAY['3.1.2.01', 'Provisão para Férias', 'ANALITICA', 'DEVEDORA', '3.1.2'],
    ARRAY['3.1.2.02', 'Provisão para 13º Salário', 'ANALITICA', 'DEVEDORA', '3.1.2'],
    ARRAY['3.1.2.03', 'Provisão para Rescisões', 'ANALITICA', 'DEVEDORA', '3.1.2'],
    
    -- Passivos relacionados a RH
    ARRAY['2', 'PASSIVO', 'SINTETICA', 'CREDORA', NULL],
    ARRAY['2.1', 'PASSIVO CIRCULANTE', 'SINTETICA', 'CREDORA', '2'],
    ARRAY['2.1.3', 'OBRIGAÇÕES TRABALHISTAS', 'SINTETICA', 'CREDORA', '2.1'],
    ARRAY['2.1.3.01', 'Salários a Pagar', 'ANALITICA', 'CREDORA', '2.1.3'],
    ARRAY['2.1.3.02', 'Encargos a Recolher', 'ANALITICA', 'CREDORA', '2.1.3'],
    ARRAY['2.1.3.03', 'INSS a Recolher', 'ANALITICA', 'CREDORA', '2.1.3'],
    ARRAY['2.1.3.04', 'FGTS a Recolher', 'ANALITICA', 'CREDORA', '2.1.3'],
    ARRAY['2.1.3.05', 'PIS sobre Folha a Recolher', 'ANALITICA', 'CREDORA', '2.1.3'],
    ARRAY['2.1.3.06', 'Vale Transporte a Pagar', 'ANALITICA', 'CREDORA', '2.1.3'],
    ARRAY['2.1.3.07', 'Vale Alimentação/Refeição a Pagar', 'ANALITICA', 'CREDORA', '2.1.3'],
    
    -- Provisões (Passivo)
    ARRAY['2.1.4', 'PROVISÕES TRABALHISTAS', 'SINTETICA', 'CREDORA', '2.1'],
    ARRAY['2.1.4.01', 'Provisão para Férias', 'ANALITICA', 'CREDORA', '2.1.4'],
    ARRAY['2.1.4.02', 'Provisão para 13º Salário', 'ANALITICA', 'CREDORA', '2.1.4'],
    ARRAY['2.1.4.03', 'Provisão para Rescisões', 'ANALITICA', 'CREDORA', '2.1.4']
  ];
  
BEGIN
  -- Verificar se instituição existe
  IF NOT EXISTS (SELECT 1 FROM institutions WHERE id = p_instituicao_id) THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Instituição não encontrada',
      'dados', NULL
    );
  END IF;
  
  -- Verificar se já existe alguma conta com código relacionado a RH
  BEGIN
    -- Exemplos de códigos que procuramos para determinar se o plano já existe
    SELECT EXISTS (
      SELECT 1 FROM contabilidade.contas 
      WHERE instituicao_id = p_instituicao_id 
        AND (codigo LIKE '3.1.1%' OR codigo LIKE '3.1.2%' OR codigo LIKE '2.1.3%' OR codigo LIKE '2.1.4%')
        AND LIMIT 1
    ) INTO v_ja_existente;
    
    IF v_ja_existente THEN
      RETURN jsonb_build_object(
        'sucesso', FALSE,
        'mensagem', 'Plano de contas para RH já existe nesta instituição',
        'dados', NULL
      );
    END IF;
  END;
  
  -- Iniciar inserção das contas
  FOR i IN 1..array_length(v_contas_rh, 1) LOOP
    DECLARE
      v_codigo ALIAS FOR v_contas_rh[i][1];
      v_nome ALIAS FOR v_contas_rh[i][2];
      v_tipo ALIAS FOR v_contas_rh[i][3];
      v_natureza ALIAS FOR v_contas_rh[i][4];
      v_pai_codigo ALIAS FOR v_contas_rh[i][5];
      v_pai_id UUID := NULL;
    BEGIN
      -- Verificar se a conta já existe
      IF EXISTS (SELECT 1 FROM contabilidade.contas WHERE instituicao_id = p_instituicao_id AND codigo = v_codigo) THEN
        v_rejeitados := v_rejeitados + 1;
        CONTINUE;
      END IF;
      
      -- Se tiver pai, buscar o ID do pai
      IF v_pai_codigo IS NOT NULL THEN
        SELECT id INTO v_pai_id 
        FROM contabilidade.contas 
        WHERE instituicao_id = p_instituicao_id AND codigo = v_pai_codigo;
      END IF;
      
      -- Inserir a conta
      INSERT INTO contabilidade.contas (
        instituicao_id,
        codigo,
        nome,
        tipo,
        natureza,
        conta_pai_id,
        descricao,
        permite_lancamentos,
        ativo
      ) VALUES (
        p_instituicao_id,
        v_codigo,
        v_nome,
        v_tipo::contabilidade.tipo_conta,
        v_natureza::contabilidade.natureza_conta,
        v_pai_id,
        'Conta criada automaticamente para o módulo RH',
        CASE WHEN v_tipo = 'ANALITICA' THEN TRUE ELSE FALSE END,
        TRUE
      )
      RETURNING id INTO v_conta_id;
      
      v_inseridos := v_inseridos + 1;
    EXCEPTION WHEN OTHERS THEN
      -- Ignorar erros e continuar com a próxima conta
      v_rejeitados := v_rejeitados + 1;
      RAISE NOTICE 'Erro ao inserir conta %: %', v_codigo, SQLERRM;
    END;
  END LOOP;
  
  -- Construir resultado
  v_resultado := jsonb_build_object(
    'sucesso', TRUE,
    'mensagem', 'Plano de contas para RH gerado com sucesso',
    'dados', jsonb_build_object(
      'contas_inseridas', v_inseridos,
      'contas_rejeitadas', v_rejeitados
    )
  );
  
  RETURN v_resultado;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'sucesso', FALSE,
    'mensagem', 'Erro ao gerar plano de contas para RH: ' || SQLERRM,
    'dados', NULL
  );
END;
$$;

-- Comentários
COMMENT ON FUNCTION contabilidade.gerar_plano_contas_rh IS 'Gera um plano de contas padrão para o módulo RH';

-- [Fim do arquivo] 