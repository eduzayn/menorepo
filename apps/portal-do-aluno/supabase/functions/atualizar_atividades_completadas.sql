CREATE OR REPLACE FUNCTION atualizar_atividades_completadas(
  p_aluno_id UUID,
  p_atividade_id UUID
)
RETURNS SETOF conquistas
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_atividade atividades_gamificadas;
  v_conquista conquistas;
BEGIN
  -- Buscar atividade
  SELECT * INTO v_atividade
  FROM atividades_gamificadas
  WHERE id = p_atividade_id;

  -- Verificar se já foi completada
  IF EXISTS (
    SELECT 1 
    FROM atividades_completadas 
    WHERE aluno_id = p_aluno_id AND atividade_id = p_atividade_id
  ) THEN
    RETURN;
  END IF;

  -- Registrar atividade como completada
  INSERT INTO atividades_completadas (aluno_id, atividade_id, data_completada)
  VALUES (p_aluno_id, p_atividade_id, NOW());

  -- Atualizar pontos
  PERFORM atualizar_pontos(p_aluno_id, v_atividade.pontos);

  -- Verificar conquistas
  FOR v_conquista IN 
    SELECT * FROM conquistas
    WHERE id NOT IN (
      SELECT conquista_id 
      FROM conquistas_aluno 
      WHERE aluno_id = p_aluno_id
    )
  LOOP
    -- Verificar requisitos
    IF (
      (v_conquista.requisitos->>'atividades_completadas_minimas' IS NULL OR 
       (SELECT COUNT(*) FROM atividades_completadas WHERE aluno_id = p_aluno_id) >= 
       (v_conquista.requisitos->>'atividades_completadas_minimas')::INTEGER)
    ) THEN
      -- Registrar conquista
      INSERT INTO conquistas_aluno (aluno_id, conquista_id, data_conquista)
      VALUES (p_aluno_id, v_conquista.id, NOW());

      -- Retornar conquista
      RETURN NEXT v_conquista;
    END IF;
  END LOOP;

  RETURN;
END;
$$; 