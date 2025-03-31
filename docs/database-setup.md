<!-- cSpell:disable -->
# Configuração do Banco de Dados - Edunéxia

Este documento descreve o processo de configuração do banco de dados para a plataforma Edunéxia, incluindo a estrutura de tabelas, políticas de segurança e instruções de instalação.

## 🗄️ Estrutura do Banco de Dados

O banco de dados é gerenciado pelo Supabase e inclui as seguintes tabelas:

### Tabelas Principais

1. `institutions`
   - Armazena informações das instituições de ensino
   - Campos: id, name, domain, logo_url, settings, created_at, updated_at

2. `profiles`
   - Perfis de usuário vinculados às contas de autenticação
   - Campos: id, email, full_name, avatar_url, role, institution_id, created_at, updated_at

3. `user_sessions`
   - Gerencia sessões ativas dos usuários
   - Campos: id, user_id, provider, ip_address, user_agent, created_at, expires_at

4. `password_resets`
   - Controla solicitações de redefinição de senha
   - Campos: id, user_id, token, created_at, expires_at, used

5. `email_verifications`
   - Gerencia verificações de email
   - Campos: id, user_id, token, created_at, expires_at, verified_at

### Tipos Enumerados

1. `user_role`
   - super_admin
   - admin_instituicao
   - consultor_comercial
   - tutor
   - aluno

2. `auth_provider`
   - email
   - google
   - facebook
   - microsoft
   - apple

## 🔒 Políticas de Segurança (RLS)

Todas as tabelas têm Row Level Security (RLS) habilitada com as seguintes políticas:

### Institutions
- SELECT: Visível para usuários autenticados
- INSERT/UPDATE: Apenas super_admin

### Profiles
- SELECT/UPDATE: Usuários podem ver/editar apenas seu próprio perfil

### User Sessions
- SELECT/DELETE: Usuários podem ver/deletar apenas suas próprias sessões

### Password Resets & Email Verifications
- SELECT: Usuários podem ver apenas seus próprios registros

## 🔄 Triggers e Funções

- `handle_new_user()`: Cria automaticamente um perfil quando um novo usuário é registrado
- Trigger `on_auth_user_created`: Executa após INSERT em auth.users

## 📑 Índices

- `idx_profiles_institution_id`
- `idx_user_sessions_user_id`
- `idx_password_resets_user_id`
- `idx_email_verifications_user_id`

## 🚀 Instalação e Configuração

### Pré-requisitos

1. Supabase CLI instalado
2. Projeto Supabase criado
3. Variáveis de ambiente configuradas

### Passos para Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/eduzayn/menorepo.git
   cd menorepo
   ```

2. Configure as variáveis de ambiente:
   ```bash
   $env:SUPABASE_DB_PASSWORD="sua_senha"
   ```

3. Vincule ao projeto Supabase:
   ```bash
   supabase link --project-ref seu-project-ref
   ```

4. Aplique as migrações:
   ```bash
   supabase db push
   ```

### Usando o Pacote Database Schema

1. Instale o pacote nos módulos que precisam dele:
   ```json
   {
     "dependencies": {
       "@edunexia/database-schema": "workspace:*"
     }
   }
   ```

2. Importe os tipos e enums:
   ```typescript
   import { UserRole, AuthProvider, Profile } from '@edunexia/database-schema';
   ```

## 🔍 Monitoramento e Manutenção

- Use o Supabase Dashboard para monitorar:
  - Uso do banco de dados
  - Performance das queries
  - Logs de autenticação
  - Políticas de segurança

## 🤝 Contribuindo

1. Crie uma nova branch para sua feature
2. Adicione migrações em `supabase/migrations`
3. Atualize os tipos em `packages/database-schema`
4. Teste localmente com `supabase db push`
5. Abra um Pull Request

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Referência de Políticas](https://supabase.com/docs/guides/auth/row-level-security/policies)

## 1. Configuração Inicial

### 1.1 Variáveis de Ambiente

```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico

