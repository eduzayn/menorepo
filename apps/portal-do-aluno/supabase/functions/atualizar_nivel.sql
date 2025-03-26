CREATE OR REPLACE FUNCTION atualizar_nivel(
  p_aluno_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_progresso progresso_aluno;
  v_novo_nivel INTEGER;
BEGIN
  -- Buscar progresso do aluno
  SELECT * INTO v_progresso
  FROM progresso_aluno
  WHERE aluno_id = p_aluno_id;

  -- Calcular novo nível baseado nos pontos
  v_novo_nivel := FLOOR(v_progresso.pontos / 1000) + 1;

  -- Se subiu de nível
  IF v_novo_nivel > v_progresso.nivel THEN
    -- Atualizar nível
    UPDATE progresso_aluno
    SET nivel = v_novo_nivel
    WHERE aluno_id = p_aluno_id;

    -- Verificar conquistas
    PERFORM atualizar_conquistas(p_aluno_id);
  END IF;

  -- Retornar novo nível
  RETURN v_novo_nivel;
END;
$$; 