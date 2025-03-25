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
│   └── site-vendas/               # Novo módulo: Site de apresentação e vendas self-service e whitelabel
├── packages/
│   ├── ui-components/       # Design System compartilhado
│   ├── auth/                # Autenticação unificada (SSO)
│   └── database-schema/     # Tipos e schemas do banco de dados
├── .gitignore
├── package.json             # Define os workspaces do Yarn
├── tsconfig.json            # Configuração TypeScript compartilhada
└── README.md
```

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

## Módulos a Desenvolver
Como o projeto será iniciado do zero, todos os módulos abaixo estão em planejamento e desenvolvimento:
- **material-didatico**: Criação de cursos, organização de conteúdos e e-books inteligentes.
- **matriculas**: Cadastro de cursos, planos e fluxo de inscrição.
- **portal-do-aluno**: Acesso ao ambiente acadêmico, documentos e certificados.
- **comunicacao**: Envio de mensagens, notificações, e integração com WhatsApp e chat com IA.
- **financeiro-empresarial**: Controle de contas, emissão de boletos e fluxo de caixa.
- **portal-parceiro**: Visão administrativa e de desempenho para parceiros comerciais.
- **portal-polo**: Gestão pedagógica e operacional dos polos educacionais.
- **rh**: Gerenciamento de colaboradores, produtividade e relatórios.
- **contabilidade**: Relatórios fiscais, balanços e integração com contadores externos.
- **site-vendas**: Site de apresentação e marketing self-service da plataforma.

## Estratégia de Integração
1. Criação da estrutura base do monorepo com Yarn Workspaces.
2. Desenvolvimento de cada módulo como um workspace em `apps/`.
3. Criação de bibliotecas reutilizáveis em `packages/` (ex: autenticação, design system, API).
4. Configuração de SSO (Single Sign-On) e compartilhamento de sessões.
5. Padronização de ferramentas de desenvolvimento: ESLint, Prettier, Husky, Vite, etc.

## Benefícios Esperados
- Desenvolvimento simultâneo de múltiplos módulos.
- Compartilhamento fácil de código entre os sistemas.
- Redução de retrabalho e inconsistências.
- Deploys independentes com controle centralizado.
- Escalabilidade para inclusão de novos módulos com baixo custo técnico.
- Venda automatizada e escalável para instituições EAD.
- Integração total entre frontend na Vercel e backend no Supabase.

## Organograma Expandido do Ecossistema Edunéxia
```
                              [ Interface Principal da Plataforma ]
                                               |
  --------------------------------------------------------------------------------------------------------------
      |                          |                        |                        |                           |
[ Material Didático ]      [ Matrículas ]     [ Portal do Aluno ]         [ Comunicação ]         [ Módulos Avançados ]
[ IA Vídeo Generator]                                                     |                       -----------------------------
[ Gestão de Planos ]       [ Área Acadêmica ]   [ Chat, Feed IA ]         [ Notificações ]       | Financeiro Empresarial |
[ E-books e Conteúdo ]     [ Vinculação com    ]  [ Boletim, Docs ]       [ WhatsApp, e-mails ]  | Portal do Parceiro     |
                           [ Material Didático ]  [ Certificados ]                              | Portal do Polo          |
                                                   [ Tutoria ]                                   | Gestão de RH            |
                                                                                                 | Contabilidade           |
                                                                                                 | Site de Vendas          |
```

## Considerações Técnicas
- Gerenciamento de pacotes via `Yarn Workspaces`
- Integração contínua com CI/CD baseada em ramificações por módulo
- Autenticação JWT com SSO centralizado (em `packages/auth`)
- Compartilhamento de componentes em `ui-components`
- Uso de TypeScript em todos os módulos e bibliotecas
- Integração com gateway de pagamento no módulo `site-vendas`
- Geração automática de credenciais e e-mails transacionais
- Backend unificado no Supabase para todos os módulos usando `@supabase/supabase-js`
- Deploy do frontend via Vercel com integrações automáticas
- Tipos e schemas centralizados em `database-schema`

## Próximos Passos
- Criar a estrutura base do monorepo no GitHub.
- Desenvolver os módulos prioritários a partir de `apps/` e `packages/`.
- Padronizar dependências e criar bibliotecas compartilhadas.
- Desenvolver o módulo de vendas self-service com período de testes gratuitos.
- Iniciar testes de integração entre módulos.

---

Com essa estrutura, a Edunéxia evolui para um ecossistema educacional escalável, modular e tecnicamente moderno, pronto para atender instituições de EAD de diferentes portes e necessidades, com possibilidade de contratação automatizada por meio do site.
