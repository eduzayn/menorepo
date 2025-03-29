# DisciplineCard

O componente `DisciplineCard` é utilizado para exibir informações sobre disciplinas em formato de card, incluindo status, duração e data da última atualização. Também oferece suporte para funcionalidades de drag and drop.

## Importação

```tsx
import { DisciplineCard } from '@edunexia/ui-components';
```

## Uso Básico

```tsx
<DisciplineCard
  id="123"
  title="Fundamentos de React"
  description="Introdução aos conceitos do React"
  duration="20 horas"
  status="active"
  lastUpdate={new Date()}
  onEdit={(id) => handleEdit(id)}
  onDelete={(id) => handleDelete(id)}
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `id` | `string` | - | ID único da disciplina (obrigatório) |
| `title` | `string` | - | Título da disciplina (obrigatório) |
| `description` | `string` | - | Descrição da disciplina (obrigatório) |
| `duration` | `string` | - | Duração da disciplina (ex: "20 horas") (obrigatório) |
| `status` | `'active' \| 'inactive'` | - | Status da disciplina (obrigatório) |
| `lastUpdate` | `Date` | - | Data da última atualização (obrigatório) |
| `onEdit` | `(id: string) => void` | - | Função chamada ao clicar no botão de edição |
| `onDelete` | `(id: string) => void` | - | Função chamada ao clicar no botão de exclusão |
| `isDragging` | `boolean` | `false` | Indica se o card está sendo arrastado |
| `dragHandleProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Props para o manipulador de arrastar |
| `className` | `string` | `''` | Classes CSS adicionais |

## Exemplos

### Disciplina Ativa

```tsx
<DisciplineCard
  id="active-123"
  title="Introdução a JavaScript"
  description="Fundamentos da linguagem JavaScript e manipulação do DOM"
  duration="15 horas"
  status="active"
  lastUpdate={new Date()}
  onEdit={(id) => handleEdit(id)}
  onDelete={(id) => handleDelete(id)}
/>
```

### Disciplina Inativa

```tsx
<DisciplineCard
  id="inactive-456"
  title="HTML e CSS Avançado"
  description="Técnicas avançadas de estilização e estruturação de páginas web"
  duration="18 horas"
  status="inactive"
  lastUpdate={new Date(2023, 5, 10)}
  onEdit={(id) => handleEdit(id)}
/>
```

### Com Suporte para Drag and Drop

```tsx
// Exemplo usando react-beautiful-dnd
import { Draggable } from 'react-beautiful-dnd';

function DraggableDiscipline({ discipline, index, onEdit, onDelete }) {
  return (
    <Draggable draggableId={discipline.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <DisciplineCard
            id={discipline.id}
            title={discipline.title}
            description={discipline.description}
            duration={discipline.duration}
            status={discipline.status}
            lastUpdate={new Date(discipline.lastUpdate)}
            isDragging={snapshot.isDragging}
            dragHandleProps={provided.dragHandleProps}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </Draggable>
  );
}
```

## Lista de Disciplinas

```tsx
import { DisciplineCard } from '@edunexia/ui-components';

function DisciplineList({ disciplines }) {
  const handleEdit = (id) => {
    // Lógica para editar uma disciplina
  };
  
  const handleDelete = (id) => {
    // Lógica para excluir uma disciplina
  };
  
  return (
    <div className="space-y-4">
      {disciplines.map((discipline) => (
        <DisciplineCard
          key={discipline.id}
          id={discipline.id}
          title={discipline.title}
          description={discipline.description}
          duration={discipline.duration}
          status={discipline.status}
          lastUpdate={new Date(discipline.updatedAt)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

## Notas de Implementação

- O componente utiliza cores diferentes para os diferentes status (verde para ativo, cinza para inativo)
- Os botões de edição e exclusão são opcionais e só serão renderizados se as funções `onEdit` e `onDelete` forem fornecidas
- O componente suporta integração com bibliotecas de drag and drop através das props `isDragging` e `dragHandleProps`
- Quando o card está sendo arrastado (`isDragging` é `true`), sua opacidade é reduzida para fornecer feedback visual 