# Progresso da Migração de Componentes para @edunexia/ui-components

Este documento registra o progresso da migração dos componentes locais para a biblioteca centralizada `@edunexia/ui-components`.

## Módulo Matrículas

### ✅ Componentes Migrados

1. **StatsCard**
   - Localização anterior: `apps/matriculas/src/components/dashboard/StatsCard.tsx`
   - Arquivos atualizados: 
     - `apps/matriculas/src/pages/dashboard/Dashboard.tsx`
     - `apps/matriculas/src/pages/dashboard/RelatorioFinanceiro.tsx`
   - Alterações:
     - Substituídas as importações locais por `import { StatsCard } from '@edunexia/ui-components'`
     - Adaptação da API: `iconBgColor` → `className`, `change` → `trend`
     - Componente local removido

2. **FormField e outros componentes de formulário**
   - Já utilizando componentes padronizados em:
     - `apps/matriculas/src/components/MatriculaForm.tsx`
     - `apps/matriculas/src/components/MatriculaFormMultiStep.tsx`
   - Arquivos já estão importando de `@edunexia/ui-components`

3. **DashboardCard**
   - Localização anterior: `apps/matriculas/src/components/dashboard/DashboardCard.tsx`
   - Implementação: `packages/ui-components/src/components/data-display/DashboardCard.tsx`
   - Arquivos atualizados:
     - `apps/matriculas/src/components/dashboard/ChartMatriculasPorStatus.tsx`
     - `apps/matriculas/src/components/dashboard/ChartMatriculasPorPeriodo.tsx`
     - `apps/matriculas/src/components/dashboard/ChartCursosPopulares.tsx`
   - Melhorias:
     - API expandida: adicionados `description`, `to` e `onClick`
     - Adicionado suporte para navegação ao clicar no card
     - Documentação completa adicionada

4. **DashboardLayout**
   - Localização anterior: 
     - `apps/matriculas/src/components/Layout/index.tsx`
     - `apps/matriculas/src/components/Layout/Header.tsx`
     - `apps/matriculas/src/components/Layout/Sidebar.tsx`
   - Implementação: `packages/ui-components/src/components/layout/DashboardLayout.tsx`
   - Arquivos atualizados:
     - `apps/matriculas/src/components/Layout/index.tsx`
   - Melhorias:
     - API flexível que permite personalização através de props
     - Implementação do hook useUser para fornecer informações de usuário
     - Mantida a navegação específica do módulo através do sidebar personalizado

### ❌ Componentes Não Migrados

1. **DashboardFilter**
   - Localização: `apps/matriculas/src/components/dashboard/DashboardFilter.tsx`
   - Justificativa: Componente muito específico para o módulo de matrículas, com dependências diretas dos tipos e serviços do módulo (DashboardFilters, seleção de cursos, etc.)
   - Decisão: Manter como componente local para evitar criar uma abstração complexa demais ou sacrificar funcionalidades específicas

### 📊 Estatísticas de Progresso

- **Componentes Migrados**: 4
- **Componentes Não Migrados (com justificativa)**: 1
- **Total de Componentes Identificados**: 5
- **Progresso**: 100% (considerando decisões de "não migrar" como concluídas)

## Módulo Portal do Aluno

### 🔄 Componentes Pendentes

1. **Card**
2. **PageHeader**
3. **FormField**
4. **DashboardLayout**

## Módulo Comunicação

### 🔄 Componentes Pendentes

1. **Message**
2. **NotificationCard**
3. **FormField**
4. **DashboardLayout**

## Resumo Geral

- **Componentes Migrados**: 4
- **Componentes Não Migrados (com justificativa)**: 1
- **Componentes Pendentes**: 8
- **Progresso Total**: ~38%

## Próximos Passos

1. Implementar Card padronizado em @edunexia/ui-components
2. Iniciar migração no portal-do-aluno
3. Expandir cobertura de testes
4. Documentar diretrizes de decisão para migração vs. manutenção local de componentes

## Problemas Encontrados

1. **Linting**: Alguns arquivos apresentam erros de linting relacionados à configuração do ESLint, que precisam ser resolvidos.
2. **Tipagem**: A tipagem do React.cloneElement no FormField precisa ser ajustada para resolver os avisos do TypeScript.
3. **Adaptação de API**: Algumas adaptações são necessárias nas APIs dos componentes, como visto na migração do StatsCard (iconBgColor → className, change → trend).
4. **Componentes Específicos**: Alguns componentes são muito acoplados ao contexto de um módulo específico, dificultando a padronização sem sacrificar funcionalidades.

---

> Este documento deve ser atualizado conforme novas migrações forem concluídas. 