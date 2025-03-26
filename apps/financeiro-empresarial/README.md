# 💹 Módulo Financeiro Empresarial - Edunéxia

> **Responsável pela gestão completa das finanças institucionais dentro da plataforma Edunéxia.**

## 📀 Visão Geral

O Módulo Financeiro Empresarial da Edunéxia oferece uma solução completa para gestão financeira de instituições de ensino, inspirado nas melhores práticas de sistemas financeiros empresariais como o Conta Azul. Este módulo controla receitas, despesas, fluxo de caixa, cobranças, repasses automáticos, conciliação bancária e emissão de notas fiscais.

### 🔧 Integração com o Ecossistema

Este módulo está totalmente integrado com os demais módulos da plataforma Edunéxia:
- **Matrículas**: Geração automática de cobranças ao matricular um aluno
- **Portal do Aluno**: Visualização e pagamento de mensalidades
- **Portal do Polo**: Controle de repasses e comissões
- **Contabilidade**: Integração para registro contábil automático

## ⚖️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript
- **Banco de Dados**: Supabase
- **Estilização**: TailwindCSS + UI Components Edunéxia
- **Gerenciamento de Estado**: React Query
- **Formulários**: React Hook Form + Zod
- **Monorepo**: Yarn Workspaces
- **Gateways de Pagamento**: Integração com Littex e InfinitePay

## 🌟 Funcionalidades Principais

### 💸 Contas a Pagar e a Receber
- Visualização completa de contas e vencimentos
- Dashboard com alertas de prazos
- Controle de recebimentos e pagamentos
- Integração com o Supabase para atualizar automaticamente parcelas e cobranças

### 💳 Cobranças Automatizadas
- Integração com gateways Littex e InfinitePay
- Suporte a múltiplos meios de pagamento:
  - PIX
  - Boleto único e parcelado
  - Cartão de crédito (à vista e parcelado)
  - Pagamentos recorrentes
- Configuração de gateway por tipo de cobrança

### 🧱 Split de Pagamentos
- Divisão automática do valor entre consultores e polos educacionais
- Percentual ou valor fixo configurado por curso
- Repasses automáticos pelo gateway
- Histórico de comissões e repasses

### 🏠 Conciliação Bancária
- Importação de extratos bancários
- Conciliação automatizada de transações
- Suporte futuro para integração direta com bancos parceiros
- Registro e auditoria de todas as movimentações

### 🏢 Emissão de Notas Fiscais
- Suporte à emissão de NFS-e para matrículas, taxas e mensalidades
- Integração com sistemas municipais de NFS-e
- Armazenamento e disponibilização de notas para alunos e contabilidade

### 📊 Relatórios Gerenciais
- DRE (Demonstrativo de Resultados)
- Fluxo de caixa diário, semanal, mensal e anual
- Relatório de inadimplência e recebimentos
- Projeção financeira
- Exportação para Excel e PDF

### 🔦 Taxas e Locações
- Cadastro de taxas administrativas (trancamento, certidão, urgências)
- Configuração de valores por tipo de serviço
- Integração com o Módulo de Matrículas

## 🔑 Permissões e Perfis de Acesso

| Perfil | Acesso |
|--------|--------|
| super_admin | Acesso total ao módulo |
| admin_instituicao | Acesso total ao módulo |
| financeiro | Financeiro, relatórios, cobranças, inadimplência |
| polo | Visualiza repasses e comissões recebidas |
| consultor | Visualiza suas comissões e pagamentos recebidos |

## 📌 Rotas e Páginas

```
/dashboard                     # Visão geral financeira
/receber                       # Contas a receber
/pagar                         # Contas a pagar
/extratos                      # Conciliação bancária
/cobrancas                     # Listagem de cobranças geradas
/cobrancas/nova                # Geração manual de cobrança
/relatorios                    # Relatórios financeiros
/taxas                         # Cadastro de taxas extras
/comissoes                     # Comissões pagas e a pagar
/configuracoes                 # Integrações com gateways, repasses, dados bancários
```

## 📊 Layout Visual

