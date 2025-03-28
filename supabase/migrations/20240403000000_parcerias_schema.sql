-- Verifica se o schema já existe para evitar conflitos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'parcerias') THEN
        CREATE SCHEMA parcerias;
        RAISE NOTICE 'Schema parcerias criado com sucesso';
    ELSE
        RAISE NOTICE 'Schema parcerias já existe, pulando criação';
    END IF;
END
$$;

-- Define o owner do schema
ALTER SCHEMA parcerias OWNER TO postgres;

-- Tipos enumerados
CREATE TYPE parcerias.status_parceria AS ENUM (
    'ativa', 
    'pendente', 
    'suspensa', 
    'encerrada'
);

CREATE TYPE parcerias.status_solicitacao AS ENUM (
    'pendente', 
    'em_analise', 
    'aprovada', 
    'rejeitada', 
    'emitida'
);

CREATE TYPE parcerias.tipo_documento AS ENUM (
    'contrato', 
    'aditivo', 
    'projeto_pedagogico', 
    'certificado',
    'historico',
    'rg_aluno',
    'cpf_aluno',
    'diploma_anterior'
);

-- Tabela de instituições parceiras
CREATE TABLE parcerias.instituicoes_parceiras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    razao_social TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    endereco JSONB,
    telefone TEXT,
    email TEXT,
    site TEXT,
    logo_url TEXT,
    data_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_fim TIMESTAMPTZ,
    status parcerias.status_parceria NOT NULL DEFAULT 'pendente',
    responsavel_id UUID REFERENCES auth.users(id),
    notas TEXT,
    contrato_ativo_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de contratos
CREATE TABLE parcerias.contratos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instituicao_id UUID NOT NULL REFERENCES parcerias.instituicoes_parceiras(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    arquivo_url TEXT,
    data_inicio TIMESTAMPTZ NOT NULL,
    data_fim TIMESTAMPTZ,
    valor_certificacao DECIMAL(10,2),
    status parcerias.status_parceria NOT NULL DEFAULT 'pendente',
    termos JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Atualizar referência de contrato ativo na instituição
ALTER TABLE parcerias.instituicoes_parceiras
ADD CONSTRAINT fk_contrato_ativo
FOREIGN KEY (contrato_ativo_id) 
REFERENCES parcerias.contratos(id) ON DELETE SET NULL;

-- Tabela de cursos permitidos por parceria
CREATE TABLE parcerias.cursos_parceria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instituicao_id UUID NOT NULL REFERENCES parcerias.instituicoes_parceiras(id) ON DELETE CASCADE,
    contrato_id UUID NOT NULL REFERENCES parcerias.contratos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    carga_horaria INTEGER NOT NULL,
    nivel TEXT NOT NULL,
    descricao TEXT,
    data_aprovacao TIMESTAMPTZ,
    aprovado_por UUID REFERENCES auth.users(id),
    status parcerias.status_parceria NOT NULL DEFAULT 'pendente',
    projeto_pedagogico_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de solicitações de certificação
CREATE TABLE parcerias.solicitacoes_certificacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instituicao_id UUID NOT NULL REFERENCES parcerias.instituicoes_parceiras(id) ON DELETE CASCADE,
    curso_id UUID NOT NULL REFERENCES parcerias.cursos_parceria(id) ON DELETE CASCADE,
    aluno_id UUID REFERENCES auth.users(id),
    nome_aluno TEXT NOT NULL,
    cpf_aluno TEXT NOT NULL,
    email_aluno TEXT,
    data_nascimento DATE,
    data_conclusao DATE NOT NULL,
    nota_final DECIMAL(4,2),
    status parcerias.status_solicitacao NOT NULL DEFAULT 'pendente',
    observacoes TEXT,
    certificado_url TEXT,
    historico_url TEXT,
    codigo_validacao TEXT UNIQUE,
    solicitado_por UUID REFERENCES auth.users(id),
    avaliado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de documentos
CREATE TABLE parcerias.documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo parcerias.tipo_documento NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    arquivo_url TEXT NOT NULL,
    instituicao_id UUID REFERENCES parcerias.instituicoes_parceiras(id) ON DELETE CASCADE,
    curso_id UUID REFERENCES parcerias.cursos_parceria(id) ON DELETE CASCADE,
    solicitacao_id UUID REFERENCES parcerias.solicitacoes_certificacao(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id),
    validado BOOLEAN DEFAULT FALSE,
    validado_por UUID REFERENCES auth.users(id),
    data_validacao TIMESTAMPTZ,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT documento_relacionado CHECK (
        (instituicao_id IS NOT NULL)::integer +
        (curso_id IS NOT NULL)::integer +
        (solicitacao_id IS NOT NULL)::integer = 1
    )
);

