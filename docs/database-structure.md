<!-- cSpell:disable -->
# 📚 Documento Técnico: Estrutura de Banco de Dados e Storage da Plataforma Edunéxia

## 🧭 Visão Geral
A plataforma Edunéxia utiliza o **Supabase** como backend principal, centralizando:
- Banco de dados PostgreSQL (multi-schema)
- Autenticação via JWT
- Policies de Row Level Security (RLS)
- Buckets de arquivos no Supabase Storage

O objetivo deste documento é padronizar a criação, manutenção e organização das tabelas, relacionamentos, views, enums, funções e buckets utilizados pelos módulos.

---

## 🧱 Organização Geral por Módulo

Cada módulo da plataforma Edunéxia terá:
- Tabelas próprias prefixadas com o nome do módulo ou organizadas por schema
- Views compartilhadas (quando necessário)
- Conexão via chaves estrangeiras a entidades comuns (ex: `usuario`, `instituicao`)

### 📂 Módulos e Schemas

| Módulo              | Schema Sugerido      |
|---------------------|----------------------|
| Comunicação         | `comunicacao`        |
| Matrículas          | `matriculas`         |
| Portal do Aluno     | `portal_aluno`       |
| Financeiro          | `financeiro`         |
| RH                  | `rh`                 |
| Contabilidade       | `contabilidade`      |
| Portal do Polo      | `portal_polo`        |
| Portal do Parceiro  | `portal_parceiro`    |
| Configurações       | `config`             |

---

## 📋 Convenções de Nomenclatura
- Tabelas: `snake_case`
- Colunas: `snake_case`
- Chaves primárias: `id`
- Chaves estrangeiras: `*_id`
- Relacionamentos obrigatórios usam `on delete cascade`
- Nome de buckets: `modulo_contexto` (ex: `comunicacao_arquivos`, `alunos_documentos`)

---

## 👥 Tabelas Compartilhadas (Módulo Global)

| Tabela            | Descrição                                           |
|-------------------|-----------------------------------------------------|
| `usuarios`        | Dados de autenticação e perfil                      |
| `instituicoes`    | Dados das instituições que contratam a plataforma   |
| `perfis`          | Papéis atribuídos aos usuários                      |
| `configuracoes`   | Configurações globais da plataforma                |
| `logs`            | Registro de ações do sistema                        |

Essas tabelas estarão disponíveis no schema público com políticas de RLS aplicadas por instituição e usuário.

---

## 🧾 Tabelas por Módulo: Exemplo (Comunicação)

### Schema: `comunicacao`

| Tabela                  | Descrição                                  |
|--------------------------|---------------------------------------------|
| `conversas`             | Registro de conversas por canal             |
| `mensagens`             | Mensagens enviadas ou recebidas             |
| `leads`                 | Leads cadastrados pelo CRM                  |
| `campanhas`             | Campanhas de marketing                      |
| `respostas_rapidas`     | Frases salvas                               |
| `tags`                  | Etiquetas para leads/conversas              |
| `canais_integrados`     | WhatsApp, Instagram, etc.                   |
| `configuracoes_canais`  | Horários, templates, webhooks               |
| `produtos_comunicacao`  | Cursos e produtos associados ao funil       |

---

## 🗂️ Estrutura de Buckets (Supabase Storage)

Buckets recomendados para armazenamento de arquivos e mídias:

| Bucket                     | Usado por                                 |
|----------------------------|-------------------------------------------|
| `comunicacao_arquivos`     | Anexos enviados em conversas              |
| `alunos_documentos`        | Documentos pessoais (RG, CPF, etc.)       |
| `instituicoes_logos`       | Logos e identidade visual                 |
| `materiais_didaticos`      | PDFs, vídeos e conteúdos de aula          |
| `certificados_emitidos`    | Certificados gerados em PDF               |

### Padrão de pastas:
- `/[instituicao_id]/[contexto]/arquivo.ext`

### Exemplo:
```
/comunicacao_arquivos/uni123/conversa456/audio.mp3
/alunos_documentos/uni123/aluno789/cpf.pdf
```

---

