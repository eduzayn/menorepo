-- Create enums if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'admin_instituicao',
        'consultor_comercial',
        'tutor',
        'aluno'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auth_provider AS ENUM (
        'email',
        'google',
        'facebook',
        'microsoft',
        'apple'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create institutions table
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    logo_url TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'aluno',
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider auth_provider NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Create password_resets table
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create email_verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ
);

-- Create RLS policies
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Institutions are viewable by authenticated users" ON institutions;
DROP POLICY IF EXISTS "Only super admins can insert institutions" ON institutions;
DROP POLICY IF EXISTS "Only super admins can update institutions" ON institutions;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Password resets are viewable by the user" ON password_resets;
DROP POLICY IF EXISTS "Email verifications are viewable by the user" ON email_verifications;

-- Institutions policies
CREATE POLICY "Institutions are viewable by authenticated users"
    ON institutions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only super admins can insert institutions"
    ON institutions FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Only super admins can update institutions"
    ON institutions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- User sessions policies
CREATE POLICY "Users can view their own sessions"
    ON user_sessions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
    ON user_sessions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Password resets policies
CREATE POLICY "Password resets are viewable by the user"
    ON password_resets FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Email verifications policies
CREATE POLICY "Email verifications are viewable by the user"
    ON email_verifications FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create or replace function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_institution_id ON profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id); 