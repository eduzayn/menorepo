CREATE OR REPLACE FUNCTION incrementar_tempo_estudo(
  p_aluno_id UUID,
  p_minutos INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tempo_atual INTEGER;
BEGIN
  -- Buscar tempo atual
  SELECT tempo_estudo INTO v_tempo_atual
  FROM progresso_aluno
  WHERE aluno_id = p_aluno_id;

  -- Incrementar tempo
  UPDATE progresso_aluno
  SET tempo_estudo = v_tempo_atual + p_minutos
  WHERE aluno_id = p_aluno_id;

  -- Retornar novo tempo
  RETURN v_tempo_atual + p_minutos;
END;
$$; 