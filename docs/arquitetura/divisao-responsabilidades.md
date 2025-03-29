<!-- cSpell:disable -->
# Divisão de Responsabilidades na Arquitetura Edunéxia

Este documento detalha as diretrizes oficiais para a divisão de responsabilidades entre os diretórios `packages/` e `apps/` no monorepo da Edunéxia, com ênfase especial em onde cada tipo de código deve residir.

## Princípios Fundamentais

A estrutura do monorepo da Edunéxia é baseada em dois princípios fundamentais:

1. **Separação de Camadas**: Dividimos claramente o código entre camadas de infraestrutura (pacotes compartilhados) e aplicações específicas.
2. **Dependências Unidirecionais**: Os módulos em `apps/` podem depender de pacotes em `packages/`, mas nunca o contrário.

## Divisão de Responsabilidades

### packages/ - Pacotes Compartilhados

Os pacotes no diretório `packages/` devem conter **código reutilizável, não específico de UI**, que possa ser compartilhado entre múltiplos módulos da aplicação. Estes pacotes são a fundação de nossa arquitetura.

#### packages/utils

**Responsabilidade**: Contém TODAS as funções utilitárias não-específicas de UI, incluindo:

- **Formatadores**: Todas as funções para formatação de dados (formatação de data, moeda, números, etc.)
- **Validadores**: Todas as funções para validação de dados (CPF, e-mail, etc.)
- **Conversores**: Funções para conversão entre tipos de dados
- **Manipuladores de Texto**: Funções para processamento de strings
- **Utilitários Gerais**: Funções para manipulação de arrays, objetos, etc.

```typescript
// ✅ CORRETO: Funções de formatação em packages/utils
// packages/utils/src/formatters.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
```

#### packages/core

**Responsabilidade**: Código fundamental não-específico de UI, incluindo:

- **Tipos Básicos**: Interfaces e tipos compartilhados (User, Course, etc.)
- **Constantes**: Valores constantes usados em toda a plataforma
- **Configurações**: Configurações compartilhadas entre módulos

```typescript
// ✅ CORRETO: Tipos em packages/core
// packages/core/src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
```

#### packages/api-client

**Responsabilidade**: Toda a lógica de comunicação com APIs:

- **Clientes HTTP**: Wrappers para fetch/axios
- **Endpoints**: Definições de rotas
- **Hooks de API**: useQuery, useMutation, etc.

#### packages/ui-components

**Responsabilidade**: Componentes de UI reutilizáveis:

- **Componentes Base**: Button, Input, Card, etc.
- **Componentes Compostos**: Form, DataTable, etc.
- **Tokens de Design**: Cores, espaçamentos, etc.

### apps/ - Aplicações Específicas

Os módulos no diretório `apps/` devem conter código específico para cada aplicação vertical da plataforma.

#### apps/[nome-do-módulo]

**Responsabilidade**: Código específico para um módulo da plataforma:

- **Pages**: Páginas específicas do módulo
- **Components**: Componentes específicos do módulo
- **Contexts**: Contextos específicos do módulo
- **Hooks**: Hooks específicos do módulo (que não façam parte da lógica de negócio compartilhada)

```typescript
// ✅ CORRETO: Componente específico em apps/portal-do-aluno
// apps/portal-do-aluno/src/components/HistoricoAcademico.tsx
export function HistoricoAcademico({ alunoId }: { alunoId: string }) {
  // Lógica específica do componente
}
```

#### apps/core

**Responsabilidade**: Componentes e lógica de UI compartilhados:

- **Layout**: Componentes de layout compartilhados (como Sidebar, Header)
- **Providers**: Providers de contexto compartilhados (Theme, Auth, etc.)
- **Componentes UI Complexos**: Componentes que usam múltiplos componentes base, como dashboards genéricos

```typescript
// ✅ CORRETO: Componente de UI compartilhado em apps/core
// apps/core/src/components/layout/SidebarLayout.tsx
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  // Implementação do layout com sidebar
}
```

## Exemplos Práticos: O que NÃO Deve Estar em apps/core

### ❌ INCORRETO: Funções de formatação em apps/core

```typescript
// apps/core/src/utils/formatters.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
```

### ✅ CORRETO: Usar funções de packages/utils

```typescript
// apps/portal-do-aluno/src/components/Financeiro.tsx
import { formatCurrency } from '@edunexia/utils';

export function Financeiro() {
  return <div>Valor: {formatCurrency(1234.56)}</div>;
}
```

## Exemplos na Codebase Atual

