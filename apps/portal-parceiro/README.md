# README TÉCNICO - Módulo Portal do Parceiro da Plataforma Edunéxia

## Visão Geral

> *🔍 Objetivo:*
> O Módulo Portal do Parceiro é voltado à gestão de parcerias técnico-científicas entre instituições de ensino, com foco em certificação de cursos por instituições credenciadas pelo MEC. Possui duas interfaces principais: Admin (Certificadora) e Parceiro (Instituição conveniada).

## Tecnologias Utilizadas
- React + TypeScript
- Supabase (Auth e banco)
- TailwindCSS
- Yarn Workspaces (Monorepo)
- Heroicons

## Interfaces do Sistema

### Interface Administrativa (Certificadora)
- Gerenciar instituições parceiras
- Validar projetos de curso submetidos
- Emitir certificados e históricos
- Acompanhar indicadores por parceiro

### Interface do Parceiro (IES Conveniada)
- Submeter cursos e projetos para validação
- Solicitar certificações por aluno ou em lote
- Upload de documentação
- Acompanhar status dos pedidos de certificação

## 🚀 Status de Desenvolvimento

### ✅ Funcionalidades Implementadas
1. **Configuração Básica do Projeto**
   - Estrutura de pastas e arquivos
   - Configuração do TypeScript (tsconfig.json)
   - Integração com Tailwind CSS
   - Configuração de rotas com React Router

2. **Autenticação**
   - Integração com o sistema de autenticação unificado da Edunéxia
   - Página de login implementada
   - Recuperação de senha
   - Registro de novos usuários
   - Redefinição de senha
   - Contexto de autenticação (AuthContext) com controle de sessão
   - Proteção de rotas para usuários autenticados

3. **Dashboard**
   - Painel de controle com métricas principais
   - Cards com estatísticas (cursos, alunos, certificações, etc.)
   - Exibição de atividades recentes
   - Navegação para as principais seções

4. **Gestão de Alunos**
   - Listagem de alunos com filtros e busca
   - Paginação dos resultados
   - Exibição de informações detalhadas
   - Acesso a ações principais (visualizar, editar, certificar)

5. **Gestão de Cursos**
   - Listagem de cursos com filtros múltiplos
   - Exibição de status e detalhes dos cursos
   - Ações para gerenciamento (visualizar, editar, duplicar, excluir)

6. **Financeiro**
   - Visão geral das transações financeiras
   - Filtros por período e status
   - Exibição de resumo financeiro (recebido, pago, pendente, saldo)
   - Lista detalhada de transações

7. **Certificações**
   - Listagem de solicitações de certificação
   - Filtros por status e categorias (pendentes, em processo, concluídas)
   - Visualização de detalhes das certificações
   - Informações sobre o processo de certificação

8. **Perfil do Usuário**
   - Edição de informações pessoais
   - Alteração de senha
   - Visualização de dados vinculados à instituição

9. **Infraestrutura Técnica**
   - Serviços de API para comunicação com o Supabase
   - Conexão com o banco de dados
   - Definição de tipos TypeScript para o modelo de dados
   - Componentes de layout reutilizáveis

### 🔄 Em Desenvolvimento
1. **Formulários de Gestão**
   - Formulário de nova solicitação de certificação
   - Formulário de adição/edição de curso
   - Formulário de adição/edição de aluno

2. **Visualização Detalhada**
   - Página de detalhes da certificação
   - Página de detalhes do curso
   - Página de detalhes do aluno

3. **Relatórios**
   - Geração de relatórios financeiros
   - Exportação de dados em PDF e Excel
   - Gráficos de desempenho

### 📋 Próximas Etapas
1. **Implementação de Funcionalidades Pendentes**
   - Integração com sistema de pagamentos
   - Upload e gerenciamento de documentos
   - Notificações e alertas

2. **Melhorias Técnicas**
   - Implementar testes unitários e de integração
   - Otimizar carregamento e performance
   - Refinar validações e tratamento de erros
   - Melhorar feedback visual e UX

3. **Documentação e Finalização**
   - Documentar APIs e integrações
   - Criar tutoriais para usuários finais
   - Realizar testes de segurança e validação
   - Preparar para deploy em produção

## Funcionalidades

### 1. Gestão de Parcerias
- Cadastro de novas instituições parceiras
- Upload de contratos de parceria (PDF)
- Definição dos cursos permitidos por parceria
- Vigência e status contratual

### 2. Cursos e Projetos
- Cadastro de cursos com vinculação à parceria
- Submissão de projetos pedagógicos
- Validação de cursos e andamento

