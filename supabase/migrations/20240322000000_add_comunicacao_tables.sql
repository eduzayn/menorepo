-- Create enum types
CREATE TYPE message_type AS ENUM ('TEXTO', 'IMAGEM', 'ARQUIVO');
CREATE TYPE conversation_status AS ENUM ('ATIVO', 'INATIVO');
CREATE TYPE participant_type AS ENUM ('LEAD', 'ALUNO');
CREATE TYPE campaign_status AS ENUM ('ATIVA', 'INATIVA', 'CONCLUIDA');
CREATE TYPE campaign_type AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');
CREATE TYPE participant_role AS ENUM ('ADMIN', 'MEMBRO');
CREATE TYPE notification_type AS ENUM ('INFO', 'SUCESSO', 'ERRO', 'ALERTA');
CREATE TYPE notification_channel AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- Create conversas table
CREATE TABLE conversas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    status conversation_status NOT NULL DEFAULT 'ATIVO',
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    participante_id UUID NOT NULL,
    participante_tipo participant_type NOT NULL,
    ultima_mensagem TEXT,
    ultima_mensagem_at TIMESTAMP WITH TIME ZONE,
    nao_lidas INTEGER NOT NULL DEFAULT 0,
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mensagens table
CREATE TABLE mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversa_id UUID NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
    remetente_id UUID NOT NULL REFERENCES auth.users(id),
    conteudo TEXT NOT NULL,
    tipo message_type NOT NULL DEFAULT 'TEXTO',
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campanhas table
CREATE TABLE campanhas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    status campaign_status NOT NULL DEFAULT 'ATIVA',
    tipo campaign_type NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE,
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create respostas_rapidas table
CREATE TABLE respostas_rapidas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grupos table
CREATE TABLE grupos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create participantes table
CREATE TABLE participantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grupo_id UUID NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    role participant_role NOT NULL DEFAULT 'MEMBRO',
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(grupo_id, usuario_id)
);

-- Create notificacoes table
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo notification_type NOT NULL DEFAULT 'INFO',
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create configuracoes_notificacao table
CREATE TABLE configuracoes_notificacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    tipo_notificacao TEXT NOT NULL,
    canal notification_channel NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, tipo_notificacao, canal)
);

-- Add indexes
CREATE INDEX idx_conversas_usuario_id ON conversas(usuario_id);
CREATE INDEX idx_conversas_participante_id ON conversas(participante_id);
CREATE INDEX idx_mensagens_conversa_id ON mensagens(conversa_id);
CREATE INDEX idx_mensagens_remetente_id ON mensagens(remetente_id);
CREATE INDEX idx_participantes_grupo_id ON participantes(grupo_id);
CREATE INDEX idx_participantes_usuario_id ON participantes(usuario_id);
CREATE INDEX idx_notificacoes_usuario_id ON notificacoes(usuario_id);
CREATE INDEX idx_configuracoes_usuario_id ON configuracoes_notificacao(usuario_id);

-- Add RLS policies
ALTER TABLE conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE respostas_rapidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_notificacao ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Usuários podem ver suas próprias conversas"
    ON conversas FOR SELECT
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar conversas"
    ON conversas FOR INSERT
    WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem ver mensagens de suas conversas"
    ON mensagens FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM conversas c
        WHERE c.id = conversa_id
        AND c.usuario_id = auth.uid()
    ));

CREATE POLICY "Usuários podem enviar mensagens em suas conversas"
    ON mensagens FOR INSERT
    WITH CHECK (
        auth.uid() = remetente_id
        AND EXISTS (
            SELECT 1 FROM conversas c
            WHERE c.id = conversa_id
            AND c.usuario_id = auth.uid()
        )
    );

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversas_updated_at
    BEFORE UPDATE ON conversas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mensagens_updated_at
    BEFORE UPDATE ON mensagens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campanhas_updated_at
    BEFORE UPDATE ON campanhas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_respostas_rapidas_updated_at
    BEFORE UPDATE ON respostas_rapidas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grupos_updated_at
    BEFORE UPDATE ON grupos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participantes_updated_at
    BEFORE UPDATE ON participantes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notificacoes_updated_at
    BEFORE UPDATE ON notificacoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_notificacao_updated_at
    BEFORE UPDATE ON configuracoes_notificacao
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 