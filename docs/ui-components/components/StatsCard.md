# StatsCard

O componente `StatsCard` é utilizado para exibir métricas e estatísticas em formato de card, com suporte para ícones, tendências e descrições adicionais.

## Importação

```tsx
import { StatsCard } from '@edunexia/ui-components';
```

## Uso Básico

```tsx
import { Users } from 'lucide-react';

<StatsCard
  title="Total de Alunos"
  value={1243}
  icon={<Users className="h-5 w-5" />}
  trend={{ value: 12, isPositive: true }}
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | `string` | - | Título do card estatístico (obrigatório) |
| `value` | `string \| number` | - | Valor principal a ser exibido (obrigatório) |
| `icon` | `ReactNode` | - | Ícone do card (opcional) |
| `iconBgColor` | `string` | `bg-primary-100` | Cor de fundo do ícone |
| `description` | `string` | - | Descrição adicional ou texto auxiliar |
| `trend` | `object` | - | Informações de tendência/comparação |
| `trend.value` | `number` | - | Valor percentual da tendência |
| `trend.isPositive` | `boolean` | - | Se a tendência é positiva ou negativa |
| `trend.text` | `string` | `comparado ao período anterior` | Texto explicativo da tendência |
| `isLoading` | `boolean` | `false` | Estado de carregamento do card |
| `className` | `string` | `''` | Classes CSS adicionais para o card |
| `to` | `string` | - | Link para navegação ao clicar no card |

## Exemplos

### Card com Ícone e Tendência

```tsx
import { Users } from 'lucide-react';

<StatsCard
  title="Total de Alunos"
  value={1243}
  icon={<Users className="h-5 w-5" />}
  iconBgColor="bg-blue-100"
  trend={{ 
    value: 12, 
    isPositive: true, 
    text: "vs. mês anterior" 
  }}
/>
```

### Card com Estado de Carregamento

```tsx
<StatsCard
  title="Total de Matrículas"
  value={0}
  isLoading={true}
/>
```

### Card com Link de Navegação

```tsx
import { TrendingUp } from 'lucide-react';

<StatsCard
  title="Receita Mensal"
  value="R$ 125.340,00"
  icon={<TrendingUp className="h-5 w-5" />}
  description="Total faturado em Julho/2023"
  to="/financeiro/relatorios"
/>
```

### Card com Tendência Negativa

```tsx
import { UserMinus } from 'lucide-react';

<StatsCard
  title="Evasão"
  value="5,2%"
  icon={<UserMinus className="h-5 w-5" />}
  iconBgColor="bg-red-100"
  trend={{ 
    value: 1.8, 
    isPositive: false, 
    text: "vs. mês anterior" 
  }}
/>
```

## Uso em Dashboard

```tsx
import { Grid } from '@edunexia/ui-components';
import { Users, GraduationCap, CreditCard, Calendar } from 'lucide-react';

<Grid cols={4} gap={4}>
  <StatsCard
    title="Total de Alunos"
    value={1243}
    icon={<Users className="h-5 w-5" />}
    trend={{ value: 12, isPositive: true }}
  />
  <StatsCard
    title="Cursos Ativos"
    value={42}
    icon={<GraduationCap className="h-5 w-5" />}
    iconBgColor="bg-green-100"
  />
  <StatsCard
    title="Receita Mensal"
    value="R$ 125.340,00"
    icon={<CreditCard className="h-5 w-5" />}
    iconBgColor="bg-purple-100"
    trend={{ value: 7.5, isPositive: true }}
  />
  <StatsCard
    title="Matrículas Pendentes"
    value={18}
    icon={<Calendar className="h-5 w-5" />}
    iconBgColor="bg-yellow-100"
    trend={{ value: 4.2, isPositive: false }}
  />
</Grid>
```

## Notas de Implementação

- O componente automaticamente adapta cores para tendências positivas (verde) e negativas (vermelho)
- Quando a prop `to` é fornecida, o card inteiro torna-se clicável, com efeito de escala no hover
- No estado de `isLoading`, o valor é substituído por um skeleton loader 