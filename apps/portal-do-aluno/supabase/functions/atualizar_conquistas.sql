CREATE OR REPLACE FUNCTION atualizar_conquistas(
  p_aluno_id UUID
)
RETURNS SETOF conquistas
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conquista conquistas;
  v_progresso progresso_aluno;
BEGIN
  -- Buscar progresso do aluno
  SELECT * INTO v_progresso
  FROM progresso_aluno
  WHERE aluno_id = p_aluno_id;

  -- Verificar cada conquista
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
      (v_conquista.requisitos->>'pontos_minimos' IS NULL OR v_progresso.pontos >= (v_conquista.requisitos->>'pontos_minimos')::INTEGER) AND
      (v_conquista.requisitos->>'nivel_minimo' IS NULL OR v_progresso.nivel >= (v_conquista.requisitos->>'nivel_minimo')::INTEGER) AND
      (v_conquista.requisitos->>'tempo_estudo_minimo' IS NULL OR v_progresso.tempo_estudo >= (v_conquista.requisitos->>'tempo_estudo_minimo')::INTEGER)
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