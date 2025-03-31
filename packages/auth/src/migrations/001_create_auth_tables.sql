-- Inicia uma transação
BEGIN;

-- Função auxiliar para verificar se uma tabela existe
CREATE OR REPLACE FUNCTION table_exists(p_table_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND tables.table_name = p_table_name
    );
END;
$$ LANGUAGE plpgsql;

-- Função auxiliar para verificar se uma coluna existe
CREATE OR REPLACE FUNCTION column_exists(p_table_name text, p_column_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND columns.table_name = p_table_name 
        AND columns.column_name = p_column_name
    );
END;
$$ LANGUAGE plpgsql;

-- Função auxiliar para verificar se uma constraint existe
CREATE OR REPLACE FUNCTION constraint_exists(p_constraint_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_constraints.constraint_name = p_constraint_name
    );
END;
$$ LANGUAGE plpgsql;

-- Tabela de perfis de usuário
DO $$
BEGIN
    IF NOT table_exists('profiles') THEN
        CREATE TABLE profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL DEFAULT 'student',
            institution_id UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Índices
        CREATE INDEX idx_profiles_email ON profiles(email);
        CREATE INDEX idx_profiles_role ON profiles(role);
        CREATE INDEX idx_profiles_institution_id ON profiles(institution_id);
    END IF;
END $$;

-- Tabela de permissões de usuário
DO $$
BEGIN
    IF NOT table_exists('user_permissions') THEN
        CREATE TABLE user_permissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE(user_id)
        );

        -- Índices
        CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
    END IF;
END $$;

-- Tabela de instituições
DO $$
BEGIN
    IF NOT table_exists('institutions') THEN
        CREATE TABLE institutions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            domain TEXT UNIQUE,
            settings JSONB NOT NULL DEFAULT '{}'::jsonb,
            active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Índices
        CREATE INDEX idx_institutions_domain ON institutions(domain);
        CREATE INDEX idx_institutions_active ON institutions(active);
    END IF;
END $$;

-- Adiciona chave estrangeira para institution_id em profiles se não existir
DO $$
BEGIN
    IF NOT constraint_exists('profiles_institution_id_fkey') THEN
        ALTER TABLE profiles
        ADD CONSTRAINT profiles_institution_id_fkey
        FOREIGN KEY (institution_id)
        REFERENCES institutions(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- Tabela de templates de permissões
DO $$
BEGIN
    IF NOT table_exists('permission_templates') THEN
        CREATE TABLE permission_templates (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Índices
        CREATE INDEX idx_permission_templates_name ON permission_templates(name);
        CREATE INDEX idx_permission_templates_created_by ON permission_templates(created_by);
    END IF;
END $$;

-- Tabela de papéis funcionais
DO $$
BEGIN
    IF NOT table_exists('functional_roles') THEN
        CREATE TABLE functional_roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            code TEXT NOT NULL UNIQUE,
            template_id UUID REFERENCES permission_templates(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Índices
        CREATE INDEX idx_functional_roles_code ON functional_roles(code);
        CREATE INDEX idx_functional_roles_template_id ON functional_roles(template_id);
    END IF;
END $$;

-- Tabela de atribuição de papéis funcionais
DO $$
BEGIN
    IF NOT table_exists('user_functional_roles') THEN
        CREATE TABLE user_functional_roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            functional_role_id UUID NOT NULL REFERENCES functional_roles(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE(user_id, functional_role_id)
        );

        -- Índices
        CREATE INDEX idx_user_functional_roles_user_id ON user_functional_roles(user_id);
        CREATE INDEX idx_user_functional_roles_role_id ON user_functional_roles(functional_role_id);
    END IF;
END $$;

-- Função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
DO $$
BEGIN
    -- profiles
    IF NOT EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'update_profiles_updated_at'
    ) THEN
        CREATE TRIGGER update_profiles_updated_at
            BEFORE UPDATE ON profiles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- user_permissions
    IF NOT EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'update_user_permissions_updated_at'
    ) THEN
        CREATE TRIGGER update_user_permissions_updated_at
            BEFORE UPDATE ON user_permissions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- institutions
    IF NOT EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'update_institutions_updated_at'
    ) THEN
        CREATE TRIGGER update_institutions_updated_at
            BEFORE UPDATE ON institutions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- permission_templates
    IF NOT EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'update_permission_templates_updated_at'
    ) THEN
        CREATE TRIGGER update_permission_templates_updated_at
            BEFORE UPDATE ON permission_templates
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- functional_roles
    IF NOT EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'update_functional_roles_updated_at'
    ) THEN
        CREATE TRIGGER update_functional_roles_updated_at
            BEFORE UPDATE ON functional_roles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- user_functional_roles
    IF NOT EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'update_user_functional_roles_updated_at'
    ) THEN
        CREATE TRIGGER update_user_functional_roles_updated_at
            BEFORE UPDATE ON user_functional_roles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Commit a transação
COMMIT; 