<!-- cSpell:disable -->
# README TÉCNICO - Módulo de Produção de Conteúdo (Portal do Professor) - Plataforma Edunéxia

## 📁 Visão Geral

> O Módulo de Produção de Conteúdo é o ambiente exclusivo dos professores e conteudistas da plataforma Edunéxia. Aqui serão criados, revisados, publicados e gerenciados todos os materiais didáticos que compõem os cursos ofertados. O sistema foi projetado para garantir autonomia ao autor, controle de qualidade, escalabilidade e integração completa com os demais módulos da plataforma.

## ⚖️ Tecnologias Utilizadas
- *React + TypeScript* (Frontend)
- *TailwindCSS* (Design moderno)
- *Supabase* (Banco, storage, autenticação)
- *PNPM Workspaces* (Monorepo)
- *Vite* (Build tool)
- *IA (OpenAI ou Claude)* para geração assistida de conteúdo
- *Shadcn UI* (Componentes base)
- *Radix UI* (Componentes primitivos)
- *Tailwind Aria* (Acessibilidade)

## 🔹 Funcionalidades Principais

### 📖 Criação e Edição de Conteúdo
- Editor inteligente com blocos (texto, vídeo, quiz, atividade, simulados, links)
- Integração com IA para:
  - Sugestão de conteúdo
  - Resumos e objetivos
  - Criação de atividades
  - Correção automática

### 🌍 Publicação e Workflow
- Criação de cursos, disciplinas, módulos e lições
- Rascunho → Revisão → Aprovado → Publicado
- Comentários e atribuição de revisores

### ✍️ Coautoria e Permissões
- Vários professores podem colaborar em um curso
- Permissões de leitura, edição, revisão e publicação

### 📄 Templates Inteligentes
- Criação de modelos reutilizáveis para aulas e disciplinas
- Sugestões automáticas de estrutura (introdução, objetivos, conclusão)

### 🔄 Controle de Versões
- Cada atualização de aula gera nova versão
- Permite restaurar versões anteriores
- Indica autor de cada versão

### 🗃️ Exportação de Conteúdo
- Exportação como:
  - PDF
  - HTML5 responsivo
  - SCORM (para LMSs externos)

### 📊 Dashboard do Autor
- Quantidade de cursos criados
- Disciplinas em revisão
- Progresso geral de produção
- Tempo médio de edição por aula

### 🌐 Anexos e Mídias
- Upload de imagens, áudios, PDFs, links externos
- Suporte a YouTube, Vimeo e arquivos da nuvem (Supabase storage)

### 🤝 Integrações
- *Portal do Aluno*: publicação e exibição do conteúdo
- *Matrículas*: vinculação com cursos comprados
- *Inadimplência*: verifica se aluno pode acessar conteúdo
- *IA Docente*: pode revisar e sugerir melhorias

## 🌍 Layout Visual (Sugerido)
```text
┌───────────── Menu Lateral ─────────────┐
│ Dashboard                             │
│ Cursos Criados                        │
│ Criar Novo Curso                      │
│ Disciplinas                          │
│ Meus Materiais                       │
│ Templates                            │
│ Publicações Pendentes                │
│ Versões e Histórico                  │
│ Configurações                       │
└───────────────────────────────────────┘
```

## 🚪 Rotas e Páginas
```bash
/dashboard                         # Painel principal do autor
/cursos                            # Lista de cursos criados
/cursos/novo                       # Novo curso
/cursos/:id                        # Editar curso
/disciplinas/:cursoId              # Disciplinas do curso
/disciplinas/:id/editar            # Editar disciplina
/materiais                         # Listagem geral de materiais
/templates                         # Modelos reutilizáveis
/publicacoes                       # Pendentes de revisão/publicação
/historico                         # Controle de versões
/configuracoes                     # Perfil e preferências
```

## 📦 Estrutura do Projeto
```bash
apps/material-didatico/
├── src/
│   ├── pages/                    # Páginas da aplicação
│   ├── components/               # Componentes específicos do módulo
│   │   ├── editor/              # Componentes do editor
│   │   ├── dashboard/           # Componentes do dashboard
│   │   ├── cursos/              # Componentes de cursos
│   │   └── templates/           # Componentes de templates
│   ├── hooks/                   # Hooks personalizados
│   ├── services/                # Serviços e APIs
│   ├── flows/                   # Workflows editoriais
│   ├── ai/                      # Integração IA
│   └── types/                   # Tipos TypeScript
├── public/                      # Arquivos estáticos
├── package.json                 # Dependências e scripts
└── tsconfig.json                # Configuração TypeScript
```

## 🎨 Componentes Utilizados
O módulo utiliza os seguintes componentes do design system compartilhado:

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

## 🔧 Supabase (Schema conteudo)
| Tabela                | Finalidade                                     |
|-----------------------|-----------------------------------------------|
| cursos              | Cadastro básico do curso                      |
| disciplinas         | Disciplinas e estrutura didática             |
| aulas               | Blocos de conteúdo e atividades              |
| templates           | Modelos reutilizáveis                        |
| versoes             | Controle de versões e auditoria              |
| autores             | Vínculo de professores ao conteúdo           |
| midias              | Biblioteca de arquivos e anexações           |
| publicacoes         | Status editorial de publicação               |

## 📅 Documentação Complementar
> Este módulo integra o monorepo da Edunéxia. Consulte os READMEs dos módulos *Portal do Aluno, **Matrículas* e *Comunicação* para mais detalhes sobre as integrações entre os sistemas.

---

Com esse módulo, a Edunéxia entrega uma experiência poderosa para os professores, com produção assistida por IA, controle de qualidade, exportação SCORM, coautoria e integração total ao ecossistema de ensino digital. 
