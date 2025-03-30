-- Script para verificação de estruturas existentes antes da migração
-- Executar este script antes das migrações para entender o estado atual

----------------------------------
-- 1. VERIFICAÇÃO DE SCHEMAS
----------------------------------
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('contabilidade', 'rh');

----------------------------------
-- 2. VERIFICAÇÃO DE TIPOS ENUMERADOS
----------------------------------
-- Verificar tipos enum existentes
SELECT n.nspname as schema,
       t.typname as tipo,
       e.enumlabel as valor
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname IN ('contabilidade', 'rh')
ORDER BY schema, tipo, e.enumsortorder;

----------------------------------
-- 3. VERIFICAÇÃO DE TABELAS
----------------------------------
-- Verificar tabelas existentes
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema IN ('contabilidade', 'rh')
ORDER BY table_schema, table_name;

-- Verificar colunas de tabelas específicas (se existirem)
SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'contabilidade' AND table_name = 'contas';

SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'contabilidade' AND table_name = 'lancamentos';

SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'rh' AND table_name = 'pendencias_contabilizacao';

----------------------------------
-- 4. VERIFICAÇÃO DE FUNÇÕES
----------------------------------
-- Verificar funções existentes
SELECT routine_schema, routine_name
FROM information_schema.routines
WHERE routine_schema IN ('contabilidade', 'rh')
ORDER BY routine_schema, routine_name;

----------------------------------
-- 5. VERIFICAÇÃO DE TRIGGERS
----------------------------------
-- Verificar triggers existentes
SELECT event_object_schema AS table_schema,
       event_object_table AS table_name,
       trigger_name,
       action_statement
FROM information_schema.triggers
WHERE event_object_schema IN ('contabilidade', 'rh')
ORDER BY table_schema, table_name, trigger_name;

----------------------------------
-- 6. VERIFICAÇÃO DE INSTITUIÇÕES
----------------------------------
-- Verificar instituições disponíveis para testes
SELECT id, nome 
FROM public.institutions
LIMIT 10;

----------------------------------
-- 7. VERIFICAÇÃO DE PERMISSÕES RLS
----------------------------------
-- Verificar políticas RLS existentes
SELECT tablename, policyname, permissive, cmd
FROM pg_policies
WHERE schemaname IN ('contabilidade', 'rh')
ORDER BY tablename, policyname; 