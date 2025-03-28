-- Função para incrementar o contador de mensagens não lidas
CREATE OR REPLACE FUNCTION increment_nao_lidas(conversa_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_count INTEGER;
BEGIN
    SELECT nao_lidas INTO current_count
    FROM conversas
    WHERE id = conversa_id;

    RETURN COALESCE(current_count, 0) + 1;
END;
$$; 