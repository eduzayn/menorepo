# Componentes Padronizados na Edunéxia

Este documento descreve os componentes padronizados disponíveis no pacote `@edunexia/ui-components` e fornece diretrizes para sua utilização nos módulos da plataforma Edunéxia.

## Instalação e Configuração

O pacote `@edunexia/ui-components` já está disponível como dependência no monorepo. Para utilizá-lo, basta importar os componentes necessários em seu código:

```tsx
import { StatsCard, DashboardCard, DashboardLayout, FormField, Input, Select, Card, CardHeader, CardContent } from '@edunexia/ui-components';
```

## Componentes Disponíveis

### Componentes de Exibição de Dados

#### StatsCard

Card padronizado para exibição de estatísticas em dashboards.

```tsx
<StatsCard
  title="Total de Alunos"
  value={1500}
  description="Alunos ativos no semestre atual"
  trend={{ value: 12, isPositive: true, text: "vs. semestre anterior" }}
  icon={<UserIcon />}
/>
```

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `title` | `string` | Título do card |
| `value` | `number \| string` | Valor principal a ser exibido |
| `description` | `string` (opcional) | Descrição adicional |
| `trend` | `{ value: number, isPositive: boolean, text?: string }` (opcional) | Informações de tendência |
| `icon` | `ReactNode` (opcional) | Ícone a ser exibido |
| `isLoading` | `boolean` (opcional) | Indica se o card está em estado de carregamento |
| `className` | `string` (opcional) | Classes CSS adicionais |
| `to` | `string` (opcional) | URL para navegação ao clicar no card |

#### DashboardCard

Card versátil para exibição de informações em dashboards, com suporte para conteúdo personalizado.

```tsx
<DashboardCard
  title="Matrículas por Status"
  icon={<ChartIcon />}
  className="h-full"
>
  <PieChart data={statusData} />
</DashboardCard>
```

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `title` | `string` | Título do card |
| `value` | `number \| string` (opcional) | Valor principal a ser exibido |
| `description` | `string` (opcional) | Descrição adicional |
| `trend` | `{ value: number, isPositive: boolean, text?: string }` (opcional) | Informações de tendência |
| `icon` | `ReactNode` (opcional) | Ícone a ser exibido |
| `isLoading` | `boolean` (opcional) | Indica se o card está em estado de carregamento |
| `className` | `string` (opcional) | Classes CSS adicionais |
| `to` | `string` (opcional) | URL para navegação ao clicar no card |
| `onClick` | `() => void` (opcional) | Função chamada ao clicar no card |
| `children` | `ReactNode` (opcional) | Conteúdo personalizado a ser exibido dentro do card |

#### Card e Componentes Relacionados

Sistema de cards flexível e composível para exibição de conteúdo organizado.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

**Componentes Disponíveis:**

| Componente | Descrição |
|------------|-----------|
| `Card` | Container principal do card |
| `CardHeader` | Cabeçalho do card, geralmente contém título e descrição |
| `CardTitle` | Título do card |
| `CardDescription` | Descrição ou subtítulo do card |
| `CardContent` | Conteúdo principal do card |
| `CardFooter` | Rodapé do card, geralmente contém ações ou botões |

**Props Comuns:**

Todos os componentes aceitam:
- `className`: Classes CSS adicionais
- Props HTML padrão do elemento base (div, h3, p, etc.)

### Templates de Página

#### DashboardPageTemplate

Template para páginas de dashboard, com suporte para cabeçalho, cards de estatísticas e área de conteúdo principal.

```tsx
<DashboardPageTemplate
  title="Dashboard de Matrículas"
  subtitle="Visão geral das matrículas ativas"
  statsCards={
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard title="Total de Alunos" value={1500} />
      <StatsCard title="Matrículas no Mês" value={120} />
      <StatsCard title="Taxa de Evasão" value="3.2%" />
    </div>
  }
  headerActions={
    <Button>Nova Matrícula</Button>
  }
>
  <div>Conteúdo principal do dashboard</div>
</DashboardPageTemplate>
```

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `title` | `string` | Título da página |
| `subtitle` | `string` (opcional) | Subtítulo da página |
| `headerActions` | `ReactNode` (opcional) | Ações/botões no cabeçalho |
| `statsCards` | `ReactNode` (opcional) | Cards de estatísticas |
| `filters` | `ReactNode` (opcional) | Área de filtros |
| `isLoading` | `boolean` (opcional) | Indica se a página está em estado de carregamento |
| `error` | `string` (opcional) | Mensagem de erro a ser exibida |
| `children` | `ReactNode` | Conteúdo principal da página |

#### SettingsPageTemplate

Template para páginas de configurações, com suporte para abas de navegação.

```tsx
<SettingsPageTemplate
  title="Configurações do Sistema"
  subtitle="Gerencie as preferências do sistema"
  tabs={[
    {
      id: 'general',
      title: 'Geral',
      content: <FormularioConfiguracoesGerais />
    },
    {
      id: 'security',
      title: 'Segurança',
      content: <FormularioConfiguracoesSegurana />
    }
  ]}
  defaultActiveTab="general"
/>
```

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `title` | `string` | Título da página |
| `subtitle` | `string` (opcional) | Subtítulo da página |
| `tabs` | `Array<{ id: string, title: string, content: ReactNode }>` | Configuração das abas |
| `defaultActiveTab` | `string` (opcional) | ID da aba que deve estar ativa por padrão |
| `isLoading` | `boolean` (opcional) | Indica se a página está em estado de carregamento |
| `error` | `string` (opcional) | Mensagem de erro a ser exibida |
| `onTabChange` | `(tabId: string) => void` (opcional) | Callback chamado quando a aba ativa é alterada |

### Componentes de Layout

#### DashboardLayout

Layout padronizado para páginas de dashboard, incluindo cabeçalho, barra lateral e rodapé.

```tsx
<DashboardLayout
  title="Portal do Aluno"
  user={{ name: "João Silva", email: "joao@exemplo.com", avatar: "/images/avatar.png" }}
  onLogout={() => handleLogout()}
>
  <DashboardPageTemplate title="Dashboard">
    {/* conteúdo da página */}
  </DashboardPageTemplate>
</DashboardLayout>
```

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `title` | `