### 3. Processo de Certificação
- Solicitação individual ou em lote
- Upload de documentos do aluno (RG, histórico, etc)
- Validação por equipe ou IA (feedback automático)
- Etapas:
  - Emissão de Certidão + Histórico
  - Emissão do Diploma definitivo

### 4.Financeiro
- Integração com o Módulo Financeiro Empresarial
- Valor da certificação por tipo de curso
- Geração de boleto por lote
- Acompanhamento de inadimplência do parceiro

### 5. Indicadores e Relatórios
- Relatórios por parceiro, curso, modalidade
- Exportação (PDF, Excel)
- Dashboards visuais por etapa do processo

## Permissões e Acessos
| Perfil               | Permissões Principais                                        |
|---------------------|--------------------------------------------------------------|
| super_admin       | Acesso total                                                 |
| admin_certificadora| Administra parcerias, valida cursos, aprova certificações |
| admin_parceiro    | Submete cursos, solicita certificações                      |
| secretaria_parceiro| Upload documentos e acompanha status de alunos             |

## Layout (Visual)
```
┌──────────────────── Menu Lateral ──────────────────────┐
│ Dashboard Inicial         ← Painel geral por parceria   │
│ Instituições Parceiras      ← Cadastro e contratos       │
│ Cursos                   ← Submissão e validação         │
│ Certificações            ← Solicitação, documentação, status │
│ Financeiro               ← Boletos, pagamentos          │
│ Relatórios                ← Exportação e dashboards       │
│ Configurações             ← Permissões, integrações         │
└────────────────────────────────────────────────────────┘
```

## Estrutura de Código Atual
```
apps/portal-parceiro/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx            ← Página principal do painel
│   │   ├── Profile.tsx              ← Perfil do usuário
│   │   ├── NotFound.tsx             ← Página 404
│   │   ├── auth/
│   │   │   ├── Login.tsx            ← Página de login
│   │   │   ├── Register.tsx         ← Página de registro
│   │   │   ├── ForgotPassword.tsx   ← Recuperação de senha
│   │   │   └── ResetPassword.tsx    ← Redefinição de senha
│   │   ├── alunos/
│   │   │   └── Alunos.tsx           ← Gestão de alunos
│   │   ├── cursos/
│   │   │   └── Cursos.tsx           ← Gestão de cursos
│   │   ├── financeiro/
│   │   │   └── Financeiro.tsx       ← Gestão financeira
│   │   └── certificacoes/
│   │       └── Certificacoes.tsx    ← Gestão de certificações
│   ├── components/
│   │   └── ui/                      ← Componentes reutilizáveis
│   ├── layouts/
│   │   ├── MainLayout.tsx           ← Layout principal
│   │   └── AuthLayout.tsx           ← Layout de autenticação
│   ├── contexts/
│   │   ├── AuthContext.tsx          ← Contexto de autenticação
│   │   └── index.tsx                ← Exportações de contextos
│   ├── services/
│   │   ├── api.ts                   ← Serviços de API
│   │   └── supabase.ts              ← Cliente Supabase
│   ├── hooks/
│   │   └── useAuth.ts               ← Hook de autenticação
│   ├── utils/                       ← Funções utilitárias
│   ├── types/                       ← Definição de tipos
│   ├── App.tsx                      ← Componente principal
│   ├── routes.tsx                   ← Configuração de rotas
│   └── main.tsx                     ← Ponto de entrada
├── public/                          ← Arquivos estáticos
├── package.json                     ← Dependências do módulo
└── tsconfig.json                    ← Configuração do TypeScript
```

## 🛠️ Supabase (Schema parcerias)
| Tabela                    | Finalidade                                 |
|---------------------------|--------------------------------------------|
| instituicoes_parceiras | Dados cadastrais e contratuais            |
| cursos_parceria        | Cursos permitidos por parceria            |
| solicitacoes_cert      | Solicitações de certificação              |
| documentos_alunos      | Documentos enviados por aluno              |
| financeiro_parceiros   | Boletos gerados e pagamentos               |
| relatorios_parceiro    | Dados agregados por curso/parceria        |


## 📊 Indicadores Implementados no Dashboard
- Total de cursos cadastrados
- Total de alunos vinculados à instituição
- Quantidade de solicitações pendentes
- Número de certificados emitidos
- Receita total gerada

## 🔹 Documentação Complementar
> Este módulo está integrado ao monorepo da Edunéxia, utilizando o sistema de autenticação unificado e componentes compartilhados. Consulte os módulos *Financeiro* e *Matrículas* para entender as dependências e integrações.

---

Com este módulo, a Edunéxia amplia sua atuação como certificadora digital, promovendo parcerias legais, transparentes e escaláveis com diversas instituições de ensino pelo Brasil.
