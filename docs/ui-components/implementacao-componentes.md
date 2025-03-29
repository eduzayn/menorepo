# Guia de Implementação de Componentes

Este documento fornece diretrizes e melhores práticas para implementação de componentes na biblioteca centralizada `@edunexia/ui-components`.

## Processo de Migração

### 1. Identificação de Componentes

1. Analise o código dos módulos para identificar componentes candidatos à migração:
   - Componentes utilizados em múltiplos módulos
   - Componentes com funcionalidade genérica
   - Componentes de UI básicos (botões, cards, inputs, etc.)

2. Evite migrar componentes que:
   - São muito específicos para um único módulo
   - Possuem dependências fortemente acopladas ao contexto do módulo
   - Implementam lógica de negócio específica

### 2. Implementação na Biblioteca Centralizada

1. Crie o componente na estrutura correta:
   - `src/components/[categoria]/[NomeDoComponente].tsx`
   - Exemplos de categorias: `layout`, `forms`, `data-display`, `feedback`, `navigation`

2. Implemente uma API limpa e consistente:
   - Use TypeScript para definição de tipos explícitos
   - Documente cada prop com comentários JSDoc
   - Evite estados internos desnecessários
   - Prefira composição à herança

3. Atualize os arquivos de exportação:
   - Adicione em `src/components/[categoria]/index.ts`
   - Adicione em `src/index.ts`

4. Crie documentação do componente:
   - Arquivo markdown em `docs/ui-components/components/[NomeDoComponente].md`
   - Inclua exemplos de uso, props e notas de implementação

### 3. Atualização nos Módulos

1. Substitua os imports nos módulos:
   ```typescript
   // Antes
   import { ComponenteX } from '../../components/ComponenteX';
   
   // Depois
   import { ComponenteX } from '@edunexia/ui-components';
   ```

2. Adapte o uso às novas props (se necessário)
3. Remova o componente original após confirmar funcionamento

### 4. Atualização da Documentação

1. Atualize o arquivo `docs/ui-components/progresso-migracao.md`
2. Inclua detalhes sobre:
   - Componente migrado
   - Melhorias realizadas
   - Arquivos atualizados
   - Status de progresso

## Estrutura de Diretórios

```
packages/ui-components/
├── src/
│   ├── components/
│   │   ├── card/               # Componentes de card
│   │   ├── forms/              # Inputs, selects, etc.
│   │   ├── layout/             # Layouts, grids, containers
│   │   ├── data-display/       # Tabelas, estatísticas, listas
│   │   ├── feedback/           # Alertas, toasts, etc.
│   │   └── navigation/         # Menus, tabs, breadcrumbs
│   ├── templates/              # Modelos de páginas completas
│   ├── hooks/                  # Hooks reutilizáveis
│   ├── utils/                  # Funções utilitárias
│   └── index.ts                # Exportação principal
├── package.json
└── tsconfig.json
```

## Convenções de Codificação

### Nomeação

- Use **PascalCase** para nomes de componentes: `Button.tsx`, `FormField.tsx`
- Use **camelCase** para nomes de hooks e utils: `useWindowSize.ts`, `formatDate.ts`
- Use **kebab-case** para nomes de arquivos de implementação interna: `button-variants.ts`

### Exportações

- Use exportação nomeada para subcomponentes relacionados:

```typescript
export const Card = ({ children, ...props }) => { /* ... */ };
export const CardHeader = ({ children, ...props }) => { /* ... */ };
export const CardFooter = ({ children, ...props }) => { /* ... */ };
```

- Use exportação padrão para componentes individuais:

```typescript
const Button = ({ children, ...props }) => { /* ... */ };
export default Button;
```

### Props

- Defina interfaces explícitas:

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
```

- Forneça valores padrão para props opcionais:

```typescript
const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  ...props
}: ButtonProps) => { /* ... */ };
```

### Estilização

- Use Tailwind CSS para estilização:

```typescript
<button 
  className={`
    px-4 py-2 rounded-md
    ${variant === 'primary' ? 'bg-blue-600 text-white' : ''}
    ${variant === 'secondary' ? 'bg-gray-200 text-gray-800' : ''}
    ${size === 'sm' ? 'text-sm' : ''}
    ${size === 'lg' ? 'text-lg px-6 py-3' : ''}
  `}
  {...props}
>
  {isLoading && <Spinner className="mr-2" />}
  {children}
</button>
```

## Melhores Práticas

### Composição de Componentes

Prefira o padrão de composição para componentes complexos:

```typescript
// Bom: Uso de composição
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo do card</CardContent>
  <CardFooter>Rodapé do card</CardFooter>
</Card>

// Evite: Componentes monolíticos
<Card 
  title="Título do Card"
  content="Conteúdo do card"
  footer="Rodapé do card"
/>
```

### Renderização Condicional

Use operadores ternários ou de curto-circuito para renderização condicional:

```typescript
// Renderização condicional com &&
{isLoading && <Spinner />}

// Renderização condicional com ternário
{isOpen ? <Content /> : <Placeholder />}
```

### Acessibilidade

- Sempre inclua elementos de acessibilidade:

```typescript
<button
  aria-label={ariaLabel || "Botão de ação"}
  aria-disabled={disabled}
  ref={ref}
  {...props}
>
  {children}
</button>
```

### Documentação

Documente props com JSDoc:

```typescript
/**
 * Componente de botão com suporte a variantes, tamanhos e estado de carregamento
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Clique Aqui
 * </Button>
 * ```
 */
export interface ButtonProps {
  /**
   * Variante visual do botão
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'outline';
  
  /**
   * Tamanho do botão
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Indica se o botão está em estado de carregamento
   * @default false
   */
  isLoading?: boolean;
}
```

## Testes

Cada componente deve incluir testes básicos:

1. Renderização sem erros
2. Renderização com diferentes props
3. Interações básicas (cliques, hover, etc.)
4. Comportamentos esperados (exibição de conteúdo condicional, etc.)

```typescript
// Exemplo de teste com React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renderiza corretamente', () => {
    render(<Button>Teste</Button>);
    expect(screen.getByText('Teste')).toBeInTheDocument();
  });
  
  it('aplica classes corretas para variante primária', () => {
    const { container } = render(<Button variant="primary">Teste</Button>);
    expect(container.firstChild).toHaveClass('bg-blue-600');
  });
  
  it('chama onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    fireEvent.click(screen.getByText('Clique'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Exemplos de Componentes Migrados

Para exemplos práticos, consulte os componentes já migrados:

- [StatsCard](./components/StatsCard.md) - Card para exibição de estatísticas
- [PageHeader](./components/PageHeader.md) - Cabeçalho de página com suporte a ações
- [MainLayout](./components/MainLayout.md) - Layout unificado para todos os módulos
- [FormField](./components/FormField.md) - Campo de formulário com suporte a validação

---

> Este documento deve ser atualizado conforme evoluções no processo de desenvolvimento. 