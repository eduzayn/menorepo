<!-- cSpell:disable -->
# Padronização de Rotas na Edunéxia

Este documento define diretrizes para padronização de rotas na plataforma Edunéxia, visando evitar conflitos quando múltiplos módulos são servidos sob o mesmo domínio.

## Problema

Atualmente, diversos módulos implementam rotas com os mesmos nomes, como:
- `/dashboard`
- `/login`
- `/configuracoes`
- `/perfil`

Isso causa conflitos quando os módulos são integrados como uma plataforma unificada, resultando em:
- Sobreposição de rotas e comportamento imprevisível
- Inconsistência na navegação entre módulos
- Problemas com autenticação e autorização
- Experiência de usuário fragmentada

## Solução: Prefixos de Rota por Módulo

A solução é implementar um sistema de prefixos de rota, onde cada módulo possui seu próprio namespace exclusivo.

### Convenção de Prefixos

| Módulo                   | Prefixo                | Exemplo                             |
|--------------------------|------------------------|-------------------------------------|
| material-didatico        | `/conteudo`            | `/conteudo/dashboard`               |
| matriculas               | `/matriculas`          | `/matriculas/dashboard`             |
| portal-do-aluno          | `/aluno`               | `/aluno/dashboard`                  |
| comunicacao              | `/comunicacao`         | `/comunicacao/dashboard`            |
| financeiro-empresarial   | `/financeiro`          | `/financeiro/dashboard`             |
| portal-parceiro          | `/parceiro`            | `/parceiro/dashboard`               |
| portal-polo              | `/polo`                | `/polo/dashboard`                   |
| rh                       | `/rh`                  | `/rh/dashboard`                     |
| contabilidade            | `/contabilidade`       | `/contabilidade/dashboard`          |
| site-edunexia            | `/site-admin`          | `/site-admin/dashboard`             |
| core (interface admin)   | `/admin`               | `/admin/dashboard`                  |

### Rotas Protegidas vs. Públicas

- **Rotas autenticadas**: Sempre usam o prefixo do módulo
  ```
  /[prefixo-módulo]/[recurso]
  ```

- **Rotas de autenticação**: Usar o prefixo seguido de `/auth`
  ```
  /[prefixo-módulo]/auth/login
  /[prefixo-módulo]/auth/recuperar-senha
  ```

- **Rotas públicas de sites**: Não necessitam de prefixo
  ```
  /sobre
  /contato
  /blog
  ```

### Rota Raiz (`/`)

A rota raiz deve redirecionar para o módulo principal configurado para o domínio ou para uma página principal que integre widgets de vários módulos.

## Implementação

### 1. Atualização dos Arquivos de Rotas

Cada módulo deve atualizar seu arquivo `routes.tsx` para incluir o prefixo em todas as rotas:

```tsx
// ANTES - apps/matriculas/src/routes.tsx
const routes = [
  {
    path: '/dashboard',
    element: <Dashboard />
  }
];

// DEPOIS - apps/matriculas/src/routes.tsx
const PREFIX = '/matriculas';

const routes = [
  {
    path: `${PREFIX}/dashboard`,
    element: <Dashboard />
  }
];
```

### 2. Centralização da Configuração de Prefixos

Criar um arquivo centralizador de configuração em `packages/core`:

```tsx
// packages/core/src/constants/route-prefixes.ts
export const ROUTE_PREFIXES = {
  MATRICULAS: '/matriculas',
  PORTAL_ALUNO: '/aluno',
  COMUNICACAO: '/comunicacao',
  FINANCEIRO: '/financeiro',
  PORTAL_PARCEIRO: '/parceiro',
  PORTAL_POLO: '/polo',
  RH: '/rh',
  CONTABILIDADE: '/contabilidade',
  MATERIAL_DIDATICO: '/conteudo',
  SITE_ADMIN: '/site-admin',
  CORE_ADMIN: '/admin'
};
```

### 3. Atualização dos Links de Navegação

