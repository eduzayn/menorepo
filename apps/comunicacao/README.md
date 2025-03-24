# Edunexia - Módulo de Comunicação

Este é o módulo de comunicação do sistema Edunexia, responsável por gerenciar conversas, grupos, notificações e outras funcionalidades relacionadas à comunicação.

## Funcionalidades

- Autenticação de usuários
- Gerenciamento de grupos
- Configuração de notificações
- Conversas em tempo real
- Respostas rápidas
- Campanhas de comunicação
- Gestão de leads

## Tecnologias Utilizadas

- React
- TypeScript
- Ant Design
- Tailwind CSS
- Supabase
- React Router
- Jest
- Testing Library

## Pré-requisitos

- Node.js 16.x ou superior
- npm ou yarn
- Conta no Supabase

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
4. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm start
# ou
yarn start
```

## Testes

Para executar os testes:

```bash
npm test
# ou
yarn test
```

## Build

Para criar uma build de produção:

```bash
npm run build
# ou
yarn build
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── hooks/         # Hooks personalizados
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e APIs
  ├── types/         # Definições de tipos
  ├── utils/         # Funções utilitárias
  ├── routes.tsx     # Configuração de rotas
  └── index.tsx      # Ponto de entrada
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

# README TÉCNICO - Módulo de Comunicação da Plataforma Edunéxia

## 📌 Visão Geral

> **🎨 Paleta de Cores e Design:**
> O módulo usará uma paleta de cores leve, moderna e amigável, com tons de azul claro, cinza suave e branco predominante, com detalhes em verde menta e lilás claro para feedbacks positivos e alertas sutis.
> 
> Todos os componentes seguem o design system global (`packages/ui-components`), com foco em acessibilidade, responsividade e clareza visual. Utilizaremos TailwindCSS com classes utilitárias e componentes reutilizáveis como:
> - Botões com animações suaves
> - Cards de conversas e leads
> - Inputs com ícones integrados
> - Avatares, chips, tooltips, badges
> - Modais, dropdowns e tabs modernos

> **🖥️ Interface Inspirada no Chatwoot:**
> A estrutura visual segue o padrão moderno de CRMs omnichannel, com menu lateral, painel principal de conversas e painel de detalhes do contato.

> **🗂️ Organização do Código:**
> Este módulo integra o monorepo da plataforma Edunéxia, que utiliza Yarn Workspaces. Isso garante compartilhamento de bibliotecas, padronização de estrutura e integração escalável entre os módulos.

O Módulo de Comunicação centraliza todas as interações entre instituição, leads, alunos e parceiros. Atua como hub de relacionamento com suporte a IA, mensagens, campanhas e CRM visual.

## ⚙️ Tecnologias Utilizadas
- **React + TypeScript** (Frontend)
- **Supabase** (Banco de dados e autenticação)
- **TailwindCSS** (Estilização)
- **Vite** (Dev server e build)
- **Yarn Workspaces** (Monorepo e compartilhamento de pacotes)

## 📁 Estrutura do Projeto
```bash
apps/comunicacao/
├── src/
│   ├── components/        # Componentes locais do módulo
│   ├── pages/             # Páginas específicas de rotas
│   ├── hooks/             # Hooks locais
│   ├── services/          # Lógicas de chamada de APIs
│   └── types/             # Tipagens exclusivas
├── public/
├── index.html
├── package.json
└── tsconfig.json
```

### 🔗 Pacotes Compartilhados
- `packages/auth`: autenticação centralizada (SSO)
- `packages/ui-components`: design system global reutilizável
- `packages/api-client`: cliente HTTP centralizado com Supabase
- `packages/utils`: funções auxiliares reutilizáveis

## 🔐 Perfis e Permissões
| Perfil de Usuário        | Acesso ao Módulo de Comunicação                |
|--------------------------|------------------------------------------------|
| `super_admin`            | Acesso total                                   |
| `admin_instituicao`      | Acesso total                                   |
| `consultor_comercial`    | CRM, mensagens e matrícula                     |
| `tutor`                  | Envio de mensagens aos alunos                  |

## 🔌 Integrações com Outros Módulos
- **Matrículas**: botão "Matricular Lead" no CRM
- **Portal do Aluno**: envio de notificações internas
- **Financeiro**: envio de alertas de cobrança
- **Supabase**: banco e sessão compartilhados entre todos os módulos

## 🧠 Funcionalidades Principais
- 📤 Notificações: push, WhatsApp, e-mail
- 🤖 IA para atendimento automatizado
- 📊 CRM: filtros e visão Kanban por funil
- 🔁 Histórico de conversas por lead/aluno
- 🎯 Criação e disparo de campanhas segmentadas

## 🧪 Comandos de Desenvolvimento
```bash
yarn dev           # Executa localmente
yarn build         # Build de produção
yarn lint          # Verifica padrões de código
yarn test          # (Futuro) Testes automatizados
```

