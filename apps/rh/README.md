<!-- cSpell:disable -->
# Módulo de RH - Edunéxia

Este módulo implementa as funcionalidades de Recursos Humanos da plataforma Edunéxia, permitindo a gestão completa do ciclo de vida dos colaboradores, recrutamento e seleção, e avaliações de desempenho.

## Funcionalidades Principais

- **Gestão de Colaboradores**: Cadastro, edição, visualização e desativação de funcionários
- **Recrutamento e Seleção**: Gerenciamento de vagas, candidatos e processo seletivo
- **Avaliações de Desempenho**: Configuração e acompanhamento de avaliações de colaboradores
- **Dashboard de RH**: Visualização de métricas e KPIs relevantes para o departamento

## Estrutura do Módulo

```
apps/rh/
├── src/
│   ├── components/           # Componentes específicos do módulo
│   │   └── layout/           # Componentes de layout específicos
│   │
│   ├── pages/                # Páginas do módulo
│   │   ├── ColaboradoresPage.tsx        # Lista de colaboradores
│   │   ├── NovoColaboradorPage.tsx      # Cadastro de colaborador
│   │   ├── DetalhesColaboradorPage.tsx  # Detalhes do colaborador
│   │   ├── VagasPage.tsx                # Lista de vagas
│   │   ├── NovaVagaPage.tsx             # Cadastro de vaga
│   │   ├── DetalhesVagaPage.tsx         # Detalhes da vaga
│   │   ├── CandidatosPage.tsx           # Lista de candidatos
│   │   ├── NovoCandidatoPage.tsx        # Cadastro de candidato
│   │   ├── DetalhesCandidatoPage.tsx    # Detalhes do candidato
│   │   ├── AvaliacoesPage.tsx           # Lista de avaliações
│   │   ├── NovaAvaliacaoPage.tsx        # Cadastro de avaliação
│   │   ├── DetalhesAvaliacaoPage.tsx    # Detalhes da avaliação
│   │   ├── ConfiguracoesPage.tsx        # Configurações do módulo
│   │   ├── SocialMediaPage.tsx          # Integração com redes sociais
│   │   └── index.ts                     # Exportações
│   │
│   ├── services/             # Serviços específicos do módulo
│   │   ├── colaboradores-service.ts     # Serviço de colaboradores
│   │   ├── vagas-service.ts             # Serviço de vagas
│   │   ├── candidatos-service.ts        # Serviço de candidatos
│   │   ├── avaliacoes-service.ts        # Serviço de avaliações
│   │   └── index.ts                     # Exportações
│   │
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Ponto de entrada
│   └── routes.tsx            # Definição de rotas do módulo
│
├── package.json
└── README.md                 # Esta documentação
```

## Tecnologias Utilizadas

- **React + TypeScript**: Para construção da interface
- **Vite**: Como bundler e ferramenta de desenvolvimento
- **React Query**: Para gerenciamento de estado e requisições
- **Supabase**: Como backend e banco de dados
- **@edunexia/ui-components**: Para componentes visuais compartilhados
- **@edunexia/auth**: Para autenticação e autorização
- **@edunexia/shared-types**: Para tipos compartilhados entre módulos

## Integração com Outros Módulos

- **Autenticação**: Utiliza o pacote `@edunexia/auth` para autenticação e controle de acesso
- **UI**: Utiliza o pacote `@edunexia/ui-components` para manter consistência visual
- **Tipos**: Utiliza o pacote `@edunexia/shared-types` para tipos compartilhados

## Como Utilizar

### Instalação

Este módulo faz parte do monorepo Edunéxia e deve ser executado dentro desse contexto.

```bash
# Na raiz do monorepo
pnpm install
```

### Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
pnpm --filter @edunexia/rh dev

# Construir para produção
pnpm --filter @edunexia/rh build
```

### Configuração

1. Crie um arquivo `.env.local` na raiz do módulo com as seguintes variáveis:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

## Features Futuras

- Integração com sistema de folha de pagamento
- Gestão de benefícios e vale-transporte
- Controle de férias e licenças
- Emissão de documentos para colaboradores
- Módulo de treinamento e desenvolvimento

## Contribuição

Para contribuir com este módulo, siga as diretrizes de contribuição do monorepo principal. 
