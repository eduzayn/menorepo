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