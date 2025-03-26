# README TÉCNICO - Integração Modular com Monorepo na Plataforma Edunéxia

## Visão Geral
Este documento apresenta a arquitetura e estratégia de integração dos módulos da plataforma Edunéxia, utilizando a abordagem **Monorepo com Workspaces**, com base nas tecnologias **Node.js, TypeScript e React**. O objetivo é centralizar todos os módulos da plataforma em um único repositório, mantendo autonomia de desenvolvimento, padronização de ferramentas e facilidade de integração.

## O que é Monorepo com Workspaces?
- **Monorepo** é uma abordagem onde todos os projetos (módulos) coexistem dentro de um único repositório Git.
- **Workspaces** permitem tratar cada módulo como um pacote isolado, com suas próprias dependências e scripts, mas compartilhando configurações e bibliotecas comuns.
- Utilizaremos o **Yarn Workspaces** como gerenciador principal, com possibilidade futura de integração com **Turborepo** para otimização de builds.

## Arquitetura Técnica da Plataforma
- **Backend**: Todos os módulos utilizam o **Supabase** como backend e banco de dados. O banco é único e compartilhado por toda a plataforma, garantindo integridade e consistência dos dados.
- **Frontend**: As aplicações front-end dos módulos serão hospedadas na **Vercel**, permitindo implantação rápida, escalável e com integração contínua via Git.

## Estrutura Modular do Monorepo
```bash
edunexia-monorepo/
├── apps/
│   ├── material-didatico/
│   ├── matriculas/
│   ├── portal-do-aluno/
│   ├── comunicacao/
│   ├── financeiro-empresarial/
│   ├── portal-parceiro/
│   ├── portal-polo/
│   ├── rh/
│   ├── contabilidade/
│   ├── site-vendas/           # Site de apresentação e vendas self-service e whitelabel
│   ├── core/                  # Módulo central com componentes, hooks e utilitários compartilhados
│   ├── module-example/        # Módulo de exemplo funcional para referência de desenvolvedores
│   └── module-template/       # Template para a criação de novos módulos
├── packages/
│   ├── ui-components/         # Design System compartilhado
│   ├── auth/                  # Autenticação unificada (SSO)
│   ├── database-schema/       # Tipos e schemas do banco de dados
│   └── api-client/            # Cliente de API unificado para comunicação com o backend
├── docs/                      # Documentação técnica detalhada
│   ├── arquitetura/           # Detalhes arquiteturais
│   ├── workflows/             # Fluxos de trabalho e processos
│   └── guidelines/            # Diretrizes e melhores práticas
├── .gitignore
├── package.json               # Define os workspaces do Yarn
├── tsconfig.json              # Configuração TypeScript compartilhada
├── CHANGELOG.md               # Registro de alterações significativas
└── README.md                  # Este documento
```

## Estado Atual do Desenvolvimento

### Módulos em Desenvolvimento Ativo
Os seguintes módulos estão atualmente em desenvolvimento ativo:
- ✅ **core** - Base arquitetural e componentes compartilhados
- ✅ **portal-do-aluno** - Interface do estudante com features de documentos e notificações
- ✅ **material-didatico** - Editor e visualizador de conteúdo didático
- ✅ **financeiro-empresarial** - Gestão financeira institucional
- ✅ **comunicacao** - Mensageria, notificações e CRM
- ✅ **matriculas** - Processo de inscrição e matrícula

### Pacotes Compartilhados Implementados
- ✅ **ui-components** - Sistema de design unificado
- ✅ **api-client** - Cliente padronizado para interação com o backend
- ✅ **auth** - Sistema centralizado de autenticação
- ✅ **database-schema** - Definições de tipos e modelos de dados

## Módulos Especiais e Infraestrutura

### Module-Example e Module-Template
Estes módulos servem como **referência e ponto de partida** para o desenvolvimento de novos módulos:

- **module-example**: Um módulo funcional completo com todas as práticas recomendadas implementadas, servindo como exemplo prático para consulta durante o desenvolvimento. Contém implementações reais de hooks, contexts, componentes e serviços seguindo os padrões do projeto.

- **module-template**: Um esqueleto inicial para a criação de novos módulos, contendo a estrutura de diretórios e arquivos básicos. Deve ser copiado ao iniciar um novo módulo para garantir que a estrutura padrão seja seguida.

### Módulo Core
O módulo **core** desempenha um papel fundamental na arquitetura da plataforma:

- Centraliza componentes de layout, hooks e utilitários compartilhados entre todos os módulos
- Fornece contextos globais para autenticação, navegação e notificações
- Implementa abstrações para operações comuns como chamadas de API e gerenciamento de estado
- Define padrões arquiteturais para garantir consistência em toda a plataforma
- Unifica a experiência do usuário entre diferentes módulos

Todos os módulos devem importar e utilizar o `core` para manter a consistência da experiência e evitar duplicação de código.

## Modelo de Comercialização da Plataforma
A Edunéxia será oferecida como uma **plataforma modular** para instituições de Educação a Distância (EAD), especialmente **faculdades, centros universitários e universidades**. A proposta comercial é flexível e escalável:

### Planos Personalizados por Tamanho da Instituição
- **Instituições pequenas** poderão adquirir apenas os módulos essenciais, como:
  - Módulo de Comunicação
  - Módulo de Matrículas
  - Portal do Aluno

