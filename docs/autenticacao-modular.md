# Sistema de Autenticação Modular

Este documento descreve o funcionamento do sistema de autenticação modular da plataforma Edunéxia, explicando a integração entre os módulos e o sistema de rotas.

## Introdução

A autenticação na Edunéxia foi projetada para funcionar de forma consistente em todos os módulos, mantendo o controle de acesso centralizado, mas respeitando as rotas específicas de cada aplicação.

## Características Principais

- **Autenticação Centralizada**: Todas as aplicações usam o mesmo backend de autenticação (Supabase)
- **Contexto por Módulo**: Cada módulo possui seu próprio contexto de autenticação
- **Rotas Padronizadas**: Integração com o sistema de prefixos de rota
- **Controle de Acesso Granular**: Verificação de papéis e permissões

## Componentes do Sistema

### AuthProvider

O `AuthProvider` é o componente principal que gerencia o estado de autenticação. Foi atualizado para ser configurável por módulo:

```tsx
import { AuthProvider } from '@edunexia/auth';

function App() {
  return (
    <AuthProvider moduleName="PORTAL_ALUNO">
      {/* Conteúdo da aplicação */}
    </AuthProvider>
  );
}
```

Principais propriedades:

- `moduleName`: O nome do módulo (corresponde às chaves em `ROUTE_PREFIXES`)
- `supabaseClient`: Opcional, cliente personalizado do Supabase (raramente necessário)

### RouteGuard

Componente para proteger rotas que requerem autenticação:

```tsx
import { RouteGuard } from '@edunexia/auth';
import { Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rota protegida simples */}
      <Route 
        path="/dashboard" 
        element={
          <RouteGuard>
            <DashboardPage />
          </RouteGuard>
        } 
      />
      
      {/* Rota que exige papel específico */}
      <Route 
        path="/admin" 
        element={
          <RouteGuard requiredRoles="admin">
            <AdminPage />
          </RouteGuard>
        } 
      />
      
      {/* Rota que exige permissão específica */}
      <Route 
        path="/relatorios" 
        element={
          <RouteGuard requiredPermissions="ver_relatorios">
            <RelatoriosPage />
          </RouteGuard>
        } 
      />
    </Routes>
  );
}
```

### Hook useAuth

O hook `useAuth` fornece acesso ao contexto de autenticação:

```tsx
import { useAuth } from '@edunexia/auth';

function ProfileButton() {
  const { user, logout, loginPath } = useAuth();
  
  if (!user) {
    return <a href={loginPath}>Login</a>;
  }
  
  return (
    <div>
      <span>Olá, {user.nome}</span>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

## Navegação entre Módulos

A integração com o sistema de prefixos de rotas permite navegação consistente entre módulos:

```tsx
import { useAuth } from '@edunexia/auth';
import { ROUTE_PREFIXES } from '@edunexia/core';

function AppMenu() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <nav>
      <a href={`${ROUTE_PREFIXES.PORTAL_ALUNO}/dashboard`}>Portal do Aluno</a>
      <a href={`${ROUTE_PREFIXES.FINANCEIRO}/extrato`}>Financeiro</a>
      <a href={`${ROUTE_PREFIXES.COMUNICACAO}/mensagens`}>Comunicação</a>
    </nav>
  );
}
```

## Controle de Acesso

### Verificação de Papéis

```tsx
const { hasRole } = useAuth();

// Verificar um papel
if (hasRole('admin')) {
  // Mostrar opções de administrador
}

// Verificar múltiplos papéis (verificação OR)
if (hasRole(['admin', 'gestor'])) {
  // Mostrar opções de administração/gestão
}
```

### Verificação de Permissões

```tsx
const { hasPermission } = useAuth();

// Verificar uma permissão
if (hasPermission('editar_usuarios')) {
  // Mostrar botão de edição
}

// Verificar múltiplas permissões (verificação OR)
if (hasPermission(['ver_relatorios', 'exportar_dados'])) {
  // Mostrar opções de relatório
}
```

## Considerações para Desenvolvimento

1. **Sempre use AuthProvider**: Todo módulo deve envolver sua aplicação com o `AuthProvider`
2. **Especifique o módulo**: Sempre defina `moduleName` ao usar `AuthProvider`
3. **Proteja rotas sensíveis**: Use o componente `RouteGuard` para rotas que exigem autenticação
4. **Definição de permissões**: As permissões devem ser consistentes em toda a plataforma

## Fluxo de Login entre Módulos

1. Usuário tenta acessar rota protegida
2. RouteGuard verifica autenticação
3. Se não estiver autenticado, é redirecionado para `/[modulo]/auth/login`
4. Após login, é redirecionado para a rota original

## Exemplos Práticos

### Implementação no Módulo de Matrículas

```tsx
// apps/matriculas/src/App.tsx
import { AuthProvider } from '@edunexia/auth';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider moduleName="MATRICULAS">
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
}

// apps/matriculas/src/routes.tsx
import { Routes, Route } from 'react-router-dom';
import { RouteGuard } from '@edunexia/auth';
import { ROUTE_PREFIXES } from '@edunexia/core';

const PREFIX = ROUTE_PREFIXES.MATRICULAS;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path={`${PREFIX}/auth/login`} element={<LoginPage />} />
      <Route path={`${PREFIX}/cursos`} element={<CursosPublicosPage />} />
      
      {/* Rotas protegidas */}
      <Route 
        path={`${PREFIX}/dashboard`} 
        element={
          <RouteGuard>
            <DashboardPage />
          </RouteGuard>
        } 
      />
      
      {/* Rotas administrativas */}
      <Route 
        path={`${PREFIX}/admin/usuarios`} 
        element={
          <RouteGuard requiredRoles="admin">
            <UsuariosPage />
          </RouteGuard>
        } 
      />
    </Routes>
  );
}
``` 