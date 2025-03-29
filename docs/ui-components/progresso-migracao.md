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

### 🔄 Componentes Pendentes

1. **DashboardLayout**
   - Localização atual: `apps/matriculas/src/components/Layout/DashboardLayout.tsx`
   - Plano: Substituir pela versão padronizada

2. **DashboardCard**
   - Localização atual: `apps/matriculas/src/components/dashboard/DashboardCard.tsx`
   - Plano: Implementar na biblioteca e depois substituir pela versão padronizada

3. **DashboardFilter**
   - Localização atual: `apps/matriculas/src/components/dashboard/DashboardFilter.tsx`
   - Plano: Avaliar se vale a centralização

### 📊 Estatísticas de Progresso

- **Componentes Migrados**: 2
- **Total de Componentes Identificados**: 5
- **Progresso**: 40%

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

- **Componentes Migrados**: 2
- **Componentes Pendentes**: 11
- **Progresso Total**: ~15%

## Próximos Passos

1. Continuar a migração do DashboardLayout no módulo matriculas
2. Implementar Card padronizado em @edunexia/ui-components
3. Iniciar migração no portal-do-aluno
4. Expandir cobertura de testes

## Problemas Encontrados

1. **Linting**: Alguns arquivos apresentam erros de linting relacionados à configuração do ESLint, que precisam ser resolvidos.
2. **Tipagem**: A tipagem do React.cloneElement no FormField precisa ser ajustada para resolver os avisos do TypeScript.
3. **Adaptação de API**: Algumas adaptações são necessárias nas APIs dos componentes, como visto na migração do StatsCard (iconBgColor → className, change → trend).

---

> Este documento deve ser atualizado conforme novas migrações forem concluídas. 