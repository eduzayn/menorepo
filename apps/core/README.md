# Edunéxia - Core

Este módulo contém componentes, hooks e utilitários compartilhados entre todos os outros módulos da plataforma Edunéxia.

**Nota importante**: Este módulo (`apps/core`) contém implementações de UI e lógica React compartilhada. Para tipos, interfaces e utilitários sem dependência de UI, use o pacote `@edunexia/core-types` localizado em `packages/core`.

## Objetivo

Centralizar os padrões arquiteturais da aplicação, garantindo:

1. Consistência entre módulos
2. Reutilização de código
3. Padronização da experiência do usuário
4. Facilidade de manutenção

## Estrutura de Arquivos

```
apps/core/
├── src/
│   ├── components/    # Componentes de layout e estrutura reutilizáveis
│   │   ├── layout/    # Layouts compartilhados entre módulos
│   │   ├── shared/    # Componentes específicos compartilhados
│   │   └── index.ts   # Exportação centralizada
│   │
│   ├── contexts/      # Contextos React globais da aplicação
│   │   └── index.ts   # Exportação centralizada
│   │
│   ├── hooks/         # Hooks personalizados compartilhados
│   │   ├── api/       # Hooks relacionados a API e data fetching
│   │   └── index.ts   # Exportação centralizada
│   │
│   ├── utils/         # Funções utilitárias compartilhadas
│   │   └── index.ts   # Exportação centralizada
│   │
│   └── index.ts       # Arquivo de entrada com exportações
│
├── package.json       # Dependências e scripts
└── README.md          # Documentação
```

## Componentes Principais

### Layouts

- `AuthLayout`: Layout para páginas que exigem autenticação
- `GuestLayout`: Layout para páginas públicas
- `DashboardLayout`: Layout principal dos dashboards

### Contextos

- `UserContext`: Gerenciamento do usuário logado
- `ThemeContext`: Configurações de tema da aplicação
- `AlertContext`: Sistema de notificações

### Hooks

- `useAuth`: Operações relacionadas a autenticação
- `useNavigation`: Navegação entre módulos
- `useNotifications`: Sistema de notificações
- `useQuery/useMutation`: Wrappers para react-query

## Uso

```tsx
// Em qualquer módulo
import { useAuth, DashboardLayout } from '@edunexia/core';

function MinhaRota() {
  const { user, logout } = useAuth();
  
  return (
    <DashboardLayout>
      <h1>Olá, {user.name}</h1>
      <button onClick={logout}>Sair</button>
    </DashboardLayout>
  );
}
```

## Benefícios

- **Consistência visual**: Todos os módulos seguem o mesmo padrão
- **DX melhorada**: Desenvolvedores podem focar nas funcionalidades específicas
- **Performance**: Elementos compartilhados são carregados uma única vez
- **Manutenção simplificada**: Alterações em um único lugar afetam toda a aplicação

## Diretrizes para Contribuição

1. Todo novo componente deve ser documentado com JSDoc
2. Componentes devem ter testes unitários
3. Não duplique funcionalidades já existentes
4. Para modificações em componentes compartilhados, avalie o impacto em todos os módulos

## Estrutura Padrão para Módulos

Para garantir a consistência entre módulos, siga esta estrutura de arquivos:

```
apps/nome-do-modulo/
├── src/
│   ├── components/           # Componentes específicos do módulo
│   │   └── index.ts         
│   │
│   ├── contexts/             # Contextos específicos (se necessário)
│   │   └── index.ts
│   │
│   ├── hooks/                # Hooks específicos do módulo
│   │   └── index.ts
│   │
│   ├── pages/                # Páginas do módulo
│   │   └── index.ts
│   │
│   ├── services/             # Serviços específicos do módulo
│   │   └── index.ts
│   │
│   ├── utils/                # Utilitários específicos do módulo
│   │   └── index.ts
│   │
│   ├── types/                # Tipos e interfaces
│   │   └── index.ts
│   │
│   ├── routes.tsx            # Definição de rotas do módulo
│   └── index.tsx             # Ponto de entrada
│
├── package.json
└── README.md                 # Documentação específica
```

## Padrões de Implementação

### Páginas

Cada página deve:

1. Usar um layout compartilhado do Core
2. Implementar controle de acesso via `useAuth`
3. Ter título definido
4. Seguir o padrão de navegação usando `useNavigation`

```tsx
// Exemplo de página seguindo o padrão
import React from 'react';
import { DashboardLayout, PageHeader, useAuth } from '@edunexia/core';

export function MinhaFeaturePage() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout 
      requiredRole="aluno" 
      title="Minha Feature"
    >
      <PageHeader
        title="Minha Feature"
        subtitle="Descrição da funcionalidade"
        backUrl="/dashboard"
      />
      
      {/* Conteúdo da página */}
    </DashboardLayout>
  );
}
```

### Hooks e Contextos

1. Hooks específicos de módulo devem seguir o mesmo padrão do Core
2. Use os hooks de API do Core (`useQuery`, `useMutation`) para operações de dados
3. Contextos específicos devem ser implementados apenas quando necessário 