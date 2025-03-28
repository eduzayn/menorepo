# @edunexia/ui-components

Biblioteca de componentes UI reutilizáveis para a plataforma Edunéxia.

## Descrição

Este pacote contém todos os componentes de interface do usuário compartilhados entre os diversos módulos da plataforma Edunéxia. A biblioteca implementa o Design System da Edunéxia, garantindo consistência visual e de experiência em toda a plataforma.

## Instalação

```bash
pnpm add @edunexia/ui-components
```

## Dependências

Este pacote requer as seguintes dependências de peer:

```bash
pnpm add react react-dom @edunexia/tailwind-config
```

## Principais Componentes

A biblioteca inclui componentes como:

- **Layout**: Container, Grid, Card, Divider
- **Formulários**: Input, Select, Checkbox, Radio, Switch
- **Feedback**: Alert, Toast, Modal, Skeleton
- **Navegação**: Tabs, Pagination, Breadcrumb, Menu
- **Data Display**: Table, Badge, Tag, Avatar
- **Ações**: Button, ButtonGroup, Dropdown

## Uso

```tsx
import { Button, Card, Input } from '@edunexia/ui-components';

const MeuComponente = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Formulário de Exemplo</Card.Title>
      </Card.Header>
      <Card.Content>
        <Input 
          label="Nome Completo" 
          placeholder="Digite seu nome" 
          required 
        />
      </Card.Content>
      <Card.Footer>
        <Button variant="primary">Enviar</Button>
      </Card.Footer>
    </Card>
  );
};
```

## Desenvolvimento

### Estrutura de Arquivos

```
src/
├── components/         # Todos os componentes UI
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   └── ...
├── hooks/              # Hooks relacionados aos componentes
├── styles/             # Estilos compartilhados
├── utils/              # Utilitários internos
├── __tests__/          # Testes unitários
└── index.ts            # Exportações públicas
```

### Contribuindo

1. Ao criar um novo componente, siga a estrutura de pastas existente
2. Cada componente deve ter:
   - Arquivo principal do componente
   - Arquivo de tipos (pode ser junto ou separado)
   - Testes unitários
   - Documentação em JSDoc
3. Utilize Tailwind CSS para estilização
4. Certifique-se de que o componente é totalmente acessível
5. Exporte o componente no arquivo index.ts

### Scripts

- `pnpm build`: Compila a biblioteca
- `pnpm dev`: Compila em modo watch
- `pnpm test`: Executa os testes
- `pnpm lint`: Executa o ESLint
- `pnpm storybook`: Inicia o Storybook para desenvolvimento

## Integração com o Monorepo

Este pacote faz parte do monorepo da Edunéxia e segue os padrões estabelecidos. Para mais informações sobre como contribuir para o monorepo, consulte o [README principal](../../README.md). 