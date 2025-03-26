CREATE OR REPLACE FUNCTION atualizar_pontos(
  p_aluno_id UUID,
  p_pontos INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pontos_atuais INTEGER;
  v_nivel_atual INTEGER;
  v_pontos_necessarios INTEGER;
BEGIN
  -- Buscar pontos e nível atuais
  SELECT pontos, nivel INTO v_pontos_atuais, v_nivel_atual
  FROM progresso_aluno
  WHERE aluno_id = p_aluno_id;

  -- Atualizar pontos
  UPDATE progresso_aluno
  SET pontos = v_pontos_atuais + p_pontos
  WHERE aluno_id = p_aluno_id;

  -- Calcular pontos necessários para próximo nível
  v_pontos_necessarios := v_nivel_atual * 1000;

  -- Verificar se subiu de nível
  IF (v_pontos_atuais + p_pontos) >= v_pontos_necessarios THEN
    -- Atualizar nível
    UPDATE progresso_aluno
    SET nivel = v_nivel_atual + 1
    WHERE aluno_id = p_aluno_id;

    -- Verificar conquistas
    PERFORM atualizar_conquistas(p_aluno_id);
  END IF;

  -- Retornar novos pontos
  RETURN v_pontos_atuais + p_pontos;
END;
$$; 