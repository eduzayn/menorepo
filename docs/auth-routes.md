# Rotas do Sistema de Autenticação

## Visão Geral

O sistema de autenticação está organizado sob o prefixo `/auth` e inclui as seguintes rotas:

## Rotas Públicas

### Login
- **URL**: `/auth/login`
- **Método**: GET
- **Descrição**: Página de login do sistema
- **Componente**: `Login`

### Registro
- **URL**: `/auth/register`
- **Método**: GET
- **Descrição**: Página de registro de novos usuários
- **Componente**: `Register`

### Recuperação de Senha
- **URL**: `/auth/forgot-password`
- **Método**: GET
- **Descrição**: Página para solicitar recuperação de senha
- **Componente**: `ForgotPassword`

### Reset de Senha
- **URL**: `/auth/reset-password`
- **Método**: GET
- **Descrição**: Página para definir nova senha após recuperação
- **Componente**: `ResetPassword`

### Verificação de Email
- **URL**: `/auth/verify-email`
- **Método**: GET
- **Descrição**: Página de confirmação de email
- **Componente**: `VerifyEmail`

## Rotas Protegidas

### Perfil
- **URL**: `/auth/profile`
- **Método**: GET
- **Descrição**: Página de perfil do usuário
- **Componente**: `Profile`
- **Proteção**: Requer autenticação

### Sessões
- **URL**: `/auth/sessions`
- **Método**: GET
- **Descrição**: Página de gerenciamento de sessões ativas
- **Componente**: `Sessions`
- **Proteção**: Requer autenticação

## Componentes Compartilhados

### AuthLayout
- **Descrição**: Layout base para todas as páginas de autenticação
- **Características**:
  - Logo da plataforma
  - Container centralizado
  - Fundo cinza claro
  - Card branco com sombra

### ProtectedRoute
- **Descrição**: Componente para proteger rotas que requerem autenticação
- **Funcionalidades**:
  - Verifica estado de autenticação
  - Redireciona para login se não autenticado
  - Exibe loading durante verificação

### Logo
- **Descrição**: Componente do logo da plataforma
- **Características**:
  - SVG vetorial
  - Suporte a customização via className
  - Cores via currentColor

## Hooks

### useAuth
- **Descrição**: Hook para gerenciar autenticação
- **Funcionalidades**:
  - Estado do usuário
  - Loading state
  - Sign in/up/out
  - Reset/update password
  - Listener de mudanças de auth

## Integração com Supabase

O sistema utiliza o Supabase para:
- Autenticação de usuários
- Armazenamento de perfis
- Gerenciamento de sessões
- Reset de senhas
- Verificação de email

## Fluxos de Autenticação

### Login
1. Usuário acessa `/auth/login`
2. Preenche credenciais
3. Sistema valida com Supabase
4. Redireciona para dashboard

### Registro
1. Usuário acessa `/auth/register`
2. Preenche dados
3. Sistema cria conta
4. Envia email de verificação

### Recuperação de Senha
1. Usuário acessa `/auth/forgot-password`
2. Informa email
3. Sistema envia link
4. Usuário define nova senha

## Segurança

- Todas as rotas protegidas verificam autenticação
- Tokens JWT gerenciados pelo Supabase
- Proteção contra CSRF
- Rate limiting nas APIs
- Validação de inputs 