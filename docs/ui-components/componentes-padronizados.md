# Componentes Padronizados e Templates Reutilizáveis

Este documento descreve os componentes padronizados e templates reutilizáveis implementados no pacote `@edunexia/ui-components`. Estes elementos devem ser utilizados em todos os módulos da plataforma Edunéxia para garantir consistência visual e comportamental.

## Instalação e Configuração

Para utilizar os componentes em qualquer módulo, importe-os diretamente do pacote:

```tsx
import { StatsCard, DashboardLayout, DashboardPageTemplate } from '@edunexia/ui-components';
```

## Componentes de Exibição de Dados

### StatsCard

Componente para exibir métricas e estatísticas em formato de card, amplamente utilizado em dashboards.

```tsx
<StatsCard
  title="Total de Alunos"
  value={1243}
  icon={<UserIcon />}
  iconBgColor="bg-blue-100"
  trend={{ value: 12, isPositive: true, text: "vs. mês anterior" }}
/>
```

**Props:**
- `title`: Título do card (obrigatório)
- `value`: Valor principal a ser exibido (obrigatório)
- `icon`: Ícone do card (opcional)
- `iconBgColor`: Cor de fundo do ícone (opcional, padrão: 'bg-primary-100')
- `description`: Descrição adicional (opcional)
- `trend`: Dados de tendência/comparação (opcional)
- `isLoading`: Estado de carregamento (opcional)
- `className`: Classes CSS adicionais (opcional)
- `to`: Link de navegação (opcional)

## Layouts

### DashboardLayout

Layout padrão para páginas de dashboard com menu lateral, cabeçalho e rodapé.

```tsx
<DashboardLayout
  title="Módulo de Matrículas"
  user={{ name: "João Silva", email: "joao@exemplo.com" }}
  onLogout={() => logout()}
>
  <div>Conteúdo principal</div>
</DashboardLayout>
```

**Props:**
- `children`: Conteúdo principal (obrigatório)
- `title`: Título da página (opcional)
- `sidebar`: Menu lateral personalizado (opcional)
- `headerContent`: Conteúdo adicional para o cabeçalho (opcional)
- `footer`: Rodapé personalizado (opcional)
- `user`: Informações do usuário logado (opcional)
- `onLogout`: Função de logout (opcional)

## Templates

### DashboardPageTemplate

Template para criação rápida de páginas de dashboard com estrutura padronizada.

```tsx
<DashboardPageTemplate
  title="Dashboard de Vendas"
  subtitle="Acompanhe suas métricas de vendas"
  headerActions={<Button>Nova Venda</Button>}
  statsCards={
    <>
      <StatsCard title="Total" value={1500} />
      <StatsCard title="Mês Atual" value={350} />
    </>
  }
>
  <div>Conteúdo principal...</div>
</DashboardPageTemplate>
```

**Props:**
- `title`: Título principal da página (obrigatório)
- `subtitle`: Subtítulo ou descrição (opcional)
- `headerActions`: Ações/botões para o cabeçalho (opcional)
- `statsCards`: Cards de estatísticas (opcional)
- `children`: Conteúdo principal (obrigatório)
- `isLoading`: Indicador de carregamento (opcional)
- `filters`: Filtros para o dashboard (opcional)
- `error`: Mensagem de erro (opcional)

### SettingsPageTemplate

Template para páginas de configurações com múltiplas abas.

```tsx
<SettingsPageTemplate
  title="Configurações"
  subtitle="Gerencie as configurações do sistema"
  tabs={[
    {
      id: 'general',
      title: 'Geral',
      icon: <Settings />,
      content: <GeneralSettingsForm />
    },
    {
      id: 'security',
      title: 'Segurança',
      icon: <Lock />,
      content: <SecuritySettingsForm />
    }
  ]}
/>
```

**Props:**
- `title`: Título da página (obrigatório)
- `subtitle`: Subtítulo ou descrição (opcional)
- `tabs`: Lista de abas (obrigatório)
- `defaultActiveTab`: ID da aba ativa inicialmente (opcional)
- `isLoading`: Indicador de carregamento (opcional)
- `error`: Mensagem de erro (opcional)
- `onTabChange`: Callback quando uma aba é alterada (opcional)

## Boas Práticas

1. **Sempre priorize os componentes padronizados** sobre implementações locais.
2. **Utilize os templates para páginas comuns** como dashboards e configurações.
3. **Comunique necessidades de novos componentes** à equipe de UI antes de criar implementações locais.
4. **Evite modificar o estilo dos componentes** para manter consistência visual.
5. **Reporte bugs e problemas** encontrados nos componentes padronizados.

## Solicitando Novos Componentes

Para solicitar a inclusão de novos componentes padronizados:

1. Verifique se não existe um componente similar já implementado
2. Documente o caso de uso e comportamento desejado
3. Forneça exemplos de implementações existentes em diferentes módulos
4. Abra uma issue no repositório com a tag "novo-componente"

## Migrando Componentes Existentes

Ao identificar componentes duplicados em diferentes módulos:

1. Verifique comportamentos e props necessárias em cada implementação
2. Implemente uma versão unificada em `@edunexia/ui-components`
3. Atualize as instâncias nos módulos para usar a versão centralizada
4. Remova as implementações locais

---

Para mais detalhes sobre cada componente específico, consulte sua documentação dentro do código fonte. 