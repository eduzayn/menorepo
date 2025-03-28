-- Enum para status de matrícula
CREATE TYPE matricula_status AS ENUM ('pendente', 'ativa', 'cancelada', 'trancada', 'concluida');

-- Enum para status de pagamento
CREATE TYPE payment_status AS ENUM ('pendente', 'aprovado', 'recusado', 'reembolsado');

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    carga_horaria INTEGER NOT NULL,
    duracao_meses INTEGER NOT NULL,
    modalidade VARCHAR(50) NOT NULL,
    coordenador_id UUID REFERENCES auth.users(id),
    institution_id UUID REFERENCES institutions(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de planos de pagamento
CREATE TABLE IF NOT EXISTS planos_pagamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID REFERENCES cursos(id) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    numero_parcelas INTEGER NOT NULL,
    valor_parcela DECIMAL(10,2) NOT NULL,
    taxa_matricula DECIMAL(10,2) DEFAULT 0,
    desconto_pontualidade DECIMAL(5,2) DEFAULT 0,
    dia_vencimento INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de matrículas
CREATE TABLE IF NOT EXISTS matriculas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID REFERENCES auth.users(id) NOT NULL,
    curso_id UUID REFERENCES cursos(id) NOT NULL,
    plano_id UUID REFERENCES planos_pagamento(id) NOT NULL,
    status matricula_status DEFAULT 'pendente',
    data_inicio DATE NOT NULL,
    data_conclusao_prevista DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de documentos
CREATE TABLE IF NOT EXISTS documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula_id UUID REFERENCES matriculas(id) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contratos
CREATE TABLE IF NOT EXISTS contratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula_id UUID REFERENCES matriculas(id) NOT NULL,
    numero_contrato VARCHAR(50) NOT NULL,
    data_assinatura TIMESTAMP WITH TIME ZONE,
    url_documento VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula_id UUID REFERENCES matriculas(id) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento TIMESTAMP WITH TIME ZONE,
    status payment_status DEFAULT 'pendente',
    forma_pagamento VARCHAR(50),
    comprovante_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cursos_institution ON cursos(institution_id);
CREATE INDEX IF NOT EXISTS idx_planos_curso ON planos_pagamento(curso_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_aluno ON matriculas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_curso ON matriculas(curso_id);
CREATE INDEX IF NOT EXISTS idx_documentos_matricula ON documentos(matricula_id);
CREATE INDEX IF NOT EXISTS idx_contratos_matricula ON contratos(matricula_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_matricula ON pagamentos(matricula_id);

-- Políticas RLS
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para cursos
CREATE POLICY "Cursos visíveis para usuários autenticados" ON cursos
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Apenas admin pode criar cursos" ON cursos
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin_instituicao')
    ));

-- Políticas para planos de pagamento
CREATE POLICY "Planos visíveis para usuários autenticados" ON planos_pagamento
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Apenas admin pode gerenciar planos" ON planos_pagamento
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin_instituicao')
    ));

-- Políticas para matrículas
CREATE POLICY "Matrículas visíveis para admin e próprio aluno" ON matriculas
    FOR SELECT TO authenticated
    USING (
        auth.uid() = aluno_id
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'admin_instituicao')
        )
    );

-- Políticas para documentos
CREATE POLICY "Documentos visíveis para admin e próprio aluno" ON documentos
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM matriculas
            WHERE matriculas.id = documentos.matricula_id
            AND (
                matriculas.aluno_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role IN ('super_admin', 'admin_instituicao')
                )
            )
        )
    );

-- Políticas para contratos
CREATE POLICY "Contratos visíveis para admin e próprio aluno" ON contratos
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM matriculas
            WHERE matriculas.id = contratos.matricula_id
            AND (
                matriculas.aluno_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role IN ('super_admin', 'admin_instituicao')
                )
            )
        )
    );

-- Políticas para pagamentos
CREATE POLICY "Pagamentos visíveis para admin e próprio aluno" ON pagamentos
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM matriculas
            WHERE matriculas.id = pagamentos.matricula_id
            AND (
                matriculas.aluno_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role IN ('super_admin', 'admin_instituicao')
                )
            )
        )
    );

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cursos_updated_at
    BEFORE UPDATE ON cursos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planos_pagamento_updated_at
    BEFORE UPDATE ON planos_pagamento
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matriculas_updated_at
    BEFORE UPDATE ON matriculas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documentos_updated_at
    BEFORE UPDATE ON documentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contratos_updated_at
    BEFORE UPDATE ON contratos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagamentos_updated_at
    BEFORE UPDATE ON pagamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 