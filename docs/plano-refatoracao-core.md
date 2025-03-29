# Plano de Refatoração e Remoção do Módulo apps/core

## Contexto

O módulo `apps/core` e o pacote `packages/core` (que exporta `@edunexia/core-types`) estão causando confusão na arquitetura e criando dependências cíclicas no monorepo. Esta refatoração visa simplificar a estrutura separando claramente as responsabilidades e eliminando o módulo desnecessário.

## Situação Atual

- `apps/core` (@edunexia/core): Contém componentes de UI, layouts, hooks e contextos
- `packages/core` (@edunexia/core-types): Contém tipos, interfaces e constantes

O problema principal é que muitos módulos importam de ambos, causando confusão e potenciais dependências cíclicas.

## Plano de Refatoração

### Fase 1: Preparação

1. **Criar um snapshot antes da refatoração**
   - Commit de todos os arquivos atuais
   - Criar uma branch de backup

2. **Identificar todo conteúdo a ser migrado de `apps/core`**
   - Componentes: DashboardLayout, PageHeader
   - Contextos: UserContext, ThemeContext, AlertContext
   - Hooks: useAuth, useNavigation, useNotifications

### Fase 2: Migração de Componentes

1. **Migrar os layouts para `ui-components`**
   - Mover DashboardLayout para packages/ui-components/src/components/layout/
   - Atualizar as exportações no packages/ui-components/src/index.ts

2. **Migrar componentes compartilhados para `ui-components`**
   - Mover Alert, Loader e outros para packages/ui-components/src/components/feedback/
   - Atualizar as exportações

### Fase 3: Migração de Hooks e Contextos

1. **Criar um novo pacote `@edunexia/hooks` se necessário**
   - Pacote para hooks como useAuth, useNavigation
   - OU mover para pacotes existentes apropriados (auth, utils)

2. **Migrar contextos**
   - Mover UserContext para packages/auth
   - Mover ThemeContext para packages/ui-components
   - Mover AlertContext para packages/ui-components

### Fase 4: Atualização de Dependências

1. **Atualizar dependências nos package.json**
   - Remover `@edunexia/core` de todos os módulos
   - Adicionar dependências para pacotes específicos
   - Exemplo: Substituir `@edunexia/core` por `@edunexia/ui-components`, `@edunexia/auth` etc.

2. **Atualizar importações em arquivos**
   - Identificar todas as importações de `@edunexia/core`
   - Substituir por importações dos novos pacotes específicos
   - Exemplo: `import { DashboardLayout } from '@edunexia/core'` → `import { DashboardLayout } from '@edunexia/ui-components'`

### Fase 5: Remoção do Módulo

1. **Verificar que nenhuma dependência circular permanece**
   - Executar `pnpm circular:check:all`

2. **Remover o módulo apps/core**
   - Deletar a pasta apps/core
   - Certificar-se de que não há referências no código

3. **Atualizar documentação**
   - Refletir as mudanças na estrutura
   - Atualizar documentos de arquitetura

## Próximos Passos

Após esta refatoração, considerar:

1. Renomear `packages/core` para `packages/core-types` para melhor clareza
2. Dividir `packages/core-types` em pacotes menores e mais específicos
3. Estabelecer diretrizes mais claras para evitar dependências cíclicas no futuro

## Impacto Esperado

- **Positivo**: Arquitetura mais clara e sem dependências cíclicas
- **Positivo**: Melhor separação de responsabilidades
- **Desafio**: Necessidade de atualizar muitos módulos que dependem de apps/core
- **Desafio**: Possíveis regressões em componentes migrados 