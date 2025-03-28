-- Função para atualizar a última mensagem da conversa
CREATE OR REPLACE FUNCTION update_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE conversas
    SET ultima_mensagem = NEW.conteudo,
        ultima_mensagem_at = NEW.criado_at
    WHERE id = NEW.conversa_id;
    RETURN NEW;
END;
$$;

-- Trigger para atualizar a última mensagem quando uma nova mensagem é inserida
CREATE TRIGGER update_last_message_trigger
    AFTER INSERT ON mensagens
    FOR EACH ROW
    EXECUTE FUNCTION update_last_message(); 