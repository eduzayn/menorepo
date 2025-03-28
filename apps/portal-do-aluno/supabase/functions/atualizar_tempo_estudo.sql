CREATE OR REPLACE FUNCTION atualizar_tempo_estudo(
  p_aluno_id UUID,
  p_minutos INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tempo_atual INTEGER;
  v_pontos_tempo INTEGER;
BEGIN
  -- Buscar tempo atual
  SELECT tempo_estudo INTO v_tempo_atual
  FROM progresso_aluno
  WHERE aluno_id = p_aluno_id;

  -- Calcular pontos baseado no tempo
  v_pontos_tempo := FLOOR(p_minutos / 30) * 10; -- 10 pontos a cada 30 minutos

  -- Atualizar tempo e pontos
  UPDATE progresso_aluno
  SET 
    tempo_estudo = v_tempo_atual + p_minutos,
    pontos = pontos + v_pontos_tempo
  WHERE aluno_id = p_aluno_id;

  -- Atualizar nível e conquistas
  PERFORM atualizar_nivel(p_aluno_id);
  PERFORM atualizar_conquistas(p_aluno_id);

  -- Retornar novo tempo
  RETURN v_tempo_atual + p_minutos;
END;
$$; 