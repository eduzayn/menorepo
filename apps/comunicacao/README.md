# Edunexia - Módulo de Comunicação

Este é o módulo de comunicação do sistema Edunexia, responsável por gerenciar conversas, grupos, notificações e outras funcionalidades relacionadas à comunicação.

## Funcionalidades

- Autenticação de usuários
- Gerenciamento de grupos
- Configuração de notificações
- Conversas em tempo real
- Respostas rápidas
- Campanhas de comunicação
- Gerenciamento de leads

## Tecnologias Utilizadas

- React
- TypeScript
- Ant Design
- Tailwind CSS
- @supabase/supabase-js (Backend e Autenticação)
- React Router
- Jest
- Testing Library

## Pré-requisitos

- Node.js 18 ou superior
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
4. Configure as credenciais do Supabase no arquivo `.env`

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm start
# ou
yarn start
```

O aplicativo estará disponível em `http://localhost:3000`.

## Testes

Para executar os testes:

```bash
# Executar todos os testes
npm test
# ou
yarn test

# Executar testes em modo watch
npm run test:watch
# ou
yarn test:watch

# Executar testes com cobertura
npm run test:coverage
# ou
yarn test:coverage
```

## Build

Para criar uma build de produção:

```bash
npm run build
# ou
yarn build
```

Para criar uma build de staging:

```bash
npm run build:staging
# ou
yarn build:staging
```

Para analisar o tamanho do bundle:

```bash
npm run build:analyze
# ou
yarn build:analyze
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── hooks/         # Custom hooks
├── pages/         # Páginas da aplicação
├── services/      # Serviços e APIs
├── types/         # Definições de tipos TypeScript
├── utils/         # Funções utilitárias
└── App.tsx        # Componente principal
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Documentação Técnica

Para informações técnicas detalhadas sobre a implementação, arquitetura e integrações, consulte o [README Técnico](TECHNICAL.md). 