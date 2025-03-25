-- Função para marcar mensagens como lidas
CREATE OR REPLACE FUNCTION mark_messages_read(p_conversa_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Marcar todas as mensagens da conversa como lidas
    UPDATE mensagens
    SET lida = true
    WHERE conversa_id = p_conversa_id
    AND NOT lida;

    -- Zerar o contador de mensagens não lidas
    UPDATE conversas
    SET nao_lidas = 0
    WHERE id = p_conversa_id;
END;
$$; 