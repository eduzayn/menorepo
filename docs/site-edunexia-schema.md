# Esquema de Banco de Dados: Site Edunéxia

Este documento descreve o esquema de banco de dados para o módulo `site-edunexia`, responsável por gerenciar o site institucional e blog da plataforma Edunéxia.

## Visão Geral

O banco de dados do módulo Site Edunéxia é composto por múltiplas tabelas projetadas para suportar:

- Páginas de conteúdo
- Blog com categorias
- Sistema de leads/contatos
- Depoimentos/testemunhos
- Configurações do site
- Banners e seções personalizáveis
- Cursos em destaque
- Estrutura de menu

## Diagrama ER

```
site_pages <-- site_menu_items
    ^
    |
    v
site_blog_posts <--> site_blog_categories
    ^
    |
    v
site_leads
    ^
    |
    v
site_testimonials
    ^
    |
    v
site_settings
    ^
    |
    v
site_sections
    ^
    |
    v
site_featured_courses
```

## Tipos Enumerados

### page_status
- `published`: Conteúdo publicado e visível publicamente
- `draft`: Conteúdo em rascunho, não visível publicamente
- `archived`: Conteúdo arquivado, não visível publicamente

## Tabelas

### site_pages

Armazena as páginas estáticas do site.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único primário |
| slug | VARCHAR(255) | URL amigável única para a página |
| title | VARCHAR(255) | Título da página |
| content | JSONB | Conteúdo estruturado da página |
| meta_description | TEXT | Descrição para SEO |
| meta_keywords | TEXT | Palavras-chave para SEO |
| status | page_status | Status da página (published, draft, archived) |
| featured_image_url | TEXT | URL da imagem de destaque |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| published_at | TIMESTAMP | Data de publicação |

**Índices:**
- `idx_site_pages_slug` para pesquisa eficiente por slug

**Políticas RLS:**
- `site_pages_public_read`: Permite leitura apenas de páginas com status 'published'

### site_blog_categories

Armazena as categorias do blog.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único primário |
| name | VARCHAR(255) | Nome da categoria |
| slug | VARCHAR(255) | URL amigável única |
| description | TEXT | Descrição da categoria |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

**Políticas RLS:**
- `site_blog_categories_public_read`: Permite leitura pública de todas as categorias

### site_blog_posts

Armazena os posts do blog.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único primário |
| title | VARCHAR(255) | Título do post |
| slug | VARCHAR(255) | URL amigável única |
| excerpt | TEXT | Resumo do post |
| content | JSONB | Conteúdo estruturado do post |
| featured_image_url | TEXT | URL da imagem de destaque |
| author_id | UUID | Referência ao autor (auth.users) |
| status | page_status | Status do post |
| meta_description | TEXT | Descrição para SEO |
| meta_keywords | TEXT | Palavras-chave para SEO |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
| published_at | TIMESTAMP | Data de publicação |

**Índices:**
- `idx_site_blog_posts_slug` para pesquisa eficiente por slug
- `idx_site_blog_posts_author` para pesquisa por autor

**Políticas RLS:**
- `site_blog_posts_public_read`: Permite leitura apenas de posts com status 'published'

### site_posts_categories

Tabela de junção para relacionamento muitos-para-muitos entre posts e categorias.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| post_id | UUID | Referência ao post |
| category_id | UUID | Referência à categoria |

**Chave primária composta:** (post_id, category_id)

### site_leads

Armazena contatos e leads gerados no site.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único primário |
| name | VARCHAR(255) | Nome do contato |
| email | VARCHAR(255) | Email do contato |
| phone | VARCHAR(50) | Telefone |
| message | TEXT | Mensagem enviada |
| source | VARCHAR(100) | Origem do lead |
| status | VARCHAR(50) | Status do lead (ex: novo, contatado) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

**Índices:**
- `idx_site_leads_email` para pesquisa por email
- `idx_site_leads_created_at` para ordenação por data

### site_testimonials

Armazena depoimentos/testemunhos exibidos no site.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único primário |
| name | VARCHAR(255) | Nome da pessoa |
| role | VARCHAR(255) | Cargo/função |
| company | VARCHAR(255) | Empresa/instituição |
| content | TEXT | Conteúdo do depoimento |
| avatar_url | TEXT | URL da foto/avatar |
| rating | SMALLINT | Avaliação (1-5) |
| is_featured | BOOLEAN | Se está em destaque |
| created_at | TIMESTAMP | Data de criação |
| published_at | TIMESTAMP | Data de publicação |

### site_settings

Armazena configurações gerais do site.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | VARCHAR(50) | Identificador único (ex: "general", "seo") |
| value | JSONB | Valor da configuração em formato JSON |
| updated_at | TIMESTAMP | Data de atualização |
| updated_by | UUID | Usuário que atualizou |

### site_sections

Armazena seções customizáveis/banners do site.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único primário |
| name | VARCHAR(255) | Nome da seção |
| type | VARCHAR(50) | Tipo de seção (ex: "banner", "features") |
| content | JSONB | Conteúdo estruturado da seção |
| is_active | BOOLEAN | Se está ativa |
| order_index | INTEGER | Ordem de exibição |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### site_featured_courses

Armazena cursos em destaque no site.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único primário |
| course_id | UUID | Referência ao ID do curso real |
| order_index | INTEGER | Ordem de exibição |
| is_active | BOOLEAN | Se está ativo |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### site_menu_items

Armazena itens do menu do site.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único primário |
| parent_id | UUID | Referência ao item pai (para submenus) |
| title | VARCHAR(255) | Título do item |
| link | VARCHAR(255) | Link/URL |
| order_index | INTEGER | Ordem de exibição |
| is_active | BOOLEAN | Se está ativo |
| open_in_new_tab | BOOLEAN | Se abre em nova aba |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

## Automações

### Triggers

O esquema inclui triggers para atualização automática do campo `updated_at`:

- `update_site_pages_updated_at`
- `update_site_blog_posts_updated_at`
- `update_site_blog_categories_updated_at`
- `update_site_leads_updated_at`

### Função para Atualização de Timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Segurança (RLS)

As seguintes tabelas têm Row Level Security (RLS) habilitada:

- `site_pages`
- `site_blog_posts`
- `site_blog_categories`
- `site_leads`
- `site_testimonials`
- `site_settings`
- `site_sections`

### Políticas Existentes

- `site_pages_public_read`: Permite leitura pública apenas de páginas publicadas
- `site_blog_posts_public_read`: Permite leitura pública apenas de posts publicados
- `site_blog_categories_public_read`: Permite leitura pública de todas as categorias

## Recomendações de Segurança Adicionais

1. **Políticas para Tabelas Restantes**:
   É recomendável adicionar políticas RLS para as tabelas restantes que já têm RLS habilitado.

2. **Políticas de Escrita**:
   Implementar políticas para escrita, restringindo-a a usuários autenticados com funções administrativas.

## Dados Iniciais

O esquema inclui uma inserção inicial na tabela `site_settings` para configurações gerais:

```json
{
  "site_name": "Edunexia",
  "site_description": "Plataforma de educação online",
  "contact_email": "contato@edunexia.com",
  "social_media": {
    "facebook": "",
    "instagram": "",
    "linkedin": "",
    "youtube": ""
  }
}
```

## Uso em Aplicações

Para a integração desse esquema com aplicações, utilize:

1. O cliente Supabase para operações CRUD
2. Os tipos definidos em `packages/database-schema/src/site-edunexia.ts`
3. A camada de abstração fornecida pelo `@edunexia/api-client` 