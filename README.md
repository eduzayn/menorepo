# EduNexia

Sistema de comunicação integrado para instituições de ensino.

## Estrutura do Projeto

```
edunexia/
├── apps/
│   └── comunicacao/     # Módulo de comunicação
├── packages/
│   ├── auth/           # Pacote de autenticação
│   ├── database-schema/# Schema do banco de dados
│   └── ui-components/  # Componentes UI compartilhados
└── package.json
```

## Requisitos

- Node.js 18+
- Yarn 4+

## Instalação

```bash
# Instalar dependências
yarn install

# Iniciar o servidor de desenvolvimento
yarn dev
```

## Scripts Disponíveis

- `yarn dev`: Inicia o servidor de desenvolvimento
- `yarn build`: Compila todos os pacotes
- `yarn lint`: Executa a verificação de linting
- `yarn clean`: Limpa os arquivos de build

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Yarn Workspaces
