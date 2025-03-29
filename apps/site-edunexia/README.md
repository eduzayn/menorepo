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
