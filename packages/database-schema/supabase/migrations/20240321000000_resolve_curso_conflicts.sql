-- Resolve conflitos entre tabelas de cursos antes da migração do material didático
-- Executado por: Supabase CLI
-- Criado em: 2024-03-21

-- Verificar se existem duas tabelas de curso para evitar conflitos com o módulo de material didático
DO $$
BEGIN
    -- Verificar se a tabela de cursos do módulo de matrículas existe
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cursos') THEN
        -- Adicionar comentário para identificação clara
        COMMENT ON TABLE public.cursos IS 'Tabela de cursos para matrícula e gestão acadêmica';
        
        -- Garante que todas as colunas necessárias existem para compatibilidade
        IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'public.cursos'::regclass AND attname = 'codigo') THEN
            ALTER TABLE public.cursos ADD COLUMN codigo TEXT;
        END IF;
    END IF;

    -- Garante que existe a tabela 'instituicoes' para referências corretas
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'instituicoes') AND
       EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'institutions') THEN
        -- Criar tabela instituicoes como view da tabela institutions se necessário
        CREATE OR REPLACE VIEW public.instituicoes AS
        SELECT 
            id,
            name as nome,
            domain as dominio,
            logo_url,
            settings as configuracoes,
            created_at,
            updated_at
        FROM public.institutions;
        
        COMMENT ON VIEW public.instituicoes IS 'View de compatibilidade mapeando institutions para instituicoes';
    END IF;

    -- Criar tabela de mapeamento entre cursos de matrículas e cursos de conteúdo se necessário
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mapeamento_cursos') THEN
        CREATE TABLE IF NOT EXISTS public.mapeamento_cursos (
            curso_matricula_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
            curso_conteudo_id UUID, -- Será referenciado depois que a tabela for criada
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            PRIMARY KEY (curso_matricula_id)
        );
        
        COMMENT ON TABLE public.mapeamento_cursos IS 'Tabela de mapeamento entre IDs de cursos nos módulos de matrícula e conteúdo';
    END IF;

END $$; 