-- Inicia uma transação
BEGIN;

-- Atualiza a coluna permissions na tabela user_permissions para usar o novo tipo
DO $$
BEGIN
    -- Primeiro, faz backup dos dados existentes
    IF NOT table_exists('user_permissions_backup') THEN
        CREATE TABLE user_permissions_backup AS 
        SELECT * FROM user_permissions;
    END IF;

    -- Altera o tipo da coluna permissions
    ALTER TABLE user_permissions
    ALTER COLUMN permissions TYPE TEXT[] USING (
        CASE 
            WHEN permissions IS NULL THEN ARRAY[]::TEXT[]
            WHEN jsonb_typeof(permissions) = 'array' THEN 
                ARRAY(SELECT jsonb_array_elements_text(permissions))
            ELSE ARRAY[]::TEXT[]
        END
    );

    -- Adiciona constraint para validar as permissões
    ALTER TABLE user_permissions
    ADD CONSTRAINT valid_permissions 
    CHECK (
        permissions <@ ARRAY[
            'matriculas.view',
            'matriculas.manage',
            'matriculas.delete',
            'portal-aluno.view',
            'portal-aluno.manage',
            'material-didatico.view',
            'material-didatico.create',
            'material-didatico.edit',
            'material-didatico.delete',
            'comunicacao.view',
            'comunicacao.manage',
            'comunicacao.delete',
            'financeiro.view',
            'financeiro.manage',
            'financeiro.delete',
            'relatorios.view',
            'relatorios.generate',
            'configuracoes.view',
            'configuracoes.manage'
        ]::TEXT[]
    );
END $$;

-- Função para atribuir permissões padrão baseadas no papel
CREATE OR REPLACE FUNCTION assign_role_permissions(user_id UUID, role TEXT)
RETURNS void AS $$
DECLARE
    role_permissions TEXT[];
BEGIN
    -- Define as permissões padrão para cada papel
    CASE role
        WHEN 'super_admin' THEN
            role_permissions := ARRAY[
                'matriculas.view', 'matriculas.manage', 'matriculas.delete',
                'portal-aluno.view', 'portal-aluno.manage',
                'material-didatico.view', 'material-didatico.create', 'material-didatico.edit', 'material-didatico.delete',
                'comunicacao.view', 'comunicacao.manage', 'comunicacao.delete',
                'financeiro.view', 'financeiro.manage', 'financeiro.delete',
                'relatorios.view', 'relatorios.generate',
                'configuracoes.view', 'configuracoes.manage'
            ];
        WHEN 'institution_admin' THEN
            role_permissions := ARRAY[
                'matriculas.view', 'matriculas.manage',
                'portal-aluno.view', 'portal-aluno.manage',
                'material-didatico.view', 'material-didatico.create', 'material-didatico.edit',
                'comunicacao.view', 'comunicacao.manage',
                'financeiro.view', 'financeiro.manage',
                'relatorios.view', 'relatorios.generate',
                'configuracoes.view', 'configuracoes.manage'
            ];
        WHEN 'coordinator' THEN
            role_permissions := ARRAY[
                'matriculas.view', 'matriculas.manage',
                'portal-aluno.view',
                'material-didatico.view', 'material-didatico.create', 'material-didatico.edit',
                'comunicacao.view', 'comunicacao.manage',
                'relatorios.view'
            ];
        WHEN 'teacher' THEN
            role_permissions := ARRAY[
                'matriculas.view',
                'portal-aluno.view',
                'material-didatico.view', 'material-didatico.create', 'material-didatico.edit',
                'comunicacao.view', 'comunicacao.manage'
            ];
        WHEN 'secretary' THEN
            role_permissions := ARRAY[
                'matriculas.view', 'matriculas.manage',
                'portal-aluno.view',
                'comunicacao.view', 'comunicacao.manage'
            ];
        WHEN 'financial' THEN
            role_permissions := ARRAY[
                'financeiro.view', 'financeiro.manage',
                'relatorios.view'
            ];
        WHEN 'student' THEN
            role_permissions := ARRAY[
                'portal-aluno.view',
                'material-didatico.view'
            ];
        WHEN 'parent' THEN
            role_permissions := ARRAY[
                'portal-aluno.view',
                'material-didatico.view'
            ];
        ELSE
            role_permissions := ARRAY[]::TEXT[];
    END CASE;

    -- Insere ou atualiza as permissões do usuário
    INSERT INTO user_permissions (user_id, permissions)
    VALUES (user_id, role_permissions)
    ON CONFLICT (user_id) 
    DO UPDATE SET permissions = role_permissions;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se um usuário tem uma permissão específica
CREATE OR REPLACE FUNCTION has_permission(user_id UUID, required_permission TEXT)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM user_permissions 
        WHERE user_id = user_id 
        AND required_permission = ANY(permissions)
    );
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se um usuário tem todas as permissões especificadas
CREATE OR REPLACE FUNCTION has_all_permissions(user_id UUID, required_permissions TEXT[])
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM user_permissions 
        WHERE user_id = user_id 
        AND permissions @> required_permissions
    );
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se um usuário tem pelo menos uma das permissões especificadas
CREATE OR REPLACE FUNCTION has_any_permission(user_id UUID, required_permissions TEXT[])
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM user_permissions 
        WHERE user_id = user_id 
        AND permissions && required_permissions
    );
END;
$$ LANGUAGE plpgsql;

-- Atualiza as permissões de todos os usuários existentes baseado em seus papéis
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id, role FROM profiles
    LOOP
        PERFORM assign_role_permissions(r.id, r.role);
    END LOOP;
END $$;

-- Commit a transação
COMMIT; 