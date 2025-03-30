# Documentação das Migrações Realizadas

## Visão Geral

Este documento descreve as migrações SQL executadas para criar e configurar os esquemas, tabelas e funções necessárias para o módulo de Recursos Humanos (RH) e sua integração com o módulo de Contabilidade na plataforma Edunéxia.

## Localização dos Arquivos

As migrações estão localizadas em:
- `packages/database-schema/supabase/migrations/`

## Migrações Principais

### 1. Schema RH (`20240702_schema_rh.sql`)

Criação do schema `rh` e seus tipos enumerados:

- **Tipos Enumerados**:
  - `rh.tipo_contrato`: CLT, PJ, AUTONOMO, ESTAGIO, TEMPORARIO, TERCEIRIZADO
  - `rh.status_colaborador`: ATIVO, INATIVO, FERIAS, LICENCA, AFASTADO, DESLIGADO
  - `rh.tipo_cargo`: DIRETORIA, GERENCIA, COORDENACAO, OPERACIONAL, ADMINISTRATIVO, DOCENTE, TECNICO
  - `rh.status_solicitacao`: PENDENTE, APROVADA, REJEITADA, CANCELADA, EM_ANDAMENTO, CONCLUIDA
  - `rh.tipo_beneficio`: VALE_REFEICAO, VALE_ALIMENTACAO, VALE_TRANSPORTE, PLANO_SAUDE, PLANO_ODONTOLOGICO, AUXILIO_CRECHE, AUXILIO_EDUCACAO, SEGURO_VIDA, OUTROS
  - `rh.tipo_desconto`: INSS, IRRF, FGTS, FALTAS, ADIANTAMENTO, PENSAO_ALIMENTICIA, OUTROS
  - `rh.tipo_hora_extra`: NORMAL_50, NOTURNA_50, DOMINGO_100, FERIADO_100, BANCO_HORAS
  - `rh.status_folha`: ABERTA, CALCULADA, FECHADA, PAGA, CANCELADA
  - `rh.status_ferias`: AGENDADA, APROVADA, REJEITADA, EM_ANDAMENTO, CONCLUIDA, CANCELADA

- **Tabelas Principais**:
  - `rh.departamentos`: Estrutura organizacional da instituição
  - `rh.cargos`: Cargos disponíveis na instituição
  - `rh.colaboradores`: Informações dos colaboradores
  - `rh.historico_cargos_salarios`: Histórico de alterações de cargos e salários
  - `rh.beneficios`: Cadastro de benefícios disponíveis
  - `rh.beneficios_colaborador`: Associação entre colaboradores e benefícios
  - `rh.periodos_folha`: Períodos de folha de pagamento
  - `rh.folha_pagamento`: Registros de folha de pagamento
  - `rh.detalhes_folha`: Detalhamento de proventos e descontos da folha
  - `rh.ferias`: Registros de férias dos colaboradores
  - `rh.decimo_terceiro`: Registros de décimo terceiro salário
  - `rh.registro_ponto`: Registro de ponto dos colaboradores
  - `rh.banco_horas`: Banco de horas dos colaboradores
  - `rh.solicitacoes_ausencia`: Solicitações de ausência
  - `rh.avaliacoes_desempenho`: Avaliações de desempenho
  - `rh.treinamentos`: Treinamentos disponíveis
  - `rh.participacoes_treinamento`: Participações em treinamentos
  - `rh.rescisoes`: Registros de rescisões contratuais
  - `rh.provisoes`: Provisões contábeis (férias, 13º, FGTS)
  - `rh.integracao_contabilidade`: Tabela de integração com contabilidade

- **Índices**: Criados para otimizar consultas nas principais tabelas e campos de relacionamento.

### 2. Funções de Integração RH-Contabilidade (`20240702_functions_rh_contabilidade.sql`)

Funções para executar a integração entre os módulos:

1. **`gerar_balancete`**: 
   - Gera o balancete contábil para um período específico.
   - Parâmetros: instituição, mês, ano.
   - Retorna: tabela com contas contábeis, saldos iniciais, débitos, créditos e saldos finais.

2. **`sincronizar_contabilidade_financeiro`**: 
   - Sincroniza transações financeiras com a contabilidade.
   - Parâmetros: instituição, data início, data fim.
   - Cria lançamentos contábeis a partir de transações financeiras.

3. **`integrar_rh_folha_pagamento`**: 
   - Integra dados da folha de pagamento para contabilização.
   - Parâmetros: instituição, mês, ano.
   - Processa registros de integração entre RH e contabilidade.

4. **`contabilizar_folha_pagamento`**: 
   - Cria lançamentos contábeis para folha de pagamento.
   - Parâmetros: instituição, mês, ano.
   - Gera lançamentos de despesas com salários e encargos.

5. **`integrar_rh_ferias`**: 
   - Integra registros de férias para contabilização.
   - Parâmetros: instituição, mês, ano.
   - Processa registros de integração de férias.

