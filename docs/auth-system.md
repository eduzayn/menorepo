<!-- cSpell:disable -->
# Sistema de Autenticação da Plataforma Edunéxia

## Visão Geral

O sistema de autenticação da plataforma Edunéxia é construído sobre o Supabase Auth, oferecendo uma solução robusta e segura para gerenciamento de usuários. O sistema suporta múltiplos provedores de autenticação e implementa um sistema de roles (papéis) para controle de acesso.

## Estrutura do Banco de Dados

### Tabelas Principais

#### 1. `profiles`
- Armazena informações detalhadas dos usuários
- Vinculada à tabela `auth.users` do Supabase
- Campos principais:
  - `id`: UUID (chave primária)
  - `email`: Email único do usuário
  - `full_name`: Nome completo
  - `avatar_url`: URL do avatar
  - `role`: Papel do usuário (enum)
  - `institution_id`: ID da instituição (opcional)

#### 2. `institutions`
- Gerencia as instituições parceiras
- Campos principais:
  - `id`: UUID (chave primária)
  - `name`: Nome da instituição
  - `domain`: Domínio único
  - `logo_url`: URL do logo
  - `settings`: Configurações em JSON

#### 3. `user_sessions`
- Registra sessões de usuários
- Campos principais:
  - `id`: UUID (chave primária)
  - `user_id`: ID do usuário
  - `provider`: Provedor de autenticação
  - `ip_address`: IP do usuário
  - `user_agent`: Informações do navegador
  - `expires_at`: Data de expiração

#### 4. `password_resets`
- Gerencia reset de senhas
- Campos principais:
  - `id`: UUID (chave primária)
  - `user_id`: ID do usuário
  - `token`: Token único
  - `expires_at`: Data de expiração
  - `used`: Status de uso

#### 5. `email_verifications`
- Gerencia verificação de email
- Campos principais:
  - `id`: UUID (chave primária)
  - `user_id`: ID do usuário
  - `token`: Token único
  - `expires_at`: Data de expiração
  - `verified_at`: Data de verificação

## Papéis de Usuário

O sistema implementa os seguintes papéis:

1. `super_admin`
   - Acesso total ao sistema
   - Gerenciamento de instituições
   - Gerenciamento de usuários

2. `admin_instituicao`
   - Acesso total à instituição
   - Gerenciamento de usuários da instituição
   - Configurações da instituição

3. `consultor_comercial`
   - Acesso ao CRM
   - Gestão de leads
   - Relatórios comerciais

4. `tutor`
   - Acesso aos alunos
   - Envio de mensagens
   - Gestão de conteúdo

5. `aluno`
   - Acesso ao portal do aluno
   - Comunicação com tutores
   - Acesso aos cursos

## Provedores de Autenticação

O sistema suporta os seguintes provedores:

1. `email`
   - Autenticação tradicional com email/senha
   - Verificação de email
   - Recuperação de senha

2. `google`
   - Login com Google
   - Integração com Google Workspace

3. `facebook`
   - Login com Facebook
   - Integração com Facebook Business

4. `github`
   - Login com GitHub
   - Integração com GitHub Organizations

## Políticas de Segurança (RLS)

O sistema implementa Row Level Security (RLS) para garantir o acesso seguro aos dados:

### Perfis
- Usuários podem ver e atualizar apenas seu próprio perfil
- Super admins podem ver todos os perfis

### Instituições
- Qualquer usuário pode visualizar instituições
- Apenas super admins podem gerenciar instituições

### Sessões
- Usuários podem ver e gerenciar apenas suas próprias sessões

### Reset de Senha e Verificação de Email
- Usuários podem criar e visualizar apenas seus próprios tokens

## Fluxos de Autenticação

### 1. Registro de Usuário
```
1. Usuário preenche formulário de registro
2. Sistema cria usuário no Supabase Auth
3. Trigger cria perfil na tabela profiles
4. Email de verificação é enviado
5. Usuário verifica email
6. Perfil é ativado
```

### 2. Login
```
1. Usuário fornece credenciais
2. Sistema valida credenciais
3. Nova sessão é criada
4. Token JWT é gerado
5. Usuário é redirecionado
```

### 3. Recuperação de Senha
```
1. Usuário solicita reset
2. Token é gerado e enviado por email
3. Usuário clica no link
4. Nova senha é definida
5. Token é marcado como usado
```

## Integração com Frontend

O sistema fornece hooks e componentes React para fácil integração:

```typescript
// Exemplo de uso do hook de autenticação
const { user, signIn, signOut } = useAuth();

// Exemplo de proteção de rota
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};
```

## Boas Práticas

1. **Segurança**
   - Sempre use HTTPS
   - Implemente rate limiting
   - Valide inputs
   - Use tokens JWT com expiração

2. **UX**
   - Forneça feedback claro
   - Implemente loading states
   - Mantenha sessões ativas
   - Permita logout em todos os dispositivos

3. **Manutenção**
   - Monitore tentativas de login
   - Limpe sessões expiradas
   - Mantenha logs de auditoria
   - Faça backup regular

## Próximos Passos

1. [ ] Implementar autenticação social
2. [ ] Adicionar 2FA
3. [ ] Implementar SSO
4. [ ] Criar dashboard de auditoria
5. [ ] Adicionar mais provedores 
