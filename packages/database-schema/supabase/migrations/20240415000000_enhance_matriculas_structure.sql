-- Migração para melhorias no módulo de matrículas
-- 20240415000000_enhance_matriculas_structure.sql

--------------------------
-- Verificações Iniciais
--------------------------
DO $$ 
BEGIN
  -- Verificar se schema matriculas existe, se não, criar
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'matriculas') THEN
    CREATE SCHEMA matriculas;
    RAISE NOTICE 'Schema matriculas criado com sucesso.';
  ELSE
    RAISE NOTICE 'Schema matriculas já existe.';
  END IF;
END $$;

-- Definir o owner do schema
ALTER SCHEMA matriculas OWNER TO postgres;

--------------------------
-- Adicionar novos status ao enum de matrícula
--------------------------
DO $$
BEGIN
  -- Adicionar novos valores no enum apenas se não existirem
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'em_processo' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'matricula_status')) THEN
    ALTER TYPE matricula_status ADD VALUE 'em_processo';
    RAISE NOTICE 'Status em_processo adicionado.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'inadimplente' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'matricula_status')) THEN
    ALTER TYPE matricula_status ADD VALUE 'inadimplente';
    RAISE NOTICE 'Status inadimplente adicionado.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'reativada' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'matricula_status')) THEN
    ALTER TYPE matricula_status ADD VALUE 'reativada';
    RAISE NOTICE 'Status reativada adicionado.';
  END IF;
END $$;

--------------------------
-- Adicionar campos à tabela de matrículas
--------------------------
DO $$
BEGIN
  -- Adicionar novos campos à tabela de matrículas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas' AND column_name = 'responsavel_financeiro') THEN
    ALTER TABLE matriculas ADD COLUMN responsavel_financeiro UUID REFERENCES auth.users(id);
    RAISE NOTICE 'Campo responsavel_financeiro adicionado.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas' AND column_name = 'origem_matricula') THEN
    ALTER TABLE matriculas ADD COLUMN origem_matricula VARCHAR(100);
    RAISE NOTICE 'Campo origem_matricula adicionado.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas' AND column_name = 'tem_bolsa') THEN
    ALTER TABLE matriculas ADD COLUMN tem_bolsa BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Campo tem_bolsa adicionado.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas' AND column_name = 'percentual_bolsa') THEN
    ALTER TABLE matriculas ADD COLUMN percentual_bolsa DECIMAL(5,2) DEFAULT 0;
    RAISE NOTICE 'Campo percentual_bolsa adicionado.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas' AND column_name = 'codigo_bolsa') THEN
    ALTER TABLE matriculas ADD COLUMN codigo_bolsa VARCHAR(100);
    RAISE NOTICE 'Campo codigo_bolsa adicionado.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'matriculas' AND column_name = 'ultima_verificacao_situacao') THEN
    ALTER TABLE matriculas ADD COLUMN ultima_verificacao_situacao TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Campo ultima_verificacao_situacao adicionado.';
  END IF;
END $$;

--------------------------
-- Criar tabela de logs de matrícula
--------------------------
CREATE TABLE IF NOT EXISTS matriculas.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula_id UUID REFERENCES matriculas(id) NOT NULL,
    status_anterior matricula_status,
    status_novo matricula_status,
    operacao VARCHAR(50) NOT NULL,
    descricao TEXT,
    dados_alterados JSONB,
    usuario_id UUID REFERENCES auth.users(id),
    ip_usuario VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para tabela de logs