6. **`contabilizar_provisao_ferias`**: 
   - Contabiliza provisões de férias.
   - Parâmetros: instituição, mês, ano.
   - Cria lançamentos para provisões de férias.

7. **`integrar_rh_beneficios`**: 
   - Integra registros de benefícios para contabilização.
   - Parâmetros: instituição, mês, ano.
   - Processa benefícios ativos para o período especificado.

8. **`contabilizar_beneficios`**: 
   - Contabiliza despesas com benefícios.
   - Parâmetros: instituição, mês, ano.
   - Cria lançamentos por tipo de benefício.

9. **`relatorio_custos_pessoal`**: 
   - Gera relatório de custos de pessoal por departamento.
   - Parâmetros: instituição, mês, ano.
   - Retorna tabela com departamentos, colaboradores e custos detalhados.

### 3. Triggers e Funções Automáticas (`20240702_triggers_rh.sql`)

Triggers para automatizar processos no RH:

1. **`set_updated_at`**: 
   - Atualiza o campo `updated_at` em cada alteração.
   - Aplicado em todas as tabelas do schema RH.

2. **`atualizar_status_ferias`**: 
   - Atualiza o status do colaborador quando as férias são aprovadas/iniciadas/concluídas.
   - Aplicado na tabela `rh.ferias`.

3. **`calcular_horas_trabalhadas`**: 
   - Calcula automaticamente as horas trabalhadas com base nos registros de ponto.
   - Aplicado na tabela `rh.registro_ponto`.

4. **`integrar_folha_contabilidade`**: 
   - Cria registros de integração quando a folha é fechada.
   - Aplicado na tabela `rh.folha_pagamento`.

5. **`integrar_ferias_contabilidade`**: 
   - Cria registros de integração quando férias são aprovadas.
   - Aplicado na tabela `rh.ferias`.

6. **`integrar_decimo_terceiro_contabilidade`**: 
   - Cria registros de integração para 13º salário.
   - Aplicado na tabela `rh.decimo_terceiro`.

7. **`integrar_rescisao_contabilidade`**: 
   - Cria registros de integração para rescisões.
   - Aplicado na tabela `rh.rescisoes`.

8. **`integrar_provisao_contabilidade`**: 
   - Cria registros de integração para provisões.
   - Aplicado na tabela `rh.provisoes`.

9. **`processar_integracao_contabilidade`**: 
   - Atualiza registros originais quando lançamentos contábeis são criados.
   - Aplicado na tabela `rh.integracao_contabilidade`.

10. **`gerar_provisoes_mensais`**: 
    - Função para gerar automaticamente provisões mensais (férias, 13º, FGTS).
    - Pode ser chamada manualmente ou por job agendado.

### 4. Políticas de Segurança RLS (`20240702_rls_policies_rh.sql`)

Políticas de Row Level Security para controle de acesso:

1. **Tabelas com instituição**:
   - Política de SELECT: acesso para usuários da mesma instituição.
   - Política de modificação: apenas para ADMIN e RH_ADMIN.

2. **Tabelas com dados pessoais**:
   - Política de SELECT: 
     - Administradores e RH podem ver todos os registros da instituição.
     - Gestores podem ver registros de seus subordinados.
     - Colaboradores podem ver seus próprios registros.
   - Política de modificação: apenas para ADMIN e RH_ADMIN.

3. **Tabela de integração**:
   - Acesso restrito a equipes de RH e Contabilidade.

## Testes de Integração Frontend-Backend

Foi criada uma página de teste (`apps/contabilidade/src/pages/TesteIntegracoes.tsx`) que permite executar cada uma das funções de integração e verificar seus resultados. Esta página utiliza os serviços definidos em `packages/api-client/src/services/contabilidadeService.ts` para comunicação com o backend.

## Objetos de Armazenamento

Foram configurados buckets para armazenamento de:

1. **Documentos Fiscais**: Para armazenar documentos fiscais como notas fiscais, recibos, etc.
2. **Relatórios Contábeis**: Para armazenar relatórios gerados pelo sistema.
3. **Obrigações Fiscais**: Para armazenar arquivos relacionados a obrigações fiscais.

## Como Executar as Migrações Manualmente

Se necessário, as migrações podem ser executadas manualmente com os seguintes comandos:

```bash
cd packages/database-schema/
npx supabase db reset
# ou para aplicar apenas uma migração específica:
npx supabase db push --db-url=YOUR_SUPABASE_URL --schema-only
```

## Considerações Adicionais

1. **Dependências entre Migrações**: As migrações devem ser executadas na ordem correta, pois há dependências entre elas.
2. **Customização por Ambiente**: Algumas configurações podem precisar de ajustes dependendo do ambiente (desenvolvimento, homologação, produção).
3. **Manutenção**: Qualquer alteração futura no schema deve ser realizada através de novas migrações, nunca modificando as existentes.

## Próximos Passos Sugeridos

1. Criar jobs agendados para executar funções como `gerar_provisoes_mensais` automaticamente.
2. Implementar métricas e monitoramento para as integrações.
3. Expandir relatórios gerenciais com mais indicadores financeiros e de RH. 