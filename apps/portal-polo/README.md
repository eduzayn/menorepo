# README TÉCNICO - Módulo Portal do Polo da Plataforma Edunéxia

## Visão Geral##

> **Objetivo:**
> O Módulo Portal do Polo é responsável por centralizar a atuação dos polos de apoio presencial em instituições parceiras da Edunéxia. Ele permite que os polos acompanhem suas matrículas, recebam comissões por desempenho, e tenham acesso a relatórios de desempenho educacional e financeiro.

> **Dupla Interface:**
> - Interface do Polo: uso exclusivo pelas unidades de polo.
> - Interface da Instituição: controle centralizado e gestão dos polos parceiros.

## Tecnologias Utilizadas
- React + TypeScript
- Supabase (Banco e Auth)
- TailwindCSS (UI moderna)
- Monorepo (pnpm)

## Status de Desenvolvimento

### Implementado
- Estrutura básica do módulo e diretórios
- Layout principal com navegação responsiva
- Sistema de rotas e páginas básicas
- Contextos de dados e providers
- Dashboard com métricas e KPIs
- Listagem de alunos com filtros
- Painel de comissões com filtros
- Página de relatórios interativos
- Estilos e componentes visuais básicos
- Integração com o tema e layout global

### Em Desenvolvimento
- Integração completa com a API Supabase
- Autenticação e permissões por tipo de usuário
- Página de detalhes do aluno
- Página de repasses financeiros
- Configurações do polo
- Gestão de polos (admin)
- Testes unitários e de integração

## Integrações
- **Módulo de Matrículas:** base de dados compartilhada para acompanhamento de alunos.
- **Módulo Financeiro:** repasses automáticos, splits e relatórios.
- **Portal do Aluno:** acesso dos alunos é idêntico ao de outras matrículas.

## Interface do Polo

### Gestão de Alunos
- Lista de alunos vinculados ao polo
- Filtros por curso, status, datas
- Detalhamento da situação financeira e documental de cada aluno

### Painel Financeiro
- Visualização das comissões por matrícula
- Detalhamento por aluno, tipo de curso e data
- Consulta dos repasses já realizados

### Relatórios
- Desempenho por período
- Total de alunos por modalidade
- Evolução da captação
- Relatórios de pagamentos e inadimplência
- Possibilidade de exportação em diferentes formatos

## Interface da Instituição (Visão Central)

### Gestão de Polos
- Cadastro completo de polos
- Upload de contratos e documentação
- Ativação/desativação

### Acompanhamento Educacional
- Visualização de todos os alunos vinculados a todos os polos
- Indicadores de inadimplência por polo
- Situação documental por aluno

### Controle Financeiro e Comissionamento
- Definição de regras de comissão (fixa ou percentual)
- Split de pagamento configurável por curso
- Integração nativa com gateways via Módulo Financeiro
- Relatórios de repasses por polo, curso ou período

## Permissões e Perfis
| Perfil                  | Permissões Principais                                      |
|------------------------|------------------------------------------------------------|
| `admin_instituicao`    | Cadastro e gestão de polos, regras de comissionamento      |
| `admin_polo`           | Visualiza matrículas, comissões, relatórios               |
| `atendente_polo`       | Consulta de alunos, financeiro, relatórios básicos         |

## Estrutura de Código
```bash
apps/portal-polo/
├── src/
│   ├── pages/              # Páginas da aplicação
│   │   ├── Dashboard.tsx   # Painel inicial
│   │   ├── AlunosLista.tsx # Lista de alunos
│   │   ├── Comissoes.tsx   # Comissões e pagamentos
│   │   ├── Relatorios.tsx  # Relatórios interativos
│   │   └── index.tsx       # Exportação de páginas
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Layout.tsx      # Layout principal
│   │   └── index.ts        # Exportação de componentes
│   ├── contexts/           # Contextos e Providers
│   │   ├── PoloContext.tsx # Contexto de dados do polo
│   │   └── index.ts        # Exportação de contextos
│   ├── hooks/              # Custom hooks
│   │   └── usePoloData.ts  # Hook para dados do polo
│   ├── services/           # Serviços e API
│   ├── types/              # Definições de tipos
│   │   └── index.ts        # Tipos principais
│   ├── utils/              # Funções utilitárias
│   └── index.tsx           # Ponto de entrada
├── public/                 # Arquivos estáticos
├── package.json            # Dependências
├── tsconfig.json           # Configuração TypeScript
└── vite.config.ts          # Configuração do Vite
```

## Supabase (Schema `polos`)
| Tabela                   | Finalidade                                 |
|--------------------------|--------------------------------------------|
| `polos`                  | Cadastro e status de polos                 |
| `alunos_polo`            | Vínculo de alunos a polos                  |
| `comissoes_polos`        | Comissões geradas por matrículas          |
| `repasses`               | Pagamentos e splits registrados            |
| `contratos_polos`        | Documentos legais                          |
| `relatorios_polo`        | Painéis e exportações                      |

## Rotas e Páginas
```bash
/dashboard                    # Painel inicial (ambos)
/alunos                       # Lista de alunos por polo
/alunos/:id                   # Detalhes do aluno
/comissoes                    # Consulta de comissões
/repasses                     # Repasses financeiros
/relatorios                   # Indicadores e relatórios
/configuracoes                # Dados do polo, contratos e regras
/polos (admin)                # Gestão de polos (instituição)
/polos/:id                    # Detalhes do polo parceiro
```

## Próximos Passos

1. **Integração com API**:
   - Implementar integração completa com Supabase
   - Conectar com o package @edunexia/api-client
   - Criar serviços para cada entidade (polos, alunos, comissões)

2. **Páginas Restantes**:
   - Desenvolver a página de detalhes do aluno com abas informativas
   - Implementar a página de repasses com filtros avançados
   - Criar a página de configurações do polo
   - Implementar a interface de gestão de polos para administradores

3. **Testes e Qualidade**:
   - Adicionar testes unitários para componentes
   - Implementar testes de integração
   - Validar fluxos de usuário e responsividade

4. **Refinamento**:
   - Melhorar UX/UI com feedback visual
   - Otimizar desempenho de listas e tabelas
   - Adicionar animações e transições

5. **Documentação**:
   - Documentar APIs e serviços
   - Atualizar este README com novas implementações
   - Criar guias de uso para equipe de suporte

## Documentação Complementar
> Consulte os módulos **Financeiro Empresarial** e **Matrículas** para integração direta com splits, repasses e fluxo de alunos.

---

Este módulo garante total transparência nas relações institucionais com polos educacionais, otimizando a gestão, captação e o controle financeiro dentro da plataforma Edunéxia. 