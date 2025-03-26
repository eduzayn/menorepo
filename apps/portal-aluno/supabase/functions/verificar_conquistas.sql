CREATE OR REPLACE FUNCTION verificar_conquistas(
  p_aluno_id UUID
)
RETURNS TABLE (
  conquista_id UUID,
  nome TEXT,
  descricao TEXT,
  pontos INTEGER,
  icone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_progresso RECORD;
  v_conquista RECORD;
  v_atividade RECORD;
  v_requisitos JSONB;
  v_atende_requisitos BOOLEAN;
BEGIN
  -- Buscar progresso do aluno
  SELECT * INTO v_progresso
  FROM progresso_aluno
  WHERE aluno_id = p_aluno_id;

  -- Para cada conquista não desbloqueada
  FOR v_conquista IN
    SELECT *
    FROM conquistas
    WHERE id NOT IN (
      SELECT unnest(conquistas)
      FROM progresso_aluno
      WHERE aluno_id = p_aluno_id
    )
  LOOP
    v_atende_requisitos := true;
    v_requisitos := v_conquista.requisitos;

    -- Verificar cada requisito
    FOR v_atividade IN
      SELECT *
      FROM jsonb_array_elements(v_requisitos)
    LOOP
      -- Verificar quantidade de atividades do tipo
      IF NOT EXISTS (
        SELECT 1
        FROM atividades_completadas ac
        JOIN atividades a ON a.id = ac.atividade_id
        WHERE ac.aluno_id = p_aluno_id
        AND a.tipo = v_atividade->>'tipo'
        AND (
          SELECT COUNT(*)
          FROM atividades_completadas ac2
          JOIN atividades a2 ON a2.id = ac2.atividade_id
          WHERE ac2.aluno_id = p_aluno_id
          AND a2.tipo = v_atividade->>'tipo'
        ) >= (v_atividade->>'quantidade')::INTEGER
      ) THEN
        v_atende_requisitos := false;
        EXIT;
      END IF;
    END LOOP;

    -- Se atende todos os requisitos, retornar conquista
    IF v_atende_requisitos THEN
      conquista_id := v_conquista.id;
      nome := v_conquista.nome;
      descricao := v_conquista.descricao;
      pontos := v_conquista.pontos;
      icone := v_conquista.icone;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$; 