## 🚧 Roadmap Técnico
- [x] Estrutura inicial
- [ ] Supabase Auth e SSO
- [ ] CRUD de mensagens e campanhas
- [ ] Integração com CRM e matrícula
- [ ] IA para atendimento
- [ ] Integração com canais externos (WhatsApp, e-mail)

## 🧭 Rotas e Páginas do Módulo de Comunicação

### 📂 Sessões
```
/conversas                # Caixa de entrada
/conversas/:id            # Detalhe do atendimento
/leads                    # Tabela de leads
/leads/kanban             # Funil visual (Kanban)
/leads/:id                # Detalhes do lead
/campanhas                # Campanhas existentes
/campanhas/nova           # Nova campanha
/campanhas/:id            # Editar campanha
/respostas-rapidas        # Mensagens prontas
/configuracoes/*          # Todas as configurações gerais
```

> Cada rota corresponde a uma página funcional e bem segmentada, baseada em permissões.

## 💬 Layout da Interface
```
┌────────────────────────────┬────────────────────────────────────────────┬─────────────────────────────┐
│        Menu Lateral        │         Área Principal (Conversas)         │     Painel de Detalhes      │
│ - Conversas                │ - Caixa de entrada                         │ - Dados do Lead/Aluno       │
│ - Leads                    │ - Mensagens + IA                           │ - Histórico de interações   │
│ - Campanhas                │ - Editor de mensagens                      │ - Ações rápidas             │
│ - Respostas Rápidas        │                                            │                             │
│ - Configurações            │                                            │                             │
└────────────────────────────┴────────────────────────────────────────────┴─────────────────────────────┘
```

## 🔄 Fluxo de Mensagens
```
Usuário inicia conversa
↓
Mensagem registrada no Supabase
↓
Visualização em tempo real para atendente
↓
Resposta via operador ou IA
↓
Envio por e-mail, WhatsApp ou notificação
↓
Histórico salvo no CRM e perfil do aluno
```

## 🗂️ Mini CRM: Visão Lista e Kanban
```
┌────────────┬────────────────────────────────────────────────────┐
│ Filtros     │ Leads (Tabela)                                     │
│ - Status    │ João A.  | joao@ | (xx) | Campanha X               │
│ - Canal     │ Maria B. | maria@| (xx) | Nova mensagem            │
└─────────────┴────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Kanban por Funil                             │
├────────────┬────────────┬────────────┬────────────┬─────────┤
│ Captado    │ Qualificado│ Contato    │ Negociação │ Fechado │
│ João A.    │ Maria B.   │ Pedro C.   │            │         │
└────────────┴────────────┴────────────┴────────────┴─────────┘
```

## 📊 Produtividade e Monitoramento

### Sessão Automática
- Logout após 10 min sem interação
- Inatividade detectada por ausência de eventos (clique, rolagem, digitação)

### Indicadores por Colaborador
- Atendimentos diários e acumulados
- Tempo médio de resposta
- Tempo efetivo logado

## 🛠️ Configurações Gerais

Rotas dedicadas para cada item de configuração:
```
/configuracoes/perfil
/configuracoes/notificacoes
/configuracoes/usuarios
/configuracoes/permissoes
/configuracoes/grupos
/configuracoes/campos-personalizados
/configuracoes/frases-rapidas
/configuracoes/tags
/configuracoes/horarios
/configuracoes/base-conhecimento
/configuracoes/atribuicao-automatica
/configuracoes/automacoes
/configuracoes/cenarios
/configuracoes/bot
/configuracoes/funil
/configuracoes/produtos
/configuracoes/widget
/configuracoes/canais
/configuracoes/integracoes
/configuracoes/auditoria
```

Cada rota conterá um painel com:
- Formulários validados
- Persistência no Supabase
- Visibilidade por função
- Uso de componentes compartilhados

### Itens Configuráveis
- Perfis e permissões
- Grupos, setores e responsáveis
- Base de conhecimento da IA
- Canais externos (WhatsApp, e-mail, etc.)
- Produtos e categorias de curso
- Frases rápidas, tags e campos extras
- Horários e automações

## 🧾 Wireframe da Área de Configurações
```
┌────────────── Configurações ──────────────┐
│ Perfil                                     │
│ Notificações                               │
├────────────── Ambiente ──────────────┤
│ Membros, Permissões, Grupos                │
│ Campos Personalizados, Frases Rápidas     │
│ Tags, Horários, Base de Conhecimento      │
│ Atribuição, Automações, Cenários          │
│ Bot, Funis, Produtos, Widget, Canais       │
│ Integrações, Auditoria                    │
└────────────────────────────────────────────┘
```

## 📄 Documentação Complementar
> Este módulo integra-se ao monorepo da Edunéxia. Consulte o [README Técnico Principal](../../README.md) para mais informações sobre estrutura, autenticação e bibliotecas compartilhadas.

---

Este módulo será um dos pilares da experiência do aluno e da força de vendas da instituição. Com ele, garantimos uma comunicação centralizada, inteligente e automatizada entre todos os envolvidos no ecossistema EAD da Edunéxia. 