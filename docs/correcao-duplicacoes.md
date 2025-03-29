# Relatório de Correção de Duplicações no Monorepo Edunéxia

Este documento descreve as correções realizadas para centralizar funções duplicadas no monorepo, seguindo as diretrizes do README principal e da documentação de arquitetura.

## Alterações Realizadas

### 1. Centralização de Funções Utilitárias

As funções utilitárias foram centralizadas no pacote `@edunexia/utils`, com arquivos de compatibilidade nos módulos que mantinham implementações duplicadas:

- **packages/core/src/utils/index.ts**: Atualizado para redirecionar para `@edunexia/utils` com avisos de depreciação.
- **packages/api-client/src/utils.ts**: As funções de formatação agora utilizam a implementação centralizada de `@edunexia/utils`.

### 2. Documentação de Problemas do Tipo UserRole

- **packages/core/src/index.ts**: Adicionado comentário alertando sobre a duplicação do tipo `UserRole`, que precisa ser unificado em `@edunexia/shared-types`.

### 3. Centralização do Cliente Supabase

- **apps/comunicacao/src/lib/supabase.ts**: Atualizado para usar `createSupabaseClient` do pacote `@edunexia/api-client` com avisos de depreciação.
- Verificado que outros módulos já usam a abordagem correta.

## Próximos Passos Recomendados

Para completar a centralização de código no monorepo, recomendamos as seguintes ações:

### 1. Unificação do Tipo UserRole

Atualmente há múltiplas definições do tipo `UserRole` em diferentes locais:
- `packages/shared-types/src/user.ts`
- `packages/core/src/index.ts`
- `packages/auth/src/types.ts`
- `packages/database-schema/index.ts`
- `apps/matriculas/src/hooks/useAuth.ts`
- `apps/comunicacao/src/types/user.ts`
- `apps/material-didatico/src/types/editor.ts`

**Ação recomendada**: Migrar todas as referências para usar o tipo definido em `@edunexia/shared-types`.

### 2. Centralização da Interface User

As diferentes definições da interface `User` deveriam ser unificadas:
- `packages/shared-types/src/user.ts`
- `packages/auth/src/types.ts`
- `apps/matriculas/src/hooks/useAuth.ts`
- `apps/comunicacao/src/types/user.ts`

**Ação recomendada**: Criar uma definição única em `@edunexia/shared-types` e realizar a migração gradual.

### 3. Centralização da Autenticação

Embora os hooks `useAuth` já estejam configurados para usar a implementação centralizada, ainda existem componentes e contextos de autenticação duplicados:
- `packages/auth/src/AuthProvider.tsx`
- `packages/auth/src/components/AuthProvider.tsx`
- Implementações locais em vários módulos

**Ação recomendada**: Unificar essas implementações e usar apenas o `AuthProvider` do pacote `@edunexia/auth`.

### 4. Melhorias para o Processo de Centralização

1. **Atualizar o script de migração**: O script `scripts/update-utils-imports.js` não detectou algumas das duplicações. Recomendamos revisar e melhorar esse script.

2. **Adicionar verificações no pipeline CI/CD**: Implementar verificações automatizadas para detectar definições duplicadas.

3. **Criar um guia de estilo detalhado**: Documentar claramente os padrões para importação de funções utilitárias, tipos e componentes compartilhados.

## Como Usar as Funções Centralizadas

### Funções Utilitárias

```typescript
// ✅ CORRETO: Importe diretamente do pacote @edunexia/utils
import { formatCurrency, formatDate, isValidCPF } from '@edunexia/utils';

// ❌ INCORRETO: Não importe de módulos específicos
import { formatCurrency } from 'apps/core/src/utils';
```

### Tipos Compartilhados

```typescript
// ✅ CORRETO: Importe diretamente do pacote @edunexia/shared-types
import { UserRole, UserStatus } from '@edunexia/shared-types';

// ❌ INCORRETO: Não importe de módulos específicos ou defina localmente
import { UserRole } from 'packages/core/src/types';
```

### Cliente Supabase

```typescript
// ✅ CORRETO: Use o hook do pacote centralizado
import { useSupabaseClient } from '@edunexia/api-client';

function MyComponent() {
  const supabase = useSupabaseClient();
  // ...
}

// ✅ CORRETO: Alternativa - use o factory para casos especiais
import { createSupabaseClient } from '@edunexia/api-client';

// ❌ INCORRETO: Não crie instâncias diretamente
import { createClient } from '@supabase/supabase-js';
```

## Conclusão

A centralização das funções duplicadas é um passo importante para manter a consistência e a qualidade do código no monorepo. Embora tenhamos feito progressos, ainda há trabalho a ser feito para completar a unificação de tipos e interfaces.

Recomendamos que todos os novos componentes e módulos sigam rigorosamente as diretrizes de importação e utilização dos pacotes centralizados.

## Próximos Passos e Recomendações para Equipe

1. **Executar scripts de verificação**: Use `npm run lint:check-duplicates` para identificar outras possíveis duplicações
2. **Revisar PRs com atenção**: Verificar importações e garantir uso de componentes existentes
3. **Centralizar definições de tipos**: Priorizar a migração do tipo `UserRole` para `@edunexia/shared-types`
4. **Consolidar hooks de autenticação**: Migrar hooks específicos para `@edunexia/auth/hooks`
5. **Documentar dependências internas**: Atualizar READMEs dos módulos para indicar pacotes compartilhados

## Status Final do Projeto

Este documento será atualizado conforme novas duplicações sejam identificadas e corrigidas. A equipe deve considerar este documento como um guia vivo para a melhoria contínua da estrutura do monorepo.

**Data da última atualização:** 29/03/2025

## Limpeza de Arquivos Temporários

Como parte do esforço de manutenção do monorepo, foram implementadas as seguintes ações para remoção de arquivos temporários e obsoletos:

1. Removidos arquivos de backup (`.bak`) que foram gerados durante a refatoração:
   - `packages/core/src/index.ts.bak`
   - `packages/ui-components/src/components/index.ts.bak`

2. Criado script de limpeza `clean-temps.ps1` no diretório `scripts/` para remover automaticamente:
   - Diretórios `.temp`
   - Arquivos temporários (`.temp`, `.tmp`)
   - Arquivos de log (`*.log`, `npm-debug.log*`, `pnpm-debug.log*`, etc)
   - Arquivos de backup (`.bak`)
   - Arquivos temporários específicos do macOS (`.DS_Store`)

3. Adicionado script `clean:temps` ao `package.json` para execução da limpeza:
   ```bash
   npm run clean:temps
   ```

É recomendável executar este script periodicamente, especialmente antes de commits importantes ou releases, para manter o repositório limpo e reduzir seu tamanho. 