-- Tabela de financeiro
CREATE TABLE parcerias.financeiro_parceiros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instituicao_id UUID NOT NULL REFERENCES parcerias.instituicoes_parceiras(id) ON DELETE CASCADE,
    curso_id UUID REFERENCES parcerias.cursos_parceria(id),
    solicitacao_id UUID REFERENCES parcerias.solicitacoes_certificacao(id),
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_emissao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_vencimento TIMESTAMPTZ NOT NULL,
    data_pagamento TIMESTAMPTZ,
    status TEXT NOT NULL,
    comprovante_url TEXT,
    boleto_url TEXT,
    gerado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de logs de atividades
CREATE TABLE parcerias.logs_atividades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    dados JSONB,
    instituicao_id UUID REFERENCES parcerias.instituicoes_parceiras(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Visão para relatórios
CREATE VIEW parcerias.visao_relatorios AS
SELECT 
    i.nome as instituicao,
    i.status as status_instituicao,
    c.titulo as curso,
    COUNT(s.id) as total_solicitacoes,
    COUNT(CASE WHEN s.status = 'emitida' THEN 1 END) as certificados_emitidos,
    COUNT(CASE WHEN s.status = 'pendente' THEN 1 END) as solicitacoes_pendentes,
    COUNT(CASE WHEN s.status = 'rejeitada' THEN 1 END) as solicitacoes_rejeitadas,
    SUM(CASE WHEN f.status = 'pago' THEN f.valor ELSE 0 END) as receita_total
FROM parcerias.instituicoes_parceiras i
LEFT JOIN parcerias.cursos_parceria c ON i.id = c.instituicao_id
LEFT JOIN parcerias.solicitacoes_certificacao s ON c.id = s.curso_id
LEFT JOIN parcerias.financeiro_parceiros f ON s.id = f.solicitacao_id
GROUP BY i.nome, i.status, c.titulo;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION parcerias.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER set_updated_at_instituicoes_parceiras
BEFORE UPDATE ON parcerias.instituicoes_parceiras
FOR EACH ROW EXECUTE FUNCTION parcerias.set_updated_at();

CREATE TRIGGER set_updated_at_contratos
BEFORE UPDATE ON parcerias.contratos
FOR EACH ROW EXECUTE FUNCTION parcerias.set_updated_at();

CREATE TRIGGER set_updated_at_cursos_parceria
BEFORE UPDATE ON parcerias.cursos_parceria
FOR EACH ROW EXECUTE FUNCTION parcerias.set_updated_at();

CREATE TRIGGER set_updated_at_solicitacoes_certificacao
BEFORE UPDATE ON parcerias.solicitacoes_certificacao
FOR EACH ROW EXECUTE FUNCTION parcerias.set_updated_at();

CREATE TRIGGER set_updated_at_documentos
BEFORE UPDATE ON parcerias.documentos
FOR EACH ROW EXECUTE FUNCTION parcerias.set_updated_at();

CREATE TRIGGER set_updated_at_financeiro_parceiros
BEFORE UPDATE ON parcerias.financeiro_parceiros
FOR EACH ROW EXECUTE FUNCTION parcerias.set_updated_at();

-- RLS Policies
ALTER TABLE parcerias.instituicoes_parceiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcerias.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcerias.cursos_parceria ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcerias.solicitacoes_certificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcerias.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcerias.financeiro_parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcerias.logs_atividades ENABLE ROW LEVEL SECURITY;

-- Policies para super_admin
CREATE POLICY super_admin_all_instituicoes_parceiras ON parcerias.instituicoes_parceiras
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY super_admin_all_contratos ON parcerias.contratos
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY super_admin_all_cursos_parceria ON parcerias.cursos_parceria
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY super_admin_all_solicitacoes_certificacao ON parcerias.solicitacoes_certificacao
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY super_admin_all_documentos ON parcerias.documentos
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY super_admin_all_financeiro_parceiros ON parcerias.financeiro_parceiros
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY super_admin_all_logs_atividades ON parcerias.logs_atividades
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

-- Policies para admin_certificadora
CREATE POLICY admin_certificadora_all_instituicoes_parceiras ON parcerias.instituicoes_parceiras
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin_certificadora');

CREATE POLICY admin_certificadora_all_contratos ON parcerias.contratos
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin_certificadora');

CREATE POLICY admin_certificadora_all_cursos_parceria ON parcerias.cursos_parceria
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin_certificadora');

CREATE POLICY admin_certificadora_all_solicitacoes_certificacao ON parcerias.solicitacoes_certificacao
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin_certificadora');

CREATE POLICY admin_certificadora_all_documentos ON parcerias.documentos
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin_certificadora');

CREATE POLICY admin_certificadora_all_financeiro_parceiros ON parcerias.financeiro_parceiros
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin_certificadora');

CREATE POLICY admin_certificadora_all_logs_atividades ON parcerias.logs_atividades
    FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin_certificadora');

-- Policies para admin_parceiro
CREATE POLICY admin_parceiro_read_instituicoes_parceiras ON parcerias.instituicoes_parceiras
    FOR SELECT TO authenticated USING (
        auth.jwt() ->> 'role' = 'admin_parceiro' AND 
        responsavel_id = auth.uid()
    );

CREATE POLICY admin_parceiro_read_contratos ON parcerias.contratos
    FOR SELECT TO authenticated USING (
        auth.jwt() ->> 'role' = 'admin_parceiro' AND 
        EXISTS (
            SELECT 1 FROM parcerias.instituicoes_parceiras ip 
            WHERE ip.id = contratos.instituicao_id AND ip.responsavel_id = auth.uid()
        )
    );

CREATE POLICY admin_parceiro_all_cursos_parceria ON parcerias.cursos_parceria
    FOR ALL TO authenticated USING (
        auth.jwt() ->> 'role' = 'admin_parceiro' AND 
        EXISTS (
            SELECT 1 FROM parcerias.instituicoes_parceiras ip 
            WHERE ip.id = cursos_parceria.instituicao_id AND ip.responsavel_id = auth.uid()
        )
    );

CREATE POLICY admin_parceiro_all_solicitacoes_certificacao ON parcerias.solicitacoes_certificacao
    FOR ALL TO authenticated USING (
        auth.jwt() ->> 'role' = 'admin_parceiro' AND 
        EXISTS (
            SELECT 1 FROM parcerias.instituicoes_parceiras ip 
            WHERE ip.id = solicitacoes_certificacao.instituicao_id AND ip.responsavel_id = auth.uid()
        )
    );

CREATE POLICY admin_parceiro_all_documentos ON parcerias.documentos
    FOR ALL TO authenticated USING (
        auth.jwt() ->> 'role' = 'admin_parceiro' AND 
        (
            EXISTS (
                SELECT 1 FROM parcerias.instituicoes_parceiras ip 
                WHERE ip.id = documentos.instituicao_id AND ip.responsavel_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM parcerias.cursos_parceria cp 
                JOIN parcerias.instituicoes_parceiras ip ON cp.instituicao_id = ip.id
                WHERE cp.id = documentos.curso_id AND ip.responsavel_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM parcerias.solicitacoes_certificacao sc 
                JOIN parcerias.instituicoes_parceiras ip ON sc.instituicao_id = ip.id
                WHERE sc.id = documentos.solicitacao_id AND ip.responsavel_id = auth.uid()
            )
        )
    );

CREATE POLICY admin_parceiro_read_financeiro_parceiros ON parcerias.financeiro_parceiros
    FOR SELECT TO authenticated USING (
        auth.jwt() ->> 'role' = 'admin_parceiro' AND 
        EXISTS (
            SELECT 1 FROM parcerias.instituicoes_parceiras ip 
            WHERE ip.id = financeiro_parceiros.instituicao_id AND ip.responsavel_id = auth.uid()
        )
    );

CREATE POLICY admin_parceiro_read_logs_atividades ON parcerias.logs_atividades
    FOR SELECT TO authenticated USING (
        auth.jwt() ->> 'role' = 'admin_parceiro' AND 
        EXISTS (
            SELECT 1 FROM parcerias.instituicoes_parceiras ip 
            WHERE ip.id = logs_atividades.instituicao_id AND ip.responsavel_id = auth.uid()
        )
    );

-- Policies para secretaria_parceiro
CREATE POLICY secretaria_parceiro_read_instituicoes_parceiras ON parcerias.instituicoes_parceiras
    FOR SELECT TO authenticated USING (
        auth.jwt() ->> 'role' = 'secretaria_parceiro' AND 
        EXISTS (
            SELECT 1 FROM auth.users u 
            WHERE u.id = auth.uid() AND u.raw_app_meta_data->>'institution_id' = instituicoes_parceiras.id::text
        )
    );

CREATE POLICY secretaria_parceiro_read_cursos_parceria ON parcerias.cursos_parceria
    FOR SELECT TO authenticated USING (
        auth.jwt() ->> 'role' = 'secretaria_parceiro' AND 
        EXISTS (
            SELECT 1 FROM auth.users u 
            WHERE u.id = auth.uid() AND u.raw_app_meta_data->>'institution_id' = cursos_parceria.instituicao_id::text
        )
    );

CREATE POLICY secretaria_parceiro_insert_solicitacoes_certificacao ON parcerias.solicitacoes_certificacao
    FOR INSERT TO authenticated WITH CHECK (
        auth.jwt() ->> 'role' = 'secretaria_parceiro' AND
        EXISTS (
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid() AND u.raw_app_meta_data->>'institution_id' = instituicao_id::text
        )
    );

CREATE POLICY secretaria_parceiro_select_solicitacoes_certificacao ON parcerias.solicitacoes_certificacao
    FOR SELECT TO authenticated USING (
        auth.jwt() ->> 'role' = 'secretaria_parceiro' AND
        EXISTS (
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid() AND u.raw_app_meta_data->>'institution_id' = instituicao_id::text
        )
    );

CREATE POLICY secretaria_parceiro_upload_documentos ON parcerias.documentos
    FOR INSERT TO authenticated WITH CHECK (
        auth.jwt() ->> 'role' = 'secretaria_parceiro' AND
        (
            (instituicao_id IS NOT NULL AND
            EXISTS (
                SELECT 1 FROM auth.users u
                WHERE u.id = auth.uid() AND u.raw_app_meta_data->>'institution_id' = instituicao_id::text
            )) OR
            (curso_id IS NOT NULL AND
            EXISTS (
                SELECT 1 FROM parcerias.cursos_parceria cp
                JOIN auth.users u ON u.raw_app_meta_data->>'institution_id' = cp.instituicao_id::text
                WHERE cp.id = curso_id AND u.id = auth.uid()
            )) OR
            (solicitacao_id IS NOT NULL AND
            EXISTS (
                SELECT 1 FROM parcerias.solicitacoes_certificacao sc
                JOIN auth.users u ON u.raw_app_meta_data->>'institution_id' = sc.instituicao_id::text
                WHERE sc.id = solicitacao_id AND u.id = auth.uid()
            ))
        )
    );

-- Adiciona storage para arquivos do módulo de parceiros
INSERT INTO storage.buckets (id, name, public)
VALUES ('contratos_parceiros', 'Contratos de Parceiros', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('projetos_pedagogicos', 'Projetos Pedagógicos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos_certificacao', 'Documentos para Certificação', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificados_emitidos', 'Certificados Emitidos', false)
ON CONFLICT (id) DO NOTHING;

-- Security policies para storage
CREATE POLICY authenticated_read_contratos_parceiros ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'contratos_parceiros');

CREATE POLICY super_admin_all_contratos_parceiros ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'contratos_parceiros' AND auth.jwt() ->> 'role' = 'super_admin')
    WITH CHECK (bucket_id = 'contratos_parceiros' AND auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY admin_certificadora_all_contratos_parceiros ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'contratos_parceiros' AND auth.jwt() ->> 'role' = 'admin_certificadora')
    WITH CHECK (bucket_id = 'contratos_parceiros' AND auth.jwt() ->> 'role' = 'admin_certificadora');

CREATE POLICY admin_parceiro_upload_documentos ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id IN ('contratos_parceiros', 'projetos_pedagogicos', 'documentos_certificacao') AND 
        auth.jwt() ->> 'role' = 'admin_parceiro'
    );

CREATE POLICY secretaria_parceiro_upload_documentos ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'documentos_certificacao' AND 
        auth.jwt() ->> 'role' = 'secretaria_parceiro'
    );

-- Adiciona mensagem de conclusão
DO $$
BEGIN
    RAISE NOTICE 'Schema de parcerias configurado com sucesso.';
END
$$; 