CREATE INDEX IF NOT EXISTS idx_matriculas_logs_matricula ON matriculas.logs(matricula_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_logs_created_at ON matriculas.logs(created_at);

-- Criar índices adicionais para matrículas
CREATE INDEX IF NOT EXISTS idx_matriculas_bolsa ON matriculas(tem_bolsa) WHERE tem_bolsa = TRUE;
CREATE INDEX IF NOT EXISTS idx_matriculas_responsavel ON matriculas(responsavel_financeiro) WHERE responsavel_financeiro IS NOT NULL;

--------------------------
-- Criar funções
--------------------------

-- Função para registrar alterações em matrículas
CREATE OR REPLACE FUNCTION matriculas.registrar_alteracao_matricula()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.status <> NEW.status OR OLD.plano_id <> NEW.plano_id) THEN
            INSERT INTO matriculas.logs (
                matricula_id,
                status_anterior,
                status_novo,
                operacao,
                descricao,
                dados_alterados,
                usuario_id,
                ip_usuario
            ) VALUES (
                NEW.id,
                OLD.status,
                NEW.status,
                CASE 
                    WHEN OLD.status <> NEW.status THEN 'alteracao_status'
                    WHEN OLD.plano_id <> NEW.plano_id THEN 'alteracao_plano'
                    ELSE 'outra_alteracao'
                END,
                'Alteração automática',
                jsonb_build_object(
                    'anterior', to_jsonb(OLD),
                    'atual', to_jsonb(NEW)
                ),
                (SELECT auth.uid()),
                inet_client_addr()::text
            );
        END IF;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO matriculas.logs (
            matricula_id,
            status_novo,
            operacao,
            descricao,
            dados_alterados,
            usuario_id,
            ip_usuario
        ) VALUES (
            NEW.id,
            NEW.status,
            'criacao',
            'Matrícula criada',
            to_jsonb(NEW),
            (SELECT auth.uid()),
            inet_client_addr()::text
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar alterações
DROP TRIGGER IF EXISTS trg_registrar_alteracao_matricula ON matriculas;
CREATE TRIGGER trg_registrar_alteracao_matricula
AFTER UPDATE OR INSERT ON matriculas
FOR EACH ROW EXECUTE FUNCTION matriculas.registrar_alteracao_matricula();

-- Função para verificar situação das matrículas
CREATE OR REPLACE FUNCTION matriculas.verificar_situacao_matriculas()
RETURNS void AS $$
DECLARE
    v_matricula_id UUID;
    v_aluno_id UUID;
    v_status_anterior matricula_status;
BEGIN
    -- Atualizar matrículas inadimplentes
    FOR v_matricula_id, v_aluno_id, v_status_anterior IN
        SELECT m.id, m.aluno_id, m.status
        FROM matriculas m
        WHERE EXISTS (
            SELECT 1 FROM pagamentos p
            WHERE p.matricula_id = m.id
            AND p.status = 'pendente'
            AND p.data_vencimento < CURRENT_DATE - INTERVAL '30 days'
        )
        AND m.status = 'ativa'
    LOOP
        -- Atualizar status da matrícula
        UPDATE matriculas
        SET 
            status = 'inadimplente',
            ultima_verificacao_situacao = NOW()
        WHERE id = v_matricula_id;
        
        -- Registrar nos logs manualmente
        INSERT INTO matriculas.logs (
            matricula_id,
            status_anterior,
            status_novo,
            operacao,
            descricao,
            usuario_id
        ) VALUES (
            v_matricula_id,
            v_status_anterior,
            'inadimplente',
            'atualizacao_automatica',
            'Matrícula marcada como inadimplente por ter parcelas vencidas há mais de 30 dias',
            '00000000-0000-0000-0000-000000000000'
        );
        
        -- Criar bloqueio de acesso se aplicável
        INSERT INTO portal_aluno.bloqueios_acesso (
            aluno_id,
            motivo,
            descricao,
            ativo,
            criado_por
        ) VALUES (
            v_aluno_id,
            'inadimplencia',
            'Bloqueio automático por inadimplência em mais de 30 dias',
            TRUE,
            '00000000-0000-0000-0000-000000000000'
        )
        ON CONFLICT (aluno_id) 
        DO UPDATE SET
            ativo = TRUE,
            data_inicio = NOW(),
            data_fim = NULL,
            updated_at = NOW()
        WHERE portal_aluno.bloqueios_acesso.aluno_id = v_aluno_id
        AND portal_aluno.bloqueios_acesso.motivo = 'inadimplencia';
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

--------------------------
-- Criar View para situação completa da matrícula
--------------------------
CREATE OR REPLACE VIEW matriculas.matriculas_completas AS
SELECT 
    m.*,
    u.email as email_aluno,
    COALESCE(u.raw_user_meta_data->>'nome', u.raw_user_meta_data->>'name', u.email) as nome_aluno,
    c.nome as curso_nome,
    c.modalidade as curso_modalidade,
    pp.nome as plano_nome,
    pp.valor_total,
    pp.numero_parcelas,
    COALESCE((SELECT COUNT(*) FROM pagamentos p WHERE p.matricula_id = m.id), 0) as total_parcelas_geradas,
    COALESCE((SELECT COUNT(*) FROM pagamentos p WHERE p.matricula_id = m.id AND p.status = 'aprovado'), 0) as parcelas_pagas,
    COALESCE((SELECT COUNT(*) FROM documentos d WHERE d.matricula_id = m.id), 0) as total_documentos,
    COALESCE((SELECT COUNT(*) FROM documentos d WHERE d.matricula_id = m.id AND d.status = 'pendente'), 0) as documentos_pendentes,
    COALESCE((SELECT EXISTS(
        SELECT 1 FROM portal_aluno.bloqueios_acesso ba 
        WHERE ba.aluno_id = m.aluno_id AND ba.ativo = TRUE
    )), FALSE) as possui_bloqueio
FROM 
    matriculas m
JOIN 
    auth.users u ON m.aluno_id = u.id
JOIN 
    cursos c ON m.curso_id = c.id
JOIN 
    planos_pagamento pp ON m.plano_id = pp.id;

-- Criar função para execução manual da verificação
CREATE OR REPLACE FUNCTION matriculas.executar_verificacao()
RETURNS text AS $$
BEGIN
    PERFORM matriculas.verificar_situacao_matriculas();
    RETURN 'Verificação de matrículas realizada com sucesso';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 