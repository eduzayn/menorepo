-- Função para notificar os participantes de um grupo
CREATE OR REPLACE FUNCTION notify_group_members()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r RECORD;
BEGIN
    -- Para cada participante do grupo
    FOR r IN (
        SELECT p.usuario_id
        FROM participantes p
        WHERE p.grupo_id = NEW.grupo_id
        AND p.usuario_id != NEW.remetente_id
    )
    LOOP
        -- Criar uma notificação
        INSERT INTO notificacoes (
            usuario_id,
            titulo,
            mensagem,
            tipo
        ) VALUES (
            r.usuario_id,
            'Nova mensagem no grupo',
            NEW.conteudo,
            'INFO'
        );
    END LOOP;
    RETURN NEW;
END;
$$;

-- Trigger para notificar participantes quando uma nova mensagem é enviada
CREATE TRIGGER notify_group_members_trigger
    AFTER INSERT ON mensagens
    FOR EACH ROW
    WHEN (EXISTS (
        SELECT 1
        FROM conversas c
        WHERE c.id = NEW.conversa_id
        AND c.tipo = 'GRUPO'
    ))
    EXECUTE FUNCTION notify_group_members(); 