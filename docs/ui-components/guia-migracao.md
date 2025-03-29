# Guia de Migração para Componentes Padronizados

Este documento fornece instruções para migrar implementações locais de componentes para a biblioteca centralizada `@edunexia/ui-components`.

## Objetivos

- Eliminar duplicação de código entre módulos
- Garantir consistência visual e comportamental
- Simplificar a manutenção e atualizações
- Acelerar o desenvolvimento de novas funcionalidades

## Componentes Disponíveis para Migração

Os seguintes componentes foram padronizados e estão disponíveis para uso imediato:

| Componente                | Importação                                            | Substitui                           |
|---------------------------|------------------------------------------------------|-------------------------------------|
| `StatsCard`               | `import { StatsCard } from '@edunexia/ui-components'` | Cards de estatísticas em dashboards |
| `DashboardLayout`         | `import { DashboardLayout } from '@edunexia/ui-components'` | Layouts de dashboard específicos |
| `DashboardPageTemplate`   | `import { DashboardPageTemplate } from '@edunexia/ui-components'` | Páginas de dashboard personalizadas |
| `SettingsPageTemplate`    | `import { SettingsPageTemplate } from '@edunexia/ui-components'` | Páginas de configurações |

## Processo de Migração

### 1. Identifique componentes duplicados

Primeiro, identifique os componentes em seu módulo que podem ser substituídos pelos componentes padronizados:

```bash
grep -r "StatsCard\|DashboardHeader\|SettingsPage" apps/seu-modulo/src/
```

### 2. Compare as APIs

Compare a API do seu componente com a API do componente padronizado. Verifique:

- Propriedades obrigatórias e opcionais
- Comportamentos esperados
- Estilos e variantes

### 3. Atualize as importações

Substitua as importações dos componentes locais pelos componentes da biblioteca centralizada:

```diff
- import { StatsCard } from '../components/dashboard/StatsCard';
+ import { StatsCard } from '@edunexia/ui-components';
```

### 4. Ajuste as props conforme necessário

Adapte as props para corresponder à API do componente padronizado:

```diff
<StatsCard 
-  titulo="Total de Alunos"
+  title="Total de Alunos"
   value={1500}
-  icone={<UserIcon />}
+  icon={<UserIcon />}
/>
```

### 5. Teste as alterações

Certifique-se de testar minuciosamente as alterações para garantir que o comportamento permaneça o mesmo após a migração.

### 6. Remova os componentes locais

Após a migração bem-sucedida, remova os componentes locais para evitar confusão e duplicação:

```bash
git rm apps/seu-modulo/src/components/dashboard/StatsCard.tsx
```

## Ordem de Prioridade para Migração

Recomendamos seguir esta ordem para migrar os componentes:

1. **Componentes de exibição de dados** (`StatsCard`)
2. **Templates de página** (`DashboardPageTemplate`, `SettingsPageTemplate`)
3. **Layouts** (`DashboardLayout`)

## Exemplo de Migração: StatsCard

### Antes (implementação local):

```tsx
// apps/matriculas/src/components/dashboard/StatsCard.tsx
export const StatsCard = ({ 
  titulo, 
  valor, 
  icone, 
  descricao 
}) => (
  <div className="bg-white rounded p-4 shadow">
    <div className="flex justify-between">
      <div>
        <h3 className="text-gray-500">{titulo}</h3>
        <p className="text-2xl font-bold">{valor}</p>
        {descricao && <p className="text-sm">{descricao}</p>}
      </div>
      {icone && <div>{icone}</div>}
    </div>
  </div>
);
```

### Depois (usando componente padronizado):

```tsx
// apps/matriculas/src/pages/Dashboard.tsx
import { StatsCard } from '@edunexia/ui-components';

export const Dashboard = () => (
  <div>
    <StatsCard 
      title="Total de Alunos"
      value={1500}
      icon={<UserIcon />}
      description="Alunos ativos"
    />
  </div>
);
```

## Suporte e Manutenção

### Reportando problemas

Se encontrar problemas com os componentes padronizados, crie uma issue com:

1. Descrição detalhada do problema
2. Trecho de código que mostra como você está usando o componente
3. Comportamento esperado vs. comportamento observado

### Solicitando novos componentes

Para solicitar a adição de novos componentes padronizados:

1. Identifique componentes similares em diferentes módulos
2. Documente as diferentes APIs e comportamentos
3. Crie uma issue sugerindo a padronização

## Módulos Prioritários para Migração

A migração deve começar pelos seguintes módulos:

1. `apps/matriculas`
2. `apps/portal-do-aluno`
3. `apps/comunicacao`
4. `apps/material-didatico`

## Próximos Passos

Após a migração inicial dos componentes existentes, planejamos:

1. Criar componentes adicionais para formulários e modais
2. Implementar integração com temas personalizáveis
3. Adicionar mais variantes e opções de customização

## Perguntas Frequentes

**P: O que fazer se o componente padronizado não atender todas as necessidades?**

R: Entre em contato com a equipe de UI antes de criar implementações personalizadas. Podemos estender os componentes existentes para atender mais casos de uso.

**P: Como posso contribuir com novos componentes?**

R: Implemente o componente em `packages/ui-components`, adicione testes e documentação, e envie um PR para revisão. 