-- Script para adicionar funções e buckets adicionais
-- Executado por: Supabase CLI
-- Criado em: 2024-04-01

-- Função moddatetime
CREATE OR REPLACE FUNCTION moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verificar se o bucket comprovantes_financeiros existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'comprovantes_financeiros') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('comprovantes_financeiros', 'Comprovantes Financeiros', false);
        RAISE NOTICE 'Bucket comprovantes_financeiros criado.';
    ELSE
        RAISE NOTICE 'Bucket comprovantes_financeiros já existe.';
    END IF;
    
    -- Verificar se o bucket documentos_aluno existe
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'documentos_aluno') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('documentos_aluno', 'Documentos de Alunos', false);
        RAISE NOTICE 'Bucket documentos_aluno criado.';
    ELSE
        RAISE NOTICE 'Bucket documentos_aluno já existe.';
    END IF;
    
    -- Verificar se o bucket certificados existe
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'certificados') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('certificados', 'Certificados Emitidos', false);
        RAISE NOTICE 'Bucket certificados criado.';
    ELSE
        RAISE NOTICE 'Bucket certificados já existe.';
    END IF;
    
    -- Verificar se o bucket fotos_aluno existe
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'fotos_aluno') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('fotos_aluno', 'Fotos de Perfil de Alunos', false);
        RAISE NOTICE 'Bucket fotos_aluno criado.';
    ELSE
        RAISE NOTICE 'Bucket fotos_aluno já existe.';
    END IF;
    
    -- Verificar se o bucket material_didatico existe
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'material_didatico') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('material_didatico', 'Arquivos de Material Didático', false);
        RAISE NOTICE 'Bucket material_didatico criado.';
    ELSE
        RAISE NOTICE 'Bucket material_didatico já existe.';
    END IF;
END $$;

-- Função para verificar cobranças vencidas diariamente (versão para o cron)
CREATE OR REPLACE FUNCTION financeiro.verificar_cobrancas_vencidas_cron()
RETURNS void AS $$
BEGIN
    UPDATE financeiro.cobrancas
    SET status = 'vencido'
    WHERE status = 'pendente'
    AND data_vencimento < CURRENT_DATE;
    
    -- Log da execução
    INSERT INTO financeiro.logs_financeiros (
        entidade_tipo,
        entidade_id,
        acao,
        valor_anterior,
        valor_novo,
        usuario_id,
        ip_usuario
    ) VALUES (
        'cobranca',
        '00000000-0000-0000-0000-000000000000',
        'alteracao',
        NULL,
        jsonb_build_object('data_execucao', CURRENT_TIMESTAMP, 'acao', 'verificação de cobranças vencidas'),
        '00000000-0000-0000-0000-000000000000',
        'sistema'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função utilitária para calcular a idade de um aluno
CREATE OR REPLACE FUNCTION public.calcular_idade(data_nascimento DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, data_nascimento));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função para realizar uma matrícula com cobrança associada
CREATE OR REPLACE FUNCTION public.realizar_matricula(
    p_aluno_id UUID,
    p_curso_id UUID,
    p_plano_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_matricula_id UUID;
    v_plano RECORD;
    v_data_vencimento DATE;
    v_valor_parcela DECIMAL(10,2);
    v_descricao TEXT;
    i INTEGER;
BEGIN
    -- Obter informações do plano
    SELECT 
        valor_parcela, 
        numero_parcelas, 
        dia_vencimento 
    INTO v_plano 
    FROM public.planos_pagamento 
    WHERE id = p_plano_id;
    
    -- Criar a matrícula
    INSERT INTO public.matriculas (
        aluno_id,
        curso_id,
        plano_id,
        status,
        data_inicio,
        data_conclusao_prevista
    ) VALUES (
        p_aluno_id,
        p_curso_id,
        p_plano_id,
        'pendente',
        CURRENT_DATE,
        CURRENT_DATE + (v_plano.numero_parcelas * 30 || ' days')::INTERVAL
    ) RETURNING id INTO v_matricula_id;
    
    -- Criar as cobranças para cada parcela
    FOR i IN 1..v_plano.numero_parcelas LOOP
        -- Calcular data de vencimento
        IF (EXTRACT(DAY FROM CURRENT_DATE) <= v_plano.dia_vencimento) THEN
            -- Mesmo mês, dia especificado
            v_data_vencimento := DATE_TRUNC('month', CURRENT_DATE) + 
                                ((v_plano.dia_vencimento - 1) || ' days')::INTERVAL + 
                                ((i - 1) || ' months')::INTERVAL;
        ELSE
            -- Próximo mês, dia especificado
            v_data_vencimento := DATE_TRUNC('month', CURRENT_DATE + '1 month'::INTERVAL) + 
                                ((v_plano.dia_vencimento - 1) || ' days')::INTERVAL + 
                                ((i - 2) || ' months')::INTERVAL;
        END IF;
        
        -- Descrição da cobrança
        v_descricao := 'Mensalidade ' || i || '/' || v_plano.numero_parcelas || ' - Curso: ' || 
                      (SELECT nome FROM public.cursos WHERE id = p_curso_id);
        
        -- Criar a cobrança
        INSERT INTO financeiro.cobrancas (
            aluno_id,
            matricula_id,
            valor,
            data_vencimento,
            status,
            tipo,
            instituicao_id,
            descricao
        ) VALUES (
            p_aluno_id,
            v_matricula_id,
            v_plano.valor_parcela,
            v_data_vencimento,
            'pendente',
            'mensalidade',
            (SELECT institution_id FROM public.cursos WHERE id = p_curso_id),
            v_descricao
        );
    END LOOP;
    
    RETURN v_matricula_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 