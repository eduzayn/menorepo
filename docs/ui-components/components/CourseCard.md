# CourseCard

O componente `CourseCard` é utilizado para exibir informações sobre cursos em formato de card, incluindo status, número de disciplinas, autores e data da última atualização.

## Importação

```tsx
import { CourseCard } from '@edunexia/ui-components';
```

## Uso Básico

```tsx
<CourseCard
  id="123"
  title="Desenvolvimento Web Fullstack"
  description="Curso completo de desenvolvimento web com React e Node.js"
  status="published"
  totalDisciplines={12}
  totalAuthors={3}
  lastUpdate={new Date()}
  onEdit={(id) => console.log('Editar', id)}
  onDelete={(id) => console.log('Excluir', id)}
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `id` | `string` | - | ID único do curso (obrigatório) |
| `title` | `string` | - | Título do curso (obrigatório) |
| `description` | `string` | - | Descrição do curso (obrigatório) |
| `status` | `'draft' \| 'review' \| 'published'` | - | Status do curso (obrigatório) |
| `totalDisciplines` | `number` | - | Número total de disciplinas |
| `totalAuthors` | `number` | - | Número total de autores |
| `lastUpdate` | `Date` | - | Data da última atualização |
| `onEdit` | `(id: string) => void` | - | Função chamada ao clicar no botão de edição |
| `onDelete` | `(id: string) => void` | - | Função chamada ao clicar no botão de exclusão |
| `className` | `string` | `''` | Classes CSS adicionais |

## Exemplos

### Card de Curso em Rascunho

```tsx
<CourseCard
  id="draft-123"
  title="Introdução a Python"
  description="Fundamentos da linguagem Python para iniciantes"
  status="draft"
  totalDisciplines={5}
  lastUpdate={new Date()}
  onEdit={(id) => handleEdit(id)}
/>
```

### Card de Curso em Revisão

```tsx
<CourseCard
  id="review-456"
  title="Marketing Digital"
  description="Estratégias avançadas de marketing para plataformas digitais"
  status="review"
  totalDisciplines={8}
  totalAuthors={2}
  lastUpdate={new Date()}
  onEdit={(id) => handleEdit(id)}
  onDelete={(id) => handleDelete(id)}
/>
```

### Card de Curso Publicado

```tsx
<CourseCard
  id="published-789"
  title="Gestão de Projetos"
  description="Metodologias ágeis e ferramentas para gestão eficiente de projetos"
  status="published"
  totalDisciplines={10}
  totalAuthors={4}
  lastUpdate={new Date()}
  onEdit={(id) => handleEdit(id)}
  onDelete={(id) => handleDelete(id)}
/>
```

### Card Personalizado

```tsx
<CourseCard
  id="custom-101"
  title="Design de UX/UI"
  description="Princípios de design de interfaces e experiência do usuário"
  status="published"
  totalDisciplines={12}
  className="border-2 border-purple-200 shadow-lg"
  onEdit={(id) => showEditModal(id)}
/>
```

## Lista de Cursos

```tsx
import { CourseCard } from '@edunexia/ui-components';

function CourseList({ courses }) {
  const handleEdit = (id) => {
    // Lógica para editar um curso
  };
  
  const handleDelete = (id) => {
    // Lógica para excluir um curso
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          description={course.description}
          status={course.status}
          totalDisciplines={course.disciplinesCount}
          totalAuthors={course.authorsCount}
          lastUpdate={new Date(course.updatedAt)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

## Notas de Implementação

- O componente automaticamente adapta cores para os diferentes status (amarelo para rascunho, azul para revisão, verde para publicado)
- Os botões de edição e exclusão são opcionais e só serão renderizados se as funções `onEdit` e `onDelete` forem fornecidas
- As informações de total de disciplinas, autores e data de atualização também são opcionais 