## 🔐 Políticas de Segurança (RLS)

Toda tabela e bucket utilizará RLS com base em:
- ID da instituição (`instituicao_id`)
- ID do usuário autenticado (`auth.uid()`)
- Permissão baseada no papel do usuário (`perfil`)

Exemplo de regra:
```sql
CREATE POLICY "Acesso apenas à instituição" ON comunicacao.mensagens
  FOR SELECT USING (instituicao_id = current_setting('request.instituicao_id')::uuid);
```

---

## ✅ Padrões de Modelagem
- Tabelas com colunas `created_at`, `updated_at` (via trigger)
- Enum para status e tipos (ex: `canal`, `status_conversa`)
- Views para relatórios, dashboards e exportações
- Funções SQL para ações automáticas (ex: bloqueio por inadimplência)

---

## 🔐 Módulo de Autenticação Centralizada

A Edunéxia utilizará um sistema de autenticação unificada baseado no Supabase Auth, integrado com todos os módulos via JWT e Role-Based Access Control (RBAC). Este sistema será implementado dentro do pacote compartilhado `packages/auth`.

### Componentes Principais

#### Hierarquia de Acesso
A plataforma adotará uma estrutura de hierarquia de perfis. Perfis com nível superior herdam permissões de níveis inferiores e possuem acesso global a todos os módulos.

| Perfil               | Acesso                                             |
|----------------------|----------------------------------------------------|
| `super_admin`        | Acesso total à plataforma, todos os módulos        |
| `admin_instituicao`  | Acesso total à instituição, todos os módulos       |
| `coordenador`        | Acesso limitado a módulos acadêmicos e gestão      |
| `consultor_comercial`| Acesso ao módulo de comunicação e CRM              |
| `tutor`              | Acesso restrito ao portal do aluno e comunicação   |
| `aluno`              | Acesso ao próprio portal do aluno                  |

Esses perfis serão utilizados na construção de policies dinâmicas com base nos claims do JWT e na configuração de menus e visibilidade de rotas no frontend.
- **Supabase Auth**: registro, login, recuperação de senha, verificação de e-mail
- **Tabela `usuarios`** (schema público):
  - `id`: UUID (igual ao `auth.uid()`)
  - `instituicao_id`: FK para a instituição contratada
  - `perfil`: enum (`super_admin`, `admin_instituicao`, `consultor_comercial`, etc.)
  - `status`: ativo, suspenso, bloqueado
  - `nome`, `email`, `avatar_url`

### Integrações com Supabase
- Toda sessão autenticada envia `X-JWT-TOKEN` ao backend
- JWT inclui claims personalizados:
```json
{
  "sub": "user_id",
  "role": "admin_instituicao",
  "instituicao_id": "uuid"
}
```
- Os módulos acessam esses dados via `context.request.jwt.claims`

### Funções Globais no Supabase
- `fn_obter_usuario_logado()` — retorna o `usuario_id` e perfil
- `fn_verificar_acesso(papel TEXT, recurso TEXT)` — retorna boolean

### Políticas RLS Baseadas em Sessão
```sql
CREATE POLICY "Somente usuários ativos da instituição" ON public.usuarios
  FOR SELECT USING (
    auth.uid() = id AND
    status = 'ativo' AND
    instituicao_id = current_setting('request.instituicao_id')::uuid
  );
```

### Rotas Frontend de Autenticação
- `/login`
- `/logout`
- `/recuperar-senha`
- `/verificar-email`
- `/autenticacao/erro`

O pacote `auth` será utilizado em todos os módulos para controle de acesso, navegação protegida, permissões e gerenciamento de sessão.

---

## 📦 Recomendações Finais
- Criar planilhas ou modelos ERD (diagrama entidade-relacionamento) por módulo
- Validar nome das tabelas com prefixo de módulo ou schema
- Evitar duplicidade de entidades entre módulos
- Automatizar o versionamento do banco via migrations (supabase CLI)

---

Este documento deve acompanhar a evolução da arquitetura da Edunéxia. Cada novo módulo ou funcionalidade deve atualizar esta referência. 
