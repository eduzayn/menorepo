-- Função para limpar mensagens antigas
CREATE OR REPLACE FUNCTION cleanup_old_messages(dias INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Deletar mensagens mais antigas que o número de dias especificado
    WITH deleted AS (
        DELETE FROM mensagens
        WHERE criado_at < NOW() - (dias || ' days')::INTERVAL
        RETURNING *
    )
    SELECT COUNT(*) INTO deleted_count
    FROM deleted;

    RETURN deleted_count;
END;
$$;

-- Criar um job para executar a limpeza diariamente
SELECT cron.schedule(
    'cleanup-old-messages',
    '0 0 * * *', -- Executar todo dia à meia-noite
    $$
    SELECT cleanup_old_messages(30);
    $$
); 