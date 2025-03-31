<!-- cSpell:disable -->
# Módulo Site Edunéxia

Módulo responsável pelo site institucional e blog da plataforma Edunéxia. Este módulo inclui gerenciamento de páginas, blog, leads e outras funcionalidades para o site público e administrativo.

## Tecnologias

- React 18+
- TypeScript
- React Query
- TailwindCSS
- Vite
- Supabase

## Funcionalidades

- Gerenciamento de páginas estáticas
- Blog corporativo com categorias
- Captação de leads
- Exibição de depoimentos
- Configurações personalizáveis do site
- Showcases de cursos
- Menu dinâmico
- **Sistema de vendas self-service**

## Instalação e Execução

1. Certifique-se de que está na raiz do monorepo e execute:

```bash
# Instalar dependências (caso ainda não tenha feito)
pnpm install

# Iniciar o módulo em modo de desenvolvimento
pnpm --filter @edunexia/site-edunexia dev
```

2. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Testes
pnpm test
```

## Estrutura de Diretórios

```
src/
├── components/       # Componentes reutilizáveis
│   ├── admin/        # Componentes da área administrativa
│   ├── blog/         # Componentes relacionados ao blog
│   ├── common/       # Componentes comuns (botões, cards, etc.)
│   ├── forms/        # Formulários reutilizáveis
│   ├── layout/       # Componentes de layout (header, footer, etc.)
│   └── sections/     # Seções específicas das páginas
├── contexts/         # Contextos React
├── hooks/            # Hooks personalizados
├── lib/              # Utilitários e configurações
├── pages/            # Páginas da aplicação
│   ├── admin/        # Páginas da área administrativa
│   ├── blog/         # Páginas do blog
│   └── public/       # Páginas públicas
├── services/         # Serviços (API, autenticação, etc.)
├── styles/           # Estilos globais
└── types/            # Definições de tipos TypeScript
```

## Banco de Dados

Este módulo utiliza o Supabase como backend. O esquema do banco de dados inclui:

### Tabelas Principais

- `site_pages`: Páginas estáticas do site
- `site_blog_posts`: Posts do blog
- `site_blog_categories`: Categorias do blog
- `site_leads`: Contatos/leads gerados no site
- `site_testimonials`: Depoimentos de clientes/alunos
- `site_settings`: Configurações gerais do site
- `site_sections`: Seções e banners personalizáveis
- `site_featured_courses`: Cursos em destaque
- `site_menu_items`: Itens do menu do site
- `site_subscriptions`: Assinaturas e testes gratuitos gerados pelo sistema self-service

Para mais detalhes sobre o esquema, consulte a [documentação completa do esquema](/docs/site-edunexia-schema.md).

### Usando o Banco de Dados no Código

Para interagir com o banco de dados, utilize o cliente ApiClient do pacote `@edunexia/api-client`:

```typescript
import { useApiClient } from '@edunexia/api-client';

// No seu componente/hook
const apiClient = useApiClient();

// Exemplo: Buscar páginas publicadas
const fetchPages = async () => {
  const { data, error } = await apiClient.from('site_pages')
    .select('*')
    .eq('status', 'published');
    
  if (error) throw error;
  return data;
};
```

## Tipos TypeScript

Os tipos para as tabelas do banco de dados estão disponíveis em `@edunexia/database-schema`:

```typescript
import { SitePage, SiteBlogPost } from '@edunexia/database-schema';

// Usar os tipos
const renderPage = (page: SitePage) => {
  // ...
};
```

## Fluxos Principais

### Gerenciamento de Páginas

1. Administrador cria/edita páginas na área administrativa
2. As páginas são salvas no Supabase com status (rascunho/publicado)
3. As páginas publicadas ficam disponíveis para visualização no site público

### Blog

1. Administrador cria categorias e posts
2. Posts são salvos com status (rascunho/publicado)
3. Visitantes podem navegar por categorias e ler posts publicados

### Captação de Leads

1. Visitante preenche formulário de contato
2. Lead é salvo no Supabase
3. Administrador pode visualizar e gerenciar leads na área administrativa

### Sistema de Vendas Self-Service

1. Visitante visualiza planos disponíveis na página de planos
2. Escolhe um plano para assinatura imediata ou período de teste gratuito
3. Preenche dados da instituição
4. Para assinatura: fornece dados de pagamento e finaliza compra
5. Para teste gratuito: recebe acesso temporário sem fornecer cartão de crédito
6. Recebe credenciais de acesso por email e pode acessar a plataforma imediatamente
7. Após teste gratuito (14 dias), pode optar por contratar um plano

## Integração com Outros Módulos

- **Módulo de Matrículas**: Encaminhamento de leads para matrícula
- **Módulo de Comunicação**: Envio de leads para o CRM
- **Módulo de Material Didático**: Exibição de previews de cursos

## Autenticação e Segurança

- A autenticação utiliza o pacote `@edunexia/auth`
- Row Level Security (RLS) do Supabase controla o acesso aos dados
- Políticas de segurança garantem que:
  - Visitantes anônimos só veem conteúdo publicado
  - Administradores têm acesso completo à área administrativa

## Deployment

O site é implantado via Vercel com integração contínua:

1. Push para a branch `main` inicia o processo de CI/CD
2. Vercel constrói e implanta automaticamente
3. O site fica disponível em `https://site.edunexia.com`