```
┌──────────────────── Menu Lateral ───────────────────────┐
│ Dashboard Inicial         ← Visão geral financeira      │
│ Contas a Receber          ← Parcelas e cobranças        │
│ Contas a Pagar            ← Despesas institucionais     │
│ Conciliação Bancária      ← Importação e validação      │
│ Relatórios                ← DRE, fluxo de caixa         │
│ Taxas e Serviços          ← Trancamento, urgências      │
│ Comissões e Repasses      ← Consultores e polos         │
│ Configurações             ← Gateways, regras, permissões │
└─────────────────────────────────────────────────────────┘
```

## 📚 Estrutura de Código

```
apps/financeiro-empresarial/
├── src/
│   ├── pages/                # Páginas e rotas do módulo
│   ├── components/           # Componentes específicos do módulo
│   │   ├── dashboard/        # Componentes do dashboard
│   │   ├── cobrancas/        # Componentes de cobranças
│   │   ├── relatorios/       # Componentes de relatórios
│   │   └── shared/           # Componentes compartilhados
│   ├── contexts/             # Contextos do módulo
│   │   ├── FinanceiroContext.tsx  # Contexto principal do módulo
│   │   └── index.ts          # Exportações dos contextos
│   ├── services/             # Serviços e APIs
│   │   ├── cobrancas.ts      # Serviço de cobranças
│   │   ├── pagamentos.ts     # Serviço de pagamentos
│   │   └── relatorios.ts     # Serviço de relatórios
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts        # Hook de autenticação
│   │   ├── useCobrancas.ts   # Hook para gerenciar cobranças
│   │   ├── usePagamentos.ts  # Hook para gerenciar pagamentos
│   │   └── useRelatorios.ts  # Hook para gerar relatórios
│   ├── utils/                # Utilitários
│   │   ├── formatters.ts     # Funções de formatação (moeda, data, documentos)
│   │   ├── validators.ts     # Funções de validação (CPF, CNPJ)
│   │   └── index.ts          # Exportações dos utilitários
│   ├── types/                # Definições de tipos
│   │   ├── cobranca.ts       # Tipos de cobrança
│   │   ├── pagamento.ts      # Tipos de pagamento
│   │   ├── relatorio.ts      # Tipos de relatório
│   │   └── financeiro.ts     # Tipos gerais do módulo
│   ├── routes.tsx            # Rotas do módulo
│   ├── index.tsx             # Ponto de entrada do módulo
│   ├── main.tsx              # Configuração principal do React
│   ├── App.tsx               # Componente principal do aplicativo
│   └── index.css             # Estilos globais
├── public/                   # Arquivos estáticos
├── package.json              # Dependências do módulo
└── tsconfig.json             # Configuração TypeScript
```

## 🔧 Estrutura no Supabase (Schema financeiro)

| Tabela | Finalidade |
|--------|------------|
| cobrancas | Registro de cobranças geradas |
| pagamentos | Entradas e baixas financeiras |
| inadimplencias | Controle de inadimplência |
| comissoes | Repasses para polos e consultores |
| taxas_administrativas | Taxas avulsas e aplicações |
| logs_financeiros | Auditoria e rastreio de transações |

## 📦 Reutilização de Componentes

Este módulo utiliza componentes comuns da Edunéxia:
- **@edunexia/ui-components**: Componentes de UI compartilhados
- **@edunexia/auth**: Autenticação e gerenciamento de sessão
- **@edunexia/core**: Layouts e componentes estruturais
- **@edunexia/api-client**: Cliente de API unificado

## 📅 Próximos Passos

- Integração com o módulo de Contabilidade
- Controle de caixa (entradas e saídas manuais)
- Automação de boletos mensais recorrentes
- Central de disputas e reembolsos
- Integração com sistemas fiscais municipais e estaduais

## 📂 Documentação Complementar

- Para garantir a total integração financeira, consulte também os módulos:
  - **Matrículas**: Geração de cobranças a partir de matrículas
  - **Portal do Aluno**: Interface de pagamento para alunos
  - **Portal do Polo**: Visualização de comissões e repasses
  - **Contabilidade**: Integração contábil

---

Com este módulo, a Edunéxia passa a oferecer uma gestão empresarial moderna e automatizada, reduzindo o trabalho manual e aumentando a previsibilidade financeira das instituições de ensino. 