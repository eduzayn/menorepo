# Configuração do Banco de Dados

## Pré-requisitos

1. Ter o Supabase CLI instalado:
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

2. Ter acesso ao projeto Supabase:
   - URL: https://npiyusbnaaibibcucspv.supabase.co
   - Senha do banco: Zayn@2025

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/eduzayn/menorepo.git
cd menorepo
```

2. Configure as variáveis de ambiente:
```bash
# Windows (PowerShell)
$env:SUPABASE_DB_PASSWORD="Zayn@2025"

# Linux/MacOS
export SUPABASE_DB_PASSWORD="Zayn@2025"
```

3. Vincule o projeto local ao Supabase:
```bash
supabase link --project-ref npiyusbnaaibibcucspv
```

## Aplicando Migrações

Para aplicar as migrações do banco de dados:

```bash
supabase db push
```

Se você receber um erro de autenticação, certifique-se de que:
1. A variável de ambiente `SUPABASE_DB_PASSWORD` está configurada corretamente
2. Você está usando a senha correta do banco de dados
3. Você tem permissões de acesso ao projeto no Supabase

## Solução de Problemas

### Erro de Autenticação
Se você receber um erro de autenticação, tente:

1. Verificar se a senha está correta:
```bash
echo $SUPABASE_DB_PASSWORD  # Linux/MacOS
echo $env:SUPABASE_DB_PASSWORD  # Windows
```

2. Reconfigurar a variável de ambiente:
```bash
# Windows (PowerShell)
$env:SUPABASE_DB_PASSWORD="Zayn@2025"

# Linux/MacOS
export SUPABASE_DB_PASSWORD="Zayn@2025"
```

3. Tentar novamente com a senha explícita:
```bash
$env:SUPABASE_DB_PASSWORD="Zayn@2025"; supabase db push
```

### Erro de Conexão
Se você receber um erro de conexão:

1. Verifique se você está conectado à internet
2. Verifique se o projeto Supabase está online
3. Tente usar o comando com a flag de debug:
```bash
supabase db push --debug
```

## Estrutura do Banco de Dados

O banco de dados está configurado com as seguintes tabelas:

1. `profiles` - Perfis de usuários
2. `institutions` - Instituições parceiras
3. `user_sessions` - Sessões de usuários
4. `password_resets` - Reset de senhas
5. `email_verifications` - Verificação de email

Para mais detalhes sobre a estrutura do banco de dados, consulte o arquivo [database-structure.md](./database-structure.md). 