## Contribuindo

Para contribuir com este módulo, siga as [diretrizes gerais do monorepo](/docs/guia-contribuicao.md) e:

1. Certifique-se de entender o esquema do banco de dados
2. Utilize os componentes do design system em `@edunexia/ui-components`
3. Mantenha a documentação atualizada

## Recursos Adicionais

- [Documentação do Esquema do Banco de Dados](/docs/site-edunexia-schema.md)
- [Guia de Contribuição do Monorepo](/docs/guia-contribuicao.md)
- [Documentação do Design System](/docs/design-system.md)
- [Gerenciamento de Pacotes](/docs/gerenciamento-pacotes.md)

# Edunéxia - Site Institucional

Este módulo contém o site institucional da Edunéxia, desenvolvido para apresentar a plataforma educacional, seus recursos e pacotes oferecidos.

## Visão Geral

O site institucional da Edunéxia apresenta a empresa, seus produtos, serviços e direciona potenciais clientes para os canais de vendas e contato. Ele serve como porta de entrada para o ecossistema Edunéxia.

## Estrutura do Módulo

```
site-edunexia/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas principais do site
│   ├── routes.js        # Configuração de rotas
│   └── assets/          # Recursos estáticos
├── public/              # Arquivos públicos
└── README.md            # Esta documentação
```

## Páginas Principais

- **Home**: Apresenta a visão geral da plataforma com call-to-action para demonstração e conhecer planos
- **Sobre**: Página institucional com informações sobre a empresa, missão e valores
- **Blog**: Artigos de conteúdo sobre educação e tecnologia
- **Contato**: Formulário para contato e lead generation
- **Planos**: Apresenta os três pacotes de módulos disponíveis com seus respectivos preços
- **Checkout**: Fluxo de checkout para assinatura direta dos planos
- **Trial**: Iniciar período de teste gratuito sem necessidade de cartão de crédito

## Módulos do Ecossistema Edunéxia

O site apresenta os seguintes módulos disponíveis na plataforma:

### 1. Sistema de Matrículas (`/matriculas`)
- Automação do processo de matrícula online
- Gestão de documentos digitais
- Integração com sistema financeiro
- Dashboard de acompanhamento
- Relatórios gerenciais

### 2. Portal do Aluno (`/portal-do-aluno`)
- Acesso a notas e boletins
- Comunicação direta com professores
- Conteúdo didático online
- Acompanhamento de frequência
- Emissão de boletos e documentos

### 3. Material Didático (`/material-didatico`)
- Biblioteca digital de conteúdos
- Criação de conteúdo interativo
- Vídeo-aulas integradas
- Avaliações automatizadas
- Análise de desempenho

### 4. Comunicação (`/comunicacao`)
- Comunicados institucionais
- Mensagens direcionadas por turma
- Chat individual com pais e alunos
- Confirmação de leitura
- Notificações por e-mail e SMS

### 5. Gestão Financeira (`/financeiro`)
- Gestão de mensalidades e boletos
- Controle de inadimplência
- Gestão de bolsas e descontos
- Integração com bancos
- Relatórios financeiros detalhados

## Página de Planos

A página de planos detalha as opções de pacotes disponíveis para contratação:

1. **Plano Básico** (R$ 1.499/mês)
   - Inclui os módulos essenciais: Matrículas, Portal do Aluno e Gestão Financeira Básica
   - Ideal para pequenas instituições iniciando sua digitalização

2. **Plano Padrão** (R$ 2.899/mês)
   - Inclui os módulos do plano básico mais: Comunicação Institucional e Material Didático
   - Recomendado para instituições de médio porte

3. **Plano Premium** (R$ 4.799/mês)
   - Acesso a todos os módulos da plataforma
   - Inclui recursos avançados como: Gestão de RH, Portal do Parceiro, Portal do Polo e Contabilidade

Cada plano inclui diferentes níveis de suporte e recursos, com opções para personalização mediante consultoria.

## Sistema de Vendas Self-Service

Conforme planejado no README principal do monorepo, o módulo implementa um sistema de vendas autoatendimento com as seguintes funcionalidades:

- Contratação direta via site sem intervenção da equipe comercial
- Opção de período de teste gratuito de 14 dias
- Integração com gateway de pagamento Asaas
- Suporte a múltiplas formas de pagamento (cartão, boleto, PIX)
- Envio automatizado de credenciais de acesso
- Cancelamento durante período de teste

## Suporte e Documentação

O site também oferece recursos para suporte:

- **Central de Ajuda** (`/pagina/central-de-ajuda`): Base de conhecimento e tutoriais
- **Documentação** (`/pagina/documentacao`): Documentação técnica completa
- **Status do Sistema** (`/pagina/status-do-sistema`): Monitoramento em tempo real da plataforma

## Páginas Institucionais

Além das páginas principais, o site inclui páginas institucionais importantes:

- **Carreiras** (`/pagina/carreiras`): Oportunidades de trabalho na Edunéxia
- **Parceiros** (`/pagina/parceiros`): Programa de parcerias e integrações
- **Política de Privacidade** (`/pagina/privacidade`): Informações sobre uso de dados
- **Termos de Uso** (`/pagina/termos`): Termos e condições de uso da plataforma
- **Cookies** (`/pagina/cookies`): Política de uso de cookies
