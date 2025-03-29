# Módulo de Contabilidade

Este módulo faz parte do sistema Edunéxia e é responsável por gerenciar as operações contábeis da instituição, com foco especial em atender às necessidades específicas da contabilidade brasileira.

## Estrutura do Módulo

O módulo de contabilidade segue a estrutura padrão dos módulos da Edunéxia:

```
apps/contabilidade/
├── src/
│   ├── components/     # Componentes específicos de contabilidade
│   ├── contexts/       # Contextos para gerenciamento de estado
│   ├── hooks/          # Hooks personalizados
│   ├── pages/          # Páginas do módulo
│   ├── services/       # Serviços para comunicação com a API
│   ├── types/          # Definições de tipos e interfaces
│   ├── utils/          # Funções utilitárias
│   └── index.tsx       # Ponto de entrada do módulo
├── public/             # Arquivos estáticos
├── package.json        # Dependências e scripts
└── README.md           # Esta documentação
```

## Funcionalidades Principais

O módulo de contabilidade implementa as seguintes funcionalidades:

1. **Plano de Contas**: 
   - Cadastro e manutenção do plano de contas conforme padrões brasileiros
   - Criação e gestão de centros de custo

2. **Lançamentos Contábeis**:
   - Lançamentos manuais e automatizados
   - Possibilidade de anexar documentos comprobatórios
   - Validação de regras contábeis

3. **Relatórios Fiscais e Contábeis**:
   - Balanço patrimonial
   - DRE (Demonstração do Resultado do Exercício)
   - Livros fiscais
   - Relatórios para obrigações acessórias

4. **Integrações**:
   - Integração com módulo Financeiro
   - Integração com módulo RH

5. **Fechamento Contábil**:
   - Conciliação bancária
   - Apuração de resultados
   - Fechamento mensal e anual

## Integração com Módulo Financeiro

A integração com o módulo financeiro permite:

- Contabilização automática de receitas e despesas
- Conciliação entre lançamentos financeiros e contábeis
- Acompanhamento de fluxo de caixa sob perspectiva contábil
- Gestão de contas a pagar e receber integrada com o plano de contas

### Arquivos Principais da Integração Financeira:

- `src/pages/IntegracaoFinanceira.tsx`: Página para visualizar e gerenciar a integração
- `src/services/contabilidadeService.ts`: Serviços com endpoints para integração
- `src/hooks/useContabilidade.ts`: Hooks para consumo dos dados de integração

## Integração com Módulo RH

A integração com o módulo de RH permite:

- Contabilização de folha de pagamento
- Provisões de férias e 13º salário
- Contabilização de benefícios
- Relatórios gerenciais sobre custos de pessoal

### Arquivos Principais da Integração RH:

- `src/pages/IntegracaoRh.tsx`: Página para visualizar e gerenciar a integração
- `src/contexts/ContabilidadeRhContext.tsx`: Contexto para gerenciar estado da integração
- `src/types/contabilidade.ts`: Definições de tipos para integração RH-Contabilidade
- `src/utils/contabilidadeUtils.ts`: Funções utilitárias para formatação e cálculos

## Configuração e Uso

### Pré-requisitos

- Node.js 16+
- Yarn 
- Instalação do monorepo da Edunéxia

### Instalação

Como este módulo faz parte do monorepo, ele é instalado automaticamente ao executar:

```bash
yarn install
```

Na raiz do projeto.

### Execução

Para executar apenas este módulo:

```bash
yarn workspace @edunexia/contabilidade dev
```

### Testes

```bash
yarn workspace @edunexia/contabilidade test
```

## Dependências Principais

Este módulo utiliza as seguintes bibliotecas internas da Edunéxia:

- `@edunexia/core`: Tipos e funções principais
- `@edunexia/api-client`: Cliente para API da Edunéxia 
- `@edunexia/ui-components`: Componentes de interface compartilhados
- `@edunexia/auth`: Autenticação e autorização

## Fluxos de Trabalho Principais

### Contabilização da Folha de Pagamento

1. Os dados de folha são gerados no módulo RH
2. Na página de integração RH, o contador visualiza os dados da folha
3. Após conferência, o contador executa a contabilização
4. Os lançamentos contábeis são gerados automaticamente
5. Relatórios podem ser gerados para conferência

### Fechamento Mensal

1. Integração com módulo financeiro é verificada
2. Lançamentos pendentes são processados
3. Provisões são calculadas e contabilizadas
4. Relatórios de fechamento são gerados
5. Período contábil é encerrado no sistema

## Próximos Passos

- Implementação da geração de EFD (Escrituração Fiscal Digital)
- Melhorias na integração com o SPED (Sistema Público de Escrituração Digital)
- Dashboard de indicadores contábeis
- Implementação de rotinas de auditoria interna

## Contribuição

Ao contribuir com este módulo, siga as diretrizes gerais do projeto Edunéxia descritas no arquivo `CONTRIBUTING.md` na raiz do monorepo.

## Suporte

Em caso de dúvidas sobre o funcionamento deste módulo, consulte a equipe de desenvolvimento ou a documentação técnica completa disponível no portal interno da Edunéxia. 