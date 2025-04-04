<!-- cSpell:disable -->
# Módulo de Matrículas

Sistema de gerenciamento de matrículas desenvolvido com React, TypeScript e integrado ao monorepo da Edunéxia.

## Funcionalidades

- Cadastro de matrículas
- Listagem de matrículas
- Detalhes da matrícula
- Atualização de matrícula
- Cancelamento de matrícula

## Tecnologias

- React 18+
- TypeScript
- React Query
- React Hook Form
- Zod
- Tailwind CSS
- Vite
- Supabase

## Instalação

1. Clone o repositório do monorepo
2. Instale as dependências na raiz:
```bash
pnpm install
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm --filter @edunexia/matriculas dev
```

4. Acesse [http://localhost:3000](http://localhost:3000)

## Scripts

- `pnpm --filter @edunexia/matriculas dev` - Inicia o servidor de desenvolvimento
- `pnpm --filter @edunexia/matriculas build` - Gera a build de produção
- `pnpm --filter @edunexia/matriculas lint` - Executa o linter

## Estrutura de Arquivos

```
apps/matriculas/
├── src/
│   ├── app/                 # Componentes principais do aplicativo
│   ├── components/          # Componentes reutilizáveis
│   ├── contexts/            # Contextos React para estado global
│   ├── hooks/               # Hooks personalizados
│   ├── lib/                 # Configurações e utilitários
│   ├── pages/               # Páginas do módulo
│   ├── routes/              # Configurações de rotas
│   ├── schemas/             # Esquemas de validação Zod
│   ├── services/            # Serviços e APIs
│   ├── styles/              # Estilos específicos
│   ├── types/               # Definições de tipos TypeScript
│   ├── App.tsx              # Componente principal
│   ├── env.d.ts             # Definições de tipos para variáveis de ambiente
│   ├── index.css            # Estilos globais
│   ├── index.tsx            # Ponto de entrada do módulo
│   ├── main.tsx             # Configuração principal do React
│   └── routes.tsx           # Definição de rotas do módulo
├── public/                  # Arquivos estáticos
├── index.html               # HTML principal
├── package.json             # Dependências específicas do módulo
└── README.md                # Esta documentação
```

## Integração com Gateways de Pagamento

O módulo de matrículas terá integração com os gateways **InfinitePay** e **Lytex**, permitindo que a instituição escolha dinamicamente qual serviço utilizar em cada cobrança.

- Cadastro de múltiplos gateways
- Seleção do gateway preferencial por instituição ou por cobrança
- Webhooks para status de pagamento (confirmado, pendente, cancelado)
- Suporte a múltiplas formas de pagamento:
  - **PIX** (imediato e recorrente)
  - **Boleto Bancário** (único e parcelado)
  - **Cartão de Crédito Parcelado** (com ou sem juros)
  - **Cartão de Crédito com Recorrência** (modelo similar ao Netflix)
- Configuração de regras para parcelamento mínimo/máximo por gateway
- Aproveitamento completo dos recursos oferecidos por cada gateway

## Fluxo de Matrícula e Regras de Acesso

```text
Matrícula Realizada
    ↓
Acesso Imediato ao Portal do Aluno
    ↓
Pagamento Confirmado?
    ↓           ↓
  Sim       Não: Aguardar até 10 dias
                  ↓
     Mais de 10 dias sem pagamento?
           ↓              ↓
        Sim           Não: Acesso Mantido
         ↓
  Acesso Bloqueado
         ↓
Mais de 30 dias sem pagamento?
           ↓              ↓
        Sim           Não: Bloqueio Mantido
         ↓
  Contrato Cancelado
```

### Regras para Alunos Ativos
Para alunos com matrícula e documentos regulares:
- Se houver atraso de mais de **30 dias** em qualquer parcela futura, o acesso ao Portal do Aluno é **bloqueado automaticamente**
- Caso o atraso ultrapasse **90 dias**, e não haja nenhuma negociação ativa, o contrato é **cancelado automaticamente**
- O aluno poderá negociar o pagamento via atendente ou pelo próprio **portal de negociações**

## Integração com o Portal do Aluno e Financeiro

Toda alteração de status realizada no **Portal do Aluno** é refletida automaticamente neste módulo:
- Finalização de curso
- Trancamento voluntário da matrícula
- Cancelamento da matrícula por iniciativa do aluno

O módulo também está conectado ao **Módulo Financeiro Empresarial**:
- Confirmações de pagamento
- Registro de inadimplência
- Geração de relatórios financeiros
- Fluxo de caixa e conciliação

## Configurações Gerais

### Controle de Descontos e Baixas Manuais
- Aplicação de descontos personalizados
- Baixa manual de parcelas
- Flexibilidade na negociação

### Sistema de Pagamento com Split
- Split de pagamento com InfinitePay e Lytex
- Percentual ou valor fixo de comissão
- Repasse para consultores ou polos
- Gatilhos automáticos após confirmação

### Gestão de Taxas e Serviços
- Taxa de trancamento
- Taxa de reabertura
- Taxa de certificação
- Taxa de emissão de 2ª via
- Taxa de apressamento de documentos

## Integração com o Monorepo

Este módulo faz parte do monorepo Edunéxia e integra-se com:

- **@edunexia/core**: Layouts e componentes estruturais compartilhados
- **@edunexia/ui-components**: Componentes de UI reutilizáveis
- **@edunexia/auth**: Sistema de autenticação e permissões
- **@edunexia/api-client**: Cliente para chamadas à API do Supabase

## Contribuição

- Siga o padrão de commit da Edunéxia: `tipo(módulo): descrição da alteração`
- Teste suas alterações localmente antes de enviar
- Garanta que não está duplicando componentes ou funcionalidades já existentes
- Utilize o core e os componentes compartilhados sempre que possível

# README TÉCNICO - Módulo de Matrículas da Plataforma Edunéxia

## 📌 Visão Geral

> **🎯 Função Principal:**
> O Módulo de Matrículas da Edunéxia é responsável por centralizar todo o processo de criação de cursos e planos, inscrição de alunos, controle de documentos e geração de contratos. Ele atua como a porta de entrada oficial dos alunos na instituição.

> **📦 Integração Total com o Ecossistema:**
> Este módulo está totalmente conectado aos demais módulos da plataforma, como Comunicação, Portal do Aluno, Financeiro e Contabilidade. Ele será fundamental para garantir que o aluno esteja registrado corretamente no sistema, com permissões, acesso e status financeiro atualizados.

> **🗂️ Organização do Código:**
> O módulo integra o monorepo da plataforma Edunéxia, utilizando PNPM Workspaces, compartilhando bibliotecas de autenticação, UI, chamadas à API e utilitários globais.

## ⚙️ Tecnologias Utilizadas
- **React + TypeScript** (Frontend)
- **@supabase/supabase-js** (Backend, banco de dados e autenticação)
- **TailwindCSS** (Estilização)
- **Vite** (Dev server e build)
- **PNPM Workspaces** (Monorepo e pacotes compartilhados)

## 🎨 Layout e Design

### Representação Visual Simples

```text
┌────────────────────────────┐
│        Menu Lateral        │ ← Navegação fixa com ícones e seções
├────────────────────────────┤
│                            │
│     Área Principal         │ ← Conteúdo principal: cursos, planos, inscrições
│                            │
├────────────────────────────┤
│     Painel de Ações        │ ← Ações contextuais (ex: matricular, salvar)
├────────────────────────────┤
│   Sessão de Configurações  │ ← Parâmetros gerais, taxas, permissões, etc.
└────────────────────────────┘
```

> O módulo seguirá a identidade visual da Edunéxia, com uma abordagem clara, moderna e responsiva, priorizando acessibilidade e boa usabilidade para todos os perfis de usuário.

### Paleta de Cores
- **Primária:** Azul claro (#4F9CF9)
- **Secundária:** Verde menta (#8EE4AF)
- **Neutra:** Tons de cinza claro (#F5F5F5) e branco (#FFFFFF)
- **Alertas:** Laranja suave (atenção), vermelho claro (erro), lilás (informações)

### Componentes
Todos os componentes seguirão o design system central da plataforma localizado em `packages/ui-components`. Serão utilizados:
- Cards informativos
- Avatares e tooltips para navegação intuitiva
- Badges para status (ex: ativo, bloqueado, pendente)
- Tabelas com filtros dinâmicos e ações por linha
- Inputs com validação visual e feedback imediato
- Etapas com progress bar para guiar o fluxo de matrícula
- Layout de 3 colunas: menu lateral fixo, conteúdo central e painel de ações (quando necessário)

### Tipografia
- **Fonte principal:** Inter ou Roboto (legibilidade, leveza e modernidade)
- **Tamanhos variáveis** por nível de título, com espaçamento consistente e responsivo

### Comportamentos e Feedback
- Animações suaves ao expandir ou colapsar seções
- Skeleton loaders em todas as listas e tabelas enquanto dados são carregados
- Feedback de sucesso/erro sempre visual e textual

---

### 🌐 Estrutura de Rotas e Páginas
```bash
/cursos                      # Listagem e gerenciamento de cursos
/cursos/novo                # Cadastro de novo curso
/cursos/:id                 # Edição de curso específico
/planos                     # Listagem de planos de pagamento
/planos/novo                # Criação de novo plano
/planos/:id                 # Edição de plano específico
/inscricoes                 # Lista geral de alunos inscritos
/inscricoes/:id             # Detalhes de inscrição do aluno
/documentos/:id             # Upload e análise de documentação
/contrato/:id               # Assinatura e visualização do contrato digital
/aditivos/:id               # Registro e controle de aditivos contratuais
/negociacoes/:id            # Histórico de negociações financeiras do aluno
/configuracoes              # Painel central de configurações
```
> Todas as rotas são protegidas por autenticação e RBAC. A navegação será baseada em roles atribuídas aos usuários e componetização reutilizável compartilhada.

```bash
/cursos                      # Listagem e gerenciamento de cursos
/cursos/novo                # Cadastro de novo curso
/cursos/:id                 # Edição de curso
/planos                     # Planos vinculados aos cursos
/planos/novo                # Novo plano de pagamento
/inscricoes                 # Lista de alunos inscritos
/inscricoes/:id             # Detalhe da inscrição e andamento
/documentos/:id             # Upload e verificação documental
/contrato/:id               # Visualização e assinatura digital
/configuracoes/*            # Ajustes gerais
```

> Cada rota terá proteção por role e será renderizada com base em componentes reutilizáveis.

## 🔄 Fluxo de Matrícula

### Fluxograma das Regras de Acesso e Inadimplência

```text
Matrícula Realizada
    ↓
Acesso Imediato ao Portal do Aluno
    ↓
Pagamento Confirmado?
    ↓           ↓
  Sim       Não: Aguardar até 10 dias
                  ↓
     Mais de 10 dias sem pagamento?
           ↓              ↓
        Sim           Não: Acesso Mantido
         ↓
  Acesso Bloqueado
         ↓
Mais de 30 dias sem pagamento?
           ↓              ↓
        Sim           Não: Bloqueio Mantido
         ↓
  Contrato Cancelado

---

Aluno Ativo com Pagamento em Dia
    ↓
Atraso > 30 dias em parcelas futuras?
    ↓           ↓
  Sim       Não: Acesso Mantido
   ↓
Acesso Bloqueado
   ↓
Atraso > 90 dias?
   ↓           ↓
Sim       Não: Bloqueio Mantido
 ↓
Contrato Cancelado
```


### Integração com o Portal do Aluno e Financeiro Empresarial

Toda alteração de status realizada no **Portal do Aluno** deve ser refletida automaticamente neste módulo, garantindo consistência entre os sistemas. Isso inclui:
- Finalização de curso
- Trancamento voluntário da matrícula
- Cancelamento da matrícula por iniciativa do aluno

Esses eventos disparam atualizações automáticas na base de dados do módulo de matrículas, alterando o status da matrícula, bloqueando cobranças futuras e registrando o histórico no log de matrícula.

Além disso, o Módulo de Matrículas está diretamente conectado ao **Módulo Financeiro Empresarial**, responsável pela gestão contábil e entrada de recursos da instituição. Toda confirmação de pagamento ou inadimplência:
- É registrada também no sistema financeiro central da empresa;
- Gera entradas e atualizações nos relatórios de fluxo de caixa, contas a receber e conciliação financeira;
- Alimenta os relatórios de acompanhamento de metas e desempenho financeiro por curso, polo, parceiro ou unidade.

Com isso, garantimos que os dados de matrícula e pagamento fluam entre os sistemas acadêmicos e empresariais sem redundância ou perda de integridade.

Toda alteração de status realizada no **Portal do Aluno** deve ser refletida automaticamente neste módulo, garantindo consistência entre os sistemas. Isso inclui:
- Finalização de curso
- Trancamento voluntário da matrícula
- Cancelamento da matrícula por iniciativa do aluno

Esses eventos disparam atualizações automáticas na base de dados do módulo de matrículas, alterando o status da matrícula, bloqueando cobranças futuras e registrando o histórico no log de matrícula.

Ao realizar uma nova matrícula, o sistema automaticamente:
- Cria um novo aluno no **Portal do Aluno**;
- Libera o acesso ao ambiente virtual de aprendizagem imediatamente, mesmo que o pagamento ainda não tenha sido realizado, como política de confiança;
- Caso o pagamento da primeira parcela ou valor integral não seja efetuado até **10 dias após a data combinada**, o acesso é automaticamente **bloqueado**;
- Caso a inadimplência ultrapasse **30 dias**, o contrato é automaticamente **cancelado** e o aluno perde as condições contratuais acordadas inicialmente.

### Regras para Alunos Ativos
Para alunos com matrícula e documentos regulares:
- Se houver atraso de mais de **30 dias** em qualquer parcela futura (ex: 3ª, 4ª...), o acesso ao Portal do Aluno é **bloqueado automaticamente**;
- Caso o atraso ultrapasse **90 dias**, e não haja nenhuma negociação ativa, o contrato é **cancelado automaticamente** pelo sistema;
- O aluno poderá negociar o pagamento via atendente ou pelo próprio **portal de negociações**.


```text
1. Lead é captado (CRM)
2. Consultor aciona "Matricular Lead"
3. Seleciona curso e plano
4. Preenche dados do aluno
5. Geração do contrato digital
6. Envio automático de acesso ao aluno
7. Dados integrados com financeiro, contabilidade e portal do aluno
```

## 📊 Indicadores do Módulo
- Total de matrículas no período
- Conversão por curso e plano
- Taxa de documentos pendentes
- Alunos com acesso liberado antes do pagamento
- Alunos inadimplentes bloqueados automaticamente

## 🛠️ Configurações Gerais do Módulo

### Controle de Descontos e Baixas Manuais
Será possível aplicar **descontos personalizados** ou dar **baixa manual** em parcelas específicas diretamente no painel financeiro do aluno. Isso permite maior flexibilidade na negociação com alunos e garante que a secretaria ou setor financeiro consiga atuar em casos excepcionais.

### Sistema de Pagamento com Split (Consultores e Polos)
O módulo terá suporte nativo a **split de pagamento** com InfinitePay e Lytex. As instituições poderão definir:
- Percentual ou valor fixo da comissão por matrícula ou parcela
- Se o repasse será feito a um **consultor de vendas** ou **polo educacional**
- Gatilhos automáticos para split após a confirmação do pagamento

Será necessário que consultores e polos **tenham contas cadastradas** no respectivo gateway para que recebam diretamente suas comissões.

Rotas e funcionalidades:
```bash
/configuracoes/consultores         # Cadastro e vínculo de contas externas
/configuracoes/polos               # Gerenciamento dos polos ativos
/configuracoes/split-pagamentos    # Regras de divisão por curso/plano
/financeiro/parcelas/:id/desconto  # Aplicar desconto ou baixa manual
```

Essas configurações farão parte da navegação lateral em **Configurações**, sob a seção "Financeiro e Repasses".

### Gestão de Taxas e Serviços Adicionais
O módulo de matrículas contará com uma seção específica para o cadastro e controle de **taxas administrativas e serviços adicionais**, tais como:
- Taxa de trancamento
- Taxa de reabertura
- Taxa de certificação
- Taxa de emissão de 2ª via
- Taxa de apressamento de documentos

Essas taxas poderão ser:
- Vinculadas a eventos específicos no fluxo da matrícula
- Associadas a regras por curso/modalidade
- Lançadas automaticamente no financeiro do aluno

A gestão será feita via painel próprio em:
```bash
/configuracoes/taxas-servicos
```

---

```bash
/configuracoes/cursos
/configuracoes/planos
/configuracoes/documentos-obrigatorios
/configuracoes/contratos
/configuracoes/modalidades
/configuracoes/integracoes
/configuracoes/permissoes
```

### Exemplos de Configuração
- Documentos obrigatórios por curso/modalidade
- Templates de contrato por tipo de curso
- Prazos para bloqueio por inadimplência
- Códigos de integração com financeiro

## 📦 Estrutura no Supabase (Schema `matriculas`)
| Tabela                  | Finalidade                                     |
|-------------------------|------------------------------------------------|
| `cursos`                | Cadastro de cursos ofertados                   |
| `planos_pagamento`      | Modelos de valores, parcelas, bolsas           |
| `inscricoes`            | Registros de inscrição e matrícula             |
| `alunos_documentos`     | Upload e status dos arquivos/documentos        |
| `contratos_digitais`    | Registro de contratos e assinatura eletrônica  |
| `matriculas_logs`       | Histórico de ações (criação, atualização, etc.)|

## 📄 Documentação Complementar
> Este módulo faz parte do monorepo da Edunéxia. Consulte o [README Técnico Principal](../../README.md) para mais informações.

---

Este módulo é responsável por garantir a organização, rastreabilidade e fluidez no processo de entrada do aluno na instituição, sendo uma ponte crítica entre marketing, setor acadêmico e financeiro da Edunéxia.

 