# Configuração de Teste
ENABLE_TEST_BYPASS=true
TEST_USER_EMAIL=ana.diretoria@edunexia.com
TEST_USER_PASSWORD=teste123
```

### 1.2 Criação do Banco de Dados

1. Acesse o painel do Supabase
2. Crie um novo projeto
3. Copie as credenciais para o arquivo `.env`

## 2. Estrutura do Banco

### 2.1 Tabelas Principais

1. **auth.users**
   ```sql
   -- Criada automaticamente pelo Supabase
   -- Não requer criação manual
   ```

2. **profiles**
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     name TEXT,
     email TEXT UNIQUE,
     institution_id UUID REFERENCES institutions(id),
     role TEXT,
     preferences JSONB DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   );
   ```

3. **user_permissions**
   ```sql
   CREATE TABLE user_permissions (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     permissions JSONB DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   );
   ```

4. **institutions**
   ```sql
   CREATE TABLE institutions (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name TEXT NOT NULL,
     domain TEXT UNIQUE,
     settings JSONB DEFAULT '{}',
     active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   );
   ```

### 2.2 Índices

```sql
-- Índices para profiles
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_institution_id_idx ON profiles(institution_id);
CREATE INDEX profiles_role_idx ON profiles(role);

-- Índices para user_permissions
CREATE INDEX user_permissions_user_id_idx ON user_permissions(user_id);

-- Índices para institutions
CREATE INDEX institutions_domain_idx ON institutions(domain);
CREATE INDEX institutions_active_idx ON institutions(active);
```

### 2.3 Políticas de Segurança (RLS)

```sql
-- Políticas para profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Apenas super_admin pode modificar perfis"
  ON profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Políticas para user_permissions
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias permissões"
  ON user_permissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Apenas super_admin pode modificar permissões"
  ON user_permissions FOR ALL
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Políticas para institutions
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver instituições ativas"
  ON institutions FOR SELECT
  USING (active = true);

CREATE POLICY "Apenas super_admin pode modificar instituições"
  ON institutions FOR ALL
  USING (auth.jwt() ->> 'role' = 'super_admin');
```

## 3. Configuração do Usuário de Teste

### 3.1 Criação do Usuário

```sql
-- Inserir usuário de teste
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  role,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ana.diretoria@edunexia.com',
  crypt('teste123', gen_salt('bf')),
  NOW(),
  'super_admin',
  '{"role": "super_admin"}',
  '{"provider": "email"}',
  NOW(),
  NOW()
);

-- Inserir perfil do usuário de teste
INSERT INTO profiles (
  id,
  name,
  email,
  role,
  preferences
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Ana Diretoria',
  'ana.diretoria@edunexia.com',
  'super_admin',
  '{"theme": "light", "language": "pt-BR"}'
);

-- Inserir permissões do usuário de teste
INSERT INTO user_permissions (
  user_id,
  permissions
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '{
    "viewEnrollments": true,
    "manageEnrollments": true,
    "viewCommunications": true,
    "manageCommunications": true,
    "sendBulkMessages": true,
    "viewMaterials": true,
    "createMaterials": true,
    "editMaterials": true,
    "viewStudentPortal": true,
    "viewFinancialData": true,
    "manageFinancialData": true,
    "viewReports": true,
    "generateReports": true,
    "manageSettings": true,
    "manageUsers": true,
    "manageRoles": true,
    "manageInstitution": true
  }'
);
```

### 3.2 Verificação

Para verificar se o usuário de teste foi criado corretamente:

```sql
-- Verificar usuário
SELECT * FROM auth.users WHERE email = 'ana.diretoria@edunexia.com';

-- Verificar perfil
SELECT * FROM profiles WHERE email = 'ana.diretoria@edunexia.com';

-- Verificar permissões
SELECT * FROM user_permissions WHERE user_id = '00000000-0000-0000-0000-000000000000';
```

## 4. Manutenção

### 4.1 Backup

1. Configure backup automático no Supabase
2. Mantenha backups por 30 dias
3. Teste restauração periodicamente

### 4.2 Monitoramento

1. Configure alertas para:
   - Falhas de autenticação
   - Tentativas de acesso não autorizado
   - Problemas de sincronização

2. Monitore métricas:
   - Número de usuários ativos
   - Taxa de autenticação
   - Erros de permissão 
