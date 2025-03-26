// Script para verificar a estrutura do banco de dados Supabase
const { createClient } = require('@supabase/supabase-js')

// Configuração do cliente Supabase
const supabaseUrl = 'https://npiyusbnaaibibcucspv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waXl1c2JuYWFpYmliY3Vjc3B2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgzMzUyOCwiZXhwIjoyMDU4NDA5NTI4fQ.YZKmlk2SAS68hqxbWg0TiOkaSRY4MpTehcVxAac3AxA'

// Criar cliente com chave de serviço
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabaseStructure() {
  console.log('Verificando estrutura do banco de dados...')
  
  try {
    // Listar todas as tabelas públicas
    const { data: publicTables, error: publicTablesError } = await supabase.rpc('get_tables', { schema_name: 'public' })
    
    if (publicTablesError) {
      console.error('Erro ao obter tabelas públicas:', publicTablesError.message)
    } else {
      console.log('Tabelas públicas encontradas:')
      console.table(publicTables)
    }
    
    // Verificar schemas existentes
    const { data: schemas, error: schemasError } = await supabase.from('information_schema.schemata').select('schema_name')
    
    if (schemasError) {
      console.error('Erro ao obter schemas:', schemasError.message)
    } else {
      console.log('Schemas encontrados:')
      console.table(schemas)
    }
    
    // Verificar tabelas específicas do módulo de matrículas
    const { data: matriculasTables, error: matriculasError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .ilike('table_name', '%matricula%')
    
    if (matriculasError) {
      console.error('Erro ao verificar tabelas de matrículas:', matriculasError.message)
    } else {
      console.log('Tabelas relacionadas a matrículas:')
      console.table(matriculasTables)
    }
    
    // Verificar tabelas de comunicação
    const { data: comunicacaoTables, error: comunicacaoError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .or('table_name.ilike.%mensagem%,table_name.ilike.%notificac%,table_name.ilike.%comunicac%')
    
    if (comunicacaoError) {
      console.error('Erro ao verificar tabelas de comunicação:', comunicacaoError.message)
    } else {
      console.log('Tabelas relacionadas a comunicação:')
      console.table(comunicacaoTables)
    }
    
    // Verificar se já existem tabelas relacionadas ao portal do aluno
    const { data: portalAlunoTables, error: portalAlunoError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .or('table_name.ilike.%aluno%,table_name.ilike.%portal%')
    
    if (portalAlunoError) {
      console.error('Erro ao verificar tabelas do portal do aluno:', portalAlunoError.message)
    } else {
      console.log('Tabelas potencialmente relacionadas ao portal do aluno:')
      console.table(portalAlunoTables)
    }
    
    // Verificar funções existentes
    const { data: functions, error: functionsError } = await supabase
      .from('information_schema.routines')
      .select('routine_name, routine_schema')
      .eq('routine_type', 'FUNCTION')
    
    if (functionsError) {
      console.error('Erro ao obter funções:', functionsError.message)
    } else {
      console.log('Funções encontradas:')
      console.table(functions)
    }
    
    // Verificar storage buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets()
    
    if (bucketsError) {
      console.error('Erro ao listar buckets:', bucketsError.message)
    } else {
      console.log('Buckets encontrados:')
      console.table(buckets)
    }
    
  } catch (error) {
    console.error('Erro geral:', error.message)
  }
}

// Executar verificação
checkDatabaseStructure() 