Todos os componentes de navegação (menus, links, botões) devem ser atualizados para usar os prefixos:

```tsx
// Em um componente de navegação
import { ROUTE_PREFIXES } from '@edunexia/core';

function Navbar() {
  return (
    <nav>
      <Link to={`${ROUTE_PREFIXES.MATRICULAS}/dashboard`}>
        Dashboard de Matrículas
      </Link>
    </nav>
  );
}
```

### 4. Atualização dos Redirecionamentos

Todos os redirecionamentos devem ser atualizados para usar os prefixos:

```tsx
// ANTES
return <Navigate to="/dashboard" />;

// DEPOIS
import { ROUTE_PREFIXES } from '@edunexia/core';
return <Navigate to={`${ROUTE_PREFIXES.MATRICULAS}/dashboard`} />;
```

### 5. Adaptação do Componente de Layout

Os layouts que renderizam a navegação lateral devem ser adaptados para usar os prefixos:

```tsx
// ANTES
const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Configurações', path: '/configuracoes', icon: SettingsIcon }
];

// DEPOIS
import { ROUTE_PREFIXES } from '@edunexia/core';
const PREFIX = ROUTE_PREFIXES.MATRICULAS;

const menuItems = [
  { name: 'Dashboard', path: `${PREFIX}/dashboard`, icon: HomeIcon },
  { name: 'Configurações', path: `${PREFIX}/configuracoes`, icon: SettingsIcon }
];
```

## Integração com Autenticação Centralizada

Quando usar o pacote de autenticação centralizada:

```tsx
// packages/auth/src/AuthProvider.tsx
import { ROUTE_PREFIXES } from '@edunexia/core';

export const AuthProvider = ({ 
  children, 
  module = 'MATRICULAS',  // Identifica qual módulo está usando a autenticação
}) => {
  // Obter o prefixo correto baseado no módulo
  const prefixo = ROUTE_PREFIXES[module];
  
  // Usar o prefixo para as rotas de autenticação
  const loginPath = `${prefixo}/auth/login`;
  // ...
  
  return (
    <AuthContext.Provider value={{
      // ...
      loginPath,
      // ...
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Navegação Entre Módulos

Para navegação entre módulos, deve-se usar URLs absolutas com os prefixos adequados:

```tsx
// Exemplo de menu global com links para múltiplos módulos
import { ROUTE_PREFIXES } from '@edunexia/core';

function GlobalMenu() {
  return (
    <nav>
      <Link to={ROUTE_PREFIXES.MATRICULAS + '/dashboard'}>Matrículas</Link>
      <Link to={ROUTE_PREFIXES.FINANCEIRO + '/dashboard'}>Financeiro</Link>
      <Link to={ROUTE_PREFIXES.RH + '/dashboard'}>RH</Link>
    </nav>
  );
}
```

## Deployment e Configuração

Quando os módulos são implantados como aplicações separadas:

1. Configure a base URL do Vite para incluir o prefixo:
```js
// vite.config.js para o módulo de matrículas
export default defineConfig({
  base: '/matriculas/',
  // ...
})
```

2. Configure o servidor para rotear corretamente:
```
/matriculas/* -> aplicação de matrículas
/aluno/* -> aplicação do portal do aluno
```

## Benefícios da Abordagem

- **Prevenção de conflitos**: Evita colisões de rotas entre módulos
- **Escalabilidade**: Facilita a adição de novos módulos sem preocupação com conflitos
- **Clareza**: Torna explícito a qual módulo pertence cada rota
- **Integração facilitada**: Permite servir múltiplos módulos sob o mesmo domínio
- **Melhor UX**: Mantém o contexto do usuário ao navegar entre diferentes partes do sistema

## Migração

A migração para este novo padrão deve ser feita gradualmente:

1. Atualizar cada módulo para usar prefixos em suas rotas
2. Manter redirecionamentos temporários das rotas antigas para as novas
3. Atualizar a documentação e interfaces de usuário
4. Após período de transição, remover os redirecionamentos 