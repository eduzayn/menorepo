# Integração entre Módulos RH e Contabilidade

## Visão Geral

Este documento detalha a arquitetura e as funcionalidades de integração entre os módulos de Recursos Humanos (RH) e Contabilidade na plataforma Edunéxia.

A integração permite que eventos financeiros relacionados a recursos humanos (folha de pagamento, férias, benefícios) sejam automaticamente refletidos na contabilidade da instituição, garantindo consistência nos registros contábeis e facilitando o fechamento mensal.

## Arquitetura da Integração

A integração é construída em três camadas:

1. **Frontend**: Componentes React em ambos os módulos (RH e Contabilidade)
2. **Backend**: Funções Supabase Edge (Deno) e funções PL/pgSQL 
3. **Banco de Dados**: Tabelas, triggers e schemas de integração

## Funcionalidades Principais

### 1. Contabilização da Folha de Pagamento

- **Endpoint**: `/integrar-rh-contabilidade` (operacao: `contabilizar_folha`)
- **Função DB**: `contabilidade.contabilizar_folha_pagamento()`
- **Acionamento**: 
  - Manual via interface
  - Automático via trigger `trigger_folha_aprovada_contabilizar`
- **Fluxo**:
  1. Ao aprovar uma folha de pagamento no módulo RH
  2. Um registro é inserido em `rh.pendencias_contabilizacao`
  3. A contabilização pode ser processada individualmente ou em lote
  4. São gerados lançamentos contábeis para:
     - Débito em despesas de pessoal
     - Crédito em obrigações trabalhistas

### 2. Contabilização de Provisões de Férias

- **Endpoint**: `/integrar-rh-contabilidade` (operacao: `contabilizar_ferias`)
- **Função DB**: `contabilidade.contabilizar_provisao_ferias()`
- **Acionamento**: 
  - Manual mensalmente
  - Pode ser programado para execução automática
- **Fluxo**:
  1. Cálculo de provisão baseado nos colaboradores ativos
  2. Geração de lançamentos contábeis para:
     - Débito em despesas com provisões
     - Crédito em provisões trabalhistas (passivo)

### 3. Relatório de Custos de Pessoal

- **Endpoint**: `/integrar-rh-contabilidade` (operacao: `relatorio_custos`)
- **Função DB**: `contabilidade.relatorio_custos_pessoal()`
- **Periodicidade**: Mensal
- **Conteúdo**:
  - Totais por departamento
  - Totais por cargo
  - Comparativo com meses anteriores
  - Detalhamento por tipo de despesa

### 4. Processamento em Lote de Integrações Pendentes

- **Endpoint**: `/integrar-rh-contabilidade` (operacao: `processar_pendencias`)
- **Função DB**: (não listada nos exemplos anteriores)
- **Utilidade**: Processa todas as pendências de contabilização em uma única operação

## Plano de Contas para RH

Para padronizar a integração, foi criada a função `contabilidade.gerar_plano_contas_rh()` que configura automaticamente um plano de contas padrão para operações de RH, incluindo:

- Contas de despesa para:
  - Salários e ordenados
  - Encargos sociais (INSS, FGTS, PIS)
  - Benefícios (VT, VA/VR, assistência médica)
  - Provisões (férias, 13º, rescisões)

- Contas de passivo para:
  - Obrigações trabalhistas
  - Encargos a recolher
  - Provisões

## Políticas de Segurança

As integrações seguem políticas de segurança rigorosas:

1. Apenas usuários autenticados podem acessar as funções
2. Apenas administradores podem executar operações de contabilização
3. Cada operação é registrada em logs de auditoria (`integration_logs`)
4. Políticas RLS garantem que usuários só acessem dados de sua instituição

## Implementação Frontend

O módulo de contabilidade inclui uma página de teste específica para integrações (`TesteIntegracoes.tsx`) que permite:

1. Selecionar o tipo de integração
2. Definir parâmetros (mês/ano)
3. Executar a operação
4. Visualizar resultados

## Tabelas de Integração

| Tabela | Descrição |
|--------|-----------|
| `contabilidade.integracoes` | Registra todas as operações de integração entre módulos |
| `rh.pendencias_contabilizacao` | Armazena operações pendentes de contabilização |
| `integration_logs` | Log detalhado de todas as operações (auditoria) |

## Fluxo de Dados

```
[Módulo RH] → [Trigger] → [Pendências] → [Edge Function] → [Função DB] → [Lançamentos Contábeis]
```

## Execução de Migrações

As migrações para esta integração devem ser executadas na seguinte ordem:

1. `20240702_schema_rh.sql`
2. `20240703_integracao_rh_contabilidade.sql`
3. `20240704_plano_contas_rh.sql`

## Testes e Validação

Após a implementação, é recomendável testar:

1. A criação automática do plano de contas
2. A contabilização manual da folha de pagamento
3. O trigger automático ao aprovar uma folha
4. A geração de relatórios de custos
5. As políticas de segurança (tentando acessar com usuários sem permissão)

## Próximos Passos e Melhorias

- Implementar contabilização de 13º salário
- Criar dashboards específicos para custos de pessoal
- Implementar integração com centro de custos por departamento
- Adicionar suporte a rateios automáticos

---

**Desenvolvido por:** Equipe Edunéxia  
**Última atualização:** Julho/2024 