Para ilustrar melhor a divisão de responsabilidades, veja como os arquivos de formatação estão organizados na codebase:

### packages/utils/src/formatters.ts - ✅ CORRETO

Este é o local correto para todas as funções de formatação. Contém implementações completas e documentadas:

```typescript
/**
 * Funções de formatação centralizadas
 * 
 * Este arquivo contém todas as funções de formatação usadas na plataforma Edunéxia
 */

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// ...outras funções de formatação
```

### apps/core/src/utils/formatters.ts - ✅ CORRETO (Por Compatibilidade)

Este arquivo não implementa nada, apenas redireciona para o pacote utils:

```typescript
/**
 * ATENÇÃO: ARQUIVO DEPRECIADO
 * 
 * Conforme a arquitetura do projeto:
 * - Funções de formatação não dependentes de UI devem estar em packages/utils
 * - Este arquivo em apps/core está mantido apenas para compatibilidade
 * 
 * Para TODAS as funções de formatação, importe diretamente de '@edunexia/utils':
 * import { formatCurrency, formatDate, ... } from '@edunexia/utils';
 * 
 * Este arquivo será removido em versões futuras.
 */

// Re-exporta todas as funções do pacote centralizado
export * from '@edunexia/utils';
```

### apps/matriculas/src/utils/formatters.ts - ✅ CORRETO (Por Compatibilidade)

Este arquivo mantém as funções por compatibilidade, mas redireciona para o pacote utils:

```typescript
/**
 * Funções utilitárias para formatação de valores
 * ATENÇÃO: Este arquivo está sendo mantido para compatibilidade.
 * Para novas implementações, utilize as funções de @edunexia/utils diretamente.
 */

import {
  formatCurrency as formatCurrencyUtil,
  formatDate as formatDateUtil,
  formatCPF as formatCPFUtil,
  formatPhone as formatPhoneUtil
} from '@edunexia/utils';

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda brasileira
 * @deprecated Use formatCurrency de '@edunexia/utils'
 */
export const formatCurrency = (value: number): string => {
  return formatCurrencyUtil(value);
};

// ...outras funções com redirecionamento semelhante
```

### Importações Ideais em Novos Componentes

Para novos componentes, use sempre a importação direta do pacote utils:

```typescript
// ✅ CORRETO: Importação direta do pacote utils
import { formatCurrency, formatDate } from '@edunexia/utils';

export function NovoComponente() {
  return (
    <div>
      <p>Valor: {formatCurrency(1000)}</p>
      <p>Data: {formatDate(new Date())}</p>
    </div>
  );
}
```

Esta abordagem garante consistência, facilita a manutenção e evita duplicação de código em todo o projeto.

## Checklist para Decisão

Ao decidir onde colocar seu código, faça as seguintes perguntas:

1. **Este código depende de React ou outro framework de UI?**
   - **Sim**: Deve estar em `apps/core` (se compartilhado) ou `apps/[módulo]` (se específico)
   - **Não**: Deve estar em `packages/utils` ou `packages/core`

2. **Este código é específico de um único módulo?**
   - **Sim**: Deve estar em `apps/[módulo]`
   - **Não**: Considere movê-lo para um pacote compartilhado

3. **Este código é uma função utilitária?**
   - **Sim**: Deve estar em `packages/utils`
   - **Não**: Avalie com base na natureza do código

## Migração de Código Existente

Se você encontrar código em locais incorretos, como funções utilitárias em `apps/core`, siga estas etapas:

1. **Verifique** se a funcionalidade já existe em algum pacote compartilhado
2. **Identifique** todas as importações e usos
3. **Mova** o código para o local correto
4. **Mantenha** temporariamente a versão antiga para compatibilidade
5. **Atualize** sua documentação

## Fluxo de Dependências Correto

```
apps/[módulo] → apps/core → packages/ui-components → packages/core → packages/utils
                ↘          ↙
               packages/api-client
```

Isso garante um fluxo de dependência unidirecional e evita dependências circulares.

## Conclusão

Seguir estas diretrizes de divisão de responsabilidades é fundamental para:

1. **Manutenibilidade**: Código organizado é mais fácil de manter
2. **Reusabilidade**: Componentes e funções em seus lugares corretos são mais fáceis de reutilizar
3. **Performance**: Evita duplicação e facilita otimizações como tree-shaking
4. **Qualidade**: Facilita testes e garantia de qualidade

Sempre prefira colocar **código sem dependência de UI** (como formatadores, validadores e utilitários) em `packages/utils` ou `packages/core`, e **nunca** em `apps/core` ou outros módulos específicos de aplicação. 