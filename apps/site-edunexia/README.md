# README TÉCNICO - Site Institucional da Plataforma Edunéxia
## Visão Geral

> ** Objetivo:** Este é o site institucional da Edunéxia, projetado para apresentar a plataforma, suas funcionalidades e planos, permitindo que clientes em potencial conheçam a solução, escolham os módulos desejados e contratem a plataforma diretamente pelo site via autoatendimento.
>

> ** Inspiração de Layout:** O design é inspirado na estrutura do site da Conta Azul ([https://ca.contaazul.com/](https://ca.contaazul.com/)), com seções bem definidas, responsivas e chamadas para ação claras.
>

## ⚙ Tecnologias Utilizadas
- React + TypeScript (Frontend)
- Vite (Build Tool)
- TailwindCSS (Estilização)
- Supabase (Backend, Autenticação e CMS Headless)
- Yarn Workspaces (Monorepo)
- Vercel (Deploy e hospedagem)

##  Integrações com o Monorepo
- **Componentes compartilhados:** Uso do pacote `@edunexia/ui-components`
- **Autenticação unificada:** Uso do módulo `@edunexia/auth`
- **Tipos compartilhados:** Uso do pacote `@edunexia/core-types`
- **Cliente de API comum:** Uso do módulo `@edunexia/api-client`
- **Supabase compartilhado:** Uso do mesmo backend do ecossistema
- **Geração de credenciais:** Após cadastro, cria instância no Supabase
- **Checkout automatizado:** Integração com gateways (Litex, InfinitePay)
- **Acesso imediato à plataforma:** Cria usuário com permissão de `admin_instituicao` no monorepo
- **14 dias de teste gratuito:** Controlado via flag no Supabase + cron job

##  Etapas de Desenvolvimento
### Etapa 1: Estruturação Inicial
- Criar estrutura base do projeto (Vite + TailwindCSS + TypeScript)
- Configurar rotas públicas (Home, Plataforma, Módulos, Planos)
- Criar layout global responsivo com Header, Footer e navegação sticky
- Configurar ThemeContext para suporte a múltiplos tenants

###  Etapa 2: Checkout Automatizado
- Página de planos e seleção de módulos com calculadora em tempo real
- Integração com Litex e InfinitePay (pix, boleto, cartão e recorrência)
- Autenticação social (Google/Microsoft) para simplificar cadastro
- Geração de credenciais e tenant no Supabase
- Registro nas tabelas `instancias`, `clientes`, `checkout_logs`
- Envio automático de e-mail com dados de acesso
- Proposta personalizada para grandes clientes

### Etapa 3: Painel Administrativo Multiempresa
- Área `/admin` com autenticação Supabase Auth
- Supabase como CMS Headless para conteúdo do site
- Gerenciamento de planos, páginas, temas e configurações
- Editor visual para textos, cores, fontes, imagens e seções
- Escolha de subdomínio ou domínio próprio (white-label)
- Analytics de conversão e uso

###  Etapa 4: Temas e Personalização
- Sistema de temas visuais por tenant
- Alteração de logotipo, esquema de cores, fontes e menus
- Templates editáveis por categoria (educação básica, superior, cursos livres)
- Suporte nativo a múltiplos idiomas (português, inglês, espanhol)

### Etapa 5: Otimização e Conteúdo
- SEO otimizado para Google e redes sociais
- Página de blog integrada (Notícias, Dicas, Atualizações)
- Páginas de FAQ e Suporte com busca
- Assistente IA para demonstração de funcionalidades
- Testes finais de responsividade e segurança

### Etapa 6: Publicação e Monitoramento
- Deploy contínuo na Vercel com domínio principal e tenants
- Criação automática de subdomínios
- Integração com ferramentas de monitoramento como Vercel Analytics e LogSnag
- Métricas de conversão, uso de trial e retenção de clientes

## Estrutura de Páginas do Site
### Páginas Públicas
- `/` → Home
- `/plataforma` → Apresentação geral
- `/modulos` → Listagem dos módulos reais da plataforma:
    - Comunicação com Alunos
    - Matrículas
    - Portal do Aluno
    - Portal do Professor
    - Material Didático
    - RH e Equipe
    - Financeiro Empresarial
    - Contabilidade
    - Portal do Polo
    - Portal do Parceiro
    - Analytics (Relatórios)
    - Site White Label

- `/planos` → Tabela comparativa entre planos:
    - **Básico:** Portal do Aluno, Matrículas, Financeiro
    - **Pro:** Tudo do Básico + Comunicação, Professor, Biblioteca, Suporte IA
    - **Master:** Tudo do Pro + Portal do Parceiro, Polo, Relatórios e site white-label com painel de edição visual

- `/ajuda` → FAQ, documentação e suporte
- `/blog` → Posts institucionais
- `/login` → Acesso à plataforma (redireciona por tenant)
- `/demonstracao` → Demonstração guiada por IA

##  Estrutura do Projeto
``` bash
apps/site-edunexia/
├── src/
│   ├── pages/             # Páginas do site
│   ├── components/        # Componentes reutilizáveis
│   ├── sections/          # Seções de página (Hero, Features, etc)
│   ├── layouts/           # Layouts de página
│   ├── hooks/             # Custom hooks
│   ├── services/          # Serviços e chamadas de API
│   ├── lib/               # Utilitários e helpers
│   ├── types/             # Definições de tipos
│   ├── utils/             # Funções utilitárias
│   ├── context/           # Contextos React (tema, auth, etc)
│   └── styles/            # Estilos globais
├── public/                # Arquivos estáticos
├── package.json           # Dependências do módulo
├── tailwind.config.js     # Configuração do TailwindCSS
├── tsconfig.json          # Configuração TypeScript
├── vite.config.ts         # Configuração do Vite
└── README.md              # Documentação específica
```
## Administração do Site (Multiempresa)
- Supabase como CMS Headless para conteúdo do site
- Admins podem editar conteúdo do site pelo painel `/admin`
- Cada instituição contratante terá seu próprio painel white-label
- Editor visual para edição sem programação (estilo Wix/Framer)
- Configurações salvas por tenant
- Controle de seções ativas/inativas
- Acesso via Supabase com permissão `admin_instituicao`
- Dashboard com métricas de conversão e uso

## Segurança
- Controle por JWT e Supabase RLS
- Isolamento de dados por tenant através de Row Level Security
- Cada tenant isola seu conteúdo
- Dados sensíveis criptografados (como credenciais de gateway)
- Autenticação social com Google e Microsoft
- Testes regulares de segurança

##  Internacionalização
- Site preparado desde o início para múltiplos idiomas (i18n)
- Suporte nativo a português, inglês e espanhol
- Conteúdo adaptável por região
- Moedas locais nos planos de preço

##  Analytics e Métricas
- Integração com Vercel Analytics
- Funil de conversão de visitante para cliente
- Métricas de uso de trials
- Taxa de conversão de trials para pagantes
- Monitoramento de churn e retenção
- Alertas personalizados via LogSnag

## Integração CI/CD
- Deploy automatizado via GitHub Actions
- Preview deployments para PRs
- Testes automatizados
- Versionamento semântico

Com esse módulo, a Edunéxia disponibiliza um site institucional completo, pronto para apresentar e vender a plataforma de forma moderna, automática e adaptável ao crescimento de cada cliente. O site é otimizado para conversão, oferece experiência personalizada para cada visitante e se integra perfeitamente ao ecossistema Edunéxia através da arquitetura de monorepo.
