# Módulo de Comunicação

Este é o módulo de comunicação integrado, que permite gerenciar conversas, mensagens e interações com usuários através de diferentes canais.

## Funcionalidades

- Lista de conversas com busca e filtros
- Chat em tempo real com suporte a diferentes tipos de mensagens
- Respostas rápidas pré-definidas
- Suporte a múltiplos canais (chat, email, SMS, WhatsApp)
- Notificações e indicadores de status
- Integração com Supabase para persistência e tempo real

## Pré-requisitos

- Node.js 18+
- Yarn (utilizado para gerenciamento de workspaces)
- Conta no Supabase

## Instalação

1. Todas as dependências são gerenciadas através do Yarn Workspaces do monorepo
2. Instale as dependências na raiz do projeto:
   ```bash
   yarn install
   ```
3. Configure as variáveis do Supabase no arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
yarn workspace @edunexia/comunicacao dev
```

## Build

Para gerar o build de produção:

```bash
yarn workspace @edunexia/comunicacao build
```

## Testes

Para executar os testes:

```bash
yarn workspace @edunexia/comunicacao test
```

## Estrutura do Projeto

```
apps/comunicacao/
├── src/
│   ├── components/    # Componentes React específicos do módulo
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
- Tailwind CSS
- Supabase
- Vite
- Vitest
- Integração com o core através de @edunexia/core
- Componentes de UI do @edunexia/ui-components
- Autenticação via @edunexia/auth

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