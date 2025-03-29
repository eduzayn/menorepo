# Componentes Padronizados na Edunéxia

Este documento descreve os componentes padronizados disponíveis no pacote `@edunexia/ui-components` e fornece diretrizes para sua utilização nos módulos da plataforma Edunéxia.

## Instalação e Configuração

O pacote `@edunexia/ui-components` já está disponível como dependência no monorepo. Para utilizá-lo, basta importar os componentes necessários em seu código:

```tsx
import { StatsCard, DashboardCard, DashboardLayout, FormField, Input, Select } from '@edunexia/ui-components';
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
| `title` | `string` (opcional) | Título do dashboard |
| `user` | `{ name?: string, email?: string, avatar?: string }` (opcional) | Informações do usuário logado |
| `onLogout` | `() => void` (opcional) | Função chamada ao clicar no botão de sair |
| `sidebar` | `ReactNode` (opcional) | Componente personalizado para a barra lateral |
| `headerContent` | `ReactNode` (opcional) | Conteúdo personalizado para o cabeçalho |
| `footer` | `ReactNode` (opcional) | Rodapé personalizado |
| `children` | `ReactNode` | Conteúdo principal do layout |

### Componentes de Formulário

#### FormField

Container padronizado para campos de formulário, com suporte para rótulo e mensagens de erro.

```tsx
<FormField
  name="email"
  label="E-mail"
  required
  error={errors.email?.message}
  helpText="Utilize seu e-mail institucional"
>
  <Input name="email" placeholder="exemplo@email.com" />
</FormField>
```

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `name` | `string` | Nome do campo |
| `label` | `string` | Rótulo do campo |
| `error` | `string` (opcional) | Mensagem de erro |
| `helpText` | `string` (opcional) | Texto de ajuda ou descrição |
| `required` | `boolean` (opcional) | Indica se o campo é obrigatório |
| `disabled` | `boolean` (opcional) | Indica se o campo está desabilitado |
| `children` | `ReactNode` | Componente de input (Input, Select, etc.) |
| `className` | `string` (opcional) | Classes CSS adicionais |

#### Input

Campo de entrada de texto padronizado.

```tsx
<Input
  name="nome"
  placeholder="Nome completo"
  variant="outlined"
  size="md"
  leftIcon={<UserIcon />}
/>
```

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `size` | `'sm' \| 'md' \| 'lg'` (opcional) | Tamanho do campo |
| `variant` | `'default' \| 'outlined' \| 'filled'` (opcional) | Variante de estilo |
| `hasError` | `boolean` (opcional) | Indica se o campo tem erro |
| `leftIcon` | `ReactNode` (opcional) | Ícone à esquerda do campo |
| `rightIcon` | `ReactNode` (opcional) | Ícone à direita do campo |
| `className` | `string` (opcional) | Classes CSS adicionais |
| ... | Todas as props nativas de `<input>` | - |

#### Select

Campo de seleção padronizado.

```tsx
<Select
  name="estado"
  placeholder="Selecione um estado"
  options={[
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Minas Gerais' }
  ]}
/>
```

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `options` | `Array<{ value: string, label: string, disabled?: boolean }>` | Opções do select |
| `size` | `'sm' \| 'md' \| 'lg'` (opcional) | Tamanho do campo |
| `variant` | `'default' \| 'outlined' \| 'filled'` (opcional) | Variante de estilo |
| `hasError` | `boolean` (opcional) | Indica se o campo tem erro |
| `placeholder` | `string` (opcional) | Texto para opção vazia |
| `rightIcon` | `ReactNode` (opcional) | Ícone à direita do campo |
| `className` | `string` (opcional) | Classes CSS adicionais |
| ... | Todas as props nativas de `<select>` | - |

## Boas Práticas

### Quando usar componentes padronizados

- Utilize os componentes padronizados para garantir consistência visual e comportamental em todos os módulos da plataforma
- Priorize o uso desses componentes em vez de criar implementações locais duplicadas
- Se precisar de personalizações leves, use as props disponíveis (como `className`, `variant`, etc.)

### Como estender funcionalidades

Se os componentes padronizados não atenderem todas as suas necessidades:

1. Verifique se a funcionalidade pode ser implementada usando as props existentes
2. Considere compor os componentes para criar uma variação específica
3. Entre em contato com a equipe de UI antes de criar implementações personalizadas

### Testes

Todos os componentes padronizados incluem testes de unidade. Ao implementar novos componentes:

1. Siga os padrões de teste existentes
2. Cubra todos os casos de uso e variações importantes
3. Execute os testes com `pnpm test` antes de enviar seu PR

## Contribuindo com novos componentes

Para contribuir com novos componentes padronizados:

1. Identifique componentes duplicados em diferentes módulos
2. Analise as APIs e comportamentos existentes
3. Extraia uma versão comum que atenda a maioria dos casos de uso
4. Implemente o componente em `packages/ui-components`
5. Adicione testes abrangentes
6. Documente o componente neste arquivo
7. Envie um PR para revisão

---

> **Lembrete:** Atualize este documento sempre que adicionar, modificar ou remover componentes padronizados. 