- **Instituições maiores** poderão adquirir módulos adicionais para uma gestão mais eficiente e completa:
  - Financeiro Empresarial
  - Portal do Polo
  - Portal do Parceiro
  - Gestão de RH
  - Contabilidade
  - Material Didático (Editor Inteligente)

### Sistema de Vendas Autoatendimento
Será desenvolvido um **site de vendas independente (`site-vendas`)**, totalmente integrado ao ecossistema, com as seguintes funcionalidades:
- Catálogo de módulos disponíveis.
- Simulação de planos conforme escolha dos módulos.
- Cadastro automático da instituição.
- Pagamento on-line (via gateway).
- Acesso imediato por e-mail após confirmação.
- **Período de testes gratuitos de 14 dias** para novos clientes.

Este modelo permite que as instituições realizem a contratação sem depender de equipe de vendas, facilitando a escalabilidade do negócio.

## Estrutura Padrão dos Módulos
Todos os módulos devem seguir rigorosamente a seguinte estrutura padronizada:

```
apps/nome-do-modulo/
├── src/
│   ├── components/           # Componentes específicos do módulo
│   │   └── index.ts         
│   │
│   ├── contexts/             # Contextos específicos (se necessário)
│   │   └── index.ts
│   │
│   ├── hooks/                # Hooks específicos do módulo
│   │   └── index.ts
│   │
│   ├── pages/                # Páginas do módulo
│   │   └── index.ts
│   │
│   ├── services/             # Serviços específicos do módulo
│   │   └── index.ts
│   │
│   ├── utils/                # Utilitários específicos do módulo
│   │   └── index.ts
│   │
│   ├── types/                # Tipos e interfaces
│   │   └── index.ts
│   │
│   ├── routes.tsx            # Definição de rotas do módulo
│   └── index.tsx             # Ponto de entrada
│
├── package.json
└── README.md                 # Documentação específica
```

O cumprimento desta estrutura garante consistência e facilita a navegação entre módulos para todos os desenvolvedores do projeto.

## Diretrizes de Contribuição

### Convenções de Código e Commits
- **Commits**: Use commits semânticos no formato `tipo(escopo): descrição`, por exemplo:
  - `feat(portal-aluno): implementa sistema de notificações`
  - `fix(financeiro): corrige cálculo de juros em boletos atrasados`
  - `docs(readme): atualiza instruções de instalação`

- **Branches**: Trabalhe diretamente na branch principal (`main`) para módulos individuais, criando branches apenas para features complexas.

- **Code Style**: Siga as regras definidas no ESLint e Prettier do projeto.

### Documentação
- **README do módulo**: Mantenha atualizado com:
  - Visão geral e propósito
  - Funcionalidades implementadas
  - Estrutura específica
  - Integrações com outros módulos
  
- **JSDoc**: Documente todas as funções públicas, hooks, contexts e componentes principais.

### Desenvolvimento
- Reuse componentes do **ui-components** sempre que possível
- Utilize o cliente **api-client** para todas as chamadas ao backend
- Implemente testes para todos os novos componentes e lógica de negócio

## Estratégia de Integração
1. Criação da estrutura base do monorepo com Yarn Workspaces. ✅
2. Desenvolvimento de cada módulo como um workspace em `apps/`. ✅
3. Criação de bibliotecas reutilizáveis em `packages/` (ex: autenticação, design system, API). ✅
4. Configuração de SSO (Single Sign-On) e compartilhamento de sessões. 🔄
5. Padronização de ferramentas de desenvolvimento: ESLint, Prettier, Husky, Vite, etc. ✅

## Considerações Técnicas
- Gerenciamento de pacotes via `Yarn Workspaces` ✅
- Integração contínua com CI/CD baseada em ramificações por módulo 🔄
- Autenticação JWT com SSO centralizado (em `packages/auth`) ✅
- Compartilhamento de componentes em `ui-components` ✅
- Uso de TypeScript em todos os módulos e bibliotecas ✅
- Integração com gateway de pagamento no módulo `site-vendas` 🔄
- Geração automática de credenciais e e-mails transacionais 🔄
- Backend unificado no Supabase para todos os módulos usando `@supabase/supabase-js` ✅
- Deploy do frontend via Vercel com integrações automáticas 🔄
- Tipos e schemas centralizados em `database-schema` ✅
- Cliente de API unificado em `api-client` para padronização de chamadas ao backend ✅

## Próximos Passos

### Curto Prazo (1-3 meses)
- Finalizar a implementação das funcionalidades básicas dos módulos prioritários
- Integrar completamente o sistema de autenticação centralizada
- Implementar pipeline de CI/CD para todos os módulos

### Médio Prazo (3-6 meses)
- Desenvolver módulos secundários (portal-parceiro, portal-polo)
- Implementar o módulo de vendas self-service
- Iniciar testes de integração entre todos os módulos

### Longo Prazo (6-12 meses)
- Completar a implementação de todos os módulos
- Realizar testes de carga e otimizações de performance
- Preparar documentação para parceiros e integradores

---

Com essa estrutura, a Edunéxia evolui para um ecossistema educacional escalável, modular e tecnicamente moderno, pronto para atender instituições de EAD de diferentes portes e necessidades, com possibilidade de contratação automatizada por meio do site.

> **Nota:** Para informações detalhadas sobre cada módulo, consulte o README específico dentro da pasta do módulo correspondente.
> 
> Para detalhes técnicos mais aprofundados, consulte a documentação em `/docs`.
