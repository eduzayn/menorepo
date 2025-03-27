# Módulo de Comunicação

Este é o módulo de comunicação integrado, que permite gerenciar conversas, mensagens e interações com usuários através de diferentes canais.

## Funcionalidades

- Lista de conversas com busca e filtros
- Chat em tempo real com suporte a diferentes tipos de mensagens
- Respostas rápidas pré-definidas
- Suporte a múltiplos canais (chat, email, SMS, WhatsApp)
- Notificações e indicadores de status
- Integração com Supabase para persistência e tempo real
- Videochamadas em tempo real com WebRTC
- Compartilhamento de tela durante videochamadas
- Notificações sonoras para mensagens e chamadas
- Configurações personalizáveis para notificações e comportamento do aplicativo
- Sistema de CRM com gerenciamento de leads
- Automações e cenários de atendimento personalizáveis

## Pré-requisitos

- Node.js 18+
- Yarn ou pnpm (utilizado para gerenciamento de workspaces)
- Conta no Supabase

## Instalação

1. Todas as dependências são gerenciadas através do monorepo
2. Instale as dependências na raiz do projeto:
   ```bash
   pnpm install
   ```
3. Configure as variáveis do Supabase no arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
pnpm --filter @edunexia/comunicacao dev
```

## Build

Para gerar o build de produção:

```bash
pnpm --filter @edunexia/comunicacao build
```

## Testes

Para executar os testes:

```bash
pnpm --filter @edunexia/comunicacao test
```

## Estrutura do Projeto

```
apps/comunicacao/
├── src/
│   ├── components/    # Componentes React específicos do módulo
│   │   ├── chat/      # Componentes de chat
│   │   ├── grupos/    # Componentes de gerenciamento de grupos
│   │   ├── layout/    # Componentes de layout
│   │   ├── ui/        # Componentes de UI básicos
│   │   └── ...        # Outros componentes organizados por contexto
│   ├── contexts/      # Contextos React para estado global
│   ├── hooks/         # Hooks personalizados
│   ├── lib/           # Configurações e utilitários
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços e integrações com APIs
│   ├── styles/        # Estilos específicos do módulo
│   ├── types/         # Tipos TypeScript
│   ├── utils/         # Funções utilitárias
│   ├── App.tsx        # Componente principal do aplicativo
│   ├── env.d.ts       # Definições de tipos para variáveis de ambiente
│   ├── index.css      # Estilos globais
│   ├── index.tsx      # Ponto de entrada do módulo
│   ├── main.tsx       # Configuração principal do React
│   ├── routes.tsx     # Definição de rotas do módulo
│   ├── setupTests.ts  # Configuração para testes
│   └── styles.css     # Estilos adicionais
├── public/            # Arquivos estáticos
├── index.html         # HTML principal
├── package.json       # Dependências específicas do módulo
└── README.md          # Esta documentação
```

## Tecnologias Utilizadas

- React
- TypeScript
- Next.js
- Tailwind CSS
- Supabase
- React Query
- WebRTC para videochamadas e compartilhamento de tela
- Integração com o core através de @edunexia/core
- Componentes de UI do @edunexia/ui-components
- Autenticação via @edunexia/auth
- API Client via @edunexia/api-client

## Integração com o Monorepo

Este módulo faz parte do monorepo Edunéxia e segue a estrutura padronizada:

- Utiliza componentes compartilhados do pacote ui-components
- Integra-se com o módulo core para layouts e comportamentos comuns
- Compartilha autenticação com outros módulos através do pacote auth
- Utiliza o cliente API unificado através do api-client

## Contribuição

1. Siga o padrão de commit da Edunéxia: `tipo(módulo): descrição da alteração`
2. Teste suas alterações localmente antes de enviar
3. Garanta que não está duplicando componentes ou funcionalidades já existentes
4. Utilize o core e os componentes compartilhados sempre que possível

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Documentação Complementar

Para mais informações sobre a integração deste módulo com o restante da plataforma Edunéxia, consulte o [README Principal](../../README.md) do monorepo.

## Notas de Padronização

Este módulo foi padronizado para seguir as convenções do monorepo Edunéxia:

1. Nome do pacote: `@edunexia/comunicacao`
2. Estrutura de diretórios alinhada com o padrão do projeto
3. Importação e utilização dos pacotes compartilhados
4. Dependências atualizadas para a versão mais recente do monorepo

Caso encontre divergências ou tenha sugestões, por favor, abra uma issue no repositório principal.

## Notas de Integração

O módulo de Material Didático foi movido para `apps/material-didatico/` na raiz do monorepo para melhor organização e separação de responsabilidades. A migração foi concluída com sucesso, e todas as funcionalidades do módulo agora estão disponíveis na nova localização.

## Recursos Avançados

### Videochamadas e Compartilhamento de Tela

O módulo de comunicação suporta videochamadas em tempo real entre usuários, utilizando WebRTC para uma comunicação ponto a ponto segura e eficiente.

**Recursos de Videochamada:**
- Iniciar e receber chamadas diretamente da interface de chat
- Controles para ativar/desativar câmera e microfone
- Indicador de status de chamada
- Notificações sonoras para chamadas recebidas
- Exibição em tela cheia
- Compartilhamento de tela durante as chamadas

**Como usar o compartilhamento de tela:**
1. Durante uma videochamada ativa, clique no ícone de monitor
2. Selecione a tela ou aplicativo que deseja compartilhar
3. Para interromper o compartilhamento, clique novamente no ícone de monitor

**Implementação técnica:**
- Utiliza WebRTC para comunicação ponto a ponto
- Sinalização via canais do Supabase
- Fallback para servidores STUN públicos
- Troca segura de streams de mídia

### Sistema de CRM

O módulo inclui um sistema completo de CRM (Customer Relationship Management) para gerenciamento de leads e oportunidades de negócio.

**Recursos de CRM:**
- Visualização de leads em formato Kanban ou tabela
- Pipeline de oportunidades com arrastar e soltar
- Sistema de pontuação de leads (lead scoring)
- Histórico de interações com leads
- Segmentação de leads por critérios personalizados
- Relatórios de conversão e desempenho
- Atribuição de responsáveis e acompanhamento

**Gerenciamento de leads:**
- Cadastro e atualização de informações
- Classificação por status (novo, em contato, qualificado, etc.)
- Tags e campos personalizados
- Histórico completo de atividades
- Visualização de métricas e indicadores

### Automações e Cenários de Atendimento

O sistema permite criar automações baseadas em regras para executar ações automáticas com base em eventos e condições.

**Recursos de automação:**
- Interface para criação e gerenciamento de cenários
- Múltiplos gatilhos como criação de lead, mudança de status, etc.
- Condições personalizáveis baseadas em atributos dos leads
- Ações automáticas como envio de e-mails, SMS, criação de tarefas
- Execução em tempo real ou agendada
- Métricas de desempenho das automações

**Como criar uma automação:**
1. Acesse a seção de Automações na página de um lead ou no menu CRM
2. Clique em "Nova Automação"
3. Configure o gatilho, condições e ações desejadas
4. Ative a automação para que ela comece a funcionar 