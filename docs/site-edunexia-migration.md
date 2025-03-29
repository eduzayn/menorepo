# Migration para o Módulo Site Edunéxia

Este documento fornece instruções sobre como aplicar a migração do banco de dados para o módulo site-edunexia.

## Conteúdo da Migração

A migração cria a estrutura de banco de dados necessária para o site institucional e blog da Edunéxia, incluindo:

- Tipos enumerados (`page_status`)
- Tabelas para páginas, blog, leads e configurações
- Índices para otimização de performance
- Triggers para atualização automática de timestamps
- Políticas de segurança (Row Level Security)
- Dados iniciais básicos

## Como Aplicar a Migração

### Pré-requisitos
- CLI do Supabase instalado
- Acesso ao projeto Supabase da Edunéxia

### Passos

1. Conecte-se ao projeto Supabase:

```bash
supabase link --project-ref <seu-ref-id>
```

2. Aplique a migração:

```bash
supabase db push
```

3. Verifique se as tabelas foram criadas:

```bash
supabase db execute 'SELECT table_name FROM information_schema.tables WHERE table_schema = '"'"'public'"'"' AND table_name LIKE '"'"'site_%'"'"';'
```

## Tabelas Criadas

A migração cria as seguintes tabelas:

- `site_pages`: Páginas estáticas do site
- `site_blog_categories`: Categorias do blog
- `site_blog_posts`: Posts do blog
- `site_posts_categories`: Relação entre posts e categorias
- `site_leads`: Contatos/leads gerados no site
- `site_testimonials`: Depoimentos de clientes/alunos
- `site_settings`: Configurações gerais do site
- `site_sections`: Seções e banners personalizáveis
- `site_featured_courses`: Cursos em destaque
- `site_menu_items`: Menu do site

## Segurança

A migração configura Row Level Security (RLS) nas tabelas, garantindo que:

- Visitantes anônimos só podem ver conteúdo publicado
- Apenas usuários autenticados com as permissões adequadas podem criar/editar conteúdo

## Tipos Enumerados

- `page_status`: Define estados possíveis para páginas e posts (`published`, `draft`, `archived`)

## Índices

Índices são criados para otimizar consultas frequentes:

- `idx_site_pages_slug`
- `idx_site_blog_posts_slug`
- `idx_site_blog_posts_author`
- `idx_site_leads_email`
- `idx_site_leads_created_at`

## Próximos Passos

Após aplicar a migração:

1. Atualize os tipos no pacote `database-schema` caso necessário
2. Verifique se o módulo `site-edunexia` está configurado para acessar as novas tabelas
3. Considere adicionar dados iniciais adicionais se necessário

Para uma documentação detalhada do esquema, consulte [site-edunexia-schema.md](/docs/site-edunexia-schema.md). 