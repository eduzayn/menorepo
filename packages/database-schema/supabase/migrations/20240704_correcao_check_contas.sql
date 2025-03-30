-- Script para corrigir a verificação de existência de contas RH
-- Executado por: Supabase CLI
-- Criado em: 2024-07-04

-- Esta função verifica primeiro se já existem contas de RH para a instituição
-- A versão anterior tinha um erro de sintaxe na consulta
CREATE OR REPLACE FUNCTION contabilidade.verificar_plano_contas_rh(
  p_instituicao_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, contabilidade
AS $$
DECLARE
  v_existe BOOLEAN := FALSE;
BEGIN
  -- Verificar se já existe alguma conta com código relacionado a RH
  SELECT EXISTS (
    SELECT 1 
    FROM contabilidade.contas 
    WHERE instituicao_id = p_instituicao_id 
      AND (
        codigo LIKE '3.1.1%' OR 
        codigo LIKE '3.1.2%' OR 
        codigo LIKE '2.1.3%' OR 
        codigo LIKE '2.1.4%'
      )
    LIMIT 1
  ) INTO v_existe;
  
  RETURN v_existe;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Erro ao verificar plano de contas: %', SQLERRM;
  RETURN FALSE;
END;
$$;

-- Comentários
COMMENT ON FUNCTION contabilidade.verificar_plano_contas_rh IS 
  'Verifica se já existe plano de contas RH para a instituição';

-- Modificar a função principal para usar a função de verificação
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

  -- Estrutura de contas para RH (sem alterações)
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
  
  -- CORREÇÃO: Chamar a função de verificação em vez de fazer a verificação diretamente
  v_ja_existente := contabilidade.verificar_plano_contas_rh(p_instituicao_id);
  
  IF v_ja_existente THEN
    RETURN jsonb_build_object(
      'sucesso', FALSE,
      'mensagem', 'Plano de contas para RH já existe nesta instituição',
      'dados', NULL
    );
  END IF;
  
  -- Resto da função segue igual...
  -- Iniciar inserção das contas
  FOR i IN 1..array_length(v_contas_rh, 1) LOOP
    DECLARE
      v_codigo TEXT;
      v_nome TEXT;
      v_tipo TEXT;
      v_natureza TEXT;
      v_pai_codigo TEXT;
      v_pai_id UUID := NULL;
    BEGIN
      -- Atribuir valores do array
      v_codigo := v_contas_rh[i][1];
      v_nome := v_contas_rh[i][2];
      v_tipo := v_contas_rh[i][3];
      v_natureza := v_contas_rh[i][4];
      v_pai_codigo := v_contas_rh[i][5];
      
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

-- [Fim do arquivo] 