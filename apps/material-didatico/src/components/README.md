<!-- cSpell:disable -->
# Estrutura de Componentes - Material Didático

## Visão Geral
Este diretório contém os componentes específicos do módulo de Material Didático, organizados por funcionalidade e reutilização.

## Estrutura de Diretórios

```bash
src/components/
├── layout/                    # Componentes de layout base
│   ├── Layout.tsx            # Layout principal da aplicação
│   ├── Header.tsx            # Cabeçalho com busca e perfil
│   └── Sidebar.tsx           # Menu lateral de navegação
│
├── editor/                    # Componentes do editor de conteúdo
│   ├── EditorToolbar.tsx     # Barra de ferramentas do editor
│   ├── BlockSelector.tsx     # Seletor de tipos de blocos
│   ├── TextBlock.tsx         # Bloco de texto
│   ├── VideoBlock.tsx        # Bloco de vídeo
│   ├── QuizBlock.tsx         # Bloco de quiz
│   └── ActivityBlock.tsx     # Bloco de atividade
│
├── dashboard/                 # Componentes do dashboard
│   ├── StatsCard.tsx         # Card de estatísticas
│   ├── RecentActivity.tsx    # Lista de atividades recentes
│   └── ProgressChart.tsx     # Gráfico de progresso
│
├── cursos/                    # Componentes relacionados a cursos
│   ├── CourseCard.tsx        # Card de visualização de curso
│   ├── CourseForm.tsx        # Formulário de curso
│   ├── CourseList.tsx        # Lista de cursos
│   └── CourseStatus.tsx      # Indicador de status do curso
│
├── disciplinas/              # Componentes relacionados a disciplinas
│   ├── DisciplineCard.tsx    # Card de visualização de disciplina
│   ├── DisciplineForm.tsx    # Formulário de disciplina
│   ├── DisciplineList.tsx    # Lista de disciplinas
│   └── ModuleTree.tsx        # Árvore de módulos
│
├── templates/                # Componentes de templates
│   ├── TemplateCard.tsx      # Card de visualização de template
│   ├── TemplateForm.tsx      # Formulário de template
│   ├── TemplateList.tsx      # Lista de templates
│   └── TemplatePreview.tsx   # Preview do template
│
└── shared/                   # Componentes compartilhados
    ├── StatusBadge.tsx       # Badge de status
    ├── AuthorAvatar.tsx      # Avatar do autor
    ├── ActionButton.tsx      # Botão de ação
    └── ConfirmationDialog.tsx # Diálogo de confirmação
```

## Componentes Base Utilizados
O módulo utiliza os seguintes componentes do design system compartilhado (`@edunexia/ui-components`):

### Layout
- `Button` - Botões com animações
- `Card` - Cards de conteúdo
- `Spinner` - Indicador de carregamento

### Formulários
- `Input` - Inputs com ícones
- `TextField` - Campo com label
- `Textarea` - Área de texto
- `Select` - Seleção

### Exibição de Dados
- `Avatar` - Avatares de usuários
- `Badge` - Badges de status
- `Chip` - Chips de categorias
- `Tooltip` - Tooltips informativos
- `Progress` - Barras de progresso
- `Calendar` - Calendários
- `Timeline` - Linhas do tempo
- `Accordion` - Acordeões

### Tabelas
- `Table` - Tabelas de dados
- `TableHeader` - Cabeçalho da tabela
- `TableBody` - Corpo da tabela
- `TableFooter` - Rodapé da tabela
- `TableHead` - Cabeçalho das colunas
- `TableRow` - Linhas da tabela
- `TableCell` - Células da tabela
- `TableCaption` - Legenda da tabela
- `TablePagination` - Paginação

### Upload
- `Upload` - Container de upload
- `UploadDropzone` - Área de soltar arquivos
- `UploadProgress` - Progresso do upload

### Diálogos
- `Dialog` - Modais
- `Command` - Dropdowns

### Feedback
- `Toast` - Notificações
- `Alert` - Alertas

### Chat
- `Chat` - Container de chat
- `ChatMessage` - Mensagens
- `ChatInput` - Input de mensagem

## Convenções de Nomenclatura
- Nomes de arquivos: PascalCase (ex: `CourseCard.tsx`)
- Nomes de componentes: PascalCase (ex: `CourseCard`)
- Nomes de props: camelCase (ex: `onSubmit`)
- Nomes de eventos: camelCase com prefixo 'handle' (ex: `handleSubmit`)
- Nomes de variáveis: camelCase (ex: `courseList`)
- Nomes de constantes: UPPER_SNAKE_CASE (ex: `MAX_ITEMS`)

## Boas Práticas
1. Componentes devem ser funcionais e utilizar hooks
2. Props devem ser tipadas com TypeScript
3. Utilizar React.memo para componentes que não precisam re-renderizar frequentemente
4. Implementar tratamento de erros e estados de loading
5. Seguir as convenções de acessibilidade (ARIA)
6. Documentar props e comportamentos complexos
7. Testar componentes isoladamente
8. Manter componentes pequenos e focados
9. Reutilizar componentes base do design system
10. Implementar feedback visual para ações do usuário 
