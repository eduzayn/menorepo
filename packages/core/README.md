# @edunexia/core-types

Este pacote contém tipos, interfaces e utilitários fundamentais compartilhados por todos os módulos e pacotes do ecossistema Edunéxia.

## Propósito

`@edunexia/core-types` serve como biblioteca central de definições do sistema, fornecendo:

- Tipos e interfaces compartilhados (UserRole, etc.)
- Constantes globais do sistema
- Utilitários "puros" que não dependem de React ou UI
- Funções de formatação e validação

## Diferença entre core-types e apps/core

- **`packages/core` (@edunexia/core-types)**: Contém apenas tipos, interfaces e funções sem dependências de UI
- **`apps/core` (@edunexia/core)**: Contém componentes React, hooks, contextos e elementos de UI compartilhados

## Uso

```typescript
// Importar tipos
import { UserRole } from '@edunexia/core-types';

// Usar em um componente
function UserProfile({ user }: { user: { role: UserRole } }) {
  return <div>Role: {user.role}</div>;
}
```

## Estrutura

```
packages/core/
├── src/
│   ├── components/    # Tipos para componentes (não implementações)
│   ├── contexts/      # Tipos para contextos (não implementações)
│   ├── hooks/         # Tipos para hooks (não implementações)
│   ├── utils/         # Funções utilitárias puras
│   └── index.ts       # Exportações
└── package.json
```

## Diretrizes

1. Este pacote **NÃO DEVE** ter dependências de React, UI ou outras bibliotecas visuais
2. Mantenha este pacote leve e focado em definições e funções puras
3. Implemente os componentes, hooks e contextos em `apps/core`, não aqui
4. Para adicionar novos tipos globais, exporte-